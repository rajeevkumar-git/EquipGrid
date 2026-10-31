import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Shield, Sparkles, LogOut, Lock } from 'lucide-react';

export const JudgeDemoBanner = () => {
  const { user, demoPersonas, switchDemoUser, isJudgeMode, exitJudgeMode } = useAuth();

  if (!isJudgeMode) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2 border-b border-indigo-800 text-xs shadow-md animate-in slide-in-from-top-1 duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold tracking-wide uppercase text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Judge Evaluation Mode
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden md:inline">
            Active: <strong className="text-white">{user?.full_name || 'Guest Sandbox'}</strong> ({user?.role || 'Guest'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 mr-1 hidden lg:inline text-[11px]">1-Click Switch:</span>
          {demoPersonas.map((persona) => {
            const isActive = user?.email === persona.email;
            return (
              <button
                key={persona.email}
                onClick={() => switchDemoUser(persona.email)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-white/30 scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {persona.role === 'borrower' && '👨‍🎓'}
                {persona.role === 'owner' && '🔬'}
                {persona.role === 'admin' && '🛡️'}
                <span>{persona.label.split(' ')[0]}</span>
              </button>
            );
          })}

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block"></div>

          <button
            onClick={exitJudgeMode}
            title="Exit Judge Evaluation Mode"
            className="px-2 py-1 rounded text-[11px] font-semibold bg-rose-950/60 hover:bg-rose-900 border border-rose-800/70 text-rose-200 transition flex items-center gap-1"
          >
            <Lock className="w-3 h-3 text-rose-400" />
            <span className="hidden sm:inline">Exit Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
