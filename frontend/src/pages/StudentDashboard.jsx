import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ConditionChecklistModal } from '../components/ConditionChecklistModal';
import { AuditTimeline } from '../components/AuditTimeline';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Hourglass, 
  AlertCircle, 
  History, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChecklist, setActiveChecklist] = useState(null); // { booking, mode: 'checkin' | 'return' }
  const [activeAuditBookingId, setActiveAuditBookingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/bookings');
      setBookings(res.data || []);
    } catch (err) {
      console.warn('Failed loading bookings:', err);
    } finally {
      setLoading(false);
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Custody & Bookings</h1>
          <p className="text-xs text-slate-500">Track your requests, check in to active slots, and verify returned equipment.</p>
        </div>

        {/* Reliability Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-600">Borrower Trust Score:</span>
          <strong className="text-emerald-700 font-bold">{(user?.trust_score || 0.95) * 100}%</strong>
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
                      <span>
                        {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                        {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {b.waitlist_position && (
                        <span className="text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          Waitlist Position: #{b.waitlist_position}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 italic">"{b.purpose_text}"</p>

                    {b.ai_rejection_explanation && (
                      <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                        {b.ai_rejection_explanation}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons for Lifecycle */}
                  <div className="flex items-center gap-2 shrink-0">
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

      {/* Checkin / Return Checklist Modal */}
      {activeChecklist && (
        <ConditionChecklistModal
          booking={activeChecklist.booking}
          mode={activeChecklist.mode}
          onClose={() => setActiveChecklist(null)}
          onSuccess={() => {
            setActiveChecklist(null);
            loadBookings();
          }}
        />
      )}

      {/* Audit Trail Modal */}
      {activeAuditBookingId && (
        <AuditTimeline
          bookingId={activeAuditBookingId}
          onClose={() => setActiveAuditBookingId(null)}
        />
      )}
    </div>
  );
};
