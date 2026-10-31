import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building, 
  ShieldCheck, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  Layers, 
  Sparkles, 
  Scale, 
  Users, 
  Search,
  FileCheck,
  Zap
} from 'lucide-react';

export const LandingPage = () => {
  const { user, switchDemoUser, openAuthModal, isJudgeMode, openJudgeModal } = useAuth();
  const navigate = useNavigate();

  const handlePersonaEntry = async (email, destination) => {
    if (isJudgeMode) {
      await switchDemoUser(email);
    }
    navigate(destination);
  };

  const steps = [
    { num: '01', title: 'List Asset', desc: 'Faculty lists idle equipment & rules' },
    { num: '02', title: 'Fair Discovery', desc: 'Anti-monopoly ranking boosts idle gear' },
    { num: '03', title: 'Request Slot', desc: 'Borrower reserves specific time slot' },
    { num: '04', title: 'AI Verification', desc: 'Gemini validates safety certificates' },
    { num: '05', title: 'Quota Guard', desc: 'Prevents monopolization of lab hours' },
    { num: '06', title: 'Owner Review', desc: 'Lab in-charge approves reservation' },
    { num: '07', title: 'Check-In Signoff', desc: 'Initial baseline condition checklist' },
    { num: '08', title: 'Return Signoff', desc: 'Checklist comparison upon return' },
    { num: '09', title: 'AI Damage Audit', desc: 'Automated discrepancy & dispute filing' },
    { num: '10', title: 'Immutable Trail', desc: 'Cryptographically hashed event ledger' },
  ];

  const institutions = [
    { name: 'IIT Delhi', role: 'Advanced Fab Lab & CIF' },
    { name: 'DTU Delhi', role: 'Materials Characterization' },
    { name: 'BITS Pilani', role: 'ISO-7 Microfab Cleanroom' },
    { name: 'NIT Trichy', role: 'RF & Microwave Engineering' },
    { name: 'NSUT Delhi', role: 'DGX H100 Supercomputing' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/50">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Inter-Institutional Equipment & Space Sharing Network
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Unlock High-End Labs & Research Equipment Across Universities.
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminating idle instruments and lab monopolies. Borrow specialized Cleanrooms, SEM Microscopes, 3D Printers, and GPUs with <strong>complete custody tracking and AI condition verification</strong>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/catalog"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              Explore Equipment Catalog
            </Link>
            {!user ? (
              <button
                onClick={() => openAuthModal('login')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition"
              >
                Sign In to University Account
              </button>
            ) : (
              <Link
                to={user.role === 'borrower' ? '/student-dashboard' : '/manager-dashboard'}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition"
              >
                Go to Your Dashboard ({user.full_name})
              </Link>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-800/80 text-left">
            <div>
              <p className="text-2xl font-black text-white">5+ Premier</p>
              <p className="text-xs text-slate-400">Connected Institutions</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">100% Audited</p>
              <p className="text-xs text-slate-400">10-Step Custody Lifecycle</p>
            </div>
            <div>
              <p className="text-2xl font-black text-indigo-400">Anti-Monopoly</p>
              <p className="text-xs text-slate-400">Fair Discovery Algorithm</p>
            </div>
            <div>
              <p className="text-2xl font-black text-amber-400">AI Powered</p>
              <p className="text-xs text-slate-400">Condition Discrepancy Checks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Institutions Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Trusted by Premier Labs & Universities
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {institutions.map((inst) => (
            <div
              key={inst.name}
              className="bg-white border border-slate-200 shadow-sm rounded-xl px-5 py-2.5 flex items-center gap-2.5"
            >
              <Building className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold text-xs text-slate-800 block leading-tight">{inst.name}</span>
                <span className="text-[10px] text-slate-500">{inst.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Choose Your Role / Portal Entry Points */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Choose Your Institutional Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Tailored experiences for researchers borrowing gear, professors managing lab queues, and deans overseeing compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Student / Borrower */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold shadow-inner">
                👨‍🎓
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Borrower Access</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                  Students & Researchers
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover instruments across partner universities, upload qualification certifications, reserve slots, and perform digital check-in.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Transparent fair booking quotas
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> AI certificate qualification check
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handlePersonaEntry('student@equipgrid.demo', '/student-dashboard')}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{isJudgeMode ? 'Enter as Student (Aarav Singh)' : 'Enter Student Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Lab In-charge / Faculty */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold shadow-inner">
                🔬
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Resource Custodian</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  Lab In-charges & Faculty
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                List idle department assets, define custom safety checklists, review reservation requests, and review AI return damage flags.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 1-Click approval queue review
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Automated return damage quarantine
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handlePersonaEntry('labmanager@equipgrid.demo', '/manager-dashboard')}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{isJudgeMode ? 'Enter as Lab Manager (Dr. Priya Roy)' : 'Enter Lab Governance Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Institutional Admin */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-2xl font-bold shadow-inner">
                🏛️
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Governance & Audit</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition">
                  Deans & Compliance Admins
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect the immutable SHA-256 event ledger, audit inter-university equipment utilization metrics, and mediate disputes.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Cryptographic audit trail (Step 10)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Multi-institution quota oversight
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handlePersonaEntry('admin@equipgrid.demo', '/audit-history')}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{isJudgeMode ? 'Enter as Admin (Prof. Ramesh Kumar)' : 'View Cryptographic Audit Trail'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10-Step Custody Lifecycle Diagram */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Complete Trust Architecture
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              The 10-Step Institutional Custody Lifecycle
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              How EquipGrid ensures total safety, zero lab damage disputes, and transparent allocation from listing to return.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition"
              >
                <span className="text-xs font-black text-blue-600 block mb-1">Step {step.num}</span>
                <h4 className="font-bold text-xs text-slate-900 leading-tight mb-1">{step.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
