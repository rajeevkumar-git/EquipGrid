import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JudgeAccessModal } from './components/JudgeAccessModal';
import { ProtectedRoute } from './components/ProtectedRoute';
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
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab,
    isJudgeModalOpen,
    closeJudgeModal
  } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Clean Single Navigation Bar */}
      <Navbar />

      {/* Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/resource/:id" element={<ResourceDetail />} />
          
          {/* Protected Operational Workspaces */}
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['borrower']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/audit-history" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AuditLogPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/new-resource" 
            element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <NewResourcePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTab={authModalTab}
      />

      {/* Confidential Passcode Modal */}
      <JudgeAccessModal
        isOpen={isJudgeModalOpen}
        onClose={closeJudgeModal}
      />

      {/* Simple Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">EquipGrid — Institutional Equipment & Resource Sharing Network</p>
        <p className="text-[11px] text-slate-400">
          Inter-Institutional Resource & Space Sharing Platform • Built for the 48-Hour Hackathon
        </p>
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
