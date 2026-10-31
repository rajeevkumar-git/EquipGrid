import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { MOCK_RESOURCES } from '../api/mockData';
import { ResourceCard } from '../components/ResourceCard';
import { BookingModal } from '../components/BookingModal';
import { 
  Search, 
  Layers, 
  Cpu, 
  Wrench, 
  Building, 
  ShieldCheck,
  Scale,
  GraduationCap,
  Coins
} from 'lucide-react';

export const Catalog = () => {
  const { user, openAuthModal, pendingBookingResource, clearPendingBooking } = useAuth();
  const [resources, setResources] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState('all');
  const [selectedStream, setSelectedStream] = useState('all');
  const [selectedDeposit, setSelectedDeposit] = useState('all');
  const [sortBy, setSortBy] = useState('fair_exposure');
  const [selectedResource, setSelectedResource] = useState(null);

  // Auto-open booking modal if guest logged in after selecting equipment
  useEffect(() => {
    if (user && pendingBookingResource) {
      setSelectedResource(pendingBookingResource);
      clearPendingBooking();
    }
  }, [user, pendingBookingResource]);

  const handleBookClick = (resource) => {
    if (!user) {
      openAuthModal('login', resource);
      return;
    }
    setSelectedResource(resource);
  };

  useEffect(() => {
    loadInstitutions();
  }, []);

  useEffect(() => {
    loadResources();
  }, [selectedCategory, selectedInstitution, selectedStream, selectedDeposit, sortBy, search]);

  const loadInstitutions = async () => {
    try {
      const res = await api.get('/api/resources/institutions');
      if (res.data && res.data.length > 0) {
        setInstitutions(res.data);
      } else {
        setInstitutions(['IIT Delhi Fab Lab', 'DTU Materials Characterization Lab', 'BITS Pilani Microfabrication Centre', 'NIT Trichy RF & Microwave Lab', 'NSUT High Performance Computing Center']);
      }
    } catch (err) {
      setInstitutions(['IIT Delhi Fab Lab', 'DTU Materials Characterization Lab', 'BITS Pilani Microfabrication Centre', 'NIT Trichy RF & Microwave Lab', 'NSUT High Performance Computing Center']);
    }
  };

  const loadResources = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedInstitution !== 'all') params.institution = selectedInstitution;
      if (sortBy) params.sort_by = sortBy;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/api/resources', { params });
      if (res.data && res.data.length > 0) {
        let list = res.data;
        if (selectedStream !== 'all') {
          list = list.filter(r => (r.stream || '').toLowerCase().includes(selectedStream.toLowerCase()));
        }
        if (selectedDeposit === 'free') {
          list = list.filter(r => !r.requires_deposit || r.deposit_amount === 0);
        } else if (selectedDeposit === 'under_1000') {
          list = list.filter(r => r.requires_deposit && r.deposit_amount <= 1000);
        } else if (selectedDeposit === 'over_1000') {
          list = list.filter(r => r.requires_deposit && r.deposit_amount > 1000);
        }
        setResources(list);
      } else {
        filterLocalMock();
      }
    } catch (err) {
      console.warn('Backend API connecting/offline, using fallback catalog:', err?.message || err);
      filterLocalMock();
    } finally {
      setLoading(false);
    }
  };

  const filterLocalMock = () => {
    let list = [...MOCK_RESOURCES];
    if (selectedCategory !== 'all') {
      list = list.filter(r => r.category === selectedCategory);
    }
    if (selectedInstitution !== 'all') {
      list = list.filter(r => r.institution === selectedInstitution);
    }
    if (selectedStream !== 'all') {
      list = list.filter(r => (r.stream || '').toLowerCase().includes(selectedStream.toLowerCase()));
    }
    if (selectedDeposit === 'free') {
      list = list.filter(r => !r.requires_deposit || r.deposit_amount === 0);
    } else if (selectedDeposit === 'under_1000') {
      list = list.filter(r => r.requires_deposit && r.deposit_amount <= 1000);
    } else if (selectedDeposit === 'over_1000') {
      list = list.filter(r => r.requires_deposit && r.deposit_amount > 1000);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.description?.toLowerCase().includes(q) ||
        (r.stream || '').toLowerCase().includes(q) ||
        (r.lab_manager || '').toLowerCase().includes(q)
      );
    }
    if (sortBy === 'underutilized') {
      list.sort((a, b) => (a.utilization_rate || 0) - (b.utilization_rate || 0));
    } else if (sortBy === 'fair_exposure') {
      list.sort((a, b) => (a.utilization_rate || 0) - (b.utilization_rate || 0));
    }
    setResources(list);
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
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Trusted Institutional Network
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
              <Scale className="w-4 h-4 text-emerald-300" />
              Anti-Monopoly Fair Discovery Engine
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Unlock High-End Equipment & Spaces Safely.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Borrow specialized 3D printers, cleanrooms, oscilloscopes, and AI workstations. Built with <strong>stream-wise filtering and fair institutional exposure</strong> so small colleges and community makerspaces get equal visibility.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-sm ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-blue-500/25'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search microscope, CSE, lab manager..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Filters Grid: Stream, Institution, Deposit, Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-sm">
          {/* Stream Filter */}
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="flex-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Stream / Dept:</span>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="w-full p-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Academic Streams</option>
                <option value="CSE">Computer Science & AI (CSE)</option>
                <option value="ECE">Electronics & VLSI (ECE)</option>
                <option value="Mechanical">Mechanical & Prototyping</option>
                <option value="Nanotech">Nanotechnology & Physics</option>
                <option value="Biotech">Biotechnology & Life Sciences</option>
              </select>
            </div>
          </div>

          {/* Deposit / Pricing Filter */}
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="flex-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Deposit / Pricing:</span>
              <select
                value={selectedDeposit}
                onChange={(e) => setSelectedDeposit(e.target.value)}
                className="w-full p-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Pricing Types</option>
                <option value="free">Zero Deposit (Free Access)</option>
                <option value="under_1000">Deposit ≤ ₹1,000</option>
                <option value="over_1000">Deposit &gt; ₹1,000</option>
              </select>
            </div>
          </div>

          {/* Institution Filter */}
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="flex-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Institution:</span>
              <select
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="w-full p-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Institutions</option>
                {institutions.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Anti-Monopoly Sorting Rule */}
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex-1">
              <span className="block text-[10px] font-bold uppercase text-slate-400">Fair Discovery:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500"
              >
                <option value="fair_exposure">🌟 Fair Discovery (Anti-Monopoly)</option>
                <option value="underutilized">🟢 Most Underutilized First</option>
                <option value="newest">🕒 Recently Listed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
          Loading institutional catalog with fair exposure ranking...
        </div>
      ) : resources.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-2">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No equipment found matching criteria</h3>
          <p className="text-xs text-slate-500">Try adjusting your stream, deposit filter, or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onBookClick={handleBookClick}
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
