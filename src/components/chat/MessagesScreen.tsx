import React from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  MessageSquare,
  Car,
  ChevronRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

export const MessagesScreen: React.FC = () => {
  const {
    bookings,
    currentUser,
    messages,
    setActiveChatBooking,
    openModal,
    triggerHaptic
  } = useApp();

  // Find all bookings involving currentUser
  const userBookings = bookings.filter(
    b => b.renterId === currentUser.id || b.ownerId === currentUser.id
  );

  const handleOpenConversation = (booking: Booking) => {
    triggerHaptic('light');
    setActiveChatBooking(booking);
    openModal('chat');
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 space-y-4 p-4">
      {/* Header */}
      <div>
        <h1 className="text-base font-extrabold text-white tracking-tight">Messages</h1>
        <p className="text-xs text-slate-400">Direct host-renter messaging and trip updates</p>
      </div>

      {/* Conversations List */}
      <div className="space-y-2.5">
        {userBookings.length > 0 ? (
          userBookings.map(bk => {
            const isRenter = bk.renterId === currentUser.id;
            const otherName = isRenter ? bk.ownerName : bk.renterName;
            const otherAvatar = isRenter ? bk.ownerAvatar : bk.renterAvatar;

            // Get last message in this booking thread
            const threadMessages = messages.filter(m => m.bookingId === bk.id);
            const lastMsg = threadMessages[threadMessages.length - 1];

            return (
              <div
                key={bk.id}
                id={`conversation-${bk.id}`}
                onClick={() => handleOpenConversation(bk)}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 flex items-center space-x-3 cursor-pointer transition-all active:scale-[0.99] shadow-md"
              >
                {/* Other user avatar with status badge */}
                <div className="relative">
                  <img
                    src={otherAvatar}
                    alt={otherName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white truncate">
                      {otherName}
                    </h3>
                    <span className="text-[10px] text-slate-400">
                      {lastMsg ? lastMsg.timestamp : 'Active'}
                    </span>
                  </div>

                  <div className="text-[11px] text-emerald-400 font-semibold truncate mt-0.5">
                    {bk.vehicle.year} {bk.vehicle.make} {bk.vehicle.model}
                  </div>

                  <p className="text-xs text-slate-300 truncate mt-1">
                    {lastMsg ? lastMsg.text : 'Tap to start conversation'}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 px-4 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No messages yet</h3>
            <p className="text-xs text-slate-400">
              When you book a car or receive a reservation request, your conversation with the host or renter will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
