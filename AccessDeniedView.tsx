import React from 'react';
import { ShieldAlert, ArrowLeft, LogIn, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AccessDeniedViewProps {
  requiredRole?: string;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  requiredRole,
  onNavigateHome,
  onNavigateLogin,
}) => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-xl mx-auto my-16 px-4 text-center">
      <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest block">
            403 — Forbidden
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Access Denied
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            {user ? (
              <>
                You are currently signed in as <strong className="text-stone-900">{user.fullName}</strong> ({user.role}).
                {requiredRole && ` This section requires ${requiredRole} credentials.`}
              </>
            ) : (
              'You must be signed in with an authorized account to access this page.'
            )}
          </p>
        </div>

        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-600 text-left space-y-2">
          <span className="font-bold text-stone-800 block">Security Policy Guidelines:</span>
          <ul className="list-disc list-inside space-y-1 text-stone-600">
            <li>Cultivators / Farmers can only access the Farmer Dashboard, crop inventory, and harvest listings.</li>
            <li>Buyers / Wholesalers can access the Buyer Dashboard, shopping cart, and negotiation tools.</li>
            <li>Admin Command Center requires verified platform administrator credentials.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={onNavigateHome}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-xs flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              onNavigateLogin();
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Different Role</span>
          </button>
        </div>
      </div>
    </div>
  );
};
