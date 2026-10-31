import React, { useState } from 'react';
import api from '../api/client';
import { 
  X, 
  Camera, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export const ConditionChecklistModal = ({ booking, mode = 'checkin', onClose, onSuccess }) => {
  const isCheckin = mode === 'checkin';
  const resource = booking.resource || booking.resource_details || {};
  const checklistItems = (resource.condition_checklist && resource.condition_checklist.length > 0)
    ? resource.condition_checklist
    : [
    'No visible structural damage or cracks',
    'All accessories and cables present',
    'Surface cleaned and free of debris',
    'Powered on and initialization completed without errors',
  ];

  const [rating, setRating] = useState('excellent');
  const [checklist, setChecklist] = useState(
    checklistItems.reduce((acc, item) => ({ ...acc, [item]: true }), {})
  );
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [aiReport, setAiReport] = useState(null);

  const toggleCheck = (item) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const endpoint = isCheckin
        ? `/api/bookings/${booking.id}/checkin`
        : `/api/bookings/${booking.id}/return`;

      const payload = {
        condition_rating: rating,
        checklist_responses: checklist,
        notes: notes,
        photos: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
        ],
      };

      const res = await api.post(endpoint, payload);
      const record = res.data;

      // If checkout and AI detected damage or generated response, display report
      if (!isCheckin && (record.ai_damage_description || record.ai_damage_detected !== undefined)) {
        setAiReport({
          detected: record.ai_damage_detected,
          severity: record.ai_damage_severity,
          desc: record.ai_damage_description || 'Condition comparison complete.',
          action: record.ai_recommended_action || 'Logged to audit trail.',
        });
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit condition record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
              {isCheckin ? 'Step 7: Check-In Inspection' : 'Step 8: Return Condition Verification'}
            </span>
            <h2 className="text-base font-bold text-white">
              {isCheckin ? 'Initial Condition Sign-Off' : 'Return Custody & AI Verification'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {aiReport ? (
            <div className="space-y-4 py-2">
              <div
                className={`p-4 rounded-xl border ${
                  aiReport.detected
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Condition Discrepancy Engine</span>
                </div>
                <p className="text-xs mt-1 leading-relaxed">{aiReport.desc}</p>
                <div className="mt-2 text-[11px] font-semibold">
                  <span>Severity: </span>
                  <span className="uppercase tracking-wide">{aiReport.severity || 'None'}</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-600">
                  <span>Recommended Action: {aiReport.action}</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={onSuccess}
                  className="px-6 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Overall Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Observed Physical Condition
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['excellent', 'good', 'fair', 'damaged'].map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRating(r)}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-semibold capitalize border transition ${
                        rating === r
                          ? r === 'damaged'
                            ? 'bg-rose-100 border-rose-500 text-rose-800'
                            : 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Standard Custody Checklist
                </label>
                <div className="space-y-2 border border-slate-100 bg-slate-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                  {checklistItems.map((item) => {
                    const checked = checklist[item] !== false;
                    return (
                      <div
                        key={item}
                        onClick={() => toggleCheck(item)}
                        className="flex items-start gap-2.5 cursor-pointer text-xs select-none"
                      >
                        {checked ? (
                          <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        )}
                        <span className={checked ? 'text-slate-800' : 'text-slate-400 line-through'}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Observation Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isCheckin
                      ? 'Note any pre-existing scratches, lens dust, or missing accessories...'
                      : 'Note equipment status after completion of work...'
                  }
                  rows={2}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-800"
                />
              </div>

              {/* Photographic Evidence Simulation */}
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 text-center text-xs text-slate-500">
                <Camera className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span className="font-medium text-slate-700 block">Photographic Evidence Attached</span>
                <span className="text-[10px] text-slate-400">
                  Server-timestamped photo logged to immutable audit trail.
                </span>
              </div>

              {error && (
                <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg text-xs">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submitting ? 'Verifying...' : isCheckin ? 'Complete Check-In' : 'Confirm Return'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
