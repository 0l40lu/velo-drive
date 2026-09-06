import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_COUNTRIES } from '../../utils/currency';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  Globe,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  Car,
  KeyRound,
  AlertCircle
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    openModal,
    closeModal,
    signUpWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    allUsers,
    currentCountry,
    setCountry,
    triggerHaptic,
    showToast
  } = useApp();

  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'renter' | 'owner'>('renter');

  // Google quick picker state
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [customGmail, setCustomGmail] = useState('');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCountryName, setSelectedCountryName] = useState(currentCountry || 'United States');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedCountryObj = SUPPORTED_COUNTRIES.find(c => c.country === selectedCountryName) || SUPPORTED_COUNTRIES[0];

  const handleGoogleAuth = async (targetEmail?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    triggerHaptic('medium');

    try {
      const emailToUse = targetEmail || customGmail.trim() || 'laoluoyelude@gmail.com';
      await signUpWithGoogle({
        email: emailToUse,
        name: emailToUse.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        country: selectedCountryName,
        role: selectedRole
      });
      localStorage.setItem('vd_auth_completed', 'true');
      closeModal();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to authenticate with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authMode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters');
        return;
      }
      if (!agreedTerms) {
        setErrorMessage('Please agree to the Terms of Service to continue');
        return;
      }

      setIsLoading(true);
      triggerHaptic('medium');
      try {
        await signUpWithEmail({
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          country: selectedCountryName,
          role: selectedRole
        });
        localStorage.setItem('vd_auth_completed', 'true');
        closeModal();
      } catch (err: any) {
        setErrorMessage(err?.message || 'Failed to create account');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Login mode
      if (!email.trim()) {
        setErrorMessage('Please enter your email');
        return;
      }

      setIsLoading(true);
      triggerHaptic('light');
      try {
        const success = await signInWithEmail(email.trim().toLowerCase());
        if (success) {
          localStorage.setItem('vd_auth_completed', 'true');
          closeModal();
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Failed to sign in');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGuestExplore = () => {
    triggerHaptic('light');
    localStorage.setItem('vd_auth_completed', 'true');
    closeModal();
    showToast('Browsing as Guest', 'Explore verified vehicles. Sign in when you are ready to book.', 'info');
  };

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] w-full max-w-lg mx-auto flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-emerald-500/20">
              V
            </div>
            <div>
              <span className="text-xs font-black text-white tracking-tight block">VeloDrive</span>
              <span className="text-[10px] text-slate-400">P2P Car Marketplace</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleGuestExplore}
              className="text-[11px] text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={() => {
                triggerHaptic('light');
                closeModal();
              }}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          {/* Headline */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-black text-white tracking-tight">
              {authMode === 'signup' ? 'Create your Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {authMode === 'signup'
                ? 'Sign up with Gmail or email to unlock verified peer-to-peer vehicles worldwide.'
                : 'Sign in to access your bookings, trips, and saved cars.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setAuthMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                authMode === 'signup'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setAuthMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                authMode === 'login'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Log In
            </button>
          </div>

          {/* Car Owner / Fleet Host Portal Callout */}
          <button
            id="auth-switch-to-owner-login"
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              closeModal();
              openModal('owner_login');
            }}
            className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 hover:border-amber-500/60 flex items-center justify-between text-left group transition-all"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs">
                <KeyRound className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  Are you a Car Owner or Fleet Host?
                </div>
                <div className="text-[10px] text-slate-400">
                  Access dedicated Owner Login & Fleet Manager →
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
              Host Portal
            </span>
          </button>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google / Gmail Button Section */}
          <div className="space-y-2">
            <button
              id="signup-with-google-btn"
              type="button"
              onClick={() => setShowGooglePicker(!showGooglePicker)}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center space-x-2.5 shadow-md active:scale-98 transition-all border border-slate-200"
            >
              {/* Google Colored G Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google / Gmail</span>
            </button>

            {/* Google Account Selector Popdown */}
            {showGooglePicker && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Google / Gmail Account
                </span>

                {/* Preset Fast Selection */}
                <div
                  onClick={() => handleGoogleAuth('laoluoyelude@gmail.com')}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      L
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                        laoluoyelude@gmail.com
                      </div>
                      <div className="text-[10px] text-slate-400">Current AI Studio Account</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                    One-Tap
                  </span>
                </div>

                {/* Custom Gmail Input */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="email"
                      placeholder="Or enter any @gmail.com address"
                      value={customGmail}
                      onChange={e => setCustomGmail(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      disabled={!customGmail.includes('@')}
                      onClick={() => handleGoogleAuth(customGmail)}
                      className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs shrink-0 transition-all"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider relative">
              or use email
            </span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {authMode === 'signup' && (
              <>
                {/* Role Picker Bento */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    I want to
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedRole('renter');
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                        selectedRole === 'renter'
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Car className={`w-4 h-4 ${selectedRole === 'renter' ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <div>
                        <div className="text-xs font-bold">Rent Cars</div>
                        <div className="text-[9px] text-slate-400">Driver</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedRole('owner');
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                        selectedRole === 'owner'
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <KeyRound className={`w-4 h-4 ${selectedRole === 'owner' ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <div>
                        <div className="text-xs font-bold">List Cars</div>
                        <div className="text-[9px] text-slate-400">Car Host</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-name-input"
                      type="text"
                      required
                      placeholder="e.g. Alex Vance"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-email-input"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Country & Currency Selection (during Sign Up) */}
            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Country & Local Currency</span>
                  <span className="text-emerald-400 lowercase font-normal">
                    {selectedCountryObj.code} ({selectedCountryObj.symbol})
                  </span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    id="signup-country-select"
                    value={selectedCountryName}
                    onChange={e => {
                      setSelectedCountryName(e.target.value);
                      setCountry(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer transition-all"
                  >
                    {SUPPORTED_COUNTRIES.map(c => (
                      <option key={c.country} value={c.country}>
                        {c.flag} {c.country} — {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Terms checkbox */}
            {authMode === 'signup' && (
              <label className="flex items-start space-x-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={e => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 leading-tight">
                  I agree to VeloDrive's <strong className="text-slate-300">Terms of Service</strong>, driver liability policies, and fraud prevention terms.
                </span>
              </label>
            )}

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <span>{authMode === 'signup' ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher (Helps test different roles easily) */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">
              Or test with a pre-configured profile
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {allUsers.slice(0, 4).map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={async () => {
                    triggerHaptic('light');
                    await signInWithEmail(u.email);
                    localStorage.setItem('vd_auth_completed', 'true');
                    closeModal();
                  }}
                  className="p-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 text-left flex items-center space-x-2 transition-all"
                >
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-white truncate">{u.name}</div>
                    <div className="text-[9px] text-slate-400 capitalize">{u.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
