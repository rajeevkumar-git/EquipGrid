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
  Loader2, 
  Coins, 
  ShieldCheck, 
  Info,
  Check
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

  // Indian Context 2-Stage Payment Split Calculations
  const slotDurationHours = selectedSlot 
    ? Math.max(1, Math.round((new Date(selectedSlot.end_time) - new Date(selectedSlot.start_time)) / (1000 * 60 * 60))) 
    : (resource.max_booking_hours || 2);

  const hourlyRate = (resource.hourly_rate && resource.hourly_rate > 0) ? resource.hourly_rate : 150;
  const usageFee = hourlyRate * slotDurationHours;
  const cautionDeposit = (resource.deposit_amount && resource.deposit_amount > 0) ? resource.deposit_amount : 1000;

  // High-Trust Scholar Policy: Trust score >= 95% gets full deposit waiver
  const trustScore = user?.trust_score ?? 0.98;
  const isDepositWaived = cautionDeposit > 0 && trustScore >= 0.95;

  // Amount payable today:
  // If deposit is waived or zero -> ₹0 today!
  // If not waived -> Partial advance deposit (e.g. ₹250 or full deposit if smaller)
  const advancePayableToday = isDepositWaived ? 0 : Math.min(cautionDeposit, 250);
  const payableOnReturn = usageFee;

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
      console.warn('Booking request error:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Unable to submit reservation request. Please try again.';
      setError(errorMsg);
      setResultMessage(null);
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Institutional Resource Reservation</span>
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
        <div className="p-6 max-h-[82vh] overflow-y-auto">
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
                    {quota ? `${quota.bookings_this_month ?? quota.current_monthly_count ?? 0} / ${quota.max_bookings_per_month ?? quota.max_allowed ?? 4} slots used` : 'Fair Allocation Active'}
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
                              {eDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({slotDurationHours} hrs)
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
                  rows={2}
                  maxLength={500}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe your research experiment or project scope (minimum 5 characters)..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Transparent Indian Fee & Caution Deposit Breakdown */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 text-xs shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>Fee & Caution Deposit Breakdown</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    Zero Hidden Charges
                  </span>
                </div>

                {/* Line Items */}
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>
                      Machine Usage / Consumables ({slotDurationHours} hrs @ {hourlyRate > 0 ? `₹${hourlyRate}/hr` : 'Subsidized'}):
                    </span>
                    <strong className="text-slate-900">
                      {usageFee > 0 ? `₹${usageFee}` : '₹0 (Free / Sponsored)'}
                    </strong>
                  </div>

                  {cautionDeposit > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Refundable Caution Deposit (Partial Advance):</span>
                      <strong className="text-slate-900">₹{cautionDeposit}</strong>
                    </div>
                  )}

                  {isDepositWaived && (
                    <div className="flex items-center justify-between text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                      <span className="flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        High-Trust Scholar Waiver ({(trustScore * 100).toFixed(0)}% Trust Score):
                      </span>
                      <strong className="font-bold">-₹{cautionDeposit} (100% Waived)</strong>
                    </div>
                  )}
                </div>

                {/* Split Summary Blocks (Payable Today vs Return) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl text-left">
                    <span className="text-[10px] font-bold uppercase text-indigo-700 block">
                      Payable Today (Advance)
                    </span>
                    <span className="text-lg font-black text-indigo-900 leading-tight">
                      ₹{advancePayableToday}
                    </span>
                    <span className="text-[10px] text-indigo-600 block mt-0.5">
                      {advancePayableToday === 0 ? '✓ Zero advance required' : 'To confirm reservation'}
                    </span>
                  </div>

                  <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-left">
                    <span className="text-[10px] font-bold uppercase text-slate-600 block">
                      Payable Upon Return
                    </span>
                    <span className="text-lg font-black text-slate-900 leading-tight">
                      ₹{payableOnReturn}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Actual machine runtime fee
                    </span>
                  </div>
                </div>

                {/* 100% Refund Guarantee */}
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>100% UPI Refund Guarantee:</strong> Held caution deposits are automatically released back to your original UPI account within 24 hours of undamaged return signoff.
                  </span>
                </div>
              </div>

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
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1.5"
                >
                  {submitting ? 'Submitting...' : `Confirm Slot (${advancePayableToday === 0 ? 'Zero Advance' : `₹${advancePayableToday} Advance`})`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
