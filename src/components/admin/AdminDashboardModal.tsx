import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Users,
  Car,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  FileCheck,
  Scale,
  RefreshCw,
  Fingerprint
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const {
    closeModal,
    kycSubmissions,
    approveKYC,
    rejectKYC,
    duplicateSignals,
    clearDuplicateSignal,
    confirmDuplicateAccount,
    vehicles,
    approveVehicle,
    rejectVehicle,
    bookings,
    resolveDispute,
    allUsers,
    showToast,
    triggerHaptic,
    formatCurrency
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'fraud' | 'kyc' | 'vehicles' | 'disputes' | 'metrics'>('fraud');

  // Platform metrics
  const totalGMV = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const platformRevenue = bookings.reduce((sum, b) => sum + b.platformFee, 0);
  const pendingKycCount = kycSubmissions.filter(k => k.status === 'pending').length;
  const pendingVehiclesCount = vehicles.filter(v => !v.isVerified).length;
  const disputedBookings = bookings.filter(b => b.status === 'disputed' || b.disputeDetails?.status === 'open');

  return (
    <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="w-full bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            triggerHaptic('light');
            closeModal();
          }}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <div className="flex items-center space-x-1.5 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Trust, Safety & Ops Panel
            </h2>
          </div>
          <span className="text-[10px] text-slate-400">Moderation & Marketplace Integrity</span>
        </div>
        <div className="w-7 h-7" />
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-3 py-1.5 flex items-center space-x-1 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveAdminTab('fraud');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-1 transition-all ${
            activeAdminTab === 'fraud'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Fraud & Duplicates ({duplicateSignals.filter(s => s.status === 'flagged').length})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveAdminTab('kyc');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-1 transition-all ${
            activeAdminTab === 'kyc'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Driver KYC ({pendingKycCount})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveAdminTab('vehicles');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-1 transition-all ${
            activeAdminTab === 'vehicles'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Vehicles ({pendingVehiclesCount})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveAdminTab('disputes');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-1 transition-all ${
            activeAdminTab === 'disputes'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Disputes ({disputedBookings.length})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveAdminTab('metrics');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-1 transition-all ${
            activeAdminTab === 'metrics'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Market Metrics</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-20">
        {/* FRAUD & DUPLICATE ACCOUNTS TAB */}
        {activeAdminTab === 'fraud' && (
          <div className="space-y-3">
            <div className="bg-rose-950/30 border border-rose-500/40 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold">
                <Fingerprint className="w-4 h-4" />
                <span>Sybil & Multi-Account Prevention Engine</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Detects coordinated ban evasion, promo abuse, and identity swapping across device fingerprints, hashed driver permits, and phone similarity.
              </p>
            </div>

            {duplicateSignals.length > 0 ? (
              duplicateSignals.map(signal => (
                <div
                  key={signal.id}
                  className="bg-slate-900 border border-rose-900/60 rounded-2xl p-3.5 space-y-2.5 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase border border-rose-500/30">
                      Risk Similarity: {signal.similarityScore}%
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">{signal.status}</span>
                  </div>

                  <div className="text-xs font-bold text-white">
                    Target: <span className="text-rose-300">{signal.sourceUserName}</span> vs Prior Account: <span className="text-amber-300">{signal.matchedUserName}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                    <div className="text-slate-400 font-semibold text-[11px]">Matched Attributes:</div>
                    {signal.matchFields.map(f => (
                      <div key={f} className="text-rose-400 font-mono text-[11px]">
                        • {f.toUpperCase()}
                      </div>
                    ))}
                  </div>

                  {signal.status === 'flagged' && (
                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        onClick={() => {
                          triggerHaptic('success');
                          clearDuplicateSignal(signal.id);
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Dismiss (Legitimate User)
                      </button>
                      <button
                        onClick={() => {
                          triggerHaptic('warning');
                          confirmDuplicateAccount(signal.id, true);
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                      >
                        Confirm & Suspend
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
                No active duplicate fraud signals. All accounts cleared.
              </div>
            )}
          </div>
        )}

        {/* KYC AUDIT TAB */}
        {activeAdminTab === 'kyc' && (
          <div className="space-y-3">
            {kycSubmissions.map(sub => (
              <div
                key={sub.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white">{sub.userName} ({sub.userEmail})</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    sub.status === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : sub.status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {sub.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Doc Type:</span>
                    <span className="capitalize">{sub.documentType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Masked #:</span>
                    <span>{sub.documentNumberMasked}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Encrypted ID Hash:</span>
                    <span className="font-mono text-[10px] text-slate-400 truncate block">{sub.documentHash}</span>
                  </div>
                </div>

                {sub.status === 'pending' && (
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => {
                        triggerHaptic('success');
                        approveKYC(sub.id, sub.userId);
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center space-x-1 shadow-sm active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Driver</span>
                    </button>
                    <button
                      onClick={() => {
                        triggerHaptic('warning');
                        rejectKYC(sub.id, sub.userId, 'Blurry document scan or expired permit');
                      }}
                      className="py-1.5 px-3 rounded-xl bg-rose-950 text-rose-300 text-xs font-semibold border border-rose-800 active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* VEHICLES TAB */}
        {activeAdminTab === 'vehicles' && (
          <div className="space-y-3">
            {vehicles.map(v => (
              <div
                key={v.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3"
              >
                <img
                  src={v.photos[0]}
                  alt={v.model}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white truncate">
                      {v.year} {v.make} {v.model}
                    </h3>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      v.isVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {v.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Owner: {v.ownerName} • VIN: {v.verificationDocs.vin}
                  </div>
                  {!v.isVerified && (
                    <div className="flex items-center space-x-2 mt-1.5">
                      <button
                        onClick={() => {
                          triggerHaptic('success');
                          approveVehicle(v.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-bold shadow active:scale-95"
                      >
                        Approve Compliance
                      </button>
                      <button
                        onClick={() => {
                          triggerHaptic('warning');
                          rejectVehicle(v.id, 'Inspection document missing');
                        }}
                        className="px-2 py-1 rounded-lg bg-slate-800 text-rose-400 text-[11px] font-medium active:scale-95"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DISPUTES TAB */}
        {activeAdminTab === 'disputes' && (
          <div className="space-y-3">
            {disputedBookings.length > 0 ? (
              disputedBookings.map(bk => (
                <div
                  key={bk.id}
                  className="bg-slate-900 border border-amber-500/30 rounded-2xl p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Booking #{bk.id.slice(-6)}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                      {bk.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    "{bk.disputeDetails?.reason || 'Issue reported during trip'}"
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Renter: <strong className="text-white">{bk.renterName}</strong></span>
                    <span>Host: <strong className="text-white">{bk.ownerName}</strong></span>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => {
                        triggerHaptic('success');
                        resolveDispute(bk.id, 'resolved_renter', 'Deposit and rental partially refunded to renter.');
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
                    >
                      Refund Renter
                    </button>
                    <button
                      onClick={() => {
                        triggerHaptic('medium');
                        resolveDispute(bk.id, 'resolved_host', 'Evidence showed no vehicle fault. Payout released to host.');
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
                    >
                      Release to Host
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
                No disputes filed. 100% peaceful marketplace operations.
              </div>
            )}
          </div>
        )}

        {/* METRICS TAB */}
        {activeAdminTab === 'metrics' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Gross Merchandise Value</span>
                <div className="text-lg font-black text-white">{formatCurrency(totalGMV)}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Platform Take (12%)</span>
                <div className="text-lg font-black text-emerald-400">{formatCurrency(platformRevenue)}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Total Bookings</span>
                <div className="text-lg font-black text-white">{bookings.length} Trips</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Total Fleet Size</span>
                <div className="text-lg font-black text-white">{vehicles.length} Cars</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
