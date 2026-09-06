import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Calendar,
  ShieldCheck,
  MessageSquare,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const {
    notifications,
    closeModal,
    markNotificationRead,
    clearAllNotifications,
    triggerHaptic
  } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'kyc':
        return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-amber-400" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-purple-400" />;
    }
  };

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
          <Bell className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Notifications ({notifications.filter(n => !n.read).length})
          </h2>
        </div>
        {notifications.length > 0 ? (
          <button
            onClick={() => {
              triggerHaptic('light');
              clearAllNotifications();
            }}
            className="text-[11px] text-slate-400 hover:text-slate-200"
          >
            Clear All
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2.5">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                triggerHaptic('light');
                markNotificationRead(notif.id);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                notif.read
                  ? 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                  : 'bg-slate-900 border-emerald-500/40 text-white shadow-lg'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold truncate">{notif.title}</h4>
                  <span className="text-[10px] text-slate-500">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {notif.body}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <CheckCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-xs font-bold text-white">All Caught Up!</div>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              You will receive push notifications when trip bookings, unlock codes, or host messages arrive.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
