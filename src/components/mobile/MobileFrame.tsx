import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Wifi,
  Battery,
  Signal,
  WifiOff,
  UserCheck,
  ShieldCheck,
  Download,
  AlertTriangle,
  RefreshCw,
  Maximize2,
  Lock,
  Layers,
  Fingerprint,
  CreditCard,
  Shield,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Zap,
  Sparkles
} from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const {
    deviceFrame,
    setDeviceFrame,
    networkStatus,
    setNetworkStatus,
    currentUser,
    allUsers,
    switchUser,
    activeMode,
    setActiveMode,
    setActiveTab,
    openModal,
    toast,
    clearToast,
    bookings,
    vehicles,
    triggerHaptic
  } = useApp();

  const [currentTime, setCurrentTime] = useState('9:41');
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeRentalsCount = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-start text-white font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Mobile Control Bar in Bento Styling */}
      <header className="w-full bg-[#171717]/90 backdrop-blur-md border-b border-[#262626] px-4 py-2.5 z-40 sticky top-0 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-emerald-500/20">
              V
            </div>
            <span className="font-bold tracking-tight text-white hidden sm:inline text-sm">
              Velo<span className="text-emerald-400">Drive</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold hidden md:inline">
              Bento Marketplace
            </span>
          </div>

          {/* Mode Switcher Pill */}
          <div className="bg-[#0A0A0A] p-0.5 rounded-xl border border-[#262626] flex items-center">
            <button
              id="mode-renter-toggle"
              onClick={() => {
                triggerHaptic('light');
                setActiveMode('renter');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'renter'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Renter
            </button>
            <button
              id="mode-owner-toggle"
              onClick={() => {
                triggerHaptic('light');
                setActiveMode('owner');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'owner'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Car Owner
            </button>
          </div>
        </div>

        {/* Device Switcher & Controls */}
        <div className="flex items-center space-x-2">
          {/* Persona Switcher */}
          <div className="relative">
            <button
              id="persona-switcher-button"
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/60 text-xs font-medium text-zinc-200 transition-colors"
              title="Switch user account"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-emerald-400"
              />
              <span className="hidden lg:inline max-w-[90px] truncate">{currentUser.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 font-mono uppercase font-bold">
                {currentUser.role}
              </span>
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#171717] border border-[#262626] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                  Switch Active Persona
                </div>
                <div className="space-y-1 mt-1">
                  {allUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-left transition-colors ${
                        currentUser.id === user.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold' : 'hover:bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate flex items-center justify-between">
                          <span>{user.name}</span>
                          <span className={`text-[8px] font-bold px-1 rounded uppercase ${
                            user.kycStatus === 'verified' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                          }`}>
                            {user.kycStatus}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate capitalize">
                          {user.role} • {user.country}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Device Frame Selector */}
          <div className="bg-[#0A0A0A] p-0.5 rounded-xl border border-[#262626] flex items-center">
            <button
              id="device-iphone-btn"
              onClick={() => {
                triggerHaptic('light');
                setDeviceFrame('iphone');
              }}
              className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 ${
                deviceFrame === 'iphone' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
              title="iPhone 16 Pro Frame"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">iPhone</span>
            </button>
            <button
              id="device-pixel-btn"
              onClick={() => {
                triggerHaptic('light');
                setDeviceFrame('pixel');
              }}
              className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 ${
                deviceFrame === 'pixel' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
              title="Google Pixel 9 Frame"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Pixel</span>
            </button>
            <button
              id="device-fluid-btn"
              onClick={() => {
                triggerHaptic('light');
                setDeviceFrame('fluid');
              }}
              className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 ${
                deviceFrame === 'fluid' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
              title="Fluid Viewport (Real Device Mode)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Fluid</span>
            </button>
          </div>

          {/* Network Simulator Toggle */}
          <button
            id="network-simulator-toggle"
            onClick={() => {
              if (networkStatus === 'online') setNetworkStatus('slow-3g');
              else if (networkStatus === 'slow-3g') setNetworkStatus('offline');
              else setNetworkStatus('online');
            }}
            className={`px-2 py-1.5 rounded-xl border text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              networkStatus === 'online'
                ? 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300'
                : networkStatus === 'slow-3g'
                ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                : 'bg-red-950/60 border-red-800 text-red-300'
            }`}
            title="Simulate network conditions"
          >
            {networkStatus === 'online' ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : networkStatus === 'slow-3g' ? (
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
            )}
            <span className="hidden sm:inline capitalize">{networkStatus}</span>
          </button>

          {/* Native Mobile Export Config Modal Button */}
          <button
            id="export-native-modal-btn"
            onClick={() => {
              triggerHaptic('light');
              openModal('export_mobile');
            }}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
            title="View Android Studio, Xcode, and React Native / Expo configs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Export Native</span>
          </button>
        </div>
      </header>

      {/* Network Alert Banner when degraded */}
      {networkStatus !== 'online' && (
        <div className={`w-full py-1.5 px-4 text-xs font-medium flex items-center justify-center space-x-2 text-center z-30 transition-all ${
          networkStatus === 'slow-3g' ? 'bg-amber-500/20 text-amber-300 border-b border-amber-500/30' : 'bg-red-500/20 text-red-300 border-b border-red-500/30'
        }`}>
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {networkStatus === 'slow-3g'
              ? 'Simulating Slow 3G / Cellular Degraded: Offline caching active.'
              : 'Simulating Airplane / Offline Mode: Stored local state available, changes queued.'}
          </span>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div
          onClick={clearToast}
          className={`fixed top-14 z-50 max-w-sm w-[90%] mx-auto left-0 right-0 p-3.5 rounded-2xl shadow-2xl border flex items-start space-x-3 cursor-pointer transition-all animate-in slide-in-from-top-4 duration-200 ${
            toast.type === 'error'
              ? 'bg-rose-950/95 border-rose-800 text-rose-100 shadow-rose-950/50'
              : toast.type === 'warning'
              ? 'bg-amber-950/95 border-amber-800 text-amber-100 shadow-amber-950/50'
              : toast.type === 'info'
              ? 'bg-[#171717]/95 border-zinc-700 text-zinc-100 shadow-black/80'
              : 'bg-emerald-950/95 border-emerald-800 text-emerald-100 shadow-emerald-950/50'
          }`}
        >
          <div className={`p-1.5 rounded-xl shrink-0 ${
            toast.type === 'error' ? 'bg-rose-900/50 text-rose-300' : toast.type === 'warning' ? 'bg-amber-900/50 text-amber-300' : toast.type === 'info' ? 'bg-zinc-800 text-zinc-300' : 'bg-emerald-900/50 text-emerald-300'
          }`}>
            {toast.type === 'error' || toast.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
            {toast.desc && <p className="text-[11px] opacity-80 mt-0.5 leading-snug">{toast.desc}</p>}
          </div>
        </div>
      )}

      {/* Main Canvas: Bento Grid Layout */}
      <main className="flex-1 w-full max-w-[1380px] mx-auto flex flex-col xl:flex-row items-center justify-center p-2 sm:p-4 md:p-6 xl:p-8 gap-8 overflow-x-hidden">
        
        {/* Left Column: The Mobile Device Viewport */}
        <div className="shrink-0 flex items-center justify-center">
          {deviceFrame === 'fluid' ? (
            <div className="w-full max-w-[393px] h-[844px] bg-[#0A0A0A] flex flex-col relative overflow-hidden shadow-2xl rounded-3xl border-2 border-[#262626]">
              {children}
            </div>
          ) : deviceFrame === 'iphone' ? (
            /* iPhone 16 Pro Physical Bezel Styled with Bento Zinc Frame */
            <div className="relative w-[375px] sm:w-[393px] h-[840px] sm:h-[852px] bg-[#171717] rounded-[52px] border-[12px] border-[#262626] shadow-2xl overflow-hidden shrink-0 flex flex-col">
              {/* Dynamic Island Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#262626] rounded-b-2xl z-30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-black/60 border border-zinc-700/50 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                </div>
              </div>

              {/* Physical side buttons */}
              <div className="absolute -left-[14px] top-[115px] w-[3px] h-[26px] bg-zinc-700 rounded-l-sm" />
              <div className="absolute -left-[14px] top-[160px] w-[3px] h-[50px] bg-zinc-700 rounded-l-sm" />
              <div className="absolute -left-[14px] top-[225px] w-[3px] h-[50px] bg-zinc-700 rounded-l-sm" />
              <div className="absolute -right-[14px] top-[170px] w-[3px] h-[75px] bg-zinc-700 rounded-r-sm" />

              {/* Screen Inner */}
              <div className="w-full h-full bg-[#0A0A0A] rounded-[40px] overflow-hidden flex flex-col relative">
                {/* Status Bar */}
                <div className="w-full h-10 px-7 flex items-center justify-between z-30 select-none shrink-0 bg-[#0A0A0A]/90 backdrop-blur-md pt-1">
                  <span className="text-xs font-semibold tracking-tight text-zinc-300 font-mono">
                    {currentTime}
                  </span>
                  <div className="flex items-center space-x-1.5 text-zinc-300">
                    <Signal className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>

                {/* Screen Body */}
                <div className="flex-1 overflow-hidden flex flex-col relative">
                  {children}
                </div>

                {/* iOS Home Gesture Indicator */}
                <div className="w-full h-4 flex items-center justify-center bg-[#171717] shrink-0 z-30">
                  <div className="w-32 h-1 bg-zinc-600 rounded-full" />
                </div>
              </div>
            </div>
          ) : (
            /* Google Pixel 9 Frame */
            <div className="relative w-[375px] sm:w-[392px] h-[840px] sm:h-[850px] bg-[#171717] rounded-[48px] border-[10px] border-[#262626] shadow-2xl shrink-0 flex flex-col overflow-hidden">
              {/* Screen Inner */}
              <div className="w-full h-full bg-[#0A0A0A] rounded-[38px] overflow-hidden flex flex-col relative">
                {/* Android Status Bar */}
                <div className="w-full h-10 px-6 flex items-center justify-between z-30 select-none shrink-0 bg-[#0A0A0A]/90 backdrop-blur-md">
                  <span className="text-xs font-semibold text-zinc-300 font-mono">
                    {currentTime}
                  </span>
                  <div className="w-3.5 h-3.5 rounded-full bg-black border border-zinc-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  </div>
                  <div className="flex items-center space-x-2 text-zinc-300">
                    <span className="text-[10px] font-bold text-emerald-400">5G</span>
                    <Wifi className="w-3.5 h-3.5" />
                    <Battery className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Screen Body */}
                <div className="flex-1 overflow-hidden flex flex-col relative">
                  {children}
                </div>

                {/* Android Gesture Bar */}
                <div className="w-full h-4 flex items-center justify-center bg-[#171717] shrink-0 z-30">
                  <div className="w-24 h-1 bg-zinc-600 rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Bento Grid Companion Hub (Visible on large screens, matching Design Template) */}
        <div className="hidden xl:grid flex-1 grid-cols-3 grid-rows-4 gap-4 max-w-[700px] h-[852px]">
          
          {/* Bento Tile 1: Welcome & KYC Identity */}
          <div className="col-span-2 row-span-1 bg-[#171717] rounded-3xl p-6 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">
                Security & Identity
              </span>
              <h2 className="text-2xl font-bold mb-1 text-white">Welcome back, {currentUser.name.split(' ')[0]}</h2>
              <p className="text-zinc-400 text-xs">
                {currentUser.kycStatus === 'verified'
                  ? 'Your driver KYC identity verification is 100% complete.'
                  : 'Your KYC identity verification is pending admin review.'}
              </p>
            </div>
            <button
              onClick={() => {
                triggerHaptic('light');
                openModal('kyc_wizard');
              }}
              className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full flex items-center gap-2 shrink-0 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-tight">
                {currentUser.kycStatus === 'verified' ? 'Verified Profile' : 'Review KYC'}
              </span>
            </button>
          </div>

          {/* Bento Tile 2: Owner Earnings High-Contrast Accent Card */}
          <div
            onClick={() => {
              triggerHaptic('medium');
              setActiveMode('owner');
              setActiveTab('dashboard');
            }}
            className="col-span-1 row-span-1 bg-emerald-600 hover:bg-emerald-500 transition-all rounded-3xl p-6 flex flex-col justify-between text-white cursor-pointer shadow-xl group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Owner Earnings</span>
              <TrendingUp className="w-4 h-4 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tight">$12,480.50</span>
              <span className="text-xs opacity-75 mt-0.5">+14% from last month</span>
            </div>
          </div>

          {/* Bento Tile 3: Security First Modular Panel */}
          <div className="col-span-1 row-span-2 bg-[#171717] rounded-3xl p-6 border border-zinc-800 relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-1">
                Trust Architecture
              </span>
              <h3 className="font-bold text-white text-base mb-4">Security First</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                    <Fingerprint className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">Biometric Login</p>
                    <p className="text-zinc-500">FaceID / Fingerprint Active</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">P2P Payments</p>
                    <p className="text-zinc-500">Stripe Escrow Integrated</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">Insurance Policy</p>
                    <p className="text-zinc-500">Full VeloShield Coverage</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                triggerHaptic('medium');
                openModal('admin');
              }}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold border border-zinc-700 text-zinc-200 transition-colors mt-4"
            >
              Review Safety Console
            </button>
          </div>

          {/* Bento Tile 4: Active Fleet Management with Radial Dot Grid & Chart */}
          <div className="col-span-2 row-span-2 bg-[#171717] rounded-3xl border border-zinc-800 overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:20px_20px]" />
            </div>

            <div className="p-6 relative h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">Live Telemetry</span>
                    <h3 className="font-bold text-white text-base">Active Fleet Management</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-zinc-800 rounded-full text-[10px] text-zinc-400 font-semibold">
                      Last 7 Days
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Visualizer */}
              <div className="flex-1 flex items-end gap-2 px-2 pb-2 min-h-[110px]">
                <div className="flex-1 bg-zinc-800 hover:bg-zinc-700 h-[40%] rounded-t-lg transition-all" title="Mon: 40%" />
                <div className="flex-1 bg-zinc-800 hover:bg-zinc-700 h-[65%] rounded-t-lg transition-all" title="Tue: 65%" />
                <div className="flex-1 bg-emerald-500 h-[85%] rounded-t-lg shadow-[0_0_12px_rgba(16,185,129,0.4)]" title="Wed: 85%" />
                <div className="flex-1 bg-zinc-800 hover:bg-zinc-700 h-[55%] rounded-t-lg transition-all" title="Thu: 55%" />
                <div className="flex-1 bg-emerald-500 h-[95%] rounded-t-lg shadow-[0_0_12px_rgba(16,185,129,0.4)]" title="Fri: 95%" />
                <div className="flex-1 bg-zinc-800 hover:bg-zinc-700 h-[45%] rounded-t-lg transition-all" title="Sat: 45%" />
                <div className="flex-1 bg-zinc-800 hover:bg-zinc-700 h-[30%] rounded-t-lg transition-all" title="Sun: 30%" />
              </div>

              {/* Bottom 3 Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Active Rentals</p>
                  <p className="text-xl font-bold text-white">08</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Utilization</p>
                  <p className="text-xl font-bold text-emerald-400">92%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Avg. Rating</p>
                  <p className="text-xl font-bold text-amber-400">4.98</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Tile 5: 3-Step Guided Marketplace Flow */}
          <div className="col-span-3 row-span-1 bg-zinc-800/30 rounded-3xl border border-dashed border-zinc-700 flex items-center justify-around p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-xl italic text-emerald-400">
                01
              </div>
              <div>
                <p className="text-sm font-bold text-white">Search</p>
                <p className="text-xs text-zinc-500">Hyperlocal Discovery</p>
              </div>
            </div>

            <div className="h-8 w-px bg-zinc-800" />

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-xl italic text-emerald-400">
                02
              </div>
              <div>
                <p className="text-sm font-bold text-white">Verify</p>
                <p className="text-xs text-zinc-500">Instant KYC Approval</p>
              </div>
            </div>

            <div className="h-8 w-px bg-zinc-800" />

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-xl italic text-emerald-400">
                03
              </div>
              <div>
                <p className="text-sm font-bold text-white">Drive</p>
                <p className="text-xs text-zinc-500">Secure Key Exchange</p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
