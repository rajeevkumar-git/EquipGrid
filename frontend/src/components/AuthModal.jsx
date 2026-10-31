import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Building, Briefcase, Phone, ShieldCheck, ArrowRight, Sparkles, Scale, Info } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { 
    login, 
    register, 
    switchDemoUser, 
    demoPersonas, 
    isJudgeMode, 
    openJudgeModal,
    pendingBookingResource 
  } = useAuth();
  
  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form State
  const [registerData, setRegisterData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'borrower', // 'borrower' | 'owner' | 'admin'
    institutional_affiliation: 'IIT Delhi',
    department: 'Engineering',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(loginEmail, loginPassword);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Invalid email or password');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!registerData.full_name.trim() || !registerData.email.trim() || !registerData.password) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    const res = await register(registerData);
    setLoading(false);
    if (res.success) {
      setSuccessMsg('Account created successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  const handleQuickDemo = async (email) => {
    setError('');
    setLoading(true);
    await switchDemoUser(email);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold">
              EG
            </span>
            <span className="text-xl font-black tracking-tight text-white">EquipGrid Portal</span>
          </div>
          <p className="text-xs text-slate-300">
            Trusted Institutional Resource & Equipment Sharing Network
          </p>

          {/* Pending Booking Banner */}
          {pendingBookingResource && (
            <div className="mt-3 p-2.5 rounded-lg bg-blue-600/30 border border-blue-400/40 text-blue-100 text-xs flex items-center gap-2 animate-in fade-in">
              <Info className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                Please authenticate to complete your reservation for <strong>{pendingBookingResource.name}</strong>.
              </span>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex mt-4 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                tab === 'login' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                tab === 'register' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@equipgrid.demo"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Demo@1234"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to EquipGrid'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Judge Mode Switcher (Only visible when Judge Mode is enabled) */}
              {isJudgeMode ? (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Judge Evaluation 1-Click Login:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {demoPersonas.map((persona) => (
                      <button
                        key={persona.email}
                        type="button"
                        onClick={() => handleQuickDemo(persona.email)}
                        className="p-2 border border-indigo-100 bg-indigo-50/40 rounded-lg text-center hover:border-indigo-400 hover:bg-indigo-50 transition group"
                      >
                        <span className="text-base block mb-0.5">
                          {persona.role === 'borrower' ? '👨‍🎓' : persona.role === 'owner' ? '🔬' : '🛡️'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-700 group-hover:text-indigo-600 block line-clamp-1">
                          {persona.label.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openJudgeModal();
                    }}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 hover:underline"
                  >
                    <Scale className="w-3 h-3" /> Evaluating for Hackathon? Enter Judge Token
                  </button>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Full Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={registerData.full_name}
                    onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                    placeholder="e.g. Rajeev Kumar"
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Institutional Email *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="e.g. rajeev@iitd.ac.in"
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Password *</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Role *</label>
                  <select
                    value={registerData.role}
                    onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                    className="w-full p-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-500 font-medium"
                  >
                    <option value="borrower">👨‍🎓 Student / Researcher</option>
                    <option value="owner">🔬 Lab In-charge / Faculty</option>
                    <option value="admin">🛡️ Institutional Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Institution *</label>
                  <input
                    type="text"
                    required
                    value={registerData.institutional_affiliation}
                    onChange={(e) => setRegisterData({ ...registerData, institutional_affiliation: e.target.value })}
                    placeholder="e.g. IIT Delhi"
                    className="w-full p-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Department</label>
                  <input
                    type="text"
                    value={registerData.department}
                    onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                    placeholder="e.g. Nanotech"
                    className="w-full p-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Phone</label>
                  <input
                    type="text"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Register Institutional Account'}
                <ShieldCheck className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
