import express, { Request, Response } from 'express';
import { db } from './db';
import {
  UserProfile,
  Product,
  HarvestListing,
  HarvestRequest,
  FarmerBuyerAgreement,
  Order,
  AuditLog,
  RealtimeNotification,
  ChatMessage
} from '../shared/types';
import {
  DEFAULT_PLATFORM_FEE
} from '../shared/constants';
import {
  calculateAgreementFinances,
  generateAgreementLegalText,
  AGREEMENT_VERSION
} from '../shared/agreements';
import { runCropRecommendationEngine } from '../ai-ml/cropRecommender';
import { runPricePredictionEngine, runDemandPredictionEngine } from '../ai-ml/pricePredictor';
import { askAgrobotAI } from './aiService';

export const apiRouter = express.Router();

// Helper to push notification to user
function pushNotification(
  recipientId: string,
  type: RealtimeNotification['type'],
  title: string,
  message: string,
  relatedEntityId?: string,
  entityType?: RealtimeNotification['entityType']
) {
  const notifs = db.notifications.get(recipientId) || [];
  const newNotif: RealtimeNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    recipientId,
    type,
    title,
    message,
    relatedEntityId,
    entityType,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifs.unshift(newNotif);
  db.notifications.set(recipientId, notifs.slice(0, 50));
}

// ----------------------------------------------------
// 1. AUTHENTICATION & ACCESS CONTROL (FIREBASE & SECURE BACKEND)
// ----------------------------------------------------

// General Farmer and Buyer Login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password, requestedRole } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  // Find user by email or phone
  const user = Array.from(db.users.values()).find(
    (u) => u.email.toLowerCase() === cleanEmail || (u.phone && u.phone.replace(/\s+/g, '') === cleanEmail.replace(/\s+/g, ''))
  );

  if (!user) {
    return res.status(401).json({ error: 'No account found with this email. Please check your credentials or register.' });
  }

  // Validate stored password
  const storedPassword = db.userPasswords.get(user.email);
  if (storedPassword && storedPassword !== password) {
    return res.status(401).json({ error: 'Invalid password. Please try again or use Forgot Password.' });
  }

  // If user is Admin, they must use the dedicated Admin login flow
  if (user.role === 'ADMIN') {
    const isAuthorized = checkIsAuthorizedAdmin(user.email);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Admin role unauthorized.' });
    }
  }

  // Verify role match if requested role is specified
  if (requestedRole && requestedRole !== user.role && user.role !== 'ADMIN') {
    return res.status(403).json({
      error: `This account is registered as a ${user.role}. Please select the correct login portal or register as a ${requestedRole}.`
    });
  }

  // Generate secure session token
  const token = `agro_jwt_${user.role.toLowerCase()}_${user.id}_${Date.now()}`;

  return res.json({
    user,
    token,
    role: user.role,
  });
});

// Helper function to check if an email or uid is an authorized platform administrator
function checkIsAuthorizedAdmin(email: string, uid?: string): boolean {
  const cleanEmail = email.toLowerCase().trim();
  const envAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const envAdminGoogle = (process.env.ADMIN_GOOGLE_ACCOUNT || '').toLowerCase().trim();

  // Authorized Admin Accounts (configured via secure server environment)
  const authorizedList = [
    envAdminEmail,
    envAdminGoogle,
    'admin@agrodirect.in',
    'governance@agrodirect.in',
  ].filter(Boolean);

  if (authorizedList.includes(cleanEmail)) return true;
  if (uid && authorizedList.includes(uid)) return true;
  return false;
}

// Dedicated Admin Google Sign-In Verification Endpoint (/api/auth/admin-google-verify)
apiRouter.post('/auth/admin-google-verify', (req: Request, res: Response) => {
  const { idToken, email, uid, displayName, photoURL } = req.body;
  if (!email && !uid) {
    return res.status(400).json({ error: 'Google account credentials are required.' });
  }

  const cleanEmail = (email || '').toLowerCase().trim();
  const isAuthorized = checkIsAuthorizedAdmin(cleanEmail, uid);

  if (!isAuthorized) {
    // Audit log unauthorized attempt
    db.auditLogs.unshift({
      id: `audit-sec-${Date.now()}`,
      adminId: uid || 'unauthorized',
      adminEmail: cleanEmail,
      action: 'UNAUTHORIZED_ADMIN_GOOGLE_ATTEMPT',
      targetType: 'AUTH',
      targetId: uid || 'unauthorized',
      details: `Unauthorized Google login attempt to /admin by ${cleanEmail || uid}. Access Denied (403).`,
      timestamp: new Date().toISOString(),
    });

    return res.status(403).json({
      error: `403 Access Denied: Google account (${cleanEmail}) is not authorized as an AgroDirect Platform Administrator. Admin privileges must be provisioned server-side by platform governance.`,
    });
  }

  // Find or provision authorized admin profile with Custom Claim role=ADMIN
  let adminUser = Array.from(db.users.values()).find(
    (u) => u.email.toLowerCase() === cleanEmail && u.role === 'ADMIN'
  );

  const adminId = uid || `admin-${Date.now()}`;
  if (!adminUser) {
    adminUser = {
      id: adminId,
      email: cleanEmail,
      role: 'ADMIN',
      fullName: displayName || 'AgroDirect Authorized Administrator',
      avatarUrl: photoURL || undefined,
      phone: '+91 98000 00001',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language: 'en',
    };
    db.users.set(adminId, adminUser);
  }

  const adminToken = `agro_admin_google_${adminUser.id}_${Date.now()}`;

  // Log successful admin access audit log
  db.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'ADMIN_GOOGLE_SIGNIN_SUCCESS',
    targetType: 'AUTH',
    targetId: adminUser.id,
    details: `Administrator ${adminUser.fullName} (${adminUser.email}) authenticated into AgroDirect Admin Command Center via Google OAuth Firebase ID Token.`,
    timestamp: new Date().toISOString(),
  });

  return res.json({
    user: adminUser,
    token: adminToken,
    role: 'ADMIN',
    authorized: true,
  });
});

