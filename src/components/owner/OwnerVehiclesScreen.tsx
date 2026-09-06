import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  PlusCircle,
  ShieldCheck,
  Star,
  Zap,
  MapPin,
  Settings2,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const OwnerVehiclesScreen: React.FC = () => {
  const {
    currentUser,
    vehicles,
    openModal,
    setSelectedVehicle,
    triggerHaptic,
    showToast,
    formatDailyRate,
    formatCurrency
  } = useApp();

  const hostVehicles = vehicles.filter(v => v.ownerId === currentUser.id);

  const handleInspectVehicle = (v: any) => {
    triggerHaptic('light');
    setSelectedVehicle(v);
    openModal('vehicle_detail');
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 space-y-4 p-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-extrabold text-white tracking-tight">Your Garage</h1>
          <p className="text-xs text-slate-400">Manage listings, daily rates, and compliance docs</p>
        </div>

        <button
          id="add-new-car-garage-btn"
          onClick={() => {
            triggerHaptic('light');
            openModal('add_vehicle');
          }}
          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Car</span>
        </button>
      </div>

      {/* Fleet List */}
      <div className="space-y-3.5">
        {hostVehicles.length > 0 ? (
          hostVehicles.map(v => (
            <div
              key={v.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Image & Quick Status Bar */}
              <div className="relative aspect-[16/9] w-full bg-slate-950">
                <img
                  src={v.photos[0]}
                  alt={`${v.make} ${v.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center space-x-1 ${
                    v.isVerified ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                  }`}>
                    <ShieldCheck className="w-3 h-3" />
                    <span>{v.isVerified ? 'Verified Listing' : 'Pending Compliance'}</span>
                  </span>
                  {v.isInstantBook && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-slate-700">
                      Instant Book
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <div className="font-extrabold text-sm">
                    {v.year} {v.make} {v.model}
                  </div>
                  <div className="font-bold text-emerald-400 text-sm">
                    {formatDailyRate(v.dailyPrice)}<span className="text-[10px] text-slate-300 font-normal">/day</span>
                  </div>
                </div>
              </div>

              {/* Body stats */}
              <div className="p-3.5 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Total Trips</div>
                    <div className="font-bold text-white mt-0.5">{v.tripCount} Completed</div>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Rating</div>
                    <div className="font-bold text-amber-400 mt-0.5 flex items-center justify-center space-x-0.5">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{v.rating.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Transmission</div>
                    <div className="font-bold text-white mt-0.5">{v.transmission}</div>
                  </div>
                </div>

                {/* Compliance info */}
                <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>VIN:</span>
                    <span className="font-mono text-slate-200">{v.verificationDocs.vin}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Registration:</span>
                    <span className="text-slate-200">{v.verificationDocs.registrationNumber}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => handleInspectVehicle(v)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 active:scale-95 transition-all"
                  >
                    View Listing Preview
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      showToast('Availability Updated', `${v.make} ${v.model} calendar synchronized.`, 'info');
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 active:scale-95 transition-all"
                  >
                    Calendar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 px-4 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
            <Car className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">Your garage is empty</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Earn an average of {formatCurrency(800)} - {formatCurrency(2500)}/month by renting out your car when you're not driving.
            </p>
            <button
              onClick={() => openModal('add_vehicle')}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95"
            >
              List Your First Vehicle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
