import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Clock,
  CreditCard,
  Lock,
  CheckCircle2,
  Info,
  Zap,
  Sparkles,
  MapPin,
  AlertCircle
} from 'lucide-react';

export const BookingCheckoutModal: React.FC = () => {
  const {
    selectedVehicle,
    closeModal,
    createBooking,
    currentUser,
    filterDates,
    setSelectedBooking,
    openModal,
    setActiveTab,
    showToast,
    triggerHaptic,
    formatCurrency,
    formatDailyRate
  } = useApp();

  const [startDate, setStartDate] = useState(filterDates.start || '2026-09-10');
  const [endDate, setEndDate] = useState(filterDates.end || '2026-09-13');
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [returnTime, setReturnTime] = useState('10:00 AM');
  const [protectionPlan, setProtectionPlan] = useState<'standard' | 'premium' | 'minimum'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'google_pay' | 'card'>('apple_pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  if (!selectedVehicle) return null;

  // Calculate days
  const startMs = new Date(startDate).getTime();
  const endMs = new Date(endDate).getTime();
  const diffDays = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)));

  const dailyPrice = selectedVehicle.dailyPrice;
  const rentalSubtotal = dailyPrice * diffDays;

  // Protection fees per day
  const protectionDailyRate = protectionPlan === 'premium' ? 29 : protectionPlan === 'standard' ? 18 : 0;
  const protectionFee = protectionDailyRate * diffDays;

  const platformFee = Number((rentalSubtotal * 0.12).toFixed(2));
  const taxes = Number(((rentalSubtotal + platformFee) * 0.085).toFixed(2));
  const securityDeposit = 250; // Refundable
  const totalAmount = Number((rentalSubtotal + protectionFee + platformFee + taxes + securityDeposit).toFixed(2));

  const handleConfirmPayment = async () => {
    triggerHaptic('medium');
    setIsProcessing(true);

    try {
      // Simulate secure tokenized payment gateway
      await new Promise(res => setTimeout(res, 1200));

      const newBooking = await createBooking({
        vehicleId: selectedVehicle.id,
        vehicle: {
          make: selectedVehicle.make,
          model: selectedVehicle.model,
          year: selectedVehicle.year,
          photo: selectedVehicle.photos[0],
          dailyPrice: selectedVehicle.dailyPrice,
          locationCity: `${selectedVehicle.location.city}, ${selectedVehicle.location.state}`,
          category: selectedVehicle.category
        },
        renterId: currentUser.id,
        renterName: currentUser.name,
        renterAvatar: currentUser.avatar,
        renterPhone: currentUser.phone,
        ownerId: selectedVehicle.ownerId,
        ownerName: selectedVehicle.ownerName,
        ownerAvatar: selectedVehicle.ownerAvatar,
        startDate,
        endDate,
        pickupTime,
        returnTime,
        totalDays: diffDays,
        rentalSubtotal,
        platformFee,
        taxes,
        securityDeposit,
        protectionPlan,
        protectionFee,
        totalAmount,
        status: selectedVehicle.isInstantBook ? 'confirmed' : 'pending',
        paymentMethod: paymentMethod === 'apple_pay' ? 'Apple Pay' : paymentMethod === 'google_pay' ? 'Google Pay' : 'Visa Debit',
        paymentLast4: '4242',
        paymentStatus: 'paid'
      });

      triggerHaptic('success');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setBookingSuccess(newBooking);
    } catch (err: any) {
      triggerHaptic('warning');
      showToast('Booking Error', err.message || 'Payment could not be completed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewTrip = () => {
    closeModal();
    setActiveTab('bookings');
  };

  return (
    <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="w-full bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            triggerHaptic('light');
            closeModal();
          }}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xs font-bold text-white uppercase tracking-wider">
          {bookingSuccess ? 'Booking Confirmed' : 'Checkout & Protection'}
        </h2>
        <div className="w-7 h-7 flex items-center justify-center">
          <Lock className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {bookingSuccess ? (
        /* Success Screen */
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Trip Confirmed
            </span>
            <h1 className="text-xl font-extrabold text-white mt-1">
              You're Ready to Roll!
            </h1>
            <p className="text-xs text-slate-300 max-w-xs mx-auto mt-1">
              Your reservation for the {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} is secured.
            </p>
          </div>

          {/* Unlock Code Card */}
          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1.5 shadow-xl">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Contactless Key Unlock Code
            </span>
            <div className="text-2xl font-mono font-black text-emerald-400 tracking-wider">
              {bookingSuccess.unlockCode}
            </div>
            <p className="text-[10px] text-slate-400">
              Enter this code on the window lockbox or use the in-app digital key upon arrival at pickup.
            </p>
          </div>

          {/* Trip Summary Card */}
          <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Pickup:</span>
              <span className="font-semibold text-white">{startDate} at {pickupTime}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Return:</span>
              <span className="font-semibold text-white">{endDate} at {returnTime}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Location:</span>
              <span className="font-semibold text-white truncate max-w-[180px]">{selectedVehicle.location.address}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800">
              <span>Total Paid:</span>
              <span className="font-extrabold text-emerald-400">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <button
            id="view-my-trips-btn"
            onClick={handleViewTrip}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            View in Trips & Chat with Host
          </button>
        </div>
      ) : (
        /* Checkout Flow */
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-28">
          {/* Vehicle Header Mini */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3">
            <img
              src={selectedVehicle.photos[0]}
              alt={selectedVehicle.model}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-white truncate">
                {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
              </h3>
              <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{selectedVehicle.location.city}</span>
              </div>
              <div className="text-xs font-extrabold text-emerald-400 mt-1">
                {formatDailyRate(selectedVehicle.dailyPrice)} <span className="text-[10px] text-slate-400 font-normal">/ day</span>
              </div>
            </div>
          </div>

          {/* Trip Dates Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Rental Dates</h4>
              <span className="text-xs font-bold text-emerald-400">{diffDays} Days Total</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Pickup Date</span>
                <input
                  id="checkout-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none text-xs cursor-pointer"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Return Date</span>
                <input
                  id="checkout-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none text-xs cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Pickup Time</span>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Return Time</span>
                <select
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Protection Plan Selection */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Choose Protection Plan</h4>

            <div className="space-y-2 text-xs">
              <label
                onClick={() => setProtectionPlan('standard')}
                className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  protectionPlan === 'standard'
                    ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/50'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  <input
                    type="radio"
                    name="protection"
                    checked={protectionPlan === 'standard'}
                    onChange={() => setProtectionPlan('standard')}
                    className="mt-0.5 accent-emerald-500"
                  />
                  <div>
                    <div className="font-bold text-white flex items-center space-x-1.5">
                      <span>Standard Protection</span>
                      <span className="text-[9px] px-1.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Recommended</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {formatCurrency(500)} max out-of-pocket physical damage limit. Includes 24/7 roadside assistance.
                    </div>
                  </div>
                </div>
                <span className="font-bold text-white whitespace-nowrap">{formatDailyRate(18)}/day</span>
              </label>

              <label
                onClick={() => setProtectionPlan('premium')}
                className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  protectionPlan === 'premium'
                    ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/50'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  <input
                    type="radio"
                    name="protection"
                    checked={protectionPlan === 'premium'}
                    onChange={() => setProtectionPlan('premium')}
                    className="mt-0.5 accent-emerald-500"
                  />
                  <div>
                    <div className="font-bold text-white flex items-center space-x-1.5">
                      <span>Premium Protection</span>
                      <span className="text-[9px] px-1.5 rounded bg-amber-500/20 text-amber-400 font-semibold">Zero Deductible</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {formatCurrency(0)} out-of-pocket deductible for covered exterior/interior damage + tire and glass replacement.
                    </div>
                  </div>
                </div>
                <span className="font-bold text-white whitespace-nowrap">{formatDailyRate(29)}/day</span>
              </label>

              <label
                onClick={() => setProtectionPlan('minimum')}
                className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  protectionPlan === 'minimum'
                    ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/50'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  <input
                    type="radio"
                    name="protection"
                    checked={protectionPlan === 'minimum'}
                    onChange={() => setProtectionPlan('minimum')}
                    className="mt-0.5 accent-emerald-500"
                  />
                  <div>
                    <div className="font-bold text-white">Minimum Coverage</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      State minimum financial responsibility. {formatCurrency(3000)} max deductible.
                    </div>
                  </div>
                </div>
                <span className="font-bold text-slate-400 whitespace-nowrap">{formatDailyRate(0)}/day</span>
              </label>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Payment Method</h4>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                id="pay-apple-btn"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'bg-slate-800 border-emerald-400 text-white font-bold ring-1 ring-emerald-400/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-sm font-semibold"> Pay</span>
                <span className="text-[9px]">One-Touch</span>
              </button>

              <button
                type="button"
                id="pay-google-btn"
                onClick={() => setPaymentMethod('google_pay')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  paymentMethod === 'google_pay'
                    ? 'bg-slate-800 border-emerald-400 text-white font-bold ring-1 ring-emerald-400/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-sm font-bold text-blue-400">G Pay</span>
                <span className="text-[9px]">Android Pay</span>
              </button>

              <button
                type="button"
                id="pay-card-btn"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-slate-800 border-emerald-400 text-white font-bold ring-1 ring-emerald-400/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="text-[9px]">Card •••• 4242</span>
              </button>
            </div>
          </div>

          {/* Complete Price Calculation Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
              Price Breakdown
            </h4>

            <div className="flex items-center justify-between text-slate-300">
              <span>Rental Rate ({formatDailyRate(dailyPrice)} × {diffDays} days)</span>
              <span className="font-semibold text-white">{formatCurrency(rentalSubtotal)}</span>
            </div>

            {protectionFee > 0 && (
              <div className="flex items-center justify-between text-slate-300">
                <span>Protection Plan ({protectionPlan})</span>
                <span className="font-semibold text-white">{formatCurrency(protectionFee)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center space-x-1">
                <span>Platform Service Fee (12%)</span>
              </span>
              <span className="font-semibold text-white">{formatCurrency(platformFee)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>Estimated Sales Tax (8.5%)</span>
              <span className="font-semibold text-white">{formatCurrency(taxes)}</span>
            </div>

            <div className="flex items-center justify-between text-emerald-400 font-medium pt-1 border-t border-slate-800/80">
              <span className="flex items-center space-x-1">
                <span>Refundable Security Deposit</span>
                <Info className="w-3 h-3" />
              </span>
              <span>{formatCurrency(securityDeposit)}</span>
            </div>

            <div className="flex items-center justify-between text-white text-sm font-extrabold pt-2 border-t border-slate-800">
              <span>Total Due Now</span>
              <span className="text-emerald-400 text-base">{formatCurrency(totalAmount)}</span>
            </div>

            <p className="text-[10px] text-slate-500 pt-1 leading-snug">
              * The {formatCurrency(securityDeposit)} security deposit is an authorization hold released automatically within 48 hours of trip return without incident.
            </p>
          </div>
        </div>
      )}

      {/* Sticky Bottom Pay Button */}
      {!bookingSuccess && (
        <div className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 z-50">
          <div>
            <div className="text-base font-extrabold text-white">{formatCurrency(totalAmount)}</div>
            <div className="text-[10px] text-emerald-400 font-medium">Instant Confirmation</div>
          </div>

          <button
            id="confirm-pay-now-btn"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Pay {formatCurrency(totalAmount)}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
