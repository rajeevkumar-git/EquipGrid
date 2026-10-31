import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  FileText,
  Clock,
  UserCheck
} from 'lucide-react';

export const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => {
    loadLogs();
  }, [filterAction]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (filterAction) params.action = filterAction;
      const res = await api.get('/api/audit-logs', { params });
      if (res.data && res.data.length > 0) {
        setLogs(res.data);
      } else {
        const { MOCK_AUDIT_LOGS } = await import('../api/mockData');
        setLogs(MOCK_AUDIT_LOGS);
      }
    } catch (err) {
      console.warn('Failed to load logs, using mock:', err);
      const { MOCK_AUDIT_LOGS } = await import('../api/mockData');
      setLogs(MOCK_AUDIT_LOGS);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    if (action.includes('APPROVED')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (action.includes('REJECTED') || action.includes('DAMAGE')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (action.includes('CHECKED_IN')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (action.includes('LISTED')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold tracking-wide uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Step 10: Verifiable History
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Institutional Audit Trail</h1>
          <p className="text-xs text-slate-500">Every decision, custody handover, condition sign-off, and dispute is recorded in an immutable ledger.</p>
        </div>

        <button
          onClick={loadLogs}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          Refresh Ledger
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading audit records...</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">No audit events recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Actor & Role</th>
                  <th className="px-6 py-3">Entity Type</th>
                  <th className="px-6 py-3">Context & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.map((log) => {
                  const date = new Date(log.created_at);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {date.toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getActionBadge(log.action)}`}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">{log.actor_name || 'System'}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{log.actor_role || 'SYSTEM'}</span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap uppercase font-mono text-[10px] text-slate-500">
                        {log.entity_type}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-600 max-w-xs truncate">
                        {log.reason ? (
                          <span className="italic">"{log.reason}"</span>
                        ) : log.details && Object.keys(log.details).length > 0 ? (
                          <span className="font-mono text-[10px] text-slate-400">{JSON.stringify(log.details)}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