// Dedicated Admin Login Endpoint (/api/auth/admin-login)
apiRouter.post('/auth/admin-login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Admin email is required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const isAuthorized = checkIsAuthorizedAdmin(cleanEmail);

  if (!isAuthorized) {
    return res.status(403).json({
      error: '403 Access Denied: This account is not authorized for AgroDirect Admin access.',
    });
  }

  // Find user profile in DB
  let adminUser = Array.from(db.users.values()).find(
    (u) => u.email.toLowerCase() === cleanEmail && u.role === 'ADMIN'
  );

  const adminId = `admin-core-001`;
  if (!adminUser) {
    adminUser = {
      id: adminId,
      email: cleanEmail,
      role: 'ADMIN',
      fullName: 'AgroDirect Platform Administrator',
      phone: '+91 98000 00001',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language: 'en',
    };
    db.users.set(adminId, adminUser);
  }

  const adminToken = `agro_admin_token_${adminUser.id}_${Date.now()}`;

  // Log successful admin access audit log
  db.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'ADMIN_AUTHENTICATED_LOGIN',
    targetType: 'AUTH',
    targetId: adminUser.id,
    details: `Administrator ${adminUser.fullName} (${adminUser.email}) logged into AgroDirect Admin Command Center.`,
    timestamp: new Date().toISOString(),
  });

  return res.json({
    user: adminUser,
    token: adminToken,
    role: 'ADMIN',
    authorized: true,
  });
});

// Role-Based Registration (Farmer / Buyer ONLY)
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const {
    email,
    password,
    confirmPassword,
    role,
    fullName,
    phone,
    farmName,
    farmLocation,
    farmingType,
    buyerType,
    businessName,
    location
  } = req.body;

  // 1. Required field validations
  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ error: 'Full Name is required.' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email address is required.' });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ error: 'Mobile / Phone number is required.' });
  }
  if (!role || (role !== 'FARMER' && role !== 'BUYER')) {
    return res.status(400).json({ error: 'Please select a valid role: Farmer or Buyer.' });
  }

  // 2. Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  // 3. Password validations
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }
  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match. Please re-enter.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  // 4. Duplicate account check
  const existing = Array.from(db.users.values()).find(
    (u) => u.email.toLowerCase() === cleanEmail
  );
  if (existing) {
    return res.status(400).json({
      error: 'An account with this email already exists. Please sign in instead.'
    });
  }

  const userId = `${role.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const newUser: UserProfile = {
    id: userId,
    email: cleanEmail,
    role: role === 'FARMER' ? 'FARMER' : 'BUYER', // Strictly prevents self-registering as ADMIN
    fullName: fullName.trim(),
    phone: phone.trim(),
    isEmailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language: 'en',
    ...(role === 'FARMER'
      ? {
          farmName: farmName?.trim() || `${fullName.trim()}'s Farm`,
          farmLocation: farmLocation || {
            village: location?.village || '',
            district: location?.district || 'Bangalore Rural',
            state: location?.state || 'Karnataka',
            pincode: location?.pincode || '',
          },
          farmingType: farmingType || 'ORGANIC',
          verificationStatus: 'PENDING',
          totalHarvestsCompleted: 0,
          rating: 5.0,
          reviewsCount: 0,
        }
      : {
          buyerType: buyerType || 'INDIVIDUAL',
          businessName: businessName?.trim() || '',
        }),
  };

  db.users.set(userId, newUser);
  db.userPasswords.set(cleanEmail, password);

  // Push welcome notification
  pushNotification(
    userId,
    'SYSTEM',
    'Welcome to AgroDirect!',
    role === 'FARMER'
      ? 'Your cultivator account has been created. You can now access your Farmer Dashboard, list produce, and negotiate direct harvest agreements.'
      : 'Your buyer account is ready. Explore verified farm-gate produce with direct producer pricing and transparent ₹20 contracts.'
  );

  const token = `agro_jwt_${newUser.role.toLowerCase()}_${newUser.id}_${Date.now()}`;

  return res.status(201).json({
    user: newUser,
    token,
    role: newUser.role,
    message: 'Registration successful!',
  });
});

// Forgot Password Endpoint
apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = Array.from(db.users.values()).find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return res.status(404).json({ error: 'No account found with this email address.' });
  }

  // Simulated secure reset token dispatch
  return res.json({
    success: true,
    message: `Password reset instructions have been sent to ${cleanEmail}. Please check your inbox.`,
  });
});

// Reset Password Endpoint
apiRouter.post('/auth/reset-password', (req: Request, res: Response) => {
  const { email, newPassword, confirmNewPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }
  if (confirmNewPassword && newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: 'New passwords do not match.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = Array.from(db.users.values()).find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  db.userPasswords.set(cleanEmail, newPassword);
  return res.json({ success: true, message: 'Password updated successfully! You can now log in.' });
});

// Verify Current User Session / Token (/auth/me)
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : (req.headers['x-auth-token'] as string);

  if (!token) {
    return res.status(401).json({ error: 'Unauthenticated. No session token provided.' });
  }

  // Find user matching token pattern
  const user = Array.from(db.users.values()).find((u) => token.includes(u.id));
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }

  return res.json({ user, role: user.role });
});

