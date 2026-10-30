import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { 
  PlusCircle, 
  Layers, 
  ShieldAlert, 
  Award, 
  Check, 
  ArrowLeft,
  Loader2
} from 'lucide-react';

export const NewResourcePage = () => {
  const navigate = useNavigate();
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
    setSubmitting(true);
    setError(null);

    try {
      await api.post('/api/resources', form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to list resource');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
                <option value="equipment">Fabrication & Tools</option>
                <option value="device">Testing & Devices</option>
                <option value="lab">Specialized Lab / Cleanroom</option>
                <option value="space">Meeting / Collaborative Space</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">Physical Location</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Block C, Advanced Metallurgy Lab, Room 102"
              className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">Description & Specifications</label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Provide technical capabilities, materials supported, and operational boundaries..."
              className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Access Policies */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="font-bold text-sm text-slate-800">Operational & Fair Usage Policies</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">Max Duration per Slot (Hours)</label>
              <input
                type="number"
                min={1}
                max={24}
                value={form.max_booking_hours}
                onChange={(e) => setForm({ ...form, max_booking_hours: parseInt(e.target.value) || 6 })}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">Approval Workflow</label>
              <select
                value={form.approval_mode}
                onChange={(e) => setForm({ ...form, approval_mode: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="manual">Manual Owner Review Required</option>
                <option value="auto">Instant Automated Approval</option>
              </select>
            </div>
          </div>
        </div>

        {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-lg">{error}</div>}

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{submitting ? 'Publishing...' : 'Publish Listing'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
