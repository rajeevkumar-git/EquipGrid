import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  X, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  ShieldCheck,
  FileText
} from 'lucide-react';

export const AuditTimeline = ({ bookingId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [bookingId]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const endpoint = bookingId 
        ? `/api/audit-logs/booking/${bookingId}` 
        : `/api/audit-logs?limit=20`;
      const res = await api.get(endpoint);
      setLogs(res.data || []);
    } catch (err) {
      console.warn('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('APPROVED') || action.includes('RETURNED')) return 'bg-emerald-500 text-white';
    if (action.includes('REJECTED') || action.includes('DAMAGE')) return 'bg-rose-500 text-white';
    if (action.includes('CHECKED_IN')) return 'bg-blue-500 text-white';
    return 'bg-slate-700 text-white';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Immutable Custody Audit Trail</h2>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="text-center text-xs text-slate-400 py-8">Loading verifiable history...</p>
          ) : logs.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">No audit events recorded yet.</p>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
              {logs.map((log) => {
                const date = new Date(log.created_at);
                return (
                  <div key={log.id} className="relative pl-6">
                    <span
                      className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-white ${getActionColor(
                        log.action
                      )}`}
                    ></span>

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 tracking-tight">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">
                          {log.actor_name || 'System'}
                        </span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                          {log.actor_role || 'SYSTEM'}
                        </span>
                      </div>

                      {log.reason && (
                        <p className="mt-1 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                          "{log.reason}"
                        </p>
                      )}

                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="mt-1 text-[10px] text-slate-400 font-mono">
                          {JSON.stringify(log.details)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