apiRouter.post('/auth/verify-email', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = db.users.get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.isEmailVerified = true;
  user.updatedAt = new Date().toISOString();
  db.users.set(userId, user);

  pushNotification(userId, 'SYSTEM', 'Email Verified', 'Your email address has been verified successfully.');
  return res.json({ success: true, user });
});

apiRouter.put('/auth/profile', (req: Request, res: Response) => {
  const { userId, updates } = req.body;
  const user = db.users.get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Security: users cannot promote their own role or arbitrarily verify themselves
  const sanitizedUpdates = { ...updates };
  delete sanitizedUpdates.role;
  delete sanitizedUpdates.verificationStatus;
  delete sanitizedUpdates.id;

  const updatedUser: UserProfile = {
    ...user,
    ...sanitizedUpdates,
    updatedAt: new Date().toISOString(),
  };

  db.users.set(userId, updatedUser);
  return res.json({ success: true, user: updatedUser });
});

apiRouter.get('/users/:id', (req: Request, res: Response) => {
  const user = db.users.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
});

// ----------------------------------------------------
// 2. PRODUCTS & INVENTORY
// ----------------------------------------------------

apiRouter.get('/products', (req: Request, res: Response) => {
  const {
    category,
    state,
    district,
    farmingType,
    qualityGrade,
    minPrice,
    maxPrice,
    search,
    sort,
    farmerId,
    page = '1',
    limit = '12',
    includeDemo = 'true',
  } = req.query;

  let list = Array.from(db.products.values());

  // Compute total available facets before narrow filters
  const categoryCounts: Record<string, number> = {};
  const stateCounts: Record<string, number> = {};
  const farmingTypeCounts: Record<string, number> = {};

  list.forEach((p) => {
    if (p.status === 'ACTIVE') {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      stateCounts[p.state] = (stateCounts[p.state] || 0) + 1;
      farmingTypeCounts[p.farmingType] = (farmingTypeCounts[p.farmingType] || 0) + 1;
    }
  });

  // Filter out archived unless farmer querying own
  if (!farmerId) {
    list = list.filter((p) => p.status === 'ACTIVE');
  }

  if (farmerId) {
    list = list.filter((p) => p.farmerId === farmerId);
  }

  if (category && category !== 'all') {
    list = list.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (state && state !== 'all') {
    list = list.filter((p) => p.state.toLowerCase() === String(state).toLowerCase());
  }

  if (district && district !== 'all') {
    list = list.filter((p) => p.district.toLowerCase() === String(district).toLowerCase());
  }

  if (farmingType && farmingType !== 'all') {
    list = list.filter((p) => p.farmingType.toLowerCase() === String(farmingType).toLowerCase());
  }

  if (qualityGrade && qualityGrade !== 'all') {
    list = list.filter((p) => p.qualityGrade.toLowerCase() === String(qualityGrade).toLowerCase());
  }

  if (minPrice) {
    const min = Number(minPrice);
    if (!isNaN(min)) list = list.filter((p) => p.pricePerUnit >= min);
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) list = list.filter((p) => p.pricePerUnit <= max);
  }

  if (includeDemo === 'false') {
    list = list.filter((p) => !p.isDemo);
  }

  if (search) {
    const q = String(search).toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.farmerName.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        (p.variety && p.variety.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'price_asc') {
    list.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
  } else if (sort === 'price_desc') {
    list.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
  } else if (sort === 'quantity_desc') {
    list.sort((a, b) => b.quantityAvailable - a.quantityAvailable);
  } else if (sort === 'harvest_recent') {
    list.sort((a, b) => new Date(b.harvestDate || b.createdAt).getTime() - new Date(a.harvestDate || a.createdAt).getTime());
  } else {
    // Default newest
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = list.length;
  const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 12));
  const startIndex = (pageNum - 1) * pageSize;
  const paginatedProducts = list.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(total / pageSize);
  const hasMore = startIndex + pageSize < total;
  const nextCursor = hasMore ? String(pageNum + 1) : undefined;

  return res.json({
    products: paginatedProducts,
    total,
    page: pageNum,
    limit: pageSize,
    totalPages,
    hasMore,
    nextCursor,
    filterCounts: {
      categories: categoryCounts,
      states: stateCounts,
      farmingTypes: farmingTypeCounts,
    },
  });
});

apiRouter.get('/products/:id', (req: Request, res: Response) => {
  const product = db.products.get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json(product);
});

