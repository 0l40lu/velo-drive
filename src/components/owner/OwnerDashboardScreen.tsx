import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  Car,
  KeyRound,
  Star,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Calendar,
  Sparkles,
  BarChart3
} from 'lucide-react';

export const OwnerDashboardScreen: React.FC = () => {
  const {
    currentUser,
    vehicles,
    bookings,
    payouts,
    openModal,
    updateBookingStatus,
    requestPayout,
    triggerHaptic,
    showToast,
    formatCurrency
  } = useApp();

  // Host vehicles
  const hostVehicles = vehicles.filter(v => v.ownerId === currentUser.id);

  // Host bookings
  const hostBookings = bookings.filter(b => b.ownerId === currentUser.id);
  const pendingRequests = hostBookings.filter(b => b.status === 'pending');
  const activeRentals = hostBookings.filter(b => b.status === 'active');
  const upcomingConfirmed = hostBookings.filter(b => b.status === 'confirmed');

  // Earnings calculation
  const totalEarned = hostBookings
    .filter(b => b.status === 'completed' || b.status === 'active')
    .reduce((sum, b) => sum + (b.rentalSubtotal * 0.88), 0); // 88% net to host after 12% platform fee

  const hostPayouts = payouts.filter(p => p.ownerId === currentUser.id);

  const handleAcceptBooking = (id: string) => {
    triggerHaptic('success');
    updateBookingStatus(id, 'confirmed');
    showToast('Booking Accepted!', 'The renter has been notified and key code is generated.', 'success');
  };

  const handleDeclineBooking = (id: string) => {
    triggerHaptic('warning');
    updateBookingStatus(id, 'cancelled');
    showToast('Booking Declined', 'Booking request declined.', 'info');
  };

  const handleRequestPayoutClick = () => {
    triggerHaptic('medium');
    if (totalEarned <= 0) {
      showToast('No Balance Available', 'Complete rentals to accumulate payout balance.', 'info');
      return;
    }
    requestPayout(Number((totalEarned * 0.5).toFixed(2)));
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 space-y-4 p-4 bg-[#0A0A0A]">
      {/* Top Welcome & Add Car Button */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
            Owner Dashboard
          </span>
          <h1 className="text-base font-extrabold text-white tracking-tight">Fleet & Earnings</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="owner-dashboard-login-btn"
            onClick={() => {
              triggerHaptic('medium');
              openModal('owner_login');
            }}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30 flex items-center space-x-1.5 active:scale-95 transition-all"
            title="Owner Login / Switch Host Fleet"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-extrabold hidden sm:inline">Owner Login</span>
          </button>

          <button
            id="host-add-car-btn"
            onClick={() => {
              triggerHaptic('light');
              openModal('add_vehicle');
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Car</span>
          </button>
        </div>
      </div>

      {/* Host Account Callout (if logged in user is not an owner or wants to access fleet portal) */}
      {currentUser.role !== 'owner' && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Viewing Host Preview</div>
              <div className="text-[10px] text-slate-400">Log in with a verified Host account to manage your real cars and earnings.</div>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('medium');
              openModal('owner_login');
            }}
            className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shrink-0 hover:bg-amber-400 transition-colors"
          >
            Host Login
          </button>
        </div>
      )}

      {/* Primary Earnings Bento Tile (Emerald Gradient or Solid from Design) */}
      <div className="bg-emerald-600 rounded-3xl p-5 flex flex-col justify-between text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Owner Earnings</span>
          <div className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14% vs last mo</span>
          </div>
        </div>

        <div className="my-2">
          <div className="text-3xl font-black tracking-tight">
            {formatCurrency(totalEarned > 0 ? totalEarned : 12480.50)}
          </div>
          <p className="text-[11px] opacity-80 mt-0.5">
            88% net host payout via Stripe Direct
          </p>
        </div>

        <div className="pt-3 border-t border-white/20 flex items-center justify-between">
          <span className="text-[11px] opacity-90">Auto-payout on 15th</span>
          <button
            id="payout-request-btn"
            onClick={handleRequestPayoutClick}
            className="px-3 py-1 rounded-xl bg-white text-emerald-950 text-xs font-bold hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
          >
            Instant Payout
          </button>
        </div>
      </div>

      {/* Bento Fleet Utilization Chart Card */}
      <div className="bg-[#171717] rounded-3xl border border-[#262626] p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Activity</span>
              <h3 className="text-xs font-bold text-white">7-Day Fleet Utilization</h3>
            </div>
            <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded-full text-[9px] text-zinc-400 uppercase font-bold">
              Live
            </span>
          </div>

          {/* Bar visualizer */}
          <div className="h-20 flex items-end gap-2 px-1 pb-1">
            {[40, 65, 85, 55, 95, 45, 70].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  style={{ height: `${height}%` }}
                  className={`w-full rounded-t-md transition-all ${
                    height >= 85 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-zinc-800'
                  }`}
                />
                <span className="text-[8px] text-zinc-500 uppercase font-mono">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-800 text-center">
            <div>
              <p className="text-[9px] text-zinc-500 uppercase font-bold">Active</p>
              <p className="text-sm font-black text-white">{activeRentals.length > 0 ? activeRentals.length : '08'}</p>
            </div>
            <div>
              <p className="text-[9px] text-zinc-500 uppercase font-bold">Utilization</p>
              <p className="text-sm font-black text-emerald-400">92%</p>
            </div>
            <div>
              <p className="text-[9px] text-zinc-500 uppercase font-bold">Rating</p>
              <p className="text-sm font-black text-amber-400">{currentUser.rating || '4.98'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Bento Row */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-[#171717] border border-[#262626] rounded-2xl p-3">
          <Car className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <div className="text-[10px] text-zinc-500 uppercase font-bold">Garage</div>
          <div className="text-sm font-black text-white">{hostVehicles.length} Listed</div>
        </div>

        <div className="bg-[#171717] border border-[#262626] rounded-2xl p-3">
          <KeyRound className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <div className="text-[10px] text-zinc-500 uppercase font-bold">Bookings</div>
          <div className="text-sm font-black text-white">{hostBookings.length} Total</div>
        </div>

        <div className="bg-[#171717] border border-[#262626] rounded-2xl p-3">
          <Star className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <div className="text-[10px] text-zinc-500 uppercase font-bold">Status</div>
          <div className="text-sm font-black text-white">Superhost</div>
        </div>
      </div>

      {/* Pending Booking Requests Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Actions</span>
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black">
                {pendingRequests.length} NEW
              </span>
            )}
          </div>
          <span className="text-[10px] text-zinc-500">Auto-expires 24h</span>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="space-y-2">
            {pendingRequests.map(req => (
              <div
                key={req.id}
                className="bg-[#171717] border border-[#262626] rounded-2xl p-3 space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={req.renterAvatar}
                      alt={req.renterName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{req.renterName}</div>
                      <div className="text-[10px] text-zinc-400">Verified Driver • 5.0 ★</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-400">
                      +{formatCurrency(req.rentalSubtotal * 0.88)}
                    </div>
                    <div className="text-[10px] text-zinc-500">{req.totalDays} days</div>
                  </div>
                </div>

                <div className="text-xs text-zinc-300 bg-zinc-800/40 p-2 rounded-xl border border-zinc-700/50 flex items-center justify-between">
                  <span>{req.vehicle.make} {req.vehicle.model}</span>
                  <span className="text-zinc-400 text-[11px]">{req.startDate} → {req.endDate}</span>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => handleAcceptBooking(req.id)}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center space-x-1 shadow-sm active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept Request</span>
                  </button>
                  <button
                    onClick={() => handleDeclineBooking(req.id)}
                    className="py-1.5 px-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-rose-400 text-xs font-medium border border-zinc-700 active:scale-95"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#171717] border border-dashed border-zinc-800 rounded-2xl p-5 text-center">
            <Clock className="w-5 h-5 text-zinc-500 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-zinc-300">No pending booking requests</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              New instant and approval bookings will appear here in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
