import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JudgeDemoBanner } from './components/JudgeDemoBanner';
import { JudgeAccessModal } from './components/JudgeAccessModal';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { Catalog } from './pages/Catalog';
import { ResourceDetail } from './pages/ResourceDetail';
import { StudentDashboard } from './pages/StudentDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { AuditLogPage } from './pages/AuditLogPage';
import { NewResourcePage } from './pages/NewResourcePage';
import { Scale } from 'lucide-react';

function AppContent() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab,
    isJudgeMode,
    isJudgeModalOpen,
    openJudgeModal,
    closeJudgeModal
  } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Top persistent Judge Switcher (Only visible when Judge Mode is unlocked) */}
      {isJudgeMode && <JudgeDemoBanner />}

      {/* Standard Navigation */}
      <Navbar />

      {/* Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/resource/:id" element={<ResourceDetail />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/audit-history" element={<AuditLogPage />} />
          <Route path="/new-resource" element={<NewResourcePage />} />
        </Routes>
      </main>

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTab={authModalTab}
      />

      {/* Judge Passcode Modal */}
      <JudgeAccessModal
        isOpen={isJudgeModalOpen}
        onClose={closeJudgeModal}
      />

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-700">EquipGrid — Institutional Equipment & Resource Sharing Network</p>
        <p>Built for the 48-Hour Hackathon • Team: Rajeev, Farhan, Shubham, Aman</p>
        
        <div className="pt-1">
          {!isJudgeMode ? (
            <button
              onClick={openJudgeModal}
              className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium hover:underline bg-indigo-50/70 border border-indigo-200/60 px-2.5 py-1 rounded-full transition"
            >
              <Scale className="w-3 h-3 text-indigo-500" />
              <span>Hackathon Jury & Reviewer Mode (Enter Token)</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <span>✓ Judge Evaluation Mode Enabled</span>
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
