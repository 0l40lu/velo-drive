import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  Calendar,
  KeyRound,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  FileText,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  ExternalLink,
  Car
} from 'lucide-react';

export const RenterBookingsScreen: React.FC = () => {
  const {
    bookings,
    currentUser,
    setActiveChatBooking,
    openModal,
    setSelectedBooking,
    cancelBooking,
    openDispute,
    showToast,
    triggerHaptic,
    formatCurrency
  } = useApp();

  const [filterTab, setFilterTab] = useState<'current' | 'history'>('current');

  // Filter bookings for current logged-in renter
  const userBookings = bookings.filter(b => b.renterId === currentUser.id);

  const activeOrUpcoming = userBookings.filter(
    b => b.status === 'active' || b.status === 'confirmed' || b.status === 'pending'
  );

  const pastOrCancelled = userBookings.filter(
    b => b.status === 'completed' || b.status === 'cancelled' || b.status === 'disputed'
  );

  const displayedBookings = filterTab === 'current' ? activeOrUpcoming : pastOrCancelled;

  const handleChatWithHost = (booking: Booking) => {
    triggerHaptic('light');
    setActiveChatBooking(booking);
    openModal('chat');
  };

  const handleLeaveReview = (booking: Booking) => {
    triggerHaptic('light');
    setSelectedBooking(booking);
    openModal('write_review');
  };

  const handleCancelClick = (bookingId: string) => {
    triggerHaptic('warning');
    const reason = prompt('Please enter cancellation reason:', 'Travel plans changed');
    if (reason) {
      cancelBooking(bookingId, reason);
    }
  };

  const handleDisputeClick = (bookingId: string) => {
    triggerHaptic('warning');
    const reason = prompt('Describe the issue (e.g. vehicle condition, mileage, host no-show):', 'Vehicle cleanliness dispute');
    if (reason) {
      openDispute(bookingId, reason, 150);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 space-y-4 p-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-extrabold text-white tracking-tight">Your Trips</h1>
          <p className="text-xs text-slate-400">Manage current, upcoming, and past vehicle rentals</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
        <button
          id="trips-tab-current"
          onClick={() => {
            triggerHaptic('light');
            setFilterTab('current');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterTab === 'current'
              ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active & Upcoming ({activeOrUpcoming.length})
        </button>
        <button
          id="trips-tab-history"
          onClick={() => {
            triggerHaptic('light');
            setFilterTab('history');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterTab === 'history'
              ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Trip History ({pastOrCancelled.length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {displayedBookings.length > 0 ? (
          displayedBookings.map(bk => (
            <div
              key={bk.id}
              id={`booking-card-${bk.id}`}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-xl"
            >
              {/* Top Status & ID */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">#{bk.id}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    bk.status === 'active'
                      ? 'bg-emerald-500 text-slate-950 animate-pulse'
                      : bk.status === 'confirmed'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : bk.status === 'completed'
                      ? 'bg-slate-800 text-slate-300'
                      : bk.status === 'disputed'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {bk.status}
                </span>
              </div>

              {/* Vehicle & Dates Info */}
              <div className="flex items-center space-x-3">
                <img
                  src={bk.vehicle.photo}
                  alt={bk.vehicle.model}
                  className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {bk.vehicle.year} {bk.vehicle.make} {bk.vehicle.model}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{bk.vehicle.locationCity}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-300 mt-1">
                    {bk.startDate} → {bk.endDate} ({bk.totalDays} days)
                  </div>
                </div>
              </div>

              {/* Active Trip Live Unlock Code Box */}
              {bk.status === 'active' && bk.unlockCode && (
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                        Active Vehicle Key Code
                      </div>
                      <div className="text-lg font-black font-mono text-white tracking-widest leading-tight">
                        {bk.unlockCode}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 max-w-[90px] text-right">
                    Contactless Lockbox
                  </span>
                </div>
              )}

              {/* Host & Price summary */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <img
                    src={bk.ownerAvatar}
                    alt={bk.ownerName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-slate-300">Host: <strong className="text-white">{bk.ownerName}</strong></span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Total: </span>
                  <strong className="text-emerald-400 font-bold">{formatCurrency(bk.totalAmount)}</strong>
                </div>
              </div>

              {/* Actions Button Row */}
              <div className="pt-1 flex items-center space-x-2">
                <button
                  onClick={() => handleChatWithHost(bk)}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all active:scale-95 border border-slate-700/60"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Message Host</span>
                </button>

                {bk.status === 'completed' && (
                  <button
                    onClick={() => handleLeaveReview(bk)}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-md shadow-emerald-500/20"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Review Trip</span>
                  </button>
                )}

                {bk.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancelClick(bk.id)}
                    className="py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 text-xs font-medium border border-rose-800/50 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                )}

                {bk.status === 'active' && (
                  <button
                    onClick={() => handleDisputeClick(bk.id)}
                    className="py-2 px-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 text-xs font-medium border border-amber-800/50 transition-all active:scale-95"
                    title="Report Issue / Open Dispute"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 px-4 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
            <Car className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No trips found in this tab</h3>
            <p className="text-xs text-slate-400">
              {filterTab === 'current'
                ? "You don't have any active or upcoming trips. Search cars to book your next ride!"
                : "No past rentals recorded on this account yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
