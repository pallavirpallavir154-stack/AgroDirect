import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../frontend/context/AuthContext';

interface AdminLoginViewProps {
  onSuccess: () => void;
  onNavigateToUserLogin: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onSuccess,
  onNavigateToUserLogin,
}) => {
  const { adminLogin, adminGoogleSignIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStage, setVerificationStage] = useState<'idle' | 'authenticating' | 'validating_claim' | 'success'>('idle');
  const [showSecondaryPassword, setShowSecondaryPassword] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [passwordEmail, setPasswordEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async (simulatedEmail?: string) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    setVerificationStage('authenticating');

    try {
      // Step 1: Firebase Google OAuth token acquisition & Step 2: Backend custom claim verification
      setTimeout(() => {
        if (isSubmitting) setVerificationStage('validating_claim');
      }, 500);

      const res = simulatedEmail
        ? await adminGoogleSignIn({ email: simulatedEmail, displayName: 'Authorized Administrator' })
        : await adminGoogleSignIn();

      if (res.success) {
        setVerificationStage('success');
        setTimeout(() => {
          setIsSubmitting(false);
          onSuccess();
        }, 600);
      } else {
        setIsSubmitting(false);
        setVerificationStage('idle');
        setErrorMessage(
          res.error || "403 Forbidden: Google account does not contain the required 'ADMIN' custom claim."
        );
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setVerificationStage('idle');
      // If popup was blocked or iframe restriction, inform user and provide direct account verification
      if (err.message && (err.message.includes('popup') || err.message.includes('cancelled'))) {
        setErrorMessage('Google OAuth popup was closed or restricted by the browser iframe. Use the verified administrator email entry below to validate custom claims.');
      } else {
        setErrorMessage(err.message || "Failed to verify administrator 'ADMIN' custom claim via Google.");
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    setVerificationStage('validating_claim');

    const res = await adminLogin(passwordEmail, password);
    setIsSubmitting(false);
    setVerificationStage('idle');

    if (res.success) {
      onSuccess();
    } else {
      setErrorMessage(res.error || "403 Access Denied: Administrator account requires valid 'ADMIN' credentials.");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 px-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl text-white space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
            AgroDirect Core Governance
          </span>
          <h2 className="text-2xl font-serif font-bold text-white">
            Admin Command Center
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed max-w-sm mx-auto">
            Authorized platform administrators only. Verified with Firebase Authentication and backend RBAC token custom claim validation.
          </p>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-300">
              Zero-Trust 'ADMIN' Claim Validation
            </span>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Google Sign-In triggers an API verification step to validate the user's <code className="text-amber-300 font-mono bg-stone-900/80 px-1 py-0.5 rounded">ADMIN</code> role custom claim before granting dashboard access.
            </p>
          </div>
        </div>

        {/* Verification Progress Tracker */}
        {isSubmitting && (
          <div className="p-4 rounded-2xl bg-stone-800/90 border border-amber-500/30 text-stone-200 text-xs space-y-3 animate-fade-in">
            <div className="flex items-center justify-between font-semibold text-amber-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                Validating Administrator Identity...
              </span>
              <span className="font-mono text-[10px] uppercase">RBAC Step</span>
            </div>

            <div className="space-y-2 pt-1 border-t border-stone-700/60 text-[11px]">
              <div className="flex items-center gap-2">
                {verificationStage === 'authenticating' ? (
                  <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                )}
                <span className={verificationStage === 'authenticating' ? 'text-amber-200 font-medium' : 'text-stone-300'}>
                  1. Firebase Google OAuth Token Acquisition
                </span>
              </div>

              <div className="flex items-center gap-2">
                {verificationStage === 'validating_claim' ? (
                  <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
                ) : verificationStage === 'success' ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-stone-600" />
                )}
                <span className={verificationStage === 'validating_claim' ? 'text-amber-200 font-medium' : 'text-stone-400'}>
                  2. Backend Verification of 'ADMIN' Custom Claim
                </span>
              </div>

              <div className="flex items-center gap-2">
                {verificationStage === 'success' ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-stone-600" />
                )}
                <span className={verificationStage === 'success' ? 'text-emerald-300 font-bold' : 'text-stone-500'}>
                  3. Access Granted — Launching Command Center
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block text-red-300">Authorization Denied</span>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* PRIMARY AUTHENTICATION METHOD: Firebase Google Sign-In */}
        <div className="space-y-4 pt-1">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleGoogleSignIn()}
            className="w-full py-4 px-5 bg-white hover:bg-stone-100 active:scale-[0.99] text-stone-900 rounded-2xl font-bold transition flex items-center justify-center gap-3.5 shadow-xl disabled:opacity-50 border border-stone-200 cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-sm font-semibold text-stone-900">
              {isSubmitting ? 'Verifying Admin Google Sign-In...' : 'Sign in with Google (Admin)'}
            </span>
          </button>

          {/* Direct verification helper for sandboxed iframes & test accounts */}
          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Backend Custom Claim Verification
              </span>
              <span className="text-[9px] text-amber-400 uppercase font-mono tracking-wider bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-full">
                ADMIN Claim Check
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                placeholder="admin@agrodirect.in"
                className="flex-1 px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                disabled={isSubmitting || !customGoogleEmail}
                onClick={() => handleGoogleSignIn(customGoogleEmail)}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition disabled:opacity-40 shadow-sm"
              >
                Verify Claim
              </button>
            </div>
            <p className="text-[10px] text-stone-400 leading-normal">
              Triggers <code className="text-amber-300 font-mono">/api/auth/admin-google-verify</code> to validate server-side platform administrator authorization.
            </p>
          </div>
        </div>

        {/* Secondary Method Accordion: Password Fallback */}
        <div className="pt-2 border-t border-stone-800">
          <button
            type="button"
            onClick={() => setShowSecondaryPassword(!showSecondaryPassword)}
            className="w-full text-center text-xs text-stone-400 hover:text-stone-300 flex items-center justify-center gap-1.5 py-1 transition"
          >
            <span>{showSecondaryPassword ? 'Hide secondary credentials option' : 'Use secondary administrator credentials'}</span>
          </button>

          {showSecondaryPassword && (
            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3 text-xs bg-stone-800/50 p-4 rounded-2xl border border-stone-700">
              <div>
                <label className="font-semibold text-stone-300 block mb-1">
                  Administrator Email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={passwordEmail}
                    onChange={(e) => setPasswordEmail(e.target.value)}
                    placeholder="admin@agrodirect.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-300 block mb-1">
                  Master Security Key / Password:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 text-xs"
              >
                <span>Authenticate with Password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-800 text-center">
          <button
            type="button"
            onClick={onNavigateToUserLogin}
            className="text-xs text-stone-400 hover:text-white transition cursor-pointer"
          >
            ← Return to Farmer & Buyer Login
          </button>
        </div>
      </div>
    </div>
  );
};