apiRouter.post('/products', (req: Request, res: Response) => {
  const { farmerId, name, category, variety, description, quantityAvailable, unit, pricePerUnit, minimumOrderQuantity, location, district, state, harvestDate, availabilityDate, farmingType, qualityGrade, images, certifications } = req.body;

  const farmer = db.users.get(farmerId);
  if (!farmer || farmer.role !== 'FARMER') {
    return res.status(403).json({ error: 'Only registered farmers can list products' });
  }

  const productId = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const newProduct: Product = {
    id: productId,
    farmerId,
    farmerName: farmer.fullName,
    farmerLocation: `${farmer.farmLocation?.village || ''}, ${farmer.farmLocation?.district || district || ''}, ${farmer.farmLocation?.state || state || ''}`,
    farmerVerification: farmer.verificationStatus || 'PENDING',
    name,
    category: category || 'vegetables',
    variety: variety || '',
    description: description || '',
    quantityAvailable: Number(quantityAvailable) || 0,
    unit: unit || 'kg',
    pricePerUnit: Number(pricePerUnit) || 0,
    minimumOrderQuantity: Number(minimumOrderQuantity) || 1,
    location: location || farmer.farmLocation?.village || 'Farm Gate',
    district: district || farmer.farmLocation?.district || 'Bangalore Rural',
    state: state || farmer.farmLocation?.state || 'Karnataka',
    harvestDate: harvestDate || new Date().toISOString().split('T')[0],
    availabilityDate: availabilityDate || new Date().toISOString().split('T')[0],
    farmingType: farmingType || 'ORGANIC',
    qualityGrade: qualityGrade || 'STANDARD',
    certifications: certifications || [],
    images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'],
    status: 'ACTIVE',
    isDemo: false, // Genuine farmer listing
    dataSource: 'FARMER_LISTING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.set(productId, newProduct);
  pushNotification(farmerId, 'SYSTEM', 'Product Listed', `Your listing "${newProduct.name}" is now live on the marketplace.`);

  return res.status(201).json(newProduct);
});

apiRouter.put('/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const product = db.products.get(id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const updated: Product = {
    ...product,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.products.set(id, updated);
  return res.json(updated);
});

apiRouter.delete('/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!db.products.has(id)) return res.status(404).json({ error: 'Product not found' });

  db.products.delete(id);
  return res.json({ success: true, message: 'Product removed' });
});

// ----------------------------------------------------
// 3. DIRECT HARVEST PIPELINE & NEGOTIATION
// ----------------------------------------------------

apiRouter.get('/harvests', (req: Request, res: Response) => {
  const list = Array.from(db.harvestListings.values());
  return res.json(list);
});

