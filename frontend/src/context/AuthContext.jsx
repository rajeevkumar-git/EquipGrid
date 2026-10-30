import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('equipgrid_token'));
  const [loading, setLoading] = useState(true);

  // Available demo personas for judge switcher
  const demoPersonas = [
    { email: 'student@equipgrid.demo', label: 'Student (Aarav Singh)', role: 'borrower', dept: 'ECE' },
    { email: 'labmanager@equipgrid.demo', label: 'Lab In-charge (Dr. Priya Roy)', role: 'owner', dept: 'Fab Lab' },
    { email: 'admin@equipgrid.demo', label: 'Admin (Prof. Ramesh Kumar)', role: 'admin', dept: 'Dean of Research' },
  ];

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data);
    } catch (err) {
      console.warn('No active session, clearing token');
      localStorage.removeItem('equipgrid_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      // Auto-switch to Student on first load for zero-friction judge evaluation
      switchDemoUser('student@equipgrid.demo');
    }
  }, [token]);

  const switchDemoUser = async (email) => {
    setLoading(true);
    try {
      const res = await api.post(`/api/auth/demo-login/${email}`);
      const { access_token, user_id, role, full_name } = res.data;
      localStorage.setItem('equipgrid_token', access_token);
      setToken(access_token);
      setUser({ id: user_id, email, full_name, role });
    } catch (err) {
      console.error('Demo login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('equipgrid_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, demoPersonas, switchDemoUser, logout, refreshUser: fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
