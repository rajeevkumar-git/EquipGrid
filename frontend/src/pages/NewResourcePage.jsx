import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  PlusCircle, 
  Layers, 
  ShieldAlert, 
  Award, 
  Check, 
  ArrowLeft,
  Loader2,
  Sparkles,
  LogIn
} from 'lucide-react';

export const NewResourcePage = () => {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'equipment',
    location: '',
    description: '',
    max_booking_hours: 6,
    approval_mode: 'manual',
    requires_deposit: false,
    deposit_amount: 0,
    requires_supervision: false,
    supervisor_contact: '',
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'],
    condition_checklist: [
      'No structural damage or cracks',
      'All accessories and power cables present',
      'Surface cleaned and sanitized after use',
      'No error codes upon power initialization',
    ],
    eligibility_requirements: [
      {
        type: 'certification',
        name: 'Lab Safety Protocol Level 1',
        mandatory: true,
        description: 'Mandatory standard induction certificate.',
      },
    ],
    usage_rules: [
      'Clean work area before departure.',
      'Report any functional defects immediately.',
    ],
    fair_usage_policy: {
      max_hours_per_week: 6,
      cooldown_hours: 2,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.post('/api/resources', form);
      navigate('/catalog');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to list resource');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Guest Mode Notice */}
      {!user && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4 border border-indigo-700/50 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>Guest Explorer Mode:</strong> You are previewing Step 1 of the Custody Lifecycle (Resource Onboarding). Sign in as a Faculty Lab In-charge to publish.
            </span>
          </div>
          <button
            onClick={() => openAuthModal('login')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white shrink-0 flex items-center gap-1 shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Step 1: List Institutional Resource</h1>
        <p className="text-xs text-slate-500">Define access rules, training requirements, custody checklist, and fair usage quotas.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Equipment Identification</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">Resource Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Renishaw Laser Powder Bed Fusion System"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="equipment">Specialized Equipment</option>
                <option value="space">Cleanroom / Wet Lab Space</option>
                <option value="compute">High Performance Compute (HPC/GPU)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">Facility & Lab Location</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Room 402, Block IV, Advanced Materials Lab"
              className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">Detailed Specifications & Usage Rules</label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Laser beam wavelength, vacuum requirements, power limits, sample preparation guidelines..."
              className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Access & Fair Usage Policy */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Step 2: Fair Usage & Quotas (Anti-Monopoly)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">Max Duration per Slot (Hours)</label>
              <input
                type="number"
                min={1}
                max={24}
                value={form.max_booking_hours}
                onChange={(e) => setForm({ ...form, max_booking_hours: parseInt(e.target.value) || 1 })}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">Weekly Borrower Quota (Hours)</label>
              <input
                type="number"
                min={1}
                max={40}
                value={form.fair_usage_policy.max_hours_per_week}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fair_usage_policy: {
                      ...form.fair_usage_policy,
                      max_hours_per_week: parseInt(e.target.value) || 1,
                    },
                  })
                }
                className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Security & Financial Risk */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Deposit & Supervision</h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.requires_deposit}
                onChange={(e) => setForm({ ...form, requires_deposit: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-800">Requires Security Deposit</span>
            </label>

            {form.requires_deposit && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={form.deposit_amount}
                  onChange={(e) => setForm({ ...form, deposit_amount: parseInt(e.target.value) || 0 })}
                  placeholder="Deposit Amount"
                  className="w-32 p-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <Link to="/catalog" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Asset...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>{user ? 'Publish to EquipGrid Network' : 'Sign In to Publish'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
