import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { BookingModal } from '../components/BookingModal';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  UserCheck
} from 'lucide-react';

export const ResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/resources/${id}`);
      setResource(res.data);

      const eligRes = await api.get(`/api/resources/${id}/eligibility`);
      setEligibility(eligRes.data);
    } catch (err) {
      console.warn('Failed loading resource:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading resource specifications...</div>;
  }

  if (!resource) {
    return <div className="py-20 text-center text-xs text-slate-500">Resource not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Gallery */}
        <div className="h-72 md:h-full bg-slate-100 relative">
          <img
            src={resource.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'}
            alt={resource.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-sm">
              {resource.category}
            </span>
          </div>
        </div>

        {/* Info & Booking CTA */}
        <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">{resource.name}</h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{resource.location}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{resource.description}</p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Duration</span>
                <span className="font-semibold text-slate-800">{resource.max_booking_hours} Hours</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Approval Mode</span>
                <span className="font-semibold text-slate-800 capitalize">{resource.approval_mode} Review</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowBookingModal(true)}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-md transition"
          >
            Request Access / Book Slot
          </button>
        </div>
      </div>

      {/* Tabs / Detailed Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eligibility Verification Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Eligibility & Training Requirements
          </h3>

          {resource.eligibility_requirements?.length === 0 ? (
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
              No specialized certificates required. Open to all registered students and researchers.
            </p>
          ) : (
            <div className="space-y-2">
              {resource.eligibility_requirements?.map((req, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 text-xs flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">{req.name}</span>
                    <span className="text-[11px] text-slate-500">{req.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custody Checklist Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Standard Custody Checklist
          </h3>
          <p className="text-xs text-slate-500">
            Verified during Check-In (Step 7) and Return (Step 8) with AI discrepancy analysis:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {resource.condition_checklist?.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          resource={resource}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};