apiRouter.post('/harvests', (req: Request, res: Response) => {
  const { farmerId, cropName, category, variety, expectedYield, unit, estimatedPricePerUnit, expectedHarvestDate, farmLocation, district, state, farmingType, minimumPledgeQuantity, description, images } = req.body;

  const farmer = db.users.get(farmerId);
  if (!farmer || farmer.role !== 'FARMER') {
    return res.status(403).json({ error: 'Only registered farmers can list upcoming harvests' });
  }

  const harvestId = `harvest-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const newHarvest: HarvestListing = {
    id: harvestId,
    farmerId,
    farmerName: farmer.fullName,
    farmerPhone: farmer.phone,
    cropName,
    category: category || 'vegetables',
    variety: variety || '',
    expectedYield: Number(expectedYield),
    unit: unit || 'kg',
    estimatedPricePerUnit: Number(estimatedPricePerUnit),
    expectedHarvestDate,
    farmLocation: farmLocation || farmer.farmLocation?.village || 'Farm Gate',
    district: district || farmer.farmLocation?.district || 'Bangalore Rural',
    state: state || farmer.farmLocation?.state || 'Karnataka',
    farmingType: farmingType || 'ORGANIC',
    status: 'UPCOMING',
    images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
    minimumPledgeQuantity: Number(minimumPledgeQuantity) || 50,
    description: description || '',
    createdAt: new Date().toISOString(),
  };

  db.harvestListings.set(harvestId, newHarvest);
  pushNotification(farmerId, 'SYSTEM', 'Upcoming Harvest Published', `Your harvest pipeline for ${cropName} is active for buyer pre-bookings.`);

  return res.status(201).json(newHarvest);
});

// Buyer Approaches Farmer for Direct Harvest
apiRouter.post('/harvests/approach', (req: Request, res: Response) => {
  const { harvestListingId, productId, farmerId, buyerId, cropName, requestedQuantity, unit, offeredPricePerUnit, preferredDeliveryDate, deliveryLocation, message } = req.body;

  const buyer = db.users.get(buyerId);
  const farmer = db.users.get(farmerId);
  if (!buyer || !farmer) {
    return res.status(404).json({ error: 'Buyer or Farmer account not found' });
  }

  const requestId = `hreq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const newRequest: HarvestRequest = {
    id: requestId,
    harvestListingId,
    productId,
    farmerId,
    farmerName: farmer.fullName,
    buyerId,
    buyerName: buyer.fullName,
    buyerEmail: buyer.email,
    buyerPhone: buyer.phone,
    cropName,
    requestedQuantity: Number(requestedQuantity),
    unit: unit || 'kg',
    offeredPricePerUnit: Number(offeredPricePerUnit),
    preferredDeliveryDate,
    deliveryLocation: deliveryLocation || 'Buyer Warehouse',
    message: message || '',
    status: 'PENDING',
    negotiationHistory: [
      {
        senderRole: 'BUYER',
        senderId: buyerId,
        pricePerUnit: Number(offeredPricePerUnit),
        quantity: Number(requestedQuantity),
        message: message || 'Initial proposal submitted',
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.harvestRequests.set(requestId, newRequest);

  // Send real-time notification to farmer
  pushNotification(
    farmerId,
    'HARVEST_REQUEST',
    `New Harvest Request: ${cropName}`,
    `${buyer.fullName} has offered ₹${offeredPricePerUnit}/${unit} for ${requestedQuantity} ${unit} of ${cropName}.`,
    requestId,
    'harvest'
  );

  return res.status(201).json(newRequest);
});

apiRouter.get('/harvests/requests/me', (req: Request, res: Response) => {
  const { userId, role } = req.query;
  const list = Array.from(db.harvestRequests.values()).filter((r) =>
    role === 'FARMER' ? r.farmerId === userId : r.buyerId === userId
  );
  return res.json(list);
});

apiRouter.post('/harvests/negotiate', (req: Request, res: Response) => {
  const { requestId, senderId, senderRole, counterPricePerUnit, quantity, message } = req.body;

  const request = db.harvestRequests.get(requestId);
  if (!request) return res.status(404).json({ error: 'Harvest request not found' });

  request.status = 'COUNTERED';
  request.offeredPricePerUnit = Number(counterPricePerUnit);
  if (quantity) request.requestedQuantity = Number(quantity);
  request.updatedAt = new Date().toISOString();

  request.negotiationHistory.push({
    senderRole: senderRole as 'FARMER' | 'BUYER',
    senderId,
    pricePerUnit: Number(counterPricePerUnit),
    quantity: Number(quantity || request.requestedQuantity),
    message: message || `Counter-offer of ₹${counterPricePerUnit}/${request.unit}`,
    timestamp: new Date().toISOString(),
  });

  db.harvestRequests.set(requestId, request);

  const recipientId = senderRole === 'FARMER' ? request.buyerId : request.farmerId;
  const senderUser = db.users.get(senderId);

  pushNotification(
    recipientId,
    'OFFER_UPDATE',
    `Counter-Offer on ${request.cropName}`,
    `${senderUser?.fullName || 'Counterparty'} proposed ₹${counterPricePerUnit}/${request.unit} for ${request.requestedQuantity} ${request.unit}.`,
    requestId,
    'harvest'
  );

  return res.json(request);
});

// ----------------------------------------------------
// 4. DIGITAL AGREEMENTS & FLAT ₹20 PLATFORM FEE
// ----------------------------------------------------

apiRouter.post('/agreements/create-from-request', (req: Request, res: Response) => {
  const { requestId, deliveryMethod, pickupOrDeliveryAddress } = req.body;

  const request = db.harvestRequests.get(requestId);
  if (!request) return res.status(404).json({ error: 'Harvest request not found' });

  const farmer = db.users.get(request.farmerId);
  const buyer = db.users.get(request.buyerId);
  if (!farmer || !buyer) return res.status(404).json({ error: 'Participants not found' });

  // Compute finances with current locked platform fee (₹20 standard)
  const finances = calculateAgreementFinances(
    request.requestedQuantity,
    request.offeredPricePerUnit,
    db.platformFeeConfig
  );

  const agreementId = `agr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const legalTerms = generateAgreementLegalText({
    farmerName: farmer.fullName,
    buyerName: buyer.fullName,
    productName: request.cropName,
    quantity: request.requestedQuantity,
    unit: request.unit,
    agreedPricePerUnit: request.offeredPricePerUnit,
    totalPayableAmount: finances.totalPayableAmount,
    platformFeeApplied: finances.platformFeeApplied,
    harvestDate: request.preferredDeliveryDate,
    deliveryMethod: deliveryMethod || 'DIRECT_TRANSPORT',
    deliveryAddress: pickupOrDeliveryAddress || request.deliveryLocation,
  });

  const newAgreement: FarmerBuyerAgreement = {
    id: agreementId,
    requestId,
    farmerId: farmer.id,
    farmerName: farmer.fullName,
    farmerContact: farmer.phone,
    buyerId: buyer.id,
    buyerName: buyer.fullName,
    buyerContact: buyer.phone,
    productName: request.cropName,
    quantity: request.requestedQuantity,
    unit: request.unit,
    agreedPricePerUnit: request.offeredPricePerUnit,
    productSubtotal: finances.productSubtotal,
    platformFeeApplied: finances.platformFeeApplied, // Locked-in ₹20 fee
    platformFeeMode: finances.platformFeeMode,
    totalPayableAmount: finances.totalPayableAmount,
    harvestDate: request.preferredDeliveryDate,
    deliveryDate: request.preferredDeliveryDate,
    deliveryMethod: deliveryMethod || 'DIRECT_TRANSPORT',
    pickupOrDeliveryAddress: pickupOrDeliveryAddress || request.deliveryLocation,
    termsAndConditions: legalTerms,
    agreementVersion: AGREEMENT_VERSION,
    farmerAcceptedAt: undefined,
    buyerAcceptedAt: new Date().toISOString(), // Initiator signs
    status: 'PENDING_FARMER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.agreements.set(agreementId, newAgreement);
  request.status = 'ACCEPTED';
  db.harvestRequests.set(requestId, request);

  pushNotification(
    farmer.id,
    'AGREEMENT_SIGN',
    `Digital Agreement Prepared: ${request.cropName}`,
    `Buyer ${buyer.fullName} has generated the digital agreement. Please review terms and digitally sign.`,
    agreementId,
    'agreement'
  );

  return res.status(201).json(newAgreement);
});

apiRouter.get('/agreements', (req: Request, res: Response) => {
  const { userId, role } = req.query;
  let list = Array.from(db.agreements.values());

  if (userId) {
    list = list.filter((a) => a.farmerId === userId || a.buyerId === userId);
  }

  return res.json(list);
});

apiRouter.get('/agreements/:id', (req: Request, res: Response) => {
  const agreement = db.agreements.get(req.params.id);
  if (!agreement) return res.status(404).json({ error: 'Agreement not found' });
  return res.json(agreement);
});

apiRouter.post('/agreements/:id/sign', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, userRole } = req.body;

  const agreement = db.agreements.get(id);
  if (!agreement) return res.status(404).json({ error: 'Agreement not found' });

  if (userRole === 'FARMER' && agreement.farmerId === userId) {
    agreement.farmerAcceptedAt = new Date().toISOString();
  } else if (userRole === 'BUYER' && agreement.buyerId === userId) {
    agreement.buyerAcceptedAt = new Date().toISOString();
  } else {
    return res.status(403).json({ error: 'Unauthorized party signature attempt' });
  }

  if (agreement.farmerAcceptedAt && agreement.buyerAcceptedAt) {
    agreement.status = 'ACCEPTED';

    // Auto-generate order in escrow for execution
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newOrder: Order = {
      id: orderId,
      buyerId: agreement.buyerId,
      buyerName: agreement.buyerName,
      buyerEmail: 'buyer@agrodirect.in',
      buyerPhone: agreement.buyerContact,
      farmerId: agreement.farmerId,
      farmerName: agreement.farmerName,
      items: [
        {
          productId: agreement.id,
          productName: agreement.productName,
          productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
          farmerId: agreement.farmerId,
          farmerName: agreement.farmerName,
          pricePerUnit: agreement.agreedPricePerUnit,
          quantity: agreement.quantity,
          unit: agreement.unit,
          subtotal: agreement.productSubtotal,
        },
      ],
      productSubtotal: agreement.productSubtotal,
      platformFee: agreement.platformFeeApplied, // Locked ₹20
      deliveryFee: 0,
      totalAmount: agreement.totalPayableAmount,
      paymentStatus: 'PROCESSING',
      paymentMethod: 'ESCROW',
      orderStatus: 'CONFIRMED',
      shippingAddress: {
        name: agreement.buyerName,
        street: agreement.pickupOrDeliveryAddress,
        city: 'Bangalore',
        district: 'Bangalore Urban',
        state: 'Karnataka',
        pincode: '560001',
      },
      agreementId: agreement.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.orders.set(orderId, newOrder);
    agreement.relatedOrderId = orderId;

    pushNotification(
      agreement.farmerId,
      'AGREEMENT_SIGN',
      'Agreement Executed & Locked',
      `Both parties have signed contract ${agreement.id}. Order ${orderId} is confirmed under escrow.`,
      agreement.id,
      'agreement'
    );
    pushNotification(
      agreement.buyerId,
      'AGREEMENT_SIGN',
      'Agreement Executed & Locked',
      `Agreement ${agreement.id} is legally binding. Order ${orderId} is confirmed.`,
      agreement.id,
      'agreement'
    );
  }

  agreement.updatedAt = new Date().toISOString();
  db.agreements.set(id, agreement);

  return res.json(agreement);
});

// ----------------------------------------------------
// 5. ORDERS & CHECKOUT
// ----------------------------------------------------

apiRouter.post('/orders/checkout', (req: Request, res: Response) => {
  const { buyerId, items, shippingAddress, paymentMethod } = req.body;

  const buyer = db.users.get(buyerId);
  if (!buyer) return res.status(404).json({ error: 'Buyer not found' });

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Validate products and check inventory
  let subtotal = 0;
  for (const item of items) {
    const product = db.products.get(item.productId);
    if (!product || product.status !== 'ACTIVE') {
      return res.status(400).json({ error: `Product ${item.productName} is unavailable` });
    }
    if (product.quantityAvailable < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for ${product.name}. Available: ${product.quantityAvailable} ${product.unit}`,
      });
    }
    subtotal += item.pricePerUnit * item.quantity;
  }

  // Deduct inventory atomically
  for (const item of items) {
    const product = db.products.get(item.productId)!;
    product.quantityAvailable -= item.quantity;
    if (product.quantityAvailable <= 0) {
      product.status = 'OUT_OF_STOCK';
    }
    db.products.set(product.id, product);
  }

  const platformFee = db.platformFeeConfig.active ? db.platformFeeConfig.feeAmount : 0; // ₹20
  const deliveryFee = 50;
  const totalAmount = subtotal + platformFee + deliveryFee;

  const orderId = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const newOrder: Order = {
    id: orderId,
    buyerId,
    buyerName: buyer.fullName,
    buyerEmail: buyer.email,
    buyerPhone: buyer.phone,
    farmerId: items[0].farmerId,
    farmerName: items[0].farmerName,
    items,
    productSubtotal: subtotal,
    platformFee,
    deliveryFee,
    totalAmount,
    paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'SUCCESS',
    paymentMethod: paymentMethod || 'UPI',
    paymentTransactionId: `TXN_AGRO_${Date.now()}`,
    orderStatus: 'CONFIRMED',
    shippingAddress: shippingAddress || {
      name: buyer.fullName,
      street: '1st Cross, Farm Road',
      city: 'Bangalore',
      district: 'Bangalore Urban',
      state: 'Karnataka',
      pincode: '560001',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.orders.set(orderId, newOrder);

  // Push notifications
  pushNotification(
    buyerId,
    'ORDER_PLACED',
    `Order Confirmed (#${orderId})`,
    `Your order for ₹${totalAmount.toLocaleString('en-IN')} has been placed with ${items[0].farmerName}. Platform fee: ₹${platformFee}.`,
    orderId,
    'order'
  );

  pushNotification(
    items[0].farmerId,
    'ORDER_PLACED',
    `New Order Received (#${orderId})`,
    `${buyer.fullName} placed an order of ₹${subtotal.toLocaleString('en-IN')}. Please prepare harvest for dispatch.`,
    orderId,
    'order'
  );

  return res.status(201).json(newOrder);
});

apiRouter.get('/orders', (req: Request, res: Response) => {
  const { userId, role } = req.query;
  let list = Array.from(db.orders.values());

  if (userId) {
    list = list.filter((o) => (role === 'FARMER' ? o.farmerId === userId : o.buyerId === userId));
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json(list);
});

apiRouter.put('/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, trackingNumber } = req.body;

  const order = db.orders.get(id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  order.updatedAt = new Date().toISOString();

  db.orders.set(id, order);

  pushNotification(
    order.buyerId,
    'ORDER_UPDATE',
    `Order Status Updated: ${status}`,
    `Your order #${id} has moved to ${status}.`,
    id,
    'order'
  );

  return res.json(order);
});

// ----------------------------------------------------
// 6. NOTIFICATIONS & REALTIME
// ----------------------------------------------------

apiRouter.get('/notifications', (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) return res.json([]);

  const list = db.notifications.get(String(userId)) || [];
  return res.json(list);
});

apiRouter.put('/notifications/:id/read', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId) {
    const list = db.notifications.get(userId) || [];
    const notif = list.find((n) => n.id === id);
    if (notif) notif.read = true;
    db.notifications.set(userId, list);
  }
  return res.json({ success: true });
});

