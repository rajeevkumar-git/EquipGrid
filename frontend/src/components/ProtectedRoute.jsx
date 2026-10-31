import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, LogIn, Scale, ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isJudgeMode, openAuthModal, openJudgeModal } = useAuth();

  // If user is not logged in and not in Judge Mode -> Restrict access
  if (!user && !isJudgeMode) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4 animate-in fade-in duration-200">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
          <Lock className="w-6 h-6 text-slate-700" />
        </div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Institutional Authentication Required</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          This portal contains restricted university allocation records and custody management. Please sign in with your institutional credentials or enter your Judge Token to proceed.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('login')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={openJudgeModal}
            className="px-4 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>Judge Access</span>
          </button>
        </div>
      </div>
    );
  }

  // If specific roles required and user is not in those roles (and not in Judge mode)
  if (allowedRoles && user && !allowedRoles.includes(user.role) && !isJudgeMode) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Role Authorization Required</h2>
        <p className="text-xs text-slate-600">
          Your active account role is <strong className="capitalize">{user.role}</strong>. This section is restricted to <strong>{allowedRoles.join(' / ')}</strong>.
        </p>
      </div>
    );
  }

  return children;
};
