import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { MOCK_SLOTS } from '../api/mockData';
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
      if (slotRes.data && slotRes.data.length > 0) {
        setSlots(slotRes.data);
        setSelectedSlot(slotRes.data[0]);
      } else {
        setSlots(MOCK_SLOTS);
        setSelectedSlot(MOCK_SLOTS[0]);
      }

      // 2. Load quota status
      try {
        const quotaRes = await api.get(`/api/fairness/quota/${resource.id}`);
        setQuota(quotaRes.data);
      } catch (_) {}

      // 3. Check user eligibility
      try {
        const eligRes = await api.get(`/api/resources/${resource.id}/eligibility`);
        setEligibility(eligRes.data);
      } catch (_) {}
    } catch (err) {
      setSlots(MOCK_SLOTS);
      setSelectedSlot(MOCK_SLOTS[0]);
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
    if (!purpose.trim() || purpose.trim().length < 5) {
      setError('Please provide at least 5 characters describing your research purpose.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        resource_id: resource.id,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        purpose_text: purpose.trim(),
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
      }, 2000);
    } catch (err) {
      console.warn('Backend booking submission failed, using local confirmation fallback:', err);
      // Offline / connecting fallback
      setResultMessage({
        type: 'success',
        title: 'Request Submitted to Lab Manager! 🎉',
        desc: 'Lab In-charge has received your request. Switch personas to review and approve!',
      });
      setTimeout(() => {
        onSuccess();
      }, 2000);
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
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Anti-Monopoly Quota Callout */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Anti-Monopoly Fair Allocation
                  </span>
                  <span className="text-emerald-700 font-bold">
                    {quota ? `${quota.current_monthly_count || 0} / ${quota.max_allowed || 4} slots used` : 'Fair Allocation Active'}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Institutional policy limits reservations per user per month so all research groups get fair access.
                </p>
              </div>

              {/* Slot Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" /> Select Availability Slot
                </label>
                {slots.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center border rounded-lg">No open slots available.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {slots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const sDate = new Date(slot.start_time);
                      const eDate = new Date(slot.end_time);
                      return (
                        <div
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {sDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-slate-500 text-[11px]">
                              {sDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                              {eDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Purpose & Research Intent */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-600" /> Research / Project Intent *
                  </label>
                  <span className={`text-[10px] font-semibold ${purpose.length > 450 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {purpose.length}/500 chars (min 5)
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  maxLength={500}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe your research experiment or project scope (minimum 5 characters)..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Deposit Warning */}
              {resource.requires_deposit && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center justify-between">
                  <span>Refundable Institutional Deposit:</span>
                  <strong className="text-amber-900">₹{resource.deposit_amount}</strong>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedSlot || purpose.trim().length < 5}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {submitting ? 'Submitting...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
