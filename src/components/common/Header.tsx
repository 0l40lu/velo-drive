import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  Bell,
  Sparkles,
  Shield,
  Layers,
  ArrowLeftRight,
  KeyRound
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeMode,
    setActiveMode,
    openModal,
    notifications,
    triggerHaptic
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full bg-[#171717] backdrop-blur-md border-b border-[#262626] px-4 py-2.5 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: User Avatar & Quick Mode Switch */}
      <div className="flex items-center space-x-2.5">
        <button
          id="header-profile-btn"
          onClick={() => openModal('user_switcher')}
          className="relative group focus:outline-none"
          title="Switch profile or test accounts"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/60 transition-transform active:scale-95"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#171717] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-[#171717]" />
          </div>
        </button>

        <div>
          <div className="flex items-center space-x-1.5">
            <h1 className="text-xs font-bold text-white tracking-tight leading-none">
              {currentUser.name}
            </h1>
            {currentUser.role === 'admin' && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 font-semibold font-mono">
                ADMIN
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5 mt-0.5">
            {/* KYC status chip */}
            <button
              id="kyc-badge-btn"
              onClick={() => {
                triggerHaptic('light');
                openModal('kyc_wizard');
              }}
              className={`flex items-center space-x-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                currentUser.kycStatus === 'verified'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                  : currentUser.kycStatus === 'pending'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
              }`}
            >
              {currentUser.kycStatus === 'verified' ? (
                <ShieldCheck className="w-2.5 h-2.5" />
              ) : currentUser.kycStatus === 'pending' ? (
                <Shield className="w-2.5 h-2.5" />
              ) : (
                <ShieldAlert className="w-2.5 h-2.5" />
              )}
              <span>
                {currentUser.kycStatus === 'verified' ? 'Verified Driver' : currentUser.kycStatus === 'pending' ? 'KYC Review' : 'Verify ID'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Actions: Mode switch toggle, Host Portal, Notifications & Admin */}
      <div className="flex items-center space-x-1.5">
        {/* Host Login Quick Button */}
        <button
          id="header-owner-login-btn"
          onClick={() => {
            triggerHaptic('medium');
            openModal('owner_login');
          }}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition-all active:scale-95"
          title="Host Portal & Owner Login"
        >
          <KeyRound className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">
            Host Login
          </span>
        </button>

        {/* Quick Mode Switcher Icon Button */}
        <button
          id="quick-mode-switch"
          onClick={() => {
            setActiveMode(activeMode === 'renter' ? 'owner' : 'renter');
          }}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 text-xs font-semibold text-zinc-200 transition-all active:scale-95"
          title={`Switch to ${activeMode === 'renter' ? 'Owner' : 'Renter'} mode`}
        >
          <ArrowLeftRight className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-bold hidden sm:inline uppercase tracking-wider">
            {activeMode === 'renter' ? 'Host' : 'Renter'}
          </span>
        </button>

        {/* Admin Portal Button */}
        <button
          id="admin-dashboard-btn"
          onClick={() => {
            triggerHaptic('medium');
            openModal('admin');
          }}
          className="p-1.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 text-zinc-300 hover:text-white transition-all active:scale-95"
          title="Open Admin & Moderation Console"
        >
          <Shield className="w-4 h-4 text-purple-400" />
        </button>

        {/* Notifications Bell */}
        <button
          id="notifications-btn"
          onClick={() => {
            triggerHaptic('light');
            openModal('notifications');
          }}
          className="relative p-1.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 text-zinc-300 hover:text-white transition-all active:scale-95"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-slate-950 font-black rounded-full text-[8px] flex items-center justify-center ring-2 ring-[#171717] animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
