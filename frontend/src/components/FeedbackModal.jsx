import React, { useState } from 'react';
import { X, Star, CheckCircle2, Award, Sparkles, MessageSquare } from 'lucide-react';

export const FeedbackModal = ({ booking, onClose, onSubmitSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [staffRating, setStaffRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmitSuccess({
        bookingId: booking.id,
        rating,
        staffRating,
        comment,
        tokensEarned: 25,
      });
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300">
              <Star className="w-4 h-4 fill-amber-400" />
            </span>
            <span className="text-base font-bold text-white">Equipment & Lab Feedback</span>
          </div>
          <p className="text-xs text-slate-300">
            {booking.resource_name || 'Research Equipment'} • Help future researchers & lab managers
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Feedback Submitted!</h3>
              <p className="text-xs text-slate-600">
                Thank you for rating. You earned <strong className="text-indigo-600">+25 Loyalty Tokens</strong>!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Overall Equipment Performance
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-slate-300 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-slate-600 ml-2">
                    {rating === 5 ? 'Exceptional' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : 'Needs Calibration'}
                  </span>
                </div>
              </div>

              {/* Lab Manager Support Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Lab Staff & In-Charge Support
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { val: 5, label: 'Very Helpful' },
                    { val: 4, label: 'Responsive' },
                    { val: 3, label: 'Delayed' },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.val}
                      onClick={() => setStaffRating(opt.val)}
                      className={`p-2 rounded-lg border text-center font-medium transition ${
                        staffRating === opt.val
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Comments & Feedback (Optional)
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share any calibration notes, tips for other students, or feedback for the lab manager..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Loyalty Reward Callout */}
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-indigo-900 font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Reward for Review:
                </span>
                <span className="font-extrabold text-indigo-700">+25 Loyalty Tokens</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
