import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ShieldCheck,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Lock,
  UserCheck,
  FileText,
  Fingerprint
} from 'lucide-react';

export const KycWizardModal: React.FC = () => {
  const { closeModal, submitKYC, currentUser, showToast, triggerHaptic } = useApp();

  const [step, setStep] = useState(1);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('DL-90821-CA');
  const [licenseState, setLicenseState] = useState('CA');
  const [licenseExpiry, setLicenseExpiry] = useState('2028-11-20');
  const [dob, setDob] = useState('1994-06-15');
  const [livenessCaptured, setLivenessCaptured] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Verification document previews
  const [licenseFrontPreview, setLicenseFrontPreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
  );
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const handleSendOtp = () => {
    triggerHaptic('light');
    setIsOtpSent(true);
    showToast('SMS Sent', `Verification code sent to ${currentUser.phone} (Code: 7392)`, 'info');
    setPhoneOtp('7392');
  };

  const handleCaptureLiveness = () => {
    triggerHaptic('medium');
    setSelfiePreview('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80');
    setLivenessCaptured(true);
    showToast('Biometric Match 99.4%', 'Facial geometry matched driver license photo.', 'success');
  };

  const handleFinalSubmit = async () => {
    triggerHaptic('medium');
    setIsProcessing(true);

    try {
      await submitKYC({
        docType: 'drivers_license',
        docNumber: licenseNumber,
        frontPhoto: licenseFrontPreview || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
        selfie: selfiePreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
      });

      closeModal();
    } catch (err: any) {
      showToast('Verification Notice', err.message || 'Verification could not be processed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="w-full bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            triggerHaptic('light');
            if (step > 1) setStep(step - 1);
            else closeModal();
          }}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Identity & Driver KYC
          </h2>
          <span className="text-[10px] text-emerald-400 font-semibold">
            Step {step} of 3
          </span>
        </div>
        <div className="w-7 h-7" />
      </div>

      {/* Steps Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-24">
        {step === 1 && (
          /* Step 1: Phone & Driver License Data */
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-white">Driver License & Eligibility</h3>
              <p className="text-xs text-slate-400">All drivers must be at least 21 years of age with a valid permit</p>
            </div>

            {/* Phone Confirmation */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Phone Verification</span>
                </span>
                {currentUser.isPhoneVerified && (
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  disabled
                  value={currentUser.phone}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-300"
                />
                {!currentUser.isPhoneVerified && (
                  <button
                    onClick={handleSendOtp}
                    className="px-3 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl active:scale-95"
                  >
                    Send OTP
                  </button>
                )}
              </div>

              {isOtpSent && !currentUser.isPhoneVerified && (
                <div className="pt-2 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Enter 4-digit code"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    className="bg-slate-950 border border-emerald-500 rounded-xl p-2 text-xs text-white text-center font-mono w-32"
                  />
                  <span className="text-[11px] text-emerald-400 font-medium">Auto-filled: 7392</span>
                </div>
              )}
            </div>

            {/* Driver License Fields */}
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Date of Birth (Minimum 21)</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-1">Driver License Number</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">State / Region</label>
                  <input
                    type="text"
                    value={licenseState}
                    onChange={(e) => setLicenseState(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white uppercase focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">License Expiry Date</label>
                <input
                  type="date"
                  value={licenseExpiry}
                  onChange={(e) => setLicenseExpiry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          /* Step 2: Driver's License Document Scan */
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-white">Driver's License Photo Scan</h3>
              <p className="text-xs text-slate-400">Position the front of your physical card within the frame</p>
            </div>

            {/* License Photo Box */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500/50 p-2 flex flex-col items-center justify-center">
              {licenseFrontPreview ? (
                <img
                  src={licenseFrontPreview}
                  alt="Driver license front"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center p-4">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-xs text-slate-300 font-bold block">Front of Driver License</span>
                  <span className="text-[10px] text-slate-500">Ensure all 4 corners and barcode are visible</span>
                </div>
              )}

              <div className="absolute bottom-2.5 right-2.5">
                <label className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white text-[11px] font-semibold cursor-pointer shadow-md flex items-center space-x-1">
                  <Upload className="w-3 h-3 text-emerald-400" />
                  <span>Replace Scan</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setLicenseFrontPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-slate-300">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-snug text-[11px]">
                Your license photo is encrypted at rest using AES-256 and only verified for DMV driving infractions and fraud checks.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          /* Step 3: Biometric Liveness Check */
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-white">Biometric Liveness Verification</h3>
              <p className="text-xs text-slate-400">Match your face against your government driver's license</p>
            </div>

            {/* Selfie / Liveness simulation */}
            <div className="relative aspect-square max-w-[260px] mx-auto rounded-full overflow-hidden border-4 border-emerald-500/60 bg-slate-900 flex items-center justify-center shadow-2xl">
              {selfiePreview ? (
                <img
                  src={selfiePreview}
                  alt="Selfie"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Fingerprint className="w-12 h-12 text-emerald-400 mx-auto animate-pulse" />
                  <span className="text-xs font-bold text-white block">Face Centered</span>
                  <span className="text-[10px] text-slate-400 block">Look directly at camera and blink</span>
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                type="button"
                id="capture-liveness-btn"
                onClick={handleCaptureLiveness}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 active:scale-95 transition-all inline-flex items-center space-x-2"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>{livenessCaptured ? 'Retake Selfie Scan' : 'Capture Liveness Selfie'}</span>
              </button>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Automated Anti-Fraud Detection</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Our platform cross-references device fingerprinting, biometric hashing, and duplicate account signals to safeguard peer-to-peer car owners.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Next/Submit Button */}
      <div className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 z-50">
        <div className="text-xs text-slate-400">
          Step {step} of 3
        </div>

        {step < 3 ? (
          <button
            onClick={() => {
              triggerHaptic('light');
              setStep(step + 1);
            }}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Continue
          </button>
        ) : (
          <button
            id="submit-kyc-final-btn"
            onClick={handleFinalSubmit}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying DMV...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Submit & Verify Driver</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
