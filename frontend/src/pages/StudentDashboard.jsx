import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ConditionChecklistModal } from '../components/ConditionChecklistModal';
import { IncidentModal } from '../components/IncidentModal';
import { AuditTimeline } from '../components/AuditTimeline';
import { FeedbackModal } from '../components/FeedbackModal';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  History, 
  ShieldCheck,
  Star,
  Coins,
  Sparkles,
  Gift,
  LogIn
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user, openAuthModal } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChecklist, setActiveChecklist] = useState(null); // { booking, mode: 'checkin' | 'return' }
  const [activeIncidentBooking, setActiveIncidentBooking] = useState(null);
  const [activeAuditBookingId, setActiveAuditBookingId] = useState(null);
  const [activeFeedbackBooking, setActiveFeedbackBooking] = useState(null);
  
  const [loyaltyTokens, setLoyaltyTokens] = useState(() => {
    const saved = localStorage.getItem('equipgrid_loyalty_tokens');
    return saved ? parseInt(saved, 10) : 450;
  });

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/bookings');
      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.warn('Backend unavailable, using local mock fallback:', err);
      try {
        const { MOCK_BOOKINGS } = await import('../api/mockData');
        setBookings(MOCK_BOOKINGS || []);
      } catch (e) {
        setBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSuccess = ({ bookingId, tokensEarned }) => {
    const newTotal = loyaltyTokens + tokensEarned;
    setLoyaltyTokens(newTotal);
    localStorage.setItem('equipgrid_loyalty_tokens', newTotal.toString());
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, has_feedback: true } : b))
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Approved</span>;
      case 'checked_in':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Active Custody</span>;
      case 'pending_approval':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Pending Review</span>;
      case 'waitlisted':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Waitlisted</span>;
      case 'completed':
        return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Returned & Verified</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Rejected</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Loyalty Reputation Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Custody & Bookings</h1>
          <p className="text-xs text-slate-500">Track your requests, check in to active slots, and verify returned equipment.</p>
        </div>

        {/* Reputation & Loyalty Hub */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-600">Trust Score:</span>
            <strong className="text-emerald-700 font-bold">{(user?.trust_score || 0.98) * 100}%</strong>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200 text-xs shadow-sm">
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="text-slate-700 font-medium">Loyalty Tokens:</span>
            <strong className="text-indigo-700 font-extrabold">{loyaltyTokens} 💎</strong>
            <span className="hidden sm:inline text-[10px] text-amber-700 font-semibold bg-amber-100/70 px-1.5 py-0.5 rounded">
              Perks Active: Deposit Waiver up to ₹1,000
            </span>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-800 uppercase tracking-wide">
            My Resource Reservations ({bookings.length})
          </span>
          <button onClick={loadBookings} className="text-xs text-blue-600 hover:underline">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading booking records...</div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <p>You haven't requested any resources yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookings.map((b) => {
              const start = new Date(b.start_time);
              const end = new Date(b.end_time);

              return (
                <div key={b.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{b.resource_name || 'Specialized Resource'}</span>
                      {getStatusBadge(b.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {start.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' })}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                        {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {b.deposit_held > 0 ? (
                        <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Caution Deposit: ₹{b.deposit_held}
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Caution Deposit Waived (High Trust Scholar)
                        </span>
                      )}
                      {b.total_fee !== undefined && (
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          Runtime Fee: {b.total_fee > 0 ? `₹${b.total_fee}` : 'Free / Subsidized'}
                        </span>
                      )}
                      {b.status === 'completed' && (
                        <span className="font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Deposit Settled / Refunded to UPI
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-w-2xl">
                      <strong>Purpose:</strong> {b.purpose_text}
                    </p>

                    {b.status === 'rejected' && b.ai_rejection_explanation && (
                      <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-100 max-w-2xl">
                        <strong>Feedback:</strong> {b.ai_rejection_explanation}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons for Lifecycle */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {b.status === 'approved' && (
                      <button
                        onClick={() => setActiveChecklist({ booking: b, mode: 'checkin' })}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1 transition"
                      >
                        Step 7: Check In
                      </button>
                    )}

                    {b.status === 'checked_in' && (
                      <button
                        onClick={() => setActiveChecklist({ booking: b, mode: 'return' })}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1 transition"
                      >
                        Step 8: Return & AI Verify
                      </button>
                    )}

                    {b.status === 'completed' && (
                      <button
                        onClick={() => setActiveFeedbackBooking(b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 transition ${
                          b.has_feedback
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-sm'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${b.has_feedback ? 'fill-slate-400 text-slate-400' : 'fill-amber-400 text-amber-500'}`} />
                        {b.has_feedback ? 'Feedback Sent' : 'Rate & Earn +25 💎'}
                      </button>
                    )}

                    {['approved', 'checked_in', 'completed'].includes(b.status) && (
                      <button
                        onClick={() => setActiveIncidentBooking(b)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 flex items-center gap-1 transition"
                        title="Step 9: Report damage, delay or misuse"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        Report Issue
                      </button>
                    )}

                    <button
                      onClick={() => setActiveAuditBookingId(b.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center gap-1 transition"
                      title="View verifiable immutable history"
                    >
                      <History className="w-3.5 h-3.5" />
                      Audit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Check-In / Return Condition Checklist Modal (Steps 7 & 8) */}
      {activeChecklist && (
        <ConditionChecklistModal
          booking={activeChecklist.booking}
          mode={activeChecklist.mode}
          onClose={() => setActiveChecklist(null)}
          onSuccess={() => {
            setActiveChecklist(null);
            // Award loyalty points for clean on-time return
            if (activeChecklist.mode === 'return') {
              const newTotal = loyaltyTokens + 50;
              setLoyaltyTokens(newTotal);
              localStorage.setItem('equipgrid_loyalty_tokens', newTotal.toString());
            }
            loadBookings();
          }}
        />
      )}

      {/* Incident / Dispute Reporting Modal (Step 9) */}
      {activeIncidentBooking && (
        <IncidentModal
          booking={activeIncidentBooking}
          onClose={() => setActiveIncidentBooking(null)}
          onSuccess={() => {
            setActiveIncidentBooking(null);
            loadBookings();
          }}
        />
      )}

      {/* Equipment & Lab Feedback Modal */}
      {activeFeedbackBooking && (
        <FeedbackModal
          booking={activeFeedbackBooking}
          onClose={() => setActiveFeedbackBooking(null)}
          onSubmitSuccess={handleFeedbackSuccess}
        />
      )}

      {/* Immutable Audit Ledger Slide-over (Step 10) */}
      {activeAuditBookingId && (
        <AuditTimeline
          bookingId={activeAuditBookingId}
          onClose={() => setActiveAuditBookingId(null)}
        />
      )}
    </div>
  );
};
