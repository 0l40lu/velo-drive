import React from 'react';
import { Vehicle } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Star,
  Zap,
  ShieldCheck,
  Heart,
  Users,
  Fuel,
  MapPin,
  Sparkles
} from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const {
    setSelectedVehicle,
    openModal,
    savedVehicleIds,
    toggleSavedVehicle,
    triggerHaptic,
    formatDailyRate
  } = useApp();

  const isSaved = savedVehicleIds.includes(vehicle.id);

  const handleCardClick = () => {
    triggerHaptic('light');
    setSelectedVehicle(vehicle);
    openModal('vehicle_detail');
  };

  return (
    <div
      id={`vehicle-card-${vehicle.id}`}
      onClick={handleCardClick}
      className="bg-zinc-800/40 hover:bg-zinc-800/60 border border-zinc-700/50 hover:border-zinc-600/70 rounded-2xl p-3 transition-all cursor-pointer group active:scale-[0.99] select-none shadow-lg"
    >
      {/* Image & Overlay Badges */}
      <div className="relative aspect-[16/9] rounded-xl bg-zinc-800 mb-3 overflow-hidden">
        <img
          src={vehicle.photos[0]}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center space-x-1.5 pointer-events-none">
          {vehicle.isInstantBook && (
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-sm">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>Instant</span>
            </span>
          )}
          {vehicle.isSuperhost && (
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-zinc-900/90 text-amber-300 border border-amber-500/30 text-[9px] font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Superhost</span>
            </span>
          )}
        </div>

        {/* Heart Bookmark Button */}
        <button
          id={`bookmark-btn-${vehicle.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleSavedVehicle(vehicle.id);
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-zinc-900/70 backdrop-blur-md border border-zinc-700/60 flex items-center justify-center text-zinc-300 hover:text-rose-400 active:scale-90 transition-all shadow-sm"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isSaved ? 'fill-rose-500 text-rose-500' : 'text-zinc-300'
            }`}
          />
        </button>

        {/* Bottom specs overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-zinc-300 pointer-events-none font-medium">
          <div className="flex items-center space-x-1.5">
            <span className="bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-zinc-800 flex items-center space-x-1">
              <Users className="w-2.5 h-2.5 text-zinc-400" />
              <span>{vehicle.seats} seats</span>
            </span>
            <span className="bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-zinc-800 flex items-center space-x-1">
              <Fuel className="w-2.5 h-2.5 text-zinc-400" />
              <span>{vehicle.fuelType}</span>
            </span>
          </div>
          <span className="bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-zinc-800">
            {vehicle.transmission}
          </span>
        </div>
      </div>

      {/* Vehicle Info & Pricing */}
      <div className="flex justify-between items-start">
        <div className="min-w-0 pr-2">
          <h4 className="text-sm font-bold text-white tracking-tight truncate">
            {vehicle.make} {vehicle.model}
          </h4>
          <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center space-x-1">
            <span>{vehicle.category} • {vehicle.year}</span>
            <span>•</span>
            <span className="truncate">{vehicle.location.city}</span>
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xs font-bold text-emerald-400">
            {formatDailyRate(vehicle.dailyPrice)}<span className="text-[10px] text-zinc-400 font-normal">/day</span>
          </div>
          <div className="flex items-center justify-end space-x-1 mt-0.5 text-[10px] text-zinc-400">
            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-zinc-200">{vehicle.rating.toFixed(2)}</span>
            <span className="text-[9px]">({vehicle.reviewsCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
