import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Send,
  Camera,
  MapPin,
  KeyRound,
  ShieldCheck,
  CheckCheck,
  Sparkles
} from 'lucide-react';

export const ChatModal: React.FC = () => {
  const {
    activeChatBooking,
    closeModal,
    messages,
    sendMessage,
    currentUser,
    triggerHaptic
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!activeChatBooking) return null;

  const isRenter = activeChatBooking.renterId === currentUser.id;
  const otherName = isRenter ? activeChatBooking.ownerName : activeChatBooking.renterName;
  const otherAvatar = isRenter ? activeChatBooking.ownerAvatar : activeChatBooking.renterAvatar;

  const bookingMessages = messages.filter(m => m.bookingId === activeChatBooking.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [bookingMessages.length]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    triggerHaptic('light');
    sendMessage(activeChatBooking.id, text);
    setInputMsg('');

    // Simulate auto-reply from host if renter sent a message
    if (isRenter) {
      setTimeout(() => {
        const cannedReplies = [
          "Sounds great! The car is freshly washed and ready for you.",
          "Enjoy the ride! Feel free to text me if you have any questions about charging or Apple CarPlay.",
          "Got it, thank you for letting me know! Safe travels.",
          "Window lockbox is active with the digital code. Have an amazing trip!"
        ];
        const randomReply = cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
        sendMessage(activeChatBooking.id, randomReply);
      }, 2000);
    }
  };

  const cannedQuickActions = [
    "Where is the car parked?",
    "I've arrived at the vehicle.",
    "Unlocked with code, car is in great shape!",
    "Trip completed & parked with full fuel."
  ];

  return (
    <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Top Header */}
      <div className="w-full bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              triggerHaptic('light');
              closeModal();
            }}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            <img
              src={otherAvatar}
              alt={otherName}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500"
            />
            <div>
              <h3 className="text-xs font-bold text-white leading-none">{otherName}</h3>
              <span className="text-[10px] text-emerald-400 font-medium">Online • Responds in &lt;5m</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-mono">
          #{activeChatBooking.id.slice(-6)}
        </div>
      </div>

      {/* Mini Trip Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <img
            src={activeChatBooking.vehicle.photo}
            alt="Car"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div>
            <div className="font-bold text-white text-[11px] truncate max-w-[170px]">
              {activeChatBooking.vehicle.year} {activeChatBooking.vehicle.make} {activeChatBooking.vehicle.model}
            </div>
            <div className="text-[10px] text-slate-400">
              {activeChatBooking.startDate} to {activeChatBooking.endDate}
            </div>
          </div>
        </div>

        {activeChatBooking.unlockCode && (
          <div className="bg-emerald-950/60 border border-emerald-500/40 px-2 py-1 rounded-lg text-right">
            <div className="text-[9px] text-emerald-400 font-bold uppercase">Key Code</div>
            <div className="font-mono text-xs font-black text-white">{activeChatBooking.unlockCode}</div>
          </div>
        )}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {bookingMessages.map(m => {
          const isMe = m.senderId === currentUser.id;
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                  isMe
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-br-none'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
                <div
                  className={`text-[9px] mt-1 flex items-center justify-end space-x-1 ${
                    isMe ? 'text-slate-900/70' : 'text-slate-500'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-slate-900" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestion Chips */}
      <div className="px-3 py-1 bg-slate-950 border-t border-slate-900 overflow-x-auto no-scrollbar flex items-center space-x-1.5">
        {cannedQuickActions.map(chip => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium whitespace-nowrap hover:border-emerald-500/50 active:scale-95 transition-all"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex items-center space-x-2">
        <button
          onClick={() => {
            triggerHaptic('light');
            handleSend("Attached photo: Vehicle condition verified at pickup.");
          }}
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-emerald-400 active:scale-95 transition-all"
        >
          <Camera className="w-4 h-4" />
        </button>

        <input
          id="chat-message-input"
          type="text"
          placeholder={`Message ${otherName}...`}
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
        />

        <button
          id="send-chat-message-btn"
          onClick={() => handleSend()}
          disabled={!inputMsg.trim()}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold active:scale-95 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
