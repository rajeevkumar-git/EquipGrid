import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { ResourceCard } from '../components/ResourceCard';
import { BookingModal } from '../components/BookingModal';
import { 
  Search, 
  Filter, 
  Layers, 
  Cpu, 
  Wrench, 
  Building, 
  Camera, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const Catalog = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    loadResources();
  }, [selectedCategory, search]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/api/resources', { params });
      setResources(res.data || []);
    } catch (err) {
      console.warn('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Resources', icon: Layers },
    { id: 'equipment', label: 'Fabrication & Tools', icon: Wrench },
    { id: 'device', label: 'Testing & Devices', icon: Cpu },
    { id: 'lab', label: 'Specialized Labs', icon: Building },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 sm:p-10 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Institutional Equipment & Resource Sharing
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Unlock High-End Lab Gear & Spaces Safely.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Borrow specialized 3D printers, cleanrooms, oscilloscopes, and AI workstations with verified training, fair usage quotas, and digital chain of custody.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment, labs..."
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 shadow-sm"
          />
        </div>
      </div>

      {/* Resource Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
          Loading institutional catalog...
        </div>
      ) : resources.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-2">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No equipment found matching criteria</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onBookClick={(res) => setSelectedResource(res)}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedResource && (
        <BookingModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onSuccess={() => {
            setSelectedResource(null);
            loadResources();
          }}
        />
      )}
    </div>
  );
};