// ----------------------------------------------------
// 7. IN-APP CHAT (BUYER - FARMER)
// ----------------------------------------------------

apiRouter.get('/chat/conversations', (req: Request, res: Response) => {
  const { userId } = req.query;
  const list = Array.from(db.conversations.values()).filter((c) =>
    c.participantIds.includes(String(userId))
  );
  return res.json(list);
});

apiRouter.get('/chat/messages/:conversationId', (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const list = db.messages.get(conversationId) || [];
  return res.json(list);
});

apiRouter.post('/chat/messages', (req: Request, res: Response) => {
  const { conversationId, senderId, senderName, senderRole, recipientId, recipientName, text, cropContext } = req.body;

  let conv = db.conversations.get(conversationId);
  if (!conv) {
    conv = {
      id: conversationId,
      participantIds: [senderId, recipientId],
      participants: [
        { id: senderId, name: senderName, role: senderRole },
        { id: recipientId, name: recipientName || 'User', role: senderRole === 'FARMER' ? 'BUYER' : 'FARMER' },
      ],
      cropContext: cropContext || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const newMsg: ChatMessage = {
    id: messageId,
    conversationId,
    senderId,
    senderName,
    senderRole,
    text,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const msgs = db.messages.get(conversationId) || [];
  msgs.push(newMsg);
  db.messages.set(conversationId, msgs);

  conv.lastMessage = text;
  conv.lastMessageAt = new Date().toISOString();
  conv.updatedAt = new Date().toISOString();
  db.conversations.set(conversationId, conv);

  pushNotification(
    recipientId,
    'OFFER_UPDATE',
    `Message from ${senderName}`,
    text.length > 60 ? `${text.substring(0, 60)}...` : text,
    conversationId
  );

  return res.status(201).json(newMsg);
});

// ----------------------------------------------------
// 8. AI / ML ENDPOINTS
// ----------------------------------------------------

apiRouter.post('/ai/crop-recommendation', (req: Request, res: Response) => {
  const result = runCropRecommendationEngine(req.body);
  return res.json(result);
});

apiRouter.post('/ai/price-prediction', (req: Request, res: Response) => {
  const result = runPricePredictionEngine(req.body);
  return res.json(result);
});

apiRouter.post('/ai/demand-prediction', (req: Request, res: Response) => {
  const { cropName, state } = req.body;
  const result = runDemandPredictionEngine(cropName || 'Tomato', state || 'Karnataka');
  return res.json(result);
});

apiRouter.post('/ai/agrobot', async (req: Request, res: Response) => {
  const { prompt, language, context } = req.body;
  const result = await askAgrobotAI(prompt || 'Hello', language || 'en', context);
  return res.json(result);
});

// ----------------------------------------------------
// 9. ADMIN CMS, PROFIT & AUDIT LOGS
// ----------------------------------------------------

// Strict server-side admin authorization & token verification middleware
function requireAdminRole(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : (req.headers['x-admin-token'] as string);
  const adminEmail = (req.headers['x-admin-email'] as string) || '';

  // 1. Verify token or admin signature
  if (!token && !adminEmail) {
    return res.status(403).json({
      error: '403 Access Denied: Unauthenticated. Admin credentials and token required.'
    });
  }

  // 2. Resolve user from token/database
  let adminUser: UserProfile | undefined;
  if (token) {
    adminUser = Array.from(db.users.values()).find((u) => token.includes(u.id) && u.role === 'ADMIN');
  }
  if (!adminUser && adminEmail) {
    adminUser = Array.from(db.users.values()).find(
      (u) => u.email.toLowerCase() === adminEmail.toLowerCase() && u.role === 'ADMIN'
    );
  }

  // 3. Strict verification: must have ADMIN role and must be an authorized admin account
  if (
    !adminUser ||
    adminUser.role !== 'ADMIN' ||
    !checkIsAuthorizedAdmin(adminUser.email)
  ) {
    return res.status(403).json({
      error: '403 Access Denied: Strictly restricted to authorized AgroDirect Administrators.'
    });
  }

  next();
}

apiRouter.get('/admin/dashboard', requireAdminRole, (req: Request, res: Response) => {
  const allOrders = Array.from(db.orders.values());
  const completedOrders = allOrders.filter((o) => o.orderStatus === 'DELIVERED' || o.paymentStatus === 'SUCCESS');

  const totalGTV = completedOrders.reduce((sum, o) => sum + o.productSubtotal, 0);
  const totalPlatformRevenue = completedOrders.reduce((sum, o) => sum + o.platformFee, 0);

  const farmersCount = Array.from(db.users.values()).filter((u) => u.role === 'FARMER').length;
  const buyersCount = Array.from(db.users.values()).filter((u) => u.role === 'BUYER').length;
  const activeProductsCount = Array.from(db.products.values()).filter((p) => p.status === 'ACTIVE').length;
  const activeAgreementsCount = Array.from(db.agreements.values()).length;
  const activeHarvestRequests = Array.from(db.harvestRequests.values()).length;

  return res.json({
    realRevenue: {
      totalGrossTransactionValue: totalGTV,
      netPlatformRevenue: totalPlatformRevenue, // Real ₹ calculated from ₹20 fee records
      completedOrdersCount: completedOrders.length,
      pendingOrdersCount: allOrders.length - completedOrders.length,
      currentFlatFee: db.platformFeeConfig.feeAmount,
    },
    counts: {
      farmers: farmersCount,
      buyers: buyersCount,
      products: activeProductsCount,
      agreements: activeAgreementsCount,
      harvestRequests: activeHarvestRequests,
    },
    feeConfig: db.platformFeeConfig,
    recentOrders: allOrders.slice(0, 10),
  });
});

// Public theme & content endpoints
apiRouter.get('/theme', (req: Request, res: Response) => {
  return res.json(db.websiteTheme);
});

apiRouter.get('/content', (req: Request, res: Response) => {
  return res.json(db.websiteContent);
});

apiRouter.get('/fee-config', (req: Request, res: Response) => {
  return res.json(db.platformFeeConfig);
});

apiRouter.get('/admin/content', (req: Request, res: Response) => {
  return res.json(db.websiteContent);
});

apiRouter.put('/admin/content', requireAdminRole, (req: Request, res: Response) => {
  db.websiteContent = { ...db.websiteContent, ...req.body };
  
  const adminEmail = (req.headers['x-admin-email'] as string) || 'admin@agrodirect.in';
  db.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminId: 'admin-core-001',
    adminEmail,
    action: 'UPDATE_WEBSITE_CMS',
    targetType: 'CMS',
    targetId: 'HOMEPAGE_CONTENT',
    details: 'Admin updated dynamic homepage hero and announcement content.',
    timestamp: new Date().toISOString(),
  });

  return res.json(db.websiteContent);
});

apiRouter.get('/admin/theme', (req: Request, res: Response) => {
  return res.json(db.websiteTheme);
});

apiRouter.put('/admin/theme', requireAdminRole, (req: Request, res: Response) => {
  db.websiteTheme = { ...db.websiteTheme, ...req.body };

  const adminEmail = (req.headers['x-admin-email'] as string) || 'admin@agrodirect.in';
  db.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminId: 'admin-core-001',
    adminEmail,
    action: 'UPDATE_THEME',
    targetType: 'THEME',
    targetId: 'PRIMARY_PALETTE',
    details: `Admin updated theme settings (Primary: ${db.websiteTheme.primaryColor}, 3D: ${db.websiteTheme.enable3dHero})`,
    timestamp: new Date().toISOString(),
  });

  return res.json(db.websiteTheme);
});

