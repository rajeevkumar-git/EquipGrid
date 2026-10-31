import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { AuditTimeline } from '../components/AuditTimeline';
import { 
  Check, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  User, 
  History, 
  Sparkles,
  Inbox,
  Wrench,
  CheckCircle2
} from 'lucide-react';

export const ManagerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAuditBookingId, setActiveAuditBookingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [resolvingIncidentId, setResolvingIncidentId] = useState(null);

  useEffect(() => {
    loadManagerData();
  }, [user]);

  const loadManagerData = async () => {
    setLoading(true);
    try {
      const bRes = await api.get('/api/bookings');
      if (bRes.data && bRes.data.length > 0) {
        setBookings(bRes.data);
      } else {
        const { MOCK_BOOKINGS } = await import('../api/mockData');
        setBookings(MOCK_BOOKINGS);
      }

      const iRes = await api.get('/api/incidents');
      setIncidents(iRes.data || []);
    } catch (err) {
      console.warn('Failed loading manager data, using mock:', err);
      const { MOCK_BOOKINGS } = await import('../api/mockData');
      setBookings(MOCK_BOOKINGS);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await api.patch(`/api/bookings/${bookingId}/approve`, { reason: 'Approved by lab in-charge.' });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'approved' } : b)));
      loadManagerData();
    } catch (err) {
      console.warn('Approve network fallback:', err);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'approved' } : b)));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookingId) => {
    const reason = prompt('Specify rejection reason (e.g., missing safety training, lab maintenance):');
    if (!reason) return;

    setActionLoading(bookingId);
    try {
      await api.patch(`/api/bookings/${bookingId}/reject`, { reason });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'rejected' } : b)));
      loadManagerData();
    } catch (err) {
      console.warn('Reject network fallback:', err);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'rejected' } : b)));
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolveIncident = async (incidentId) => {
    const notes = prompt('Enter resolution summary (e.g. Inspected by technician, lens recalibrated, security deposit deducted ₹500):');
    if (!notes) return;

    setActionLoading(incidentId);
    try {
      await api.patch(`/api/incidents/${incidentId}/resolve`, { resolution_notes: notes });
      alert('Incident resolved! Equipment released from quarantine to available status.');
      loadManagerData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Resolution failed');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingRequests = bookings.filter((b) => b.status === 'pending_approval');
  const activeCustody = bookings.filter((b) => b.status === 'checked_in');
  const openIncidents = incidents.filter((i) => i.status === 'open' || i.status === 'under_review');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Lab Custodian & In-Charge Dashboard</h1>
          <p className="text-xs text-slate-500">Review pending reservation requests, monitor active custody, and manage safety incidents.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            {pendingRequests.length} Pending Approval
          </span>
          <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            {activeCustody.length} Active in Lab
          </span>
          <span className={`px-3 py-1 rounded-xl text-xs font-semibold border ${
            openIncidents.length > 0
              ? 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            {openIncidents.length} Safety Incidents
          </span>
        </div>
      </div>

      {/* Step 9: Incidents & Disputes Queue */}
      {openIncidents.length > 0 && (
        <div className="bg-rose-50/60 rounded-2xl border border-rose-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-rose-200 bg-rose-100/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h2 className="font-bold text-xs text-rose-950 uppercase tracking-wide">
                Step 9: Active Damage & Incident Queue ({openIncidents.length})
              </h2>
            </div>
            <span className="text-[10px] text-rose-700 font-semibold bg-rose-200/70 px-2 py-0.5 rounded">
              Quarantine Enforced
            </span>
          </div>

          <div className="divide-y divide-rose-200">
            {openIncidents.map((inc) => (
              <div key={inc.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 capitalize">
                      {inc.incident_type.replace('_', ' ')} Incident
                    </span>
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {inc.severity || 'Moderate'}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Reported: {new Date(inc.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-rose-100 italic">
                    "{inc.description}"
                  </p>

                  {inc.ai_summary && (
                    <div className="bg-white/80 p-2.5 rounded-lg border border-rose-100 space-y-1">
                      <span className="font-bold text-blue-900 flex items-center gap-1 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Discrepancy & Severity Analysis:
                      </span>
                      <p className="text-slate-600 text-[11px]">{inc.ai_summary}</p>
                    </div>
                  )}

                  {inc.estimated_cost && (
                    <span className="font-bold text-slate-800 block text-[11px]">
                      Estimated Penalty / Repair: ₹{inc.estimated_cost}
                    </span>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => handleResolveIncident(inc.id)}
                    disabled={actionLoading === inc.id}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resolve & Clear Quarantine</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Approvals Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-amber-600" />
            <h2 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
              Step 5 & 6: Pending Borrower Requests ({pendingRequests.length})
            </h2>
          </div>
          <button onClick={loadManagerData} className="text-xs text-blue-600 hover:underline">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading requests...</div>
        ) : pendingRequests.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No requests awaiting review right now.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingRequests.map((b) => {
              const start = new Date(b.start_time);
              const end = new Date(b.end_time);

              return (
                <div key={b.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{b.resource_name || 'Specialized Asset'}</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Pending
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{start.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' })}</span>
                      <span>
                        {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                        {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <strong className="text-slate-900">Stated Purpose: </strong>
                      {b.purpose_text}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(b.id)}
                      disabled={actionLoading === b.id}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Slot
                    </button>
                    <button
                      onClick={() => handleReject(b.id)}
                      disabled={actionLoading === b.id}
                      className="px-3.5 py-2 rounded-lg text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => setActiveAuditBookingId(b.id)}
                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                      title="View audit logs"
                    >
                      <History className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active in Custody List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
            Currently In-Use / Active Custody ({activeCustody.length})
          </h2>
        </div>

        {activeCustody.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No equipment currently checked out.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activeCustody.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{b.resource_name || 'Equipment'}</span>
                  <span className="text-slate-500 text-[11px]">
                    Checked in at: {new Date(b.actual_checkin_time || b.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 font-bold text-[10px] uppercase">
                  Active in Lab
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit Modal */}
      {activeAuditBookingId && (
        <AuditTimeline
          bookingId={activeAuditBookingId}
          onClose={() => setActiveAuditBookingId(null)}
        />
      )}
    </div>
  );
};
