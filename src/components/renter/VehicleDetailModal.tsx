import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  ShieldCheck,
  Zap,
  MapPin,
  Users,
  Fuel,
  KeyRound,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileCheck,
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const VehicleDetailModal: React.FC = () => {
  const {
    selectedVehicle,
    closeModal,
    openModal,
    savedVehicleIds,
    toggleSavedVehicle,
    reviews,
    currentUser,
    setActiveChatBooking,
    bookings,
    showToast,
    triggerHaptic,
    formatDailyRate,
    formatCurrency
  } = useApp();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!selectedVehicle) return null;

  const isSaved = savedVehicleIds.includes(selectedVehicle.id);
  const vehicleReviews = reviews.filter(r => r.vehicleId === selectedVehicle.id);

  const handleBookClick = () => {
    triggerHaptic('medium');
    if (currentUser.kycStatus !== 'verified') {
      showToast('KYC Verification Required', 'Complete 1-minute driver verification before booking.', 'info');
      openModal('kyc_wizard');
    } else {
      openModal('checkout');
    }
  };

  const handleMessageHost = () => {
    const existing = bookings.find(b => b.vehicleId === selectedVehicle.id && b.renterId === currentUser.id);
    if (existing) {
      setActiveChatBooking(existing);
      openModal('chat');
    } else {
      showToast('Host Inquiry', `You can message ${selectedVehicle.ownerName} directly once a booking is initiated, or reserve now with free cancellation.`, 'info');
    }
  };

  return (
    <div className="absolute inset-0 bg-[#0A0A0A] z-40 flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Top Floating Action Bar */}
      <div className="absolute top-3 left-3 right-3 z-50 flex items-center justify-between pointer-events-none">
        <button
          id="close-vehicle-detail-btn"
          onClick={() => {
            triggerHaptic('light');
            closeModal();
          }}
          className="w-8 h-8 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 text-white flex items-center justify-center pointer-events-auto hover:bg-zinc-800 active:scale-95 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            id="share-vehicle-btn"
            onClick={() => {
              triggerHaptic('light');
              navigator.clipboard?.writeText(window.location.href);
              showToast('Link Copied!', 'Shareable vehicle link copied to clipboard.', 'success');
            }}
            className="w-8 h-8 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 text-white flex items-center justify-center hover:bg-zinc-800 active:scale-95 shadow-md"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            id="bookmark-vehicle-detail-btn"
            onClick={() => toggleSavedVehicle(selectedVehicle.id)}
            className="w-8 h-8 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 text-white flex items-center justify-center hover:bg-zinc-800 active:scale-95 shadow-md"
          >
            <Heart
              className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-zinc-300'}`}
            />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Photo Gallery Carousel */}
        <div className="relative aspect-[16/10] w-full bg-[#0A0A0A] overflow-hidden">
          <img
            src={selectedVehicle.photos[activePhotoIndex]}
            alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/40 pointer-events-none" />

          {/* Photo Dots */}
          {selectedVehicle.photos.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center space-x-1.5 z-10">
              {selectedVehicle.photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activePhotoIndex === idx ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Body */}
        <div className="p-4 space-y-4">
          {/* Header Title & Ratings */}
          <div>
            <div className="flex items-center space-x-2 text-xs mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                {selectedVehicle.category}
              </span>
              {selectedVehicle.isInstantBook && (
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#171717] text-zinc-300 text-[10px] font-bold border border-[#262626] uppercase">
                  <Zap className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
                  <span>Instant Booking</span>
                </span>
              )}
            </div>

            <h1 className="text-xl font-bold text-white tracking-tight">
              {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
            </h1>

            <div className="flex items-center space-x-3 text-xs text-zinc-400 mt-1">
              <div className="flex items-center space-x-1 text-zinc-200">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-bold">{selectedVehicle.rating.toFixed(2)}</span>
                <span className="text-zinc-500">({selectedVehicle.reviewsCount} reviews)</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{selectedVehicle.location.neighborhood}, {selectedVehicle.location.city}</span>
              </div>
            </div>
          </div>

          {/* Key Specs Bento Row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#171717] border border-[#262626] rounded-2xl p-2.5">
              <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-[9px] text-zinc-500 uppercase font-bold">Capacity</div>
              <div className="text-xs font-bold text-white">{selectedVehicle.seats} Seats</div>
            </div>
            <div className="bg-[#171717] border border-[#262626] rounded-2xl p-2.5">
              <KeyRound className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-[9px] text-zinc-500 uppercase font-bold">Gearbox</div>
              <div className="text-xs font-bold text-white">{selectedVehicle.transmission}</div>
            </div>
            <div className="bg-[#171717] border border-[#262626] rounded-2xl p-2.5">
              <Fuel className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-[9px] text-zinc-500 uppercase font-bold">Power</div>
              <div className="text-xs font-bold text-white">{selectedVehicle.fuelType}</div>
            </div>
          </div>

          {/* Host Card Bento Widget */}
          <div className="bg-[#171717] border border-[#262626] rounded-3xl p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={selectedVehicle.ownerAvatar}
                alt={selectedVehicle.ownerName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
              />
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs font-bold text-white">{selectedVehicle.ownerName}</h4>
                  {selectedVehicle.isSuperhost && (
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold uppercase tracking-wider">
                      SUPERHOST
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  ★ {selectedVehicle.ownerRating} • {selectedVehicle.ownerTripsCount} trips hosted
                </div>
              </div>
            </div>

            <button
              onClick={handleMessageHost}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center space-x-1 border border-zinc-700 transition-all active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold">Chat</span>
            </button>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Overview</span>
            <p className="text-xs text-zinc-300 leading-relaxed bg-[#171717] p-3 rounded-2xl border border-[#262626]">
              {selectedVehicle.description}
            </p>
          </div>

          {/* Features Bento Tiles */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Amenities</span>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
              {selectedVehicle.features.map(f => (
                <div key={f} className="flex items-center space-x-2 bg-[#171717] p-2.5 rounded-xl border border-[#262626]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate text-xs font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Vehicle Compliance Bento Card */}
          <div className="bg-[#171717] border border-emerald-500/30 rounded-3xl p-4 space-y-2.5">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
              <FileCheck className="w-4 h-4" />
              <span className="uppercase tracking-wider">Platform Verified Fleet Asset</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-300">
              <div className="bg-zinc-800/40 p-2 rounded-xl border border-zinc-700/50">
                <span className="text-zinc-500 uppercase tracking-wider block font-bold">VIN Hash:</span>
                <span className="font-mono text-zinc-200">{selectedVehicle.verificationDocs.vin}</span>
              </div>
              <div className="bg-zinc-800/40 p-2 rounded-xl border border-zinc-700/50">
                <span className="text-zinc-500 uppercase tracking-wider block font-bold">Inspection:</span>
                <span className="text-emerald-400 font-bold capitalize">
                  {selectedVehicle.verificationDocs.inspectionStatus}
                </span>
              </div>
              <div className="bg-zinc-800/40 p-2 rounded-xl border border-zinc-700/50">
                <span className="text-zinc-500 uppercase tracking-wider block font-bold">Insurance:</span>
                <span className="text-zinc-200">{selectedVehicle.verificationDocs.insuranceProvider}</span>
              </div>
              <div className="bg-zinc-800/40 p-2 rounded-xl border border-zinc-700/50">
                <span className="text-zinc-500 uppercase tracking-wider block font-bold">Coverage:</span>
                <span className="text-zinc-200">{formatCurrency(1000000)} Liability</span>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">
                Ratings & Reviews ({selectedVehicle.reviewsCount})
              </span>
              <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{selectedVehicle.rating.toFixed(2)}</span>
              </div>
            </div>

            {vehicleReviews.length > 0 ? (
              <div className="space-y-2">
                {vehicleReviews.map(rev => (
                  <div key={rev.id} className="bg-[#171717] border border-[#262626] rounded-2xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={rev.reviewerAvatar}
                          alt={rev.reviewerName}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-700"
                        />
                        <span className="text-xs font-bold text-white">{rev.reviewerName}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">{rev.date}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-snug">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">No reviews yet for this vehicle.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Booking Sticky CTA Bar */}
      <div className="w-full bg-[#171717] border-t border-[#262626] px-4 py-3 flex items-center justify-between shrink-0 z-50">
        <div>
          <div className="flex items-baseline space-x-1">
            <span className="text-lg font-black text-white">{formatDailyRate(selectedVehicle.dailyPrice)}</span>
            <span className="text-xs text-zinc-400">/day</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-medium">Free cancellation up to 24h</div>
        </div>

        <button
          id="book-now-cta-btn"
          onClick={handleBookClick}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
        >
          <span>{currentUser.kycStatus === 'verified' ? 'Book Drive' : 'Verify & Book'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