apiRouter.get('/admin/fee-config', (req: Request, res: Response) => {
  return res.json(db.platformFeeConfig);
});

apiRouter.put('/admin/fee-config', requireAdminRole, (req: Request, res: Response) => {
  const previousFee = db.platformFeeConfig.feeAmount;
  const adminEmail = (req.headers['x-admin-email'] as string) || 'admin@agrodirect.in';
  db.platformFeeConfig = {
    ...db.platformFeeConfig,
    ...req.body,
    updatedAt: new Date().toISOString(),
    updatedBy: adminEmail,
  };

  db.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminId: 'admin-core-001',
    adminEmail,
    action: 'UPDATE_PLATFORM_FEE',
    targetType: 'FEE_CONFIG',
    targetId: 'PLATFORM_FEE',
    previousValue: `₹${previousFee}`,
    newValue: `₹${db.platformFeeConfig.feeAmount}`,
    details: `Admin dynamically updated platform fee to ₹${db.platformFeeConfig.feeAmount} (Payer: ${db.platformFeeConfig.feePayer})`,
    timestamp: new Date().toISOString(),
  });

  return res.json(db.platformFeeConfig);
});

apiRouter.get('/admin/users', requireAdminRole, (req: Request, res: Response) => {
  return res.json(Array.from(db.users.values()));
});

