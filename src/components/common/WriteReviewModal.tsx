import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Sparkles,
  Car
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WriteReviewModal: React.FC = () => {
  const { selectedBooking, closeModal, addReview, currentUser, showToast, triggerHaptic } = useApp();

  const [rating, setRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [carCondition, setCarCondition] = useState(5);
  const [comment, setComment] = useState('Incredible vehicle and seamless pickup experience. Highly recommended host!');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedBooking) return null;

  const handleSubmit = async () => {
    triggerHaptic('success');
    setIsSubmitting(true);

    try {
      addReview({
        vehicleId: selectedBooking.vehicleId,
        bookingId: selectedBooking.id,
        reviewerId: currentUser.id,
        reviewerName: currentUser.name,
        reviewerAvatar: currentUser.avatar,
        targetType: 'vehicle',
        rating,
        comment,
        categories: {
          cleanliness,
          communication,
          accuracy: 5,
          performance: carCondition
        }
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast('Review Published!', 'Thank you for contributing to community trust.', 'success');
      closeModal();
    } catch (err) {
      showToast('Error', 'Could not post review.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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
          Review Your Trip
        </h2>
        <div className="w-7 h-7" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-24">
        {/* Vehicle Mini */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3">
          <img
            src={selectedBooking.vehicle.photo}
            alt="Car"
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <h3 className="text-xs font-bold text-white">
              {selectedBooking.vehicle.year} {selectedBooking.vehicle.make} {selectedBooking.vehicle.model}
            </h3>
            <p className="text-[11px] text-slate-400">Host: {selectedBooking.ownerName}</p>
          </div>
        </div>

        {/* Overall Star Rating */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Overall Experience</span>
          <div className="flex items-center justify-center space-x-2 pt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => {
                  triggerHaptic('light');
                  setRating(s);
                }}
                className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
              >
                <Star
                  className={`w-8 h-8 ${
                    rating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs text-emerald-400 font-bold block">
            {rating === 5 ? 'Excellent 5.0' : rating === 4 ? 'Very Good 4.0' : 'Average'}
          </span>
        </div>

        {/* Category breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Cleanliness:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setCleanliness(n)}
                  className={`w-6 h-6 rounded-lg font-bold text-[10px] ${
                    cleanliness >= n ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-300">Vehicle Condition:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setCarCondition(n)}
                  className={`w-6 h-6 rounded-lg font-bold text-[10px] ${
                    carCondition >= n ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-300">Host Communication:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setCommunication(n)}
                  className={`w-6 h-6 rounded-lg font-bold text-[10px] ${
                    communication >= n ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback text */}
        <div className="space-y-1 text-xs">
          <label className="text-slate-400 block font-semibold">Written Review for Community</label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Sticky Bottom Post Button */}
      <div className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 z-50">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Post Review</span>
        </button>
      </div>
    </div>
  );
};
