import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { closeModal, openModal, setActiveMode, setActiveTab, triggerHaptic } = useApp();

  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Drive Exceptional Peer Cars',
      subtitle: 'Rent distinctive vehicles from verified local hosts near you with transparent all-inclusive pricing.',
      icon: Car,
      tag: 'Peer-to-Peer Marketplace',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'Contactless Digital Keys',
      subtitle: 'Skip rental counter queues. Locate your car, enter the digital key code, and hit the open road in minutes.',
      icon: KeyRound,
      tag: 'Seamless Hand-off',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'VeloShield Protection',
      subtitle: '$1,000,000 liability insurance and 24/7 roadside assistance included on every verified trip.',
      icon: ShieldCheck,
      tag: 'Zero-Worry Safety',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const current = slides[slide];
  const Icon = current.icon;

  const handleNext = () => {
    triggerHaptic('light');
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      closeModal();
    }
  };

  const handleChooseRenter = () => {
    triggerHaptic('medium');
    setActiveMode('renter');
    setActiveTab('explore');
    closeModal();
  };

  const handleChooseHost = () => {
    triggerHaptic('medium');
    setActiveMode('owner');
    setActiveTab('dashboard');
    closeModal();
  };

  return (
    <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col justify-between p-6 animate-in fade-in duration-300 select-none">
      {/* Top Skip & Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-base shadow-md shadow-emerald-500/30">
            V
          </div>
          <span className="text-sm font-extrabold text-white tracking-tight">VeloDrive</span>
        </div>

        <button
          onClick={() => closeModal()}
          className="text-xs text-slate-400 hover:text-white font-medium px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
        >
          Skip
        </button>
      </div>

      {/* Hero Visual */}
      <div className="my-auto space-y-6">
        <div className="relative aspect-[16/11] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/60 text-emerald-400 text-[10px] font-bold flex items-center space-x-1.5">
            <Icon className="w-3.5 h-3.5" />
            <span>{current.tag}</span>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
            {current.title}
          </h1>
          <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
            {current.subtitle}
          </p>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center space-x-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                slide === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        {slide === slides.length - 1 ? (
          <div className="space-y-2">
            <button
              id="onboarding-rent-cars-btn"
              onClick={handleChooseRenter}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>I Want to Rent Cars</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              id="onboarding-list-cars-btn"
              onClick={() => {
                triggerHaptic('medium');
                setActiveMode('owner');
                closeModal();
                openModal('owner_login');
              }}
              className="w-full py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>I Want to List My Car • Owner Login</span>
            </button>

            <div className="flex items-center justify-center space-x-3 pt-1 text-[11px] text-slate-400">
              <button
                id="onboarding-signup-link-btn"
                onClick={() => {
                  triggerHaptic('medium');
                  openModal('auth');
                }}
                className="hover:text-emerald-400 transition-colors"
              >
                Sign Up with Gmail / Email
              </button>
              <span>•</span>
              <button
                id="onboarding-owner-login-btn"
                onClick={() => {
                  triggerHaptic('medium');
                  closeModal();
                  openModal('owner_login');
                }}
                className="text-amber-400 hover:text-amber-300 font-semibold underline transition-colors"
              >
                Owner Portal
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                openModal('auth');
              }}
              className="w-full text-center text-[11px] text-slate-400 hover:text-white transition-colors"
            >
              Already have an account? <span className="text-emerald-400 font-semibold">Sign In / Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
