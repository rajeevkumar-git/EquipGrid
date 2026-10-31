import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scale, Lock, X, ArrowRight, CheckCircle2 } from 'lucide-react';

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
      }, 700);
    } else {
      setError(res.error || 'Access denied. Invalid credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white">
                Reviewer & Judge Authentication
              </h2>
              <span className="text-[10px] text-slate-400">Institutional Evaluation Sandbox</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5">
          {success ? (
            <div className="py-4 text-center space-y-2 animate-in fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xs text-slate-900">Sandbox Unlocked</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Access Key
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    autoFocus
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Enter confidential key..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <span>Authenticate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
