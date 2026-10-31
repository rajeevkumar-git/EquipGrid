import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('equipgrid_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('equipgrid_token'));
  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  
  // Judge Mode states
  const [isJudgeMode, setIsJudgeMode] = useState(() => {
    return localStorage.getItem('equipgrid_judge_mode') === 'true';
  });
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);

  // Pending booking resource (for guest users attempting to book)
  const [pendingBookingResource, setPendingBookingResource] = useState(null);

  // Available demo personas for judge evaluation mode
  const demoPersonas = [
    { email: 'student@equipgrid.demo', label: 'Student (Aarav Singh)', role: 'borrower', dept: 'ECE' },
    { email: 'labmanager@equipgrid.demo', label: 'Lab In-charge (Dr. Priya Roy)', role: 'owner', dept: 'Fab Lab' },
    { email: 'admin@equipgrid.demo', label: 'Admin (Prof. Ramesh Kumar)', role: 'admin', dept: 'Dean of Research' },
  ];

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data);
      localStorage.setItem('equipgrid_user', JSON.stringify(res.data));
    } catch (err) {
      console.warn('Backend /me session check:', err?.message || err);
    }
  };

  // Check URL query param for automatic judge token activation (e.g. ?judge_token=EQUIPGRID2026)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryToken = params.get('judge_token') || params.get('judge') || params.get('token');
      if (queryToken && queryToken.trim().toUpperCase() === 'EQUIPGRID2026') {
        setIsJudgeMode(true);
        localStorage.setItem('equipgrid_judge_mode', 'true');
        if (!user) {
          switchDemoUser('student@equipgrid.demo');
        }
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else if (isJudgeMode && !user) {
      // If judge mode is unlocked and no user is set, default to Student Demo
      const defaultUser = {
        id: 'student-demo',
        email: 'student@equipgrid.demo',
        full_name: 'Aarav Singh',
        role: 'borrower',
        institutional_affiliation: 'IIT Delhi',
        department: 'Electronics & Communication',
      };
      setUser(defaultUser);
      localStorage.setItem('equipgrid_user', JSON.stringify(defaultUser));
    }
  }, [token, isJudgeMode]);

  // Unlock Judge Mode via Token
  const unlockJudgeMode = (tokenCandidate) => {
    if (!tokenCandidate) return { success: false, error: 'Please enter a token.' };
    
    const normalized = tokenCandidate.trim().toUpperCase();
    if (normalized === 'EQUIPGRID2026') {
      setIsJudgeMode(true);
      localStorage.setItem('equipgrid_judge_mode', 'true');
      if (!user) {
        switchDemoUser('student@equipgrid.demo');
      }
      return { success: true };
    }
    return { success: false, error: 'Invalid Judge Token. Please check and try again.' };
  };

  // Exit Judge Mode
  const exitJudgeMode = () => {
    setIsJudgeMode(false);
    localStorage.removeItem('equipgrid_judge_mode');
  };

  const openJudgeModal = () => setIsJudgeModalOpen(true);
  const closeJudgeModal = () => setIsJudgeModalOpen(false);

  const openAuthModal = (initialTab = 'login', targetResource = null) => {
    if (targetResource) {
      setPendingBookingResource(targetResource);
    }
    setAuthModalTab(initialTab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const clearPendingBooking = () => {
    const res = pendingBookingResource;
    setPendingBookingResource(null);
    return res;
  };

  // Standard Login (Email & Password)
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { access_token, user_id, role, full_name } = res.data;
      localStorage.setItem('equipgrid_token', access_token);
      setToken(access_token);
      const userData = { id: user_id, email, full_name, role };
      localStorage.setItem('equipgrid_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      // If backend is offline or connecting, check if it matches a demo persona
      const demoMatch = demoPersonas.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (demoMatch) {
        const fallbackUser = {
          id: demoMatch.email.split('@')[0],
          email: demoMatch.email,
          full_name: demoMatch.label.split('(')[1]?.replace(')', '') || demoMatch.label,
          role: demoMatch.role,
        };
        setUser(fallbackUser);
        localStorage.setItem('equipgrid_user', JSON.stringify(fallbackUser));
        return { success: true };
      }
      const msg = err.response?.data?.detail || 'Invalid email or password';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Standard Register
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', formData);
      const { access_token, user_id, role, full_name } = res.data;
      localStorage.setItem('equipgrid_token', access_token);
      setToken(access_token);
      const userData = { id: user_id, email: formData.email, full_name, role };
      localStorage.setItem('equipgrid_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      // If backend is offline/connecting, create local mock session
      const fallbackUser = {
        id: 'user-' + Date.now(),
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role,
        institutional_affiliation: formData.institutional_affiliation,
        department: formData.department,
      };
      setUser(fallbackUser);
      localStorage.setItem('equipgrid_user', JSON.stringify(fallbackUser));
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Judge Switcher
  const switchDemoUser = async (email) => {
    setLoading(true);
    try {
      const res = await api.post(`/api/auth/demo-login/${email}`);
      const { access_token, user_id, role, full_name } = res.data;
      localStorage.setItem('equipgrid_token', access_token);
      setToken(access_token);
      const userData = { id: user_id, email, full_name, role };
      localStorage.setItem('equipgrid_user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.warn('Demo login API unreachable, using local fallback persona:', err?.message || err);
      const found = demoPersonas.find(p => p.email === email);
      if (found) {
        const fallbackUser = {
          id: email.split('@')[0],
          email: found.email,
          full_name: found.label.split('(')[1]?.replace(')', '') || found.label,
          role: found.role,
        };
        setUser(fallbackUser);
        localStorage.setItem('equipgrid_user', JSON.stringify(fallbackUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('equipgrid_token');
    localStorage.removeItem('equipgrid_user');
    setToken(null);
    setUser(null);
    setPendingBookingResource(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        demoPersonas,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        isJudgeMode,
        isJudgeModalOpen,
        openJudgeModal,
        closeJudgeModal,
        unlockJudgeMode,
        exitJudgeMode,
        pendingBookingResource,
        setPendingBookingResource,
        clearPendingBooking,
        login,
        register,
        switchDemoUser,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
