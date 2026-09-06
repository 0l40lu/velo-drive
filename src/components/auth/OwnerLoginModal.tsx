import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_COUNTRIES } from '../../utils/currency';
import {
  X,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Building,
  TrendingUp,
  DollarSign,
  Car,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Globe,
  AlertCircle,
  HelpCircle,
  Smartphone,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const OwnerLoginModal: React.FC = () => {
  const {
    closeModal,
    allUsers,
    setCurrentUser,
    setActiveMode,
    setCountry,
    signUpWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    currentCountry,
    triggerHaptic,
    showToast,
    formatCurrency
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberHost, setRememberHost] = useState(true);

  // Form states for login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Form states for register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [fleetSize, setFleetSize] = useState<'1' | '2-3' | '4+'>('1');
  const [regCountry, setRegCountry] = useState(currentCountry || 'United States');

  // Google Host quick picker
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [customGmail, setCustomGmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter host users from allUsers
  const hostUsers = allUsers.filter(u => u.role === 'owner');

  const handleHostLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your host email address');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);
    triggerHaptic('medium');

    try {
      const emailClean = loginEmail.trim().toLowerCase();
      const existingUser = allUsers.find(u => u.email.toLowerCase() === emailClean);

      if (existingUser) {
        setCurrentUser(existingUser);
        if (existingUser.country) {
          setCountry(existingUser.country);
        }
        setActiveMode('owner');
        localStorage.setItem('vd_auth_completed', 'true');
        showToast(
          `Host Portal Connected!`,
          `Welcome back, ${existingUser.name}. Your host fleet garage is ready.`,
          'success'
        );
        closeModal();
      } else {
        // Auto-register as owner if not found
        const newUser = await signUpWithEmail({
          name: emailClean.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: emailClean,
          password: loginPassword,
          role: 'owner',
          country: currentCountry
        });
        setActiveMode('owner');
        localStorage.setItem('vd_auth_completed', 'true');
        showToast(`Host Account Active!`, `Welcome to VeloDrive Host Portal, ${newUser.name}!`, 'success');
        closeModal();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to sign in to host portal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHostRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim()) {
      setErrorMessage('Please enter your full or business name');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please enter a valid business/host email');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    triggerHaptic('medium');

    try {
      const newUser = await signUpWithEmail({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        country: regCountry,
        role: 'owner'
      });

      setActiveMode('owner');
      localStorage.setItem('vd_auth_completed', 'true');
      showToast(
        'Host Account Created!',
        `Welcome ${newUser.name}! Fleet tier: ${fleetSize} vehicle(s). You can now list your cars.`,
        'success'
      );
      closeModal();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create host account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleHostAuth = async (targetEmail?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    triggerHaptic('medium');

    try {
      const emailToUse = targetEmail || customGmail.trim() || 'laoluoyelude@gmail.com';
      const user = await signUpWithGoogle({
        email: emailToUse,
        name: emailToUse.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        country: currentCountry,
        role: 'owner'
      });

      setActiveMode('owner');
      localStorage.setItem('vd_auth_completed', 'true');
      showToast('Host Portal Connected', `Logged in as Host (${user.name}) via Google`, 'success');
      closeModal();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to authenticate with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectHostSelect = (host: typeof allUsers[0]) => {
    triggerHaptic('success');
    setCurrentUser(host);
    if (host.country) {
      setCountry(host.country);
    }
    setActiveMode('owner');
    localStorage.setItem('vd_auth_completed', 'true');
    showToast('Host Portal Connected', `Active Host: ${host.name} (Superhost Fleet)`, 'success');
    closeModal();
  };

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] w-full max-w-lg mx-auto flex flex-col overflow-hidden shadow-2xl">
        {/* Header with Host Badge */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/95">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-amber-500/20">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black text-white tracking-tight">Host Portal</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Car Owners
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Fleet Management & Earnings</span>
            </div>
          </div>

          <button
            id="close-owner-login-btn"
            onClick={() => {
              triggerHaptic('light');
              closeModal();
            }}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          {/* Host Value Proposition Bento */}
          <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/30 rounded-2xl p-3.5 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Host Benefits & Protections</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                88% Direct Payout
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-[11px]">$1M Commercial Cover</div>
                  <div className="text-[9px] text-slate-400">Umbrella liability & collision</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 flex items-start space-x-2">
                <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-[11px]">Keyless Telematics</div>
                  <div className="text-[9px] text-slate-400">Remote unlock & GPS tracker</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 flex items-start space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-[11px]">Instant ACH / Debit</div>
                  <div className="text-[9px] text-slate-400">Payout within 24h of trip</div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 flex items-start space-x-2">
                <Building className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-[11px]">Multi-Car Garage</div>
                  <div className="text-[9px] text-slate-400">Manage 1 or 100+ vehicles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Selector: Login vs Register */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              id="owner-tab-login"
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Host Log In
            </button>

            <button
              id="owner-tab-register"
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register as Host
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google / Gmail Host Sign-In */}
          <div className="space-y-2">
            <button
              id="owner-google-login-btn"
              type="button"
              onClick={() => setShowGooglePicker(!showGooglePicker)}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center space-x-2.5 shadow-md active:scale-98 transition-all border border-slate-200"
            >
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
              <span>Continue with Google / Gmail as Host</span>
            </button>

            {/* Google Host Account Dropdown */}
            {showGooglePicker && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Host Google Account
                </span>

                <div
                  onClick={() => handleGoogleHostAuth('laoluoyelude@gmail.com')}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs">
                      H
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                        laoluoyelude@gmail.com
                      </div>
                      <div className="text-[10px] text-slate-400">Current AI Studio Account (Owner)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10">
                    Host Login
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 pt-1">
                  <input
                    type="email"
                    placeholder="Enter other host @gmail.com"
                    value={customGmail}
                    onChange={e => setCustomGmail(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    disabled={!customGmail.includes('@')}
                    onClick={() => handleGoogleHostAuth(customGmail)}
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs shrink-0 transition-all"
                  >
                    Enter
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider relative">
              or use host credentials
            </span>
          </div>

          {/* TAB 1: HOST LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleHostLogin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Host Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="host-email-input"
                    type="email"
                    required
                    placeholder="owner@velodrive.com or your email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Password Reset', 'Password recovery link sent to your registered host email.', 'info')}
                    className="text-[10px] text-amber-400 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="host-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Your host portal password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
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

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberHost}
                    onChange={e => setRememberHost(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400">Remember on this device</span>
                </label>
              </div>

              <button
                id="host-login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 mt-2"
              >
                <span>Access Host Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER AS HOST FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleHostRegister} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Host / Business Legal Name
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="host-reg-name"
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova or Apex Fleet LLC"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Business / Host Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="host-reg-email"
                    type="email"
                    required
                    placeholder="host@business.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Fleet Size Bento */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  How many cars do you plan to list?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1', '2-3', '4+'] as const).map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setFleetSize(size);
                      }}
                      className={`py-2 px-3 rounded-xl border text-center transition-all ${
                        fleetSize === size
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-black">{size} Car{size !== '1' ? 's' : ''}</div>
                      <div className="text-[8px] text-slate-400 uppercase">
                        {size === '1' ? 'Individual' : size === '2-3' ? 'Small Fleet' : 'Commercial'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Host Operating Country & Currency */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Host Primary Country & Payout Currency
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    id="host-reg-country"
                    value={regCountry}
                    onChange={e => setRegCountry(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white appearance-none focus:outline-none focus:border-amber-500 cursor-pointer transition-all"
                  >
                    {SUPPORTED_COUNTRIES.map(c => (
                      <option key={c.country} value={c.country}>
                        {c.flag} {c.country} — {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Create Host Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="host-reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 6 characters"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
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

              <button
                id="host-register-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 mt-2"
              >
                <span>Create Host Fleet Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick-Access Verified Host Profiles (Interactive One-Tap Switcher) */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Instant Demo Host Profiles
              </span>
              <span className="text-[10px] text-amber-400 font-semibold">1-Click Host Sign In</span>
            </div>

            <div className="space-y-1.5">
              {hostUsers.map(host => (
                <div
                  key={host.id}
                  id={`quick-host-btn-${host.id}`}
                  onClick={() => handleDirectHostSelect(host)}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img src={host.avatar} alt={host.name} className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-amber-500/40" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center space-x-1.5">
                        <span className="truncate">{host.name}</span>
                        {host.isSuperhost && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 font-semibold shrink-0">
                            SUPERHOST
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {host.email} • {host.country || 'USA'}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0 flex items-center space-x-1">
                    <span>Log In</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
