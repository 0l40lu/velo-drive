import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  User,
  Star,
  Phone,
  Mail,
  CreditCard,
  Bell,
  Lock,
  LifeBuoy,
  LogOut,
  ChevronRight,
  Sparkles,
  Smartphone,
  Fingerprint,
  RotateCcw,
  ArrowLeftRight,
  Globe,
  Settings,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  KeyRound
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchUser,
    activeMode,
    setActiveMode,
    openModal,
    showToast,
    triggerHaptic,
    currentCountry,
    currency
  } = useApp();

  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSwitchPersona = (userId: string) => {
    triggerHaptic('medium');
    switchUser(userId);
  };

  const handleToggleBiometrics = () => {
    triggerHaptic('light');
    setBiometricsEnabled(!biometricsEnabled);
    showToast(
      biometricsEnabled ? 'Biometrics Disabled' : 'Biometrics Activated',
      biometricsEnabled ? 'FaceID / Fingerprint turned off.' : 'FaceID / Fingerprint security bound to device.',
      'info'
    );
  };

  const handleToggleNotifications = () => {
    triggerHaptic('light');
    setNotificationsEnabled(!notificationsEnabled);
    showToast(
      notificationsEnabled ? 'Notifications Muted' : 'Notifications Enabled',
      notificationsEnabled ? 'Push and SMS booking notifications muted.' : 'Instant booking and message alerts active.',
      'info'
    );
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 space-y-4 p-4">
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center space-x-3.5">
          <div className="relative shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/60"
            />
            {currentUser.kycStatus === 'verified' && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center ring-2 ring-slate-900 shadow">
                <ShieldCheck className="w-3 h-3" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-white truncate">{currentUser.name}</h2>
              {currentUser.isSuperhost && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-semibold shrink-0">
                  SUPERHOST
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-0.5 truncate">
              <Mail className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs mt-1">
              <span className="flex items-center space-x-1 text-amber-400 font-bold">
                <Star className="w-3 h-3 fill-current" />
                <span>{currentUser.rating}</span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-medium">{currentUser.totalTrips} trips</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-medium">{currentUser.country || currentCountry}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Mode Switch & Sign Up / Log In */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            id="profile-mode-switch-btn"
            onClick={() => {
              triggerHaptic('light');
              setActiveMode(activeMode === 'renter' ? 'owner' : 'renter');
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-700 active:scale-95 transition-all shadow"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Switch to {activeMode === 'renter' ? 'Host Mode' : 'Renter Mode'}</span>
          </button>

          <button
            id="profile-signup-btn"
            onClick={() => {
              triggerHaptic('medium');
              openModal('auth');
            }}
            className="py-2 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center space-x-1.5 border border-emerald-500/30 active:scale-95 transition-all shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            id="profile-owner-login-btn"
            onClick={() => {
              triggerHaptic('medium');
              openModal('owner_login');
            }}
            className="py-2 px-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center space-x-1.5 border border-amber-500/30 active:scale-95 transition-all shrink-0"
            title="Open Owner Login & Host Fleet Manager"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Host Portal</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DEDICATED SETTINGS SECTION (KYC, CURRENCY & PREFERENCES) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 px-1">
          <Settings className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-black text-white uppercase tracking-wider">
            Settings & Verification
          </h3>
        </div>

        {/* Bento Grid Settings Container */}
        <div className="grid grid-cols-1 gap-3">
          {/* 1. KYC Identity Verification Card */}
          <div
            id="settings-kyc-card"
            className={`rounded-2xl p-4 border transition-all ${
              currentUser.kycStatus === 'verified'
                ? 'bg-gradient-to-br from-slate-900 to-emerald-950/20 border-emerald-500/30 shadow-lg'
                : currentUser.kycStatus === 'pending'
                ? 'bg-slate-900 border-amber-500/30'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  currentUser.kycStatus === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : currentUser.kycStatus === 'pending'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {currentUser.kycStatus === 'verified' ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : currentUser.kycStatus === 'pending' ? (
                    <Shield className="w-5 h-5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">Driver Identity (KYC)</h4>
                  <p className="text-[10px] text-slate-400">Government ID & Biometric Verification</p>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                currentUser.kycStatus === 'verified'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : currentUser.kycStatus === 'flagged'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : currentUser.kycStatus === 'pending'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {currentUser.kycStatus === 'verified' ? '✓ Verified' : currentUser.kycStatus}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
              {currentUser.kycStatus === 'verified'
                ? 'Your driver license and biometric liveness are fully verified. You have instant keyless access to all peer vehicles with $1M umbrella insurance.'
                : 'Driver license verification is required before reserving or unlocking peer-to-peer vehicles on VeloDrive.'}
            </p>

            {/* Perks / Attributes List */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[10px]">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>$1,000,000 Liability Cover</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Instant Digital Key Unlock</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero-Security Deposit Perks</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>One-Person=One-Account Fraud Shield</span>
              </div>
            </div>

            <button
              id="settings-kyc-action-btn"
              onClick={() => {
                triggerHaptic('medium');
                openModal('kyc_wizard');
              }}
              className={`w-full mt-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 ${
                currentUser.kycStatus === 'verified'
                  ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <span>{currentUser.kycStatus === 'verified' ? 'View / Update Verification Documents' : 'Complete 1-Minute Verification'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Country & Currency Settings Card */}
          <div
            id="settings-currency-card"
            onClick={() => {
              triggerHaptic('light');
              openModal('country_currency');
            }}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                    Country & Marketplace Currency
                  </h4>
                  <p className="text-[10px] text-slate-400">Localized pricing, exchange rates, and taxes</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full text-emerald-400 text-xs font-extrabold shadow-sm">
                <span>{currency.flag}</span>
                <span>{currency.code} ({currency.symbol})</span>
              </div>
            </div>

            {/* Current Region Details */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Region</span>
                <div className="text-white font-bold flex items-center space-x-1.5">
                  <span>{currency.flag}</span>
                  <span>{currentCountry}</span>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Exchange Rate</span>
                <div className="text-emerald-400 font-mono font-bold text-xs">
                  {currency.exchangeRate === 1.0 ? '1.00 USD (Base)' : `1 USD = ${currency.exchangeRate} ${currency.code}`}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-[11px] text-slate-400">All vehicle daily rates and deposits update live</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                <span>Change Currency</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* 3. Security, Preferences & Hotline Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 text-xs text-slate-300 overflow-hidden">
            {/* Biometric 2FA Toggle */}
            <div
              onClick={handleToggleBiometrics}
              className="p-3.5 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-semibold text-white block">Biometric FaceID / TouchID</span>
                  <span className="text-[10px] text-slate-400">Device cryptographic authentication</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                biometricsEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {biometricsEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>

            {/* Notifications Toggle */}
            <div
              onClick={handleToggleNotifications}
              className="p-3.5 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <Bell className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="font-semibold text-white block">Push & SMS Trip Alerts</span>
                  <span className="text-[10px] text-slate-400">Booking confirmations & host messages</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                notificationsEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {notificationsEnabled ? 'Active' : 'Muted'}
              </span>
            </div>

            {/* Payment & Payout Methods */}
            <div
              onClick={() => {
                triggerHaptic('light');
                showToast('Payment Methods', 'Apple Pay, Google Pay, and Visa •••• 4242 linked.', 'info');
              }}
              className="p-3.5 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="font-semibold text-white block">Payment & Payout Methods</span>
                  <span className="text-[10px] text-slate-400">Instant host bank transfers & renter cards</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>

            {/* Admin Trust, KYC & Fraud Panel */}
            <div
              id="settings-admin-panel-btn"
              onClick={() => {
                triggerHaptic('light');
                openModal('admin_dashboard');
              }}
              className="p-3.5 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors text-purple-400 font-semibold"
            >
              <div className="flex items-center space-x-2.5">
                <Lock className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="block text-white">Trust, KYC & Fraud Moderation Panel</span>
                  <span className="text-[10px] text-purple-300/80">Manage duplicate flags, review KYC, resolve disputes</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-400" />
            </div>

            {/* 24/7 Roadside Hotline */}
            <div
              onClick={() => {
                triggerHaptic('light');
                showToast('24/7 Roadside Hotline', 'Emergency dispatch connected: 1-800-VELO-911', 'info');
              }}
              className="p-3.5 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors text-amber-400"
            >
              <div className="flex items-center space-x-2.5">
                <LifeBuoy className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-semibold block text-white">24/7 Roadside Assistance & Claims</span>
                  <span className="text-[10px] text-amber-400/80">Towing, flat tire, lockout support worldwide</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PERSONA & ACCOUNT SWITCHER (For Testing Multiple States) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              Test Accounts & Personas
            </span>
            <span className="text-[10px] text-slate-400">
              Test different verified, host, and multi-country profiles
            </span>
          </div>

          <button
            onClick={() => {
              triggerHaptic('medium');
              openModal('auth');
            }}
            className="px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center space-x-1 transition-all"
          >
            <UserPlus className="w-3 h-3" />
            <span>+ New Account</span>
          </button>
        </div>

        <div className="space-y-1.5">
          {allUsers.map(u => (
            <div
              key={u.id}
              onClick={() => handleSwitchPersona(u.id)}
              className={`p-2.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                currentUser.id === u.id
                  ? 'bg-emerald-950/40 border border-emerald-500/50 shadow-md'
                  : 'bg-slate-950/60 border border-slate-800/80 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{u.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    <span className="text-emerald-400 font-medium">{u.country || 'United States'}</span> • <span className="capitalize">{u.role}</span> • <span className="capitalize">{u.kycStatus}</span>
                  </div>
                </div>
              </div>
              {currentUser.id === u.id && (
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                  Active
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
