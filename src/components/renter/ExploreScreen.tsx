import React from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleCard } from './VehicleCard';
import {
  Search,
  SlidersHorizontal,
  Zap,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle,
  Navigation
} from 'lucide-react';

export const ExploreScreen: React.FC = () => {
  const {
    vehicles,
    selectedCategory,
    setSelectedCategory,
    currentUser,
    openModal,
    setActiveTab,
    setFilterLocation,
    filterLocation,
    triggerHaptic
  } = useApp();

  const categories = ['All', 'Electric', 'Sports', 'Luxury', 'SUV'];
  const popularCities = ['San Francisco, CA', 'Los Angeles, CA', 'Miami, FL', 'Austin, TX'];

  const filteredVehicles = vehicles.filter(v => {
    if (selectedCategory !== 'All' && v.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 space-y-4 p-4 bg-[#0A0A0A]">
      {/* Search Bar Input Container matching Bento Design */}
      <div
        id="explore-search-trigger"
        onClick={() => {
          triggerHaptic('light');
          setActiveTab('search');
        }}
        className="w-full bg-zinc-800/50 hover:bg-zinc-800/70 border border-zinc-700/80 rounded-2xl py-2.5 px-3.5 flex items-center justify-between shadow-sm cursor-pointer transition-all active:scale-[0.99]"
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-zinc-800 flex items-center justify-center text-emerald-400 border border-zinc-700">
            <Search className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 block leading-none">
              Location
            </span>
            <span className="text-xs font-bold text-white truncate block mt-0.5">
              {filterLocation}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] text-zinc-400 hidden sm:inline">Find your drive...</span>
          <div className="p-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* KYC Alert Banner if user not verified */}
      {currentUser.kycStatus !== 'verified' && (
        <div
          id="kyc-onboarding-banner"
          onClick={() => {
            triggerHaptic('medium');
            openModal('kyc_wizard');
          }}
          className="bg-[#171717] border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:border-emerald-500/60 transition-all shadow-md active:scale-[0.99]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                <span>Unlock Instant Booking</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500 text-slate-950 rounded font-black uppercase tracking-wider">
                  Required
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                Complete 1-minute driver KYC to book local peer cars.
              </p>
            </div>
          </div>
          <button className="px-2.5 py-1 rounded-xl bg-emerald-500 text-slate-950 font-bold text-[11px] shrink-0 shadow-sm">
            Verify
          </button>
        </div>
      )}

      {/* City Chips Bento Row */}
      <div>
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {popularCities.map(city => (
            <button
              key={city}
              id={`city-chip-${city.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => {
                triggerHaptic('light');
                setFilterLocation(city);
                setActiveTab('search');
              }}
              className="px-2.5 py-1 rounded-xl bg-[#171717] border border-[#262626] hover:border-zinc-700 text-zinc-300 text-[11px] font-medium whitespace-nowrap flex items-center space-x-1 transition-all shrink-0 active:scale-95"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{city.split(',')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div>
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`category-pill-${cat.toLowerCase()}`}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-[#171717] text-zinc-400 border border-[#262626] hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">
            Hyperlocal Fleet
          </span>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Popular in {filterLocation.split(',')[0]}
          </h2>
        </div>
        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          {filteredVehicles.length} available
        </span>
      </div>

      {/* Vehicle Grid */}
      <div className="space-y-3">
        {filteredVehicles.map(vehicle => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
};
