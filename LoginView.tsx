import React, { useState } from 'react';
import {
  User,
  Lock,
  Mail,
  Phone,
  Sprout,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Building2,
  MapPin,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../../shared/types';

interface LoginViewProps {
  initialMode?: 'login' | 'register';
  redirectNotice?: string;
  onSuccess: (role?: UserRole) => void;
  onNavigateToAdminLogin?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  initialMode = 'login',
  redirectNotice,
  onSuccess,
  onNavigateToAdminLogin,
}) => {
  const { login, register, forgotPassword, resetPassword, switchDemoUser } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  const [role, setRole] = useState<'FARMER' | 'BUYER'>('FARMER');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [farmName, setFarmName] = useState('');
  const [farmingType, setFarmingType] = useState('ORGANIC');
  const [stateName, setStateName] = useState('Karnataka');
  const [districtName, setDistrictName] = useState('Bangalore Rural');
  const [villageName, setVillageName] = useState('');
  const [pincode, setPincode] = useState('');
  const [buyerType, setBuyerType] = useState('WHOLESALER');
  const [businessName, setBusinessName] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const res = await login(email, password, role);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess(res.role);
    } else {
      setErrorMessage(res.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      email,
      password,
      confirmPassword,
      role,
      fullName,
      phone,
      farmName: role === 'FARMER' ? (farmName || `${fullName}'s Farm`) : undefined,
      farmingType: role === 'FARMER' ? farmingType : undefined,
      buyerType: role === 'BUYER' ? (buyerType as any) : undefined,
      businessName: role === 'BUYER' ? businessName : undefined,
      location: {
        village: villageName,
        district: districtName,
        state: stateName,
        pincode: pincode,
      },
    });
    setIsSubmitting(false);

    if (res.success) {
      onSuccess(res.role);
    } else {
      setErrorMessage(res.error || 'Registration failed. Please check your details.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    setIsSubmitting(true);
    const res = await forgotPassword(email);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMessage(res.message || 'Password reset link sent to your email.');
      setMode('reset');
    } else {
      setErrorMessage(res.error || 'Failed to send reset link.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    const res = await resetPassword(email, password, confirmPassword);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMessage('Password reset successfully. You can now sign in.');
      setMode('login');
    } else {
      setErrorMessage(res.error || 'Failed to reset password.');
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 px-4 sm:px-6">
      {/* Notice Banner if redirecting from protected route */}
      {redirectNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold block text-sm mb-0.5">Authentication Required</span>
            {redirectNotice}
          </div>
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {mode === 'login' && 'Sign in to AgroDirect'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Your Password'}
            {mode === 'reset' && 'Create New Password'}
          </h2>
          <p className="text-xs text-stone-600 max-w-sm mx-auto">
            {mode === 'login' && 'Direct farm-to-buyer transactions, digital ₹20 agreements, and real-time market prices.'}
            {mode === 'register' && 'Join thousands of verified Indian farmers and direct bulk buyers.'}
            {mode === 'forgot' && 'Enter your registered email address to receive reset instructions.'}
            {mode === 'reset' && 'Set a secure new password for your account.'}
          </p>
        </div>

        {/* Tab switcher between Sign In and Register */}
        {(mode === 'login' || mode === 'register') && (
          <div className="flex p-1 bg-stone-100 rounded-2xl border border-stone-200">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                mode === 'login'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                mode === 'register'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Instant Developer / Test Persona Switcher */}
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 block text-[11px] uppercase tracking-wider">
              Instant Verified Persona Login:
            </span>
            <span className="text-[10px] text-emerald-700">1-Click Fast Auth</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={async () => {
                const res = await switchDemoUser('FARMER');
                if (res.success) onSuccess('FARMER');
              }}
              className="p-2.5 bg-white hover:bg-emerald-100/60 border border-emerald-300 rounded-xl text-left flex items-center gap-2.5 transition active:scale-95 shadow-xs"
            >
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block text-xs">Farmer Ramesh</span>
                <span className="text-[10px] text-stone-500">Karnataka Cultivator</span>
              </div>
            </button>

            <button
              type="button"
              onClick={async () => {
                const res = await switchDemoUser('BUYER');
                if (res.success) onSuccess('BUYER');
              }}
              className="p-2.5 bg-white hover:bg-blue-50 border border-blue-200 rounded-xl text-left flex items-center gap-2.5 transition active:scale-95 shadow-xs"
            >
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block text-xs">Buyer Ananya</span>
                <span className="text-[10px] text-stone-500">Retail Greens Wholesaler</span>
              </div>
            </button>
          </div>
        </div>

        {/* Error / Success Feedback Messages */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">Select Your Account Type:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('FARMER')}
                  className={`p-3 rounded-xl border flex items-center gap-2 transition ${
                    role === 'FARMER'
                      ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold ring-1 ring-emerald-700'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  <span>Farmer / Cultivator</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`p-3 rounded-xl border flex items-center gap-2 transition ${
                    role === 'BUYER'
                      ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold ring-1 ring-emerald-700'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  <span>Buyer / Retailer</span>
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">Email Address / Mobile:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ramesh.gowda@agrodirect.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-stone-800">Password:</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrorMessage(null);
                  }}
                  className="text-[11px] text-emerald-800 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {role === 'FARMER' ? 'Farmer' : 'Buyer'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. REGISTRATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">I want to register as:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('FARMER')}
                  className={`p-3 rounded-xl border flex items-center gap-2 transition ${
                    role === 'FARMER'
                      ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold ring-1 ring-emerald-700'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  <span>Farmer / Cultivator</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`p-3 rounded-xl border flex items-center gap-2 transition ${
                    role === 'BUYER'
                      ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold ring-1 ring-emerald-700'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  <span>Buyer / Merchant</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Gowda"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Mobile / Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ramesh@farmmail.in"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>

            {role === 'FARMER' ? (
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3">
                <span className="font-bold text-emerald-900 block text-[11px] uppercase">
                  Farm & Location Details
                </span>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Farm / Estate Name</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Kaveri Organic Greens"
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">State</label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">District</label>
                    <input
                      type="text"
                      value={districtName}
                      onChange={(e) => setDistrictName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3">
                <span className="font-bold text-blue-900 block text-[11px] uppercase">
                  Buyer Profile Details
                </span>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Company / Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Retail Greens Pvt Ltd"
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Buyer Category</label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl"
                  >
                    <option value="WHOLESALER">Wholesale Merchant / Mandi Trader</option>
                    <option value="SUPERMARKET">Supermarket / Retail Chain</option>
                    <option value="PROCESSOR">Food Processing & Agribusiness</option>
                    <option value="HOTEL_RESTAURANT">Hotel / Restaurant / Cloud Kitchen</option>
                    <option value="INDIVIDUAL">Direct Consumer / Collective</option>
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">Create Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Confirm Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create {role === 'FARMER' ? 'Farmer' : 'Buyer'} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">Registered Email Address:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ramesh.gowda@agrodirect.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition active:scale-[0.99]"
            >
              {isSubmitting ? 'Sending Instructions...' : 'Send Password Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className="w-full py-2 text-stone-600 hover:text-stone-900 font-semibold"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* 4. RESET PASSWORD FORM */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">New Password:</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-800 block mb-1">Confirm New Password:</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition"
            >
              {isSubmitting ? 'Saving Password...' : 'Save New Password & Sign In'}
            </button>
          </form>
        )}

        {/* Dedicated Admin Portal Direct Access Footer */}
        {onNavigateToAdminLogin && (
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Are you a platform administrator?</span>
            <button
              type="button"
              onClick={onNavigateToAdminLogin}
              className="font-bold text-amber-800 hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal Login</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
