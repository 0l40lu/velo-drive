import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Camera,
  Upload,
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  Sparkles,
  MapPin,
  Car,
  DollarSign,
  Plus
} from 'lucide-react';

export const AddVehicleWizardModal: React.FC = () => {
  const { closeModal, createVehicle, currentUser, showToast, triggerHaptic, currency, formatCurrency } = useApp();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [make, setMake] = useState('Mercedes-Benz');
  const [model, setModel] = useState('C300 4MATIC');
  const [year, setYear] = useState(2023);
  const [category, setCategory] = useState<'SUV' | 'Sedan' | 'Electric' | 'Sports' | 'Luxury'>('Sedan');
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [seats, setSeats] = useState(5);
  const [fuelType, setFuelType] = useState<'Gasoline' | 'Electric' | 'Hybrid'>('Gasoline');

  // Step 2
  const [dailyPrice, setDailyPrice] = useState(115);
  const [city, setCity] = useState('Los Angeles');
  const [address, setAddress] = useState('900 Wilshire Blvd, Downtown');
  const [neighborhood, setNeighborhood] = useState('Financial District');
  const [description, setDescription] = useState('Pristine luxury sedan equipped with AMG styling package, Burmester sound, and heated leather seating.');

  // Step 3 (Photos)
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=80'
  ]);

  // Step 4 (Compliance)
  const [vin, setVin] = useState('WDDWF8DB6PR481920');
  const [regNumber, setRegNumber] = useState('CAL-9MBZ300');
  const [insuranceProvider, setInsuranceProvider] = useState('Allstate Commercial Fleet');
  const [complianceCountry, setComplianceCountry] = useState('United States (DOT & FMVSS)');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      triggerHaptic('light');
      const newUrl = URL.createObjectURL(files[0]);
      setPhotos(prev => [newUrl, ...prev]);
      showToast('Photo Added', 'High-resolution vehicle photo attached.', 'success');
    }
  };

  const handleFinish = async () => {
    triggerHaptic('medium');
    setIsSubmitting(true);

    try {
      await createVehicle({
        make,
        model,
        year: Number(year),
        category: category as any,
        transmission,
        seats: Number(seats),
        fuelType: fuelType as any,
        dailyPrice: Number(dailyPrice),
        location: {
          city,
          state: 'CA',
          address,
          neighborhood,
          lat: 34.05,
          lng: -118.25
        },
        photos,
        description,
        rules: [
          'No smoking or vaping ($250 cleaning fee)',
          'Return with full tank of fuel',
          'Pets must be in a carrier'
        ],
        verificationDocs: {
          vin,
          registrationNumber: regNumber,
          insuranceProvider,
          insuranceExpiry: '2027-04-15',
          inspectionStatus: 'passed'
        },
        isInstantBook: true
      });

      closeModal();
    } catch (err) {
      showToast('Listing Failed', 'Could not create vehicle listing.', 'error');
    } finally {
      setIsSubmitting(false);
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
            List Your Vehicle
          </h2>
          <span className="text-[10px] text-emerald-400 font-semibold">
            Step {step} of 4
          </span>
        </div>
        <div className="w-7 h-7" />
      </div>

      {/* Body per step */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-24">
        {step === 1 && (
          /* Step 1: Specs */
          <div className="space-y-3.5">
            <div>
              <h3 className="text-sm font-extrabold text-white">Vehicle Specifications</h3>
              <p className="text-xs text-slate-400">Enter accurate details for vehicle title and insurance</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Make</label>
                <input
                  type="text"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Electric">Electric</option>
                  <option value="Sports">Sports</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Seats</label>
                <select
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={7}>7</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Fuel / Power</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="Gasoline">Gasoline</option>
                  <option value="Electric">Electric (EV)</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          /* Step 2: Pricing & Location */
          <div className="space-y-3.5">
            <div>
              <h3 className="text-sm font-extrabold text-white">Pricing & Pickup Address</h3>
              <p className="text-xs text-slate-400">Set your daily rental price and pickup location</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <label className="text-xs font-bold text-white block">Daily Rental Rate ({currency.code})</label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-white">{currency.symbol}</span>
                <input
                  type="number"
                  value={dailyPrice}
                  onChange={(e) => setDailyPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xl font-extrabold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="text-[11px] text-emerald-400">
                You receive ~{formatCurrency(dailyPrice * 0.88)}/day after platform fee & roadside insurance.
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Pickup City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Street Address / Hand-off Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Neighborhood</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Description for Guests</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          /* Step 3: Photos */
          <div className="space-y-3.5">
            <div>
              <h3 className="text-sm font-extrabold text-white">Vehicle Photos</h3>
              <p className="text-xs text-slate-400">High-quality photos increase booking conversions by 3.5x</p>
            </div>

            {/* Photo Uploader Card */}
            <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-900/50 transition-all active:scale-[0.99]">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-white">Take Photo or Upload from Gallery</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Supports JPG, PNG, HEIC up to 15MB</div>
            </label>

            {/* Photos Preview Grid */}
            <div className="grid grid-cols-2 gap-2">
              {photos.map((p, idx) => (
                <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img src={p} alt="Vehicle photo" className="w-full h-full object-cover" />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] text-white font-mono">
                    {idx === 0 ? 'Cover Photo' : `#${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          /* Step 4: Verification & Compliance Docs */
          <div className="space-y-3.5">
            <div>
              <h3 className="text-sm font-extrabold text-white">Safety & Vehicle Compliance</h3>
              <p className="text-xs text-slate-400">Configurable legal requirements for peer-to-peer sharing</p>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Compliance Jurisdiction</label>
                <select
                  value={complianceCountry}
                  onChange={(e) => setComplianceCountry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="United States (DOT & FMVSS)">United States (DOT & FMVSS)</option>
                  <option value="United Kingdom (DVLA / MOT)">United Kingdom (DVLA / MOT)</option>
                  <option value="European Union (TUV / Periodic Inspection)">European Union (TUV / Periodic Inspection)</option>
                  <option value="Canada (Transport Canada)">Canada (Transport Canada)</option>
                  <option value="Australia (ADR & Rego)">Australia (ADR & Rego)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Vehicle Identification Number (VIN / Chassis)</label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Official License Plate / Registration #</label>
                <input
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white uppercase focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Commercial Insurance Provider</label>
                <input
                  type="text"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                <FileCheck className="w-4 h-4" />
                <span>Automated Compliance Verification</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Your VIN will be automatically checked against national theft databases and title registries. Upon approval, your vehicle is insured under our $1M umbrella policy during every trip.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 z-50">
        <div className="text-xs text-slate-400">
          Step {step} of 4
        </div>

        {step < 4 ? (
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
            onClick={handleFinish}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit Vehicle Listing</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
