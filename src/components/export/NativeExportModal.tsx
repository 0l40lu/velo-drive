import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Smartphone,
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
  Layers,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const NativeExportModal: React.FC = () => {
  const { closeModal, showToast, triggerHaptic } = useApp();
  const [activeTab, setActiveTab] = useState<'app_json' | 'package_json' | 'eas_build' | 'arch'>('app_json');
  const [copied, setCopied] = useState(false);

  const expoConfig = `{
  "expo": {
    "name": "VeloDrive",
    "slug": "velodrive-p2p",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "scheme": "velodrive",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#020617"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.velodrive.app",
      "infoPlist": {
        "NSCameraUsageDescription": "VeloDrive requires camera access to scan driver licenses and verify return vehicle condition.",
        "NSLocationWhenInUseUsageDescription": "VeloDrive uses your location to discover nearby rental vehicles and enable contactless pickup.",
        "NSFaceIDUsageDescription": "Authenticate quickly and securely to unlock reserved vehicles."
      }
    },
    "android": {
      "package": "com.velodrive.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#020617"
      },
      "permissions": [
        "CAMERA",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "USE_BIOMETRIC",
        "USE_FINGERPRINT",
        "VIBRATE"
      ]
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow VeloDrive to access camera for vehicle check-in."
        }
      ],
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Allow VeloDrive to use Face ID for secure digital key access."
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Show available peer cars near you."
        }
      ]
    ]
  }
}`;

  const nativePackageJson = `{
  "name": "velodrive-mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "build:android": "eas build -p android --profile production",
    "build:ios": "eas build -p ios --profile production"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "expo-camera": "~15.0.13",
    "expo-location": "~17.0.1",
    "expo-local-authentication": "~14.1.1",
    "expo-haptics": "~13.0.1",
    "expo-secure-store": "~13.0.2",
    "react": "18.2.0",
    "react-native": "0.74.2",
    "react-native-reanimated": "~3.10.1",
    "react-native-gesture-handler": "~2.16.1",
    "@stripe/stripe-react-native": "0.37.2",
    "lucide-react-native": "^0.395.0"
  }
}`;

  const easInstructions = `# 1. Install Expo Application Services CLI
npm install -g eas-cli

# 2. Login to your Expo account
eas login

# 3. Configure iOS / Android credentials & keystores
eas build:configure

# 4. Run automated production build for Android (.apk or .aab for Google Play)
eas build --platform android --profile production

# 5. Run automated production build for iOS (TestFlight / App Store)
eas build --platform ios --profile production

# 6. Submit directly to Stores
eas submit --platform all`;

  const archGuide = `VeloDrive Native Mobile Architecture:
----------------------------------------
/app
  ├── (auth)
  │    ├── login.tsx            # Biometric & SMS OTP authentication
  │    └── kyc-verify.tsx       # Driver license OCR + selfie liveness
  ├── (renter)
  │    ├── (tabs)
  │    │    ├── explore.tsx     # Geo-search, map clustering, filter pills
  │    │    ├── search.tsx      # Multi-facet filters, date picker
  │    │    ├── trips.tsx       # Active bookings, digital lockbox PIN
  │    │    └── profile.tsx     # Driver stats, wallet, settings
  │    └── vehicle/[id].tsx     # Full gallery, pricing calculator, booking
  ├── (owner)
  │    ├── (tabs)
  │    │    ├── dashboard.tsx   # Fleet earnings, calendar occupancy
  │    │    └── garage.tsx      # Vehicle fleet, pricing toggles
  │    └── add-car.tsx          # VIN scan, insurance doc upload
  └── api
       └── client.ts            # Offline-first API client with retry queue`;

  const getCodeContent = () => {
    switch (activeTab) {
      case 'app_json':
        return expoConfig;
      case 'package_json':
        return nativePackageJson;
      case 'eas_build':
        return easInstructions;
      case 'arch':
        return archGuide;
    }
  };

  const handleCopy = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    showToast('Copied to Clipboard', 'Ready to paste into your Expo workspace.', 'success');
    setTimeout(() => setCopied(false), 2000);
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
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            React Native / Expo Setup
          </h2>
        </div>
        <div className="w-6" />
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-3 py-1.5 flex items-center space-x-1 shrink-0 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('app_json');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'app_json'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          app.json (Expo)
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('package_json');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'package_json'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          package.json
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('eas_build');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'eas_build'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          EAS Build (iOS & Android)
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('arch');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'arch'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Expo Directory Tree
        </button>
      </div>

      {/* Banner */}
      <div className="p-3 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] leading-snug">
            Production-ready native configuration for iOS App Store & Android Google Play Store.
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="ml-2 px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center space-x-1 shrink-0 active:scale-95 shadow"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-auto p-4 font-mono text-[11px] text-emerald-300 bg-slate-950 leading-relaxed no-scrollbar select-text">
        <pre className="whitespace-pre-wrap">{getCodeContent()}</pre>
      </div>
    </div>
  );
};
