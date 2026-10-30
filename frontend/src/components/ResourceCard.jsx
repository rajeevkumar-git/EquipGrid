import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const ResourceCard = ({ resource, onBookClick }) => {
  const isAvailable = resource.status === 'available';
  const hasTrainingReq = (resource.eligibility_requirements || []).some(
    (r) => r.type === 'training' || r.type === 'certification'
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Thumbnail */}
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {resource.images && resource.images.length > 0 ? (
          <img
            src={resource.images[0]}
            alt={resource.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
            No Image Provided
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm flex items-center gap-1.5 ${
              isAvailable
                ? 'bg-emerald-500 text-white'
                : resource.status === 'in_use'
                ? 'bg-amber-500 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            {resource.status.replace('_', ' ')}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3">
          <span className="bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
            {resource.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition line-clamp-1">
          {resource.name}
        </h3>

        <div className="flex items-center gap-1 text-slate-500 text-xs mt-1 mb-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{resource.location || 'Campus Lab'}</span>
        </div>

        <p className="text-slate-600 text-xs line-clamp-2 mb-3 flex-1">
          {resource.description || 'Institutional research equipment available for booking.'}
        </p>

        {/* Requirements / Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {hasTrainingReq && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
              <Award className="w-3 h-3 text-amber-600" /> Training Required
            </span>
          )}
          {resource.requires_deposit && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Deposit: ₹{resource.deposit_amount}
            </span>
          )}
          {resource.max_booking_hours && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              <Clock className="w-3 h-3" /> Max {resource.max_booking_hours}h
            </span>
          )}
        </div>

        {/* Action Footnotes */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/resource/${resource.id}`}
            className="text-xs text-slate-600 hover:text-blue-600 font-medium transition"
          >
            View Details
          </Link>

          <button
            onClick={() => onBookClick(resource)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              isAvailable
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                : 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
            }`}
          >
            {isAvailable ? 'Request Slot' : 'Join Waitlist'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
