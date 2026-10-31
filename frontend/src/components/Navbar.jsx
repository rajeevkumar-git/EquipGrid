import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { 
  Layers, 
  Compass,
  Calendar, 
  ShieldCheck, 
  History, 
  PlusCircle, 
  Bell, 
  LogOut,
  LogIn,
  UserPlus,
  Scale,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, openAuthModal, isJudgeMode, openJudgeModal } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const countRes = await api.get('/api/notifications/unread-count');
      setUnreadCount(countRes.data?.unread_count || 0);

      const listRes = await api.get('/api/notifications');
      setNotifications(listRes.data || []);
    } catch (err) {
      // Fallback empty if backend offline
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/api/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      setUnreadCount(0);
    }
  };

  // Strict Role-Based Navigation links (Guest only sees Home & Explore)
  const navLinks = [
    { to: '/', label: 'Home', icon: Layers },
    { to: '/catalog', label: 'Explore Equipment', icon: Compass },
    ...(user
      ? [
          ...(user.role === 'borrower'
            ? [{ to: '/student-dashboard', label: 'My Bookings', icon: Calendar }]
            : []),
          ...(user.role === 'owner' || user.role === 'admin'
            ? [
                { to: '/manager-dashboard', label: 'Lab Dashboard', icon: ShieldCheck },
                { to: '/new-resource', label: 'List Equipment', icon: PlusCircle },
              ]
            : []),
          ...(user.role === 'admin' || isJudgeMode
            ? [{ to: '/audit-history', label: 'Audit Trail', icon: History }]
            : []),
        ]
      : []),
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 group">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="leading-none text-blue-900 tracking-tight font-extrabold text-lg">EquipGrid</span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Institutional Sharing</span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Judge Access Pill, Notifications & User Card / Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Judge Mode Trigger (Only shown if not already unlocked) */}
            {!isJudgeMode ? (
              <button
                onClick={openJudgeModal}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition flex items-center gap-1.5 shadow-xs"
                title="Enter Judge Passcode"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Judge Access</span>
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                <Sparkles className="w-3 h-3 text-amber-500" /> Judge Active
              </span>
            )}

            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifMenu(!showNotifMenu)}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full relative transition"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifMenu && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                        <span className="font-semibold text-xs text-slate-800">Notifications ({unreadCount} new)</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-[11px] text-blue-600 hover:underline">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-6 text-center text-xs text-slate-400">No new notifications</p>
                        ) : (
                          notifications.slice(0, 6).map((n) => (
                            <div key={n.id} className={`px-4 py-2.5 text-xs ${n.is_read ? 'bg-white' : 'bg-blue-50/50'}`}>
                              <p className="font-medium text-slate-800">{n.title}</p>
                              <p className="text-slate-600 text-[11px] mt-0.5">{n.body}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Pill */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-xs font-bold text-blue-800">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 leading-tight">{user.full_name}</span>
                    <span className="text-[10px] text-blue-600 font-medium capitalize">{user.role}</span>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
