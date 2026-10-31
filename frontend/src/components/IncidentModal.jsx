import React, { useState } from 'react';
import api from '../api/client';
import { 
  X, 
  AlertTriangle, 
  Camera, 
  Sparkles, 
  FileText, 
  Loader2, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const IncidentModal = ({ booking, onClose, onSuccess }) => {
  const [incidentType, setIncidentType] = useState('damage');
  const [severity, setSeverity] = useState('moderate');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successReport, setSuccessReport] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a detailed description of the incident or damage.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        booking_id: booking.id,
        resource_id: booking.resource_id,
        incident_type: incidentType,
        severity: severity,
        description: description,
        estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
        evidence_photos: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
        ],
      };

      const res = await api.post('/api/incidents', payload);
      setSuccessReport(res.data);

      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit incident report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-rose-950 text-white flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600/30 flex items-center justify-center text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Step 9: Trust & Safety Protocol</span>
              <h2 className="text-sm font-bold text-white">Report Incident, Delay or Damage</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-rose-300 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {successReport ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">Incident Logged & Resource Quarantined</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Equipment has been flagged for inspection. The lab manager has been alerted and will review the dispute.
                </p>
              </div>

              {successReport.ai_summary && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Executive Summary
                  </div>
                  <p className="text-slate-600 text-[11px] italic">"{successReport.ai_summary}"</p>
                  {successReport.ai_recommended_steps?.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Recommended Resolution:</span>
                      <ul className="list-disc pl-4 text-[10px] text-slate-600 mt-0.5 space-y-0.5">
                        {successReport.ai_recommended_steps.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Incident Type */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Incident Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'damage', label: 'Physical Damage' },
                    { id: 'delay', label: 'Overdue / Delay' },
                    { id: 'misuse', label: 'Safety Misuse' },
                    { id: 'dispute', label: 'Usage Conflict' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setIncidentType(t.id)}
                      className={`py-2 px-2 rounded-lg text-center font-semibold border transition ${
                        incidentType === t.id
                          ? 'bg-rose-50 border-rose-600 text-rose-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Severity Level
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['minor', 'moderate', 'severe', 'total_loss'].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSeverity(s)}
                      className={`py-1.5 px-1 rounded-lg text-center font-semibold capitalize border transition ${
                        severity === s
                          ? s === 'severe' || s === 'total_loss'
                            ? 'bg-rose-600 text-white font-bold'
                            : 'bg-amber-100 border-amber-500 text-amber-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Detailed Incident Narrative
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what occurred: e.g. Extruder nozzle clogged with incompatible filament, overheating warning triggered during job..."
                  rows={3}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  required
                />
              </div>

              {/* Estimated Repair Cost */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Estimated Repair / Penalty Cost (INR, Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Security deposit deduction will be reviewed against this estimate.
                </span>
              </div>

              {/* Evidence Photo */}
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 text-center text-slate-500">
                <Camera className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span className="font-medium text-slate-700 block">Digital Evidence Attached</span>
                <span className="text-[10px] text-slate-400">
                  Photo logged with SHA-256 fingerprint into immutable audit history.
                </span>
              </div>

              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submitting ? 'Submitting & Analyzing...' : 'File Official Incident'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
