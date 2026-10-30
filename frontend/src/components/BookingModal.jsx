import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Award, 
  Sparkles,
  Loader2
} from 'lucide-react';

export const BookingModal = ({ resource, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [purpose, setPurpose] = useState('');
  const [quota, setQuota] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [resultMessage, setResultMessage] = useState(null);

  useEffect(() => {
    if (resource) {
      loadDetails();
    }
  }, [resource]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      // 1. Load available slots
      const slotRes = await api.get(`/api/resources/${resource.id}/slots`);
      setSlots(slotRes.data || []);
      if (slotRes.data && slotRes.data.length > 0) {
        setSelectedSlot(slotRes.data[0]);
      }

      // 2. Load quota status
      const quotaRes = await api.get(`/api/fairness/quota/${resource.id}`);
      setQuota(quotaRes.data);

      // 3. Check user eligibility
      const eligRes = await api.get(`/api/resources/${resource.id}/eligibility`);
      setEligibility(eligRes.data);
    } catch (err) {
      console.warn('Error loading resource booking info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError('Please select an available slot.');
      return;
    }
    if (!purpose.trim()) {
      setError('Please specify the project or research purpose for this booking.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        resource_id: resource.id,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        purpose_text: purpose,
        documents: [],
      };

      const res = await api.post('/api/bookings', payload);
      const booking = res.data;

      if (booking.status === 'waitlisted') {
        setResultMessage({
          type: 'waitlist',
          title: `Waitlisted at Position #${booking.waitlist_position || 1}`,
          desc: 'High demand detected. Your request has been queued with a transparent priority score.',
        });
      } else {
        setResultMessage({
          type: 'success',
          title: booking.status === 'approved' ? 'Booking Confirmed! 🎉' : 'Request Submitted to Lab Manager',
          desc: booking.status === 'approved' 
            ? 'Access approved. Please check in when your slot begins.' 
            : 'Lab Manager has been notified and will review your request shortly.',
        });
      }

      setTimeout(() => {
        onSuccess();
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Resource Request</span>
            <h2 className="text-base font-bold truncate text-white">{resource.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {resultMessage ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">{resultMessage.title}</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">{resultMessage.desc}</p>
            </div>
          ) : loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs">Checking availability & eligibility...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quota & Eligibility Banner */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Fair Access Status
                  </span>
                  <span className="text-blue-700 font-medium">
                    {quota?.hours_used_this_week || 0} / {quota?.max_hours_per_week || 6} hrs used
                  </span>
                </div>
                {eligibility && (
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <span>Eligibility:</span>
                    <strong className={eligibility.all_requirements_met ? 'text-emerald-700' : 'text-amber-700'}>
                      {eligibility.eligibility_status}
                    </strong>
                  </div>
                )}
              </div>

              {/* Slot Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Select Time Slot
                </label>
                {slots.length === 0 ? (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded border border-amber-200">
                    No immediate free slots found on calendar. Submitting will place you on the high-priority waitlist.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                    {slots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const start = new Date(slot.start_time);
                      const end = new Date(slot.end_time);
                      return (
                        <button
                          type="button"
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 rounded-lg border text-left text-xs transition flex flex-col ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-600'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className="font-bold flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {start.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' })}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">
                            {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                            {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Purpose & Justification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Project Purpose & Justification
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g., Fabricating PCB prototype for Autonomous Drone capstone project. Testing telemetry at 2.4GHz."
                  rows={3}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-800"
                  required
                />
                <span className="text-[10px] text-slate-400">
                  AI will categorize and evaluate request legitimacy to protect against hoarding.
                </span>
              </div>

              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
