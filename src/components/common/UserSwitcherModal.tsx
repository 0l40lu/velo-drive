import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  Check,
  Smartphone,
  Fingerprint,
  UserPlus
} from 'lucide-react';

export const UserSwitcherModal: React.FC = () => {
  const {
    allUsers,
    currentUser,
    switchUser,
    openModal,
    closeModal,
    triggerHaptic
  } = useApp();

  return (
    <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col animate-in slide-in-from-bottom duration-300 select-none">
      {/* Header */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            triggerHaptic('light');
            closeModal();
          }}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center space-x-1.5">
          <Users className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Switch Test Persona
          </h2>
        </div>
        <div className="w-6" />
      </div>

      <div className="p-4 bg-slate-900/40 border-b border-slate-800/80">
        <p className="text-[11px] text-slate-300 leading-snug">
          Switch between verified renters, top-rated hosts, unverified applicants, and marketplace admins to test multi-role features.
        </p>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2.5">
        {allUsers.map(user => {
          const isSelected = user.id === currentUser.id;
          return (
            <div
              key={user.id}
              onClick={() => {
                triggerHaptic('medium');
                switchUser(user.id);
                closeModal();
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                  : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                />
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-white truncate">{user.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      user.kycStatus === 'verified'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {user.kycStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 capitalize">
                    {user.role} • {user.country}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center space-x-1">
                    <Fingerprint className="w-3 h-3 text-slate-600" />
                    <span className="truncate max-w-[170px]">{user.email}</span>
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        <button
          id="user-switcher-signup-btn"
          onClick={() => {
            triggerHaptic('medium');
            closeModal();
            openModal('auth');
          }}
          className="w-full py-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center justify-center space-x-2 transition-all mt-2 active:scale-98"
        >
          <UserPlus className="w-4 h-4" />
          <span>Sign Up with Gmail or Email</span>
        </button>
      </div>
    </div>
  );
};
