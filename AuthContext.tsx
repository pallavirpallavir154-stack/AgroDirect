import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, LanguageCode } from '../../shared/types';
import { signInWithGoogleOAuth } from '../lib/firebase';

interface AuthResponse {
  success: boolean;
  error?: string;
  message?: string;
  role?: UserRole;
  user?: UserProfile;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  login: (email: string, password?: string, requestedRole?: 'FARMER' | 'BUYER') => Promise<AuthResponse>;
  adminLogin: (email: string, password?: string) => Promise<AuthResponse>;
  adminGoogleSignIn: (simulatedGoogleAccount?: { email: string; displayName?: string }) => Promise<AuthResponse>;
  register: (data: Partial<UserProfile> & { password?: string; confirmPassword?: string; location?: any }) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (email: string, newPassword: string, confirmNewPassword: string) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  verifyEmail: () => Promise<void>;
  switchDemoUser: (targetRole: UserRole) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('agrodirect_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('agrodirect_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('agrodirect_lang') as LanguageCode) || 'en';
  });

  // Verify and hydrate session from server on startup
  useEffect(() => {
    const hydrateSession = async () => {
      const storedToken = localStorage.getItem('agrodirect_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'x-auth-token': storedToken,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            localStorage.setItem('agrodirect_user', JSON.stringify(data.user));
          }
        } else {
          // Token expired or invalid
          setUser(null);
          setToken(null);
          localStorage.removeItem('agrodirect_user');
          localStorage.removeItem('agrodirect_token');
        }
      } catch (err) {
        console.error('Session hydration error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    hydrateSession();
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('agrodirect_lang', lang);
  };

  // Farmer & Buyer Login
  const login = async (
    email: string,
    password?: string,
    requestedRole?: 'FARMER' | 'BUYER'
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, requestedRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Login failed. Please check your credentials.' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('agrodirect_user', JSON.stringify(data.user));
      localStorage.setItem('agrodirect_token', data.token);
      setIsLoading(false);

      return {
        success: true,
        user: data.user,
        role: data.user.role,
      };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Network error occurred during login.' };
    }
  };

  // Dedicated Firebase Admin Login (/admin/login)
  const adminLogin = async (email: string, password?: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || '403 Access Denied: Admin authorization failed.' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('agrodirect_user', JSON.stringify(data.user));
      localStorage.setItem('agrodirect_token', data.token);
      setIsLoading(false);

      return {
        success: true,
        user: data.user,
        role: 'ADMIN',
      };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Admin authentication failed.' };
    }
  };

  // Dedicated Firebase Google Sign-In for Admin (/admin/login)
  const adminGoogleSignIn = async (simulatedGoogleAccount?: { email: string; displayName?: string }): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      let googlePayload: {
        idToken: string;
        email: string | null;
        uid: string;
        displayName: string | null;
        photoURL: string | null;
      };

      if (simulatedGoogleAccount) {
        googlePayload = {
          idToken: `google_oauth_token_${Date.now()}`,
          email: simulatedGoogleAccount.email,
          uid: `google-uid-${simulatedGoogleAccount.email.replace(/[^a-zA-Z0-9]/g, '')}`,
          displayName: simulatedGoogleAccount.displayName || 'Google Admin User',
          photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${simulatedGoogleAccount.email}`,
        };
      } else {
        try {
          googlePayload = await signInWithGoogleOAuth();
        } catch (popupErr: any) {
          // If in an iframe or environment without real Google OAuth credentials configured,
          // allow falling back to the configured admin account prompt
          throw popupErr;
        }
      }

      const res = await fetch('/api/auth/admin-google-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googlePayload),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return {
          success: false,
          error: data.error || '403 Access Denied: This Google account is not authorized as an AgroDirect Administrator.',
        };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('agrodirect_user', JSON.stringify(data.user));
      localStorage.setItem('agrodirect_token', data.token);
      setIsLoading(false);

      return {
        success: true,
        user: data.user,
        role: 'ADMIN',
      };
    } catch (e: any) {
      setIsLoading(false);
      return {
        success: false,
        error: e.message || 'Google Sign-In failed or popup was blocked.',
      };
    }
  };

  // Farmer & Buyer Registration
  const register = async (
    data: Partial<UserProfile> & { password?: string; confirmPassword?: string; location?: any }
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: result.error || 'Registration failed.' };
      }

      setUser(result.user);
      setToken(result.token);
      localStorage.setItem('agrodirect_user', JSON.stringify(result.user));
      localStorage.setItem('agrodirect_token', result.token);
      setIsLoading(false);

      return {
        success: true,
        user: result.user,
        role: result.user.role,
        message: result.message,
      };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Network error occurred during registration.' };
    }
  };

  // Forgot Password
  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to send password reset.' };
      }
      return { success: true, message: data.message };
    } catch (e: any) {
      return { success: false, error: e.message || 'Error processing request.' };
    }
  };

  // Reset Password
  const resetPassword = async (
    email: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, confirmNewPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update password.' };
      }
      return { success: true, message: data.message };
    } catch (e: any) {
      return { success: false, error: e.message || 'Error updating password.' };
    }
  };

  // Logout & Clean Session State
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agrodirect_user');
    localStorage.removeItem('agrodirect_token');
    localStorage.removeItem('agrodirect_cart');
    // Clear session storage if any
    sessionStorage.clear();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !token) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id, updates }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('agrodirect_user', JSON.stringify(data.user));
      }
    } catch (e) {
      console.error('Profile update error', e);
    }
  };

  const verifyEmail = async () => {
    if (!user || !token) return;
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('agrodirect_user', JSON.stringify(data.user));
      }
    } catch (e) {
      console.error('Email verification error', e);
    }
  };

  // Switch demo user helper for fast testing
  const switchDemoUser = async (targetRole: UserRole): Promise<AuthResponse> => {
    if (targetRole === 'ADMIN') {
      return await adminLogin('admin@agrodirect.in');
    } else if (targetRole === 'FARMER') {
      return await login('ramesh.gowda@agrodirect.in', 'Farmer@123', 'FARMER');
    } else {
      return await login('ananya.sharma@retailgreens.com', 'Buyer@123', 'BUYER');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isLoading,
        isAuthenticated: !!user && !!token,
        language,
        setLanguage,
        login,
        adminLogin,
        adminGoogleSignIn,
        register,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile,
        verifyEmail,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
