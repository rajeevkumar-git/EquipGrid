import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JudgeDemoBanner } from './components/JudgeDemoBanner';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { Catalog } from './pages/Catalog';
import { ResourceDetail } from './pages/ResourceDetail';
import { StudentDashboard } from './pages/StudentDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { AuditLogPage } from './pages/AuditLogPage';
import { NewResourcePage } from './pages/NewResourcePage';

function AppContent() {
  const { isAuthModalOpen, closeAuthModal, authModalTab } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Top persistent Judge Switcher */}
      <JudgeDemoBanner />

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

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">EquipGrid — Institutional Equipment & Resource Sharing Network</p>
        <p>Built for the 48-Hour Hackathon • Team: Rajeev, Farhan, Shubham, Aman</p>
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
