import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleCard } from './VehicleCard';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  DollarSign,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Car
} from 'lucide-react';

export const SearchScreen: React.FC = () => {
  const {
    vehicles,
    filterLocation,
    setFilterLocation,
    filterDates,
    setFilterDates,
    triggerHaptic,
    formatDailyRate
  } = useApp();

  const [keyword, setKeyword] = useState('');
  const [selectedMake, setSelectedMake] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [maxPrice, setMaxPrice] = useState(250);
  const [instantBookOnly, setInstantBookOnly] = useState(false);
  const [minSeats, setMinSeats] = useState(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating' | 'newest'>('recommended');
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const makes = ['All', 'Porsche', 'BMW', 'Tesla', 'Land Rover', 'Chevrolet', 'Ford'];
  const types = ['All', 'Electric', 'Sports', 'Luxury', 'SUV'];

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    // Location filter
    if (filterLocation && filterLocation !== 'All Cities') {
      const cityClean = filterLocation.split(',')[0].toLowerCase();
      result = result.filter(v => v.location.city.toLowerCase().includes(cityClean));
    }

    // Keyword
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      result = result.filter(v =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.location.city.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
      );
    }

    // Make
    if (selectedMake !== 'All') {
      result = result.filter(v => v.make === selectedMake);
    }

    // Category
    if (selectedType !== 'All') {
      result = result.filter(v => v.category === selectedType);
    }

    // Transmission
    if (selectedTransmission !== 'All') {
      result = result.filter(v => v.transmission === selectedTransmission);
    }

    // Price
    result = result.filter(v => v.dailyPrice <= maxPrice);

    // Instant Book
    if (instantBookOnly) {
      result = result.filter(v => v.isInstantBook);
    }

    // Min Seats
    if (minSeats > 0) {
      result = result.filter(v => v.seats >= minSeats);
    }

    // Sort
    if (sortBy === 'price_low') {
      result.sort((a, b) => a.dailyPrice - b.dailyPrice);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.dailyPrice - a.dailyPrice);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [
    vehicles,
    filterLocation,
    keyword,
    selectedMake,
    selectedType,
    selectedTransmission,
    maxPrice,
    instantBookOnly,
    minSeats,
    sortBy
  ]);

  const resetFilters = () => {
    triggerHaptic('light');
    setKeyword('');
    setSelectedMake('All');
    setSelectedType('All');
    setSelectedTransmission('All');
    setMaxPrice(250);
    setMinSeats(0);
    setInstantBookOnly(false);
    setSortBy('recommended');
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 space-y-3 p-4 bg-[#0A0A0A]">
      {/* Search Input Box */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-keyword-input"
            type="text"
            placeholder="Find your next drive..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-zinc-800/50 border border-zinc-700/80 rounded-2xl pl-9 pr-8 py-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Date and Location selectors in Bento styling */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#171717] border border-[#262626] rounded-2xl p-2.5 flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              id="search-city-select"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="bg-transparent text-white focus:outline-none w-full truncate cursor-pointer text-xs"
            >
              <option value="San Francisco, CA" className="bg-[#171717]">San Francisco, CA</option>
              <option value="Los Angeles, CA" className="bg-[#171717]">Los Angeles, CA</option>
              <option value="Miami, FL" className="bg-[#171717]">Miami, FL</option>
              <option value="Austin, TX" className="bg-[#171717]">Austin, TX</option>
              <option value="All Cities" className="bg-[#171717]">All Locations</option>
            </select>
          </div>

          <div className="bg-[#171717] border border-[#262626] rounded-2xl p-2.5 flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <input
              id="search-date-start"
              type="date"
              value={filterDates.start}
              onChange={(e) => setFilterDates({ ...filterDates, start: e.target.value })}
              className="bg-transparent text-white focus:outline-none w-full text-[11px] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Filter Quick Pills & Toggle Modal Button */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            id="filter-toggle-btn"
            onClick={() => {
              triggerHaptic('light');
              setShowFiltersModal(!showFiltersModal);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              showFiltersModal ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold' : 'bg-[#171717] text-zinc-300 border-[#262626] hover:border-zinc-700'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Filters</span>
          </button>

          <button
            id="quick-instant-toggle"
            onClick={() => {
              triggerHaptic('light');
              setInstantBookOnly(!instantBookOnly);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center space-x-1 transition-all whitespace-nowrap ${
              instantBookOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-[#171717] text-zinc-400 border-[#262626]'
            }`}
          >
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Instant</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center bg-[#171717] border border-[#262626] rounded-xl px-2.5 py-1">
            <ArrowUpDown className="w-3 h-3 text-zinc-400 mr-1.5 shrink-0" />
            <select
              id="search-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-zinc-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="recommended" className="bg-[#171717]">Recommended</option>
              <option value="price_low" className="bg-[#171717]">Price: Low to High</option>
              <option value="price_high" className="bg-[#171717]">Price: High to Low</option>
              <option value="rating" className="bg-[#171717]">Top Rated</option>
              <option value="newest" className="bg-[#171717]">Newest Model</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expanded Filter Panel Bento Box */}
      {showFiltersModal && (
        <div className="bg-[#171717] border border-[#262626] rounded-3xl p-4 space-y-3.5 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Refine</span>
              <h4 className="text-xs font-bold text-white">Marketplace Filters</h4>
            </div>
            <button
              id="reset-filters-btn"
              onClick={resetFilters}
              className="text-xs text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-zinc-400">Max Daily Rate:</span>
              <span className="font-extrabold text-white">{formatDailyRate(maxPrice)}/day</span>
            </div>
            <input
              id="price-range-slider"
              type="range"
              min="50"
              max="300"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Make Selector */}
          <div>
            <span className="text-xs text-zinc-400 block mb-1.5">Vehicle Make:</span>
            <div className="flex flex-wrap gap-1.5">
              {makes.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMake(m)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium ${
                    selectedMake === m ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission & Seats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-zinc-400 block mb-1">Transmission:</span>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white focus:outline-none"
              >
                <option value="All">Any Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <span className="text-zinc-400 block mb-1">Minimum Seats:</span>
              <select
                value={minSeats}
                onChange={(e) => setMinSeats(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-2 text-white focus:outline-none"
              >
                <option value={0}>Any Seats</option>
                <option value={2}>2+ Seats</option>
                <option value={4}>4+ Seats</option>
                <option value={5}>5+ Seats</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-xs text-zinc-400 flex items-center justify-between pt-1">
        <span>Found {filteredVehicles.length} vehicles</span>
        <span>Dates: 3 days rental</span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))
        ) : (
          <div className="text-center py-12 px-4 bg-[#171717] rounded-3xl border border-[#262626]">
            <Car className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white">No cars match your filters</h3>
            <p className="text-xs text-zinc-400 mt-1">Try adjusting the price range or changing location.</p>
            <button
              onClick={resetFilters}
              className="mt-3 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
