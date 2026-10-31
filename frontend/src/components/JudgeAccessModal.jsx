import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scale, Lock, Sparkles, X, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const JudgeAccessModal = ({ isOpen, onClose }) => {
  const { unlockJudgeMode } = useAuth();
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = unlockJudgeMode(tokenInput);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTokenInput('');
        onClose();
      }, 1000);
    } else {
      setError(res.error || 'Invalid token. Please check and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/90 border border-indigo-400/40 flex items-center justify-center shadow-inner">
              <Scale className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Judge & Evaluator Access
              </h2>
              <span className="text-[11px] text-indigo-300 font-medium">EquipGrid Hackathon Review Sandbox</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-2">
            Enter the secret review token provided to the Hackathon Evaluation Committee to unlock 1-click persona switching, quota bypass, and custody verification.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {success ? (
            <div className="py-6 text-center space-y-2 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Judge Mode Unlocked!</h3>
              <p className="text-xs text-slate-500">Activating evaluation switcher and sandbox profiles...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in shake">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Judge Passcode / Token</span>
                  <span className="text-[10px] text-slate-400 font-normal">Confidential</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                    placeholder="e.g. EQUIPGRID2026"
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-mono tracking-wider font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase placeholder:font-normal placeholder:tracking-normal placeholder:font-sans"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Hint: Use token <code className="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded font-mono font-bold">EQUIPGRID2026</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Unlock Judge Mode</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
