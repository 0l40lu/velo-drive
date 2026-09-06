import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/mobile/MobileFrame';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';

// Renter Screens
import { ExploreScreen } from './components/renter/ExploreScreen';
import { SearchScreen } from './components/renter/SearchScreen';
import { RenterBookingsScreen } from './components/renter/RenterBookingsScreen';

// Owner Screens
import { OwnerDashboardScreen } from './components/owner/OwnerDashboardScreen';
import { OwnerVehiclesScreen } from './components/owner/OwnerVehiclesScreen';

// Shared Screens
import { MessagesScreen } from './components/chat/MessagesScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';

// Modals
import { VehicleDetailModal } from './components/renter/VehicleDetailModal';
import { BookingCheckoutModal } from './components/renter/BookingCheckoutModal';
import { AddVehicleWizardModal } from './components/owner/AddVehicleWizardModal';
import { KycWizardModal } from './components/common/KycWizardModal';
import { ChatModal } from './components/chat/ChatModal';
import { WriteReviewModal } from './components/common/WriteReviewModal';
import { NativeExportModal } from './components/export/NativeExportModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { NotificationsModal } from './components/common/NotificationsModal';
import { UserSwitcherModal } from './components/common/UserSwitcherModal';
import { OnboardingModal } from './components/common/OnboardingModal';
import { CountryCurrencyModal } from './components/common/CountryCurrencyModal';
import { AuthModal } from './components/auth/AuthModal';
import { OwnerLoginModal } from './components/auth/OwnerLoginModal';

const MainScreen: React.FC = () => {
  const { activeMode, activeTab, activeModal, openModal } = useApp();

  // Trigger sign up modal on first visit if not yet authenticated
  useEffect(() => {
    const hasAuthCompleted = localStorage.getItem('vd_auth_completed');
    if (!hasAuthCompleted) {
      openModal('auth');
    }
  }, [openModal]);

  const renderActiveScreen = () => {
    if (activeMode === 'renter') {
      switch (activeTab) {
        case 'explore':
          return <ExploreScreen />;
        case 'search':
          return <SearchScreen />;
        case 'trips':
          return <RenterBookingsScreen />;
        case 'messages':
          return <MessagesScreen />;
        case 'profile':
          return <ProfileScreen />;
        default:
          return <ExploreScreen />;
      }
    } else {
      // Owner Mode
      switch (activeTab) {
        case 'dashboard':
          return <OwnerDashboardScreen />;
        case 'vehicles':
          return <OwnerVehiclesScreen />;
        case 'messages':
          return <MessagesScreen />;
        case 'profile':
          return <ProfileScreen />;
        default:
          return <OwnerDashboardScreen />;
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden relative">
      {/* Mobile Application Header */}
      <Header />

      {/* Screen Body */}
      <div className="flex-1 w-full overflow-hidden relative">
        {renderActiveScreen()}
      </div>

      {/* Persistent Native Bottom Navigation */}
      <BottomNav />

      {/* Interactive Modal Registry */}
      {activeModal === 'vehicle_detail' && <VehicleDetailModal />}
      {activeModal === 'booking_checkout' && <BookingCheckoutModal />}
      {activeModal === 'add_vehicle' && <AddVehicleWizardModal />}
      {activeModal === 'kyc_wizard' && <KycWizardModal />}
      {activeModal === 'chat' && <ChatModal />}
      {activeModal === 'write_review' && <WriteReviewModal />}
      {activeModal === 'export_mobile' && <NativeExportModal />}
      {(activeModal === 'admin' || activeModal === 'admin_dashboard') && <AdminDashboardModal />}
      {activeModal === 'notifications' && <NotificationsModal />}
      {activeModal === 'user_switcher' && <UserSwitcherModal />}
      {activeModal === 'country_currency' && <CountryCurrencyModal />}
      {activeModal === 'onboarding' && <OnboardingModal />}
      {(activeModal === 'auth' || activeModal === 'signup') && <AuthModal />}
      {activeModal === 'owner_login' && <OwnerLoginModal />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MobileFrame>
        <MainScreen />
      </MobileFrame>
    </AppProvider>
  );
}