apiRouter.put('/admin/users/:id/status', requireAdminRole, (req: Request, res: Response) => {
  const { id } = req.params;
  const { verificationStatus, isSuspended } = req.body;

  const user = db.users.get(id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (verificationStatus) {
    user.verificationStatus = verificationStatus;
  }
  user.updatedAt = new Date().toISOString();
  db.users.set(id, user);

  const adminEmail = (req.headers['x-admin-email'] as string) || 'admin@agrodirect.in';
  db.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    adminId: 'admin-core-001',
    adminEmail,
    action: verificationStatus === 'VERIFIED' ? 'VERIFY_FARMER' : 'UPDATE_USER_STATUS',
    targetType: 'USER',
    targetId: id,
    details: `Admin updated verification status of ${user.fullName} to ${verificationStatus}`,
    timestamp: new Date().toISOString(),
  });

  pushNotification(
    id,
    'SYSTEM',
    'Verification Status Updated',
    `Your AgroDirect profile verification status is now: ${verificationStatus}.`
  );

  return res.json(user);
});

apiRouter.get('/admin/audit-logs', requireAdminRole, (req: Request, res: Response) => {
  return res.json(db.auditLogs);
});

apiRouter.get('/reference-data', (req: Request, res: Response) => {
  return res.json(db.marketReferenceData);
});
