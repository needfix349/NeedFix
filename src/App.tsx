import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { CustomerHome } from './components/customer/CustomerHome';
import { TechnicianDashboard } from './components/technician/TechnicianDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { UnifiedAuthModal } from './components/auth/UnifiedAuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { TechnicianRegistrationModal } from './components/technician/TechnicianRegistrationModal';
import { TechnicianDetailModal } from './components/customer/TechnicianDetailModal';
import { ImportantNoticeModal } from './components/auth/ImportantNoticeModal';
import { SMSNotificationToast } from './components/common/SMSNotificationToast';
import { NeedFixAppIcon } from './components/common/NeedFixAppIcon';
import { Footer } from './components/layout/Footer';
import { HelpSupportModal } from './components/common/HelpSupportModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';

import {
  UserProfile,
  TechnicianProfile,
  ServiceLead,
  UserLocation,
} from './types';
import { storageService } from './services/storage';
import { otpService } from './services/otpService';
import { supabase } from './services/supabaseClient';
import { supabaseService } from './services/supabaseService';
import { MAJOR_CITIES, ALL_INDIAN_STATES, UNION_TERRITORIES, DEFAULT_USER_LOCATION } from './services/locationService';

export default function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    storageService.getCurrentUser()
  );
  const [guestLocation, setGuestLocation] = useState<UserLocation>(() =>
    storageService.getGuestLocation() || DEFAULT_USER_LOCATION
  );
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>(() =>
    storageService.getTechnicians()
  );
  const [activeView, setActiveView] = useState<
    'home' | 'technician_dashboard' | 'admin_panel'
  >('home');
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavorites());

  // Modals & State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState<string | undefined>(undefined);
  const [authInitialRole, setAuthInitialRole] = useState<'customer' | 'technician'>('customer');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showImportantNoticeModal, setShowImportantNoticeModal] = useState<boolean>(() => {
    return !storageService.hasAgreedImportantNotice();
  });
  const [showTechRegistrationModal, setShowTechRegistrationModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianProfile | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleRequireAuth = (actionDescription?: string, role: 'customer' | 'technician' = 'customer') => {
    if (role === 'technician') {
      setAuthPromptMessage('Technician verification is required to register and manage service provider profiles.');
    } else if (actionDescription) {
      setAuthPromptMessage(`To ${actionDescription}, please enter your details.`);
    } else {
      setAuthPromptMessage('Please enter your details to contact technicians.');
    }
    setAuthInitialRole(role);
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    setAuthPromptMessage(undefined);
  };

  const handleGoBack = () => {
    if (selectedTechnician) {
      setSelectedTechnician(null);
      return;
    }
    if (showTechRegistrationModal) {
      setShowTechRegistrationModal(false);
      return;
    }
    if (showAuthModal) {
      setShowAuthModal(false);
      return;
    }
    if (showHelpModal) {
      setShowHelpModal(false);
      return;
    }
    if (activeView !== 'home') {
      setActiveView('home');
    }
  };

  // Load and subscribe to storage & Supabase auth
  const syncState = () => {
    setCurrentUser(storageService.getCurrentUser());
    setTechnicians(storageService.getTechnicians());
    setFavorites(storageService.getFavorites());
  };

  useEffect(() => {
    // Check if visitor has accepted Important Notice
    if (!storageService.hasAgreedImportantNotice()) {
      setShowImportantNoticeModal(true);
    }

    syncState();
    const unsubStorage = storageService.subscribe(syncState);

    // Load live approved technicians from Supabase database
    supabaseService.getApprovedTechnicians().then((liveTechs) => {
      if (liveTechs && liveTechs.length > 0) {
        setTechnicians(liveTechs);
      }
    }).catch(console.warn);

    const handleSupabaseUser = (sbUser: any) => {
      const fullName =
        sbUser.user_metadata?.full_name ||
        sbUser.user_metadata?.name ||
        sbUser.email?.split('@')[0] ||
        'NeedFix Customer';
      const avatar =
        sbUser.user_metadata?.avatar_url ||
        sbUser.user_metadata?.picture ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

      const synced = storageService.syncExternalUser({
        uid: sbUser.id,
        email: sbUser.email,
        displayName: fullName,
        photoURL: avatar,
        role: 'customer',
      });
      setCurrentUser(synced);
      supabaseService.upsertUserInDatabase(synced).catch(console.warn);

      // Check if user has agreed to the mandatory Important Notice
      if (!storageService.hasAgreedImportantNotice(synced.id, synced.email)) {
        setShowImportantNoticeModal(true);
      }
    };

    // 1. Check existing session on redirect/reload
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleSupabaseUser(session.user);
      }
    });

    // 2. Listen to ongoing auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleSupabaseUser(session.user);
      }
    });

    return () => {
      unsubStorage();
      subscription.unsubscribe();
    };
  }, []);

  // Technician profile for the currently logged-in user (if any)
  const currentTechnicianProfile = currentUser
    ? technicians.find((t) => t.userId === currentUser.id) ||
      storageService.getTechnicians().find((t) => t.userId === currentUser.id) ||
      null
    : null;

  // Toggle Favorite
  const handleToggleFavorite = (techId: string) => {
    const updated = storageService.toggleFavorite(techId);
    setFavorites(updated);
  };

  // Auth completion handler
  const handleAuthSuccess = (user: UserProfile, isNewUser: boolean) => {
    setShowAuthModal(false);
    setCurrentUser(user);

    const hasAgreed = storageService.hasAgreedImportantNotice(user.id, user.email);

    if (!hasAgreed) {
      setShowImportantNoticeModal(true);
    } else if (isNewUser || !user.name) {
      setShowOnboardingModal(true);
    } else if (user.role === 'technician') {
      setActiveView('technician_dashboard');
    } else if (user.role === 'admin') {
      setActiveView('admin_panel');
    }
  };

  // Agree to Important Notice handler (Mandatory disclaimer)
  const handleAgreeImportantNotice = () => {
    storageService.setAgreedImportantNotice(currentUser?.id, currentUser?.email);
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        hasAgreedNotice: true,
        noticeAgreedAt: new Date().toISOString(),
      };
      setCurrentUser(updatedUser);
      supabaseService.recordNoticeAgreement(currentUser.id);
      supabaseService.upsertUserInDatabase(updatedUser).catch(console.warn);
    }
    setShowImportantNoticeModal(false);
  };

  // Onboarding completion
  const handleOnboardingComplete = (completedUser: UserProfile) => {
    setShowOnboardingModal(false);
    setCurrentUser(completedUser);
    setActiveView('home');
  };

  // Technician Registration submitted
  const handleTechnicianSubmitted = (newProfile: TechnicianProfile) => {
    setTechnicians(storageService.getTechnicians());
    setActiveView('technician_dashboard');
  };

  // Update Location
  const handleUpdateLocation = (newLoc: UserLocation) => {
    storageService.setGuestLocation(newLoc);
    setGuestLocation(newLoc);
    if (currentUser) {
      const updated = { ...currentUser, location: newLoc };
      storageService.updateUser(updated);
      setCurrentUser(updated);
    }
  };

  const handleUpdateCity = (cityName: string) => {
    const cityObj = MAJOR_CITIES.find((c) => c.city === cityName);
    if (cityObj) {
      handleUpdateLocation(cityObj);
    }
  };

  // Logout
  const handleLogout = () => {
    storageService.setCurrentUser(null);
    setCurrentUser(null);
    setActiveView('home');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Offline PWA Connectivity Indicator */}
      <OfflineIndicator />

      {/* Main Top Navigation */}
      <Navbar
        currentUser={currentUser}
        technicianProfile={currentTechnicianProfile}
        guestLocation={guestLocation}
        activeView={activeView}
        canGoBack={activeView !== 'home' || Boolean(selectedTechnician || showTechRegistrationModal || showHelpModal)}
        onBack={handleGoBack}
        onNavigate={(view) => {
          if ((view === 'technician_dashboard' || view === 'admin_panel') && !currentUser) {
            setAuthInitialRole(view === 'technician_dashboard' ? 'technician' : 'customer');
            setShowAuthModal(true);
            return;
          }
          setActiveView(view);
        }}
        onOpenAuth={() => {
          setAuthPromptMessage(undefined);
          setAuthInitialRole('customer');
          setShowAuthModal(true);
        }}
        onOpenTechnicianRegistration={() => {
          if (!currentUser) {
            handleRequireAuth('register as a service provider', 'technician');
          } else {
            setShowTechRegistrationModal(true);
          }
        }}
        onOpenHelpSupport={() => setShowHelpModal(true)}
        onLogout={handleLogout}
        onUpdateCity={handleUpdateCity}
        onUpdateLocation={handleUpdateLocation}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeView === 'home' && (
          <CustomerHome
            technicians={technicians}
            currentUser={currentUser}
            customerLocation={currentUser?.location || guestLocation}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectTechnician={(tech) => setSelectedTechnician(tech)}
            onOpenTechnicianRegistration={() => {
              if (!currentUser) handleRequireAuth('register as a service provider', 'technician');
              else setShowTechRegistrationModal(true);
            }}
            onUpdateLocation={handleUpdateLocation}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {activeView === 'technician_dashboard' && currentTechnicianProfile && (
          <TechnicianDashboard
            technician={currentTechnicianProfile}
            onOpenEditApplication={() => setShowTechRegistrationModal(true)}
          />
        )}

        {activeView === 'admin_panel' && (
          <AdminPanel
            currentUser={currentUser}
            onUserChange={setCurrentUser}
            onExitAdmin={() => setActiveView('home')}
          />
        )}
      </main>

      {/* FOOTER */}
      <Footer
        onOpenHelpModal={() => setShowHelpModal(true)}
        onOpenNoticeModal={() => setShowImportantNoticeModal(true)}
        onOpenAdmin={() => setActiveView('admin_panel')}
        onOpenTechnicianRegistration={() => {
          if (!currentUser) {
            handleRequireAuth('register as a service provider', 'technician');
          } else {
            setShowTechRegistrationModal(true);
          }
        }}
      />

      {/* MODALS */}
      {/* 1. Unified Mobile OTP Login Modal */}
      {showAuthModal && (
        <UnifiedAuthModal
          isOpen={showAuthModal}
          onClose={handleCloseAuthModal}
          onSuccess={handleAuthSuccess}
          onLoginSuccess={handleAuthSuccess}
          promptMessage={authPromptMessage}
          initialRole={authInitialRole}
        />
      )}

      {/* 2. User Profile & Location Onboarding Modal */}
      {showOnboardingModal && currentUser && (
        <OnboardingModal
          user={currentUser}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* 3. Become a Service Provider (Technician Registration) Form */}
      {showTechRegistrationModal && currentUser && (
        <TechnicianRegistrationModal
          isOpen={showTechRegistrationModal}
          onClose={() => setShowTechRegistrationModal(false)}
          currentUser={currentUser}
          onSubmitted={handleTechnicianSubmitted}
        />
      )}

      {/* 4. Technician Detail Modal */}
      {selectedTechnician && (
        <TechnicianDetailModal
          technician={selectedTechnician}
          currentUser={currentUser}
          userLocation={currentUser?.location}
          isFavorite={favorites.includes(selectedTechnician.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedTechnician(null)}
          onRequireAuth={handleRequireAuth}
        />
      )}

      {/* 5. Help, Complaints & Support Modal */}
      <HelpSupportModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        userRole={currentUser?.role}
      />

      {/* 6. Mandatory Important Notice / Disclaimer Modal */}
      <ImportantNoticeModal
        isOpen={showImportantNoticeModal}
        onAgree={handleAgreeImportantNotice}
        userName={currentUser?.name}
      />

      {/* Live SMS Notification Toast for OTP Simulation */}
      <SMSNotificationToast />
    </div>
  );
}
