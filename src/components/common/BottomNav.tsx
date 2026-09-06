import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Search,
  Calendar,
  MessageSquare,
  User,
  LayoutDashboard,
  Car,
  KeyRound
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeMode,
    activeTab,
    setActiveTab,
    bookings,
    currentUser,
    messages,
    triggerHaptic
  } = useApp();

  // Active bookings count for renter
  const activeTripsCount = bookings.filter(
    b => b.renterId === currentUser.id && (b.status === 'active' || b.status === 'confirmed')
  ).length;

  // Pending bookings count for host
  const pendingRequestsCount = bookings.filter(
    b => b.ownerId === currentUser.id && b.status === 'pending'
  ).length;

  interface TabItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | null;
  }

  const renterTabs: TabItem[] = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'trips', label: 'Trips', icon: Calendar, badge: activeTripsCount > 0 ? activeTripsCount : null },
    { id: 'messages', label: 'Inbox', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const ownerTabs: TabItem[] = [
    { id: 'dashboard', label: 'Earnings', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Garage', icon: Car },
    { id: 'messages', label: 'Inbox', icon: MessageSquare, badge: pendingRequestsCount > 0 ? pendingRequestsCount : null },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const tabs = activeMode === 'renter' ? renterTabs : ownerTabs;

  return (
    <nav className="w-full bg-[#171717] backdrop-blur-xl border-t border-[#262626] px-3 py-2 flex items-center justify-around z-20 shrink-0 select-none">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`bottom-nav-${tab.id}`}
            onClick={() => {
              triggerHaptic('light');
              setActiveTab(tab.id);
            }}
            className="flex-1 flex flex-col items-center justify-center relative group focus:outline-none transition-transform active:scale-95"
          >
            {/* Top tiny active dot matching the Bento design template */}
            <div className={`w-1 h-1 rounded-full mb-1 transition-all ${
              isActive ? 'bg-emerald-500 opacity-100 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'opacity-0'
            }`} />

            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'
                }`}
              />
              {tab.badge && (
                <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center ring-1 ring-[#171717]">
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-zinc-500 group-hover:text-zinc-300 font-medium'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
