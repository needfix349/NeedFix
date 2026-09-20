import React, { useState, useEffect, useRef } from 'react';
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
import { BlockedAccessScreen } from './components/security/BlockedAccessScreen';
import { deviceSecurityService } from './services/deviceSecurityService';

import {
  UserProfile,
  TechnicianProfile,
  ServiceLead,
  UserLocation,
  DeviceSecurityStatus,
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
  const [showImportantNoticeModal, setShowImportantNoticeModal] = useState<boolean>(false);
  const [showTechRegistrationModal, setShowTechRegistrationModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianProfile | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<DeviceSecurityStatus | null>(null);

  // Device Security Verification: Check if device or user is blocked
  const runDeviceSecurityVerification = async () => {
    try {
      const status = await deviceSecurityService.checkDeviceBlocked();
      setSecurityStatus(status);
      if (status.isBlocked) {
        storageService.clearSession();
        setCurrentUser(null);
      }
    } catch {}
  };

  // Ref to always track current navigation & modal state for popstate handler
  const navStateRef = useRef({
    activeView,
    selectedTechnician,
    showTechRegistrationModal,
    showAuthModal,
    showHelpModal,
    showImportantNoticeModal,
  });

  useEffect(() => {
    navStateRef.current = {
      activeView,
      selectedTechnician,
      showTechRegistrationModal,
      showAuthModal,
      showHelpModal,
      showImportantNoticeModal,
    };
  });

  // Push history state so the phone back button triggers popstate instead of exiting the site
  const pushNavHistory = (tag: string) => {
    try {
      window.history.pushState({ needfix: true, tag, t: Date.now() }, '');
    } catch (e) {
      console.warn('History pushState warning:', e);
    }
  };

  // Close whichever modal is currently active or return to home screen
  const closeActiveModalOrView = () => {
    const s = navStateRef.current;
    if (s.selectedTechnician) {
      setSelectedTechnician(null);
      return true;
    }
    if (s.showTechRegistrationModal) {
      setShowTechRegistrationModal(false);
      return true;
    }
    if (s.showAuthModal) {
      setShowAuthModal(false);
      setAuthPromptMessage(undefined);
      return true;
    }
    if (s.showHelpModal) {
      setShowHelpModal(false);
      return true;
    }
    if (s.showImportantNoticeModal) {
      setShowImportantNoticeModal(false);
      return true;
    }
    if (s.activeView !== 'home') {
      setActiveView('home');
      return true;
    }
    return false;
  };

  // Unified back handler: pop history if pushed, or close active modal/view directly
  const handleGoBack = () => {
    if (window.history.state && window.history.state.needfix) {
      window.history.back();
    } else {
      closeActiveModalOrView();
    }
  };

  // Navigation router with history support
  const handleNavigateToView = (view: 'home' | 'technician_dashboard' | 'admin_panel') => {
    if (view === 'technician_dashboard' && !currentUser) {
      setAuthInitialRole('technician');
      pushNavHistory('auth');
      setShowAuthModal(true);
      return;
    }
    if (view !== 'home' && activeView === 'home') {
      pushNavHistory(`view_${view}`);
    }
    setActiveView(view);
  };

  const handleSelectTechnician = (tech: TechnicianProfile) => {
    pushNavHistory('tech_detail');
    setSelectedTechnician(tech);
  };

  const handleOpenTechnicianRegistration = () => {
    if (!currentUser) {
      handleRequireAuth('register as a service provider', 'technician');
    } else {
      pushNavHistory('tech_registration');
      setShowTechRegistrationModal(true);
    }
  };

  const handleOpenHelpSupport = () => {
    pushNavHistory('help_support');
    setShowHelpModal(true);
  };

  const handleOpenNoticeModal = () => {
    pushNavHistory('notice');
    setShowImportantNoticeModal(true);
  };

  const handleRequireAuth = (actionDescription?: string, role: 'customer' | 'technician' = 'customer') => {
    if (role === 'technician') {
      setAuthPromptMessage('Technician verification is required to register and manage service provider profiles.');
    } else if (actionDescription) {
      setAuthPromptMessage(`To ${actionDescription}, please enter your details.`);
    } else {
      setAuthPromptMessage('Please enter your details to contact technicians.');
    }
    setAuthInitialRole(role);
    pushNavHistory('auth');
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    handleGoBack();
  };

  // Load and subscribe to storage & Supabase auth
  const syncState = () => {
    const user = storageService.getCurrentUser();
    if (user?.isBlocked || (user as any)?.status === 'blocked') {
      storageService.clearSession(true);
      setCurrentUser(null);
      setSecurityStatus({
        isBlocked: true,
        reason: 'Your account/device has been blocked by Admin. Access denied until unblocked.',
        deviceId: deviceSecurityService.getDeviceId(),
        ip: '',
      });
    } else {
      setCurrentUser(user);
    }
    setTechnicians(storageService.getTechnicians());
    setFavorites(storageService.getFavorites());
  };

  useEffect(() => {
    syncState();
    runDeviceSecurityVerification();
    const unsubStorage = storageService.subscribe(() => {
      syncState();
    });

    // Initialize root browser history state for seamless phone back navigation
    if (!window.history.state || !window.history.state.needfixRoot) {
      window.history.replaceState({ needfixRoot: true }, '');
    }

    // Handle physical/system phone back button navigation (popstate)
    const onPopState = () => {
      closeActiveModalOrView();
    };
    window.addEventListener('popstate', onPopState);

    // Show Important Notice modal after 5 seconds of entering (if not already agreed)
    const noticeTimer = setTimeout(() => {
      const activeUser = storageService.getCurrentUser();
      const hasAgreed = storageService.hasAgreedImportantNotice(activeUser?.id, activeUser?.email);
      if (!hasAgreed) {
        pushNavHistory('notice');
        setShowImportantNoticeModal(true);
      }
    }, 5000);

    // Load live approved technicians from Supabase database
    supabaseService.getApprovedTechnicians().then((liveTechs) => {
      if (liveTechs && liveTechs.length > 0) {
        setTechnicians(liveTechs);
      }
    }).catch(console.warn);

    const handleSupabaseUser = (sbUser: any) => {
      const storedCustomerName = localStorage.getItem('needfix_customer_custom_name');
      const existingUser = storageService.getCurrentUser();
      const isSuperAdminEmail = sbUser.email?.toLowerCase() === 'needfix349@gmail.com';

      // Use stored customer name if available, otherwise prioritize existing customer name, or fall back to sbUser name
      let fullName: string;
      if (storedCustomerName) {
        fullName = storedCustomerName;
      } else if (
        existingUser?.name &&
        existingUser.name !== 'NeedFix Customer' &&
        existingUser.name !== 'NeedFix User' &&
        (!isSuperAdminEmail || existingUser.role !== 'admin')
      ) {
        fullName = existingUser.name;
      } else {
        fullName =
          sbUser.user_metadata?.full_name ||
          sbUser.user_metadata?.name ||
          sbUser.email?.split('@')[0] ||
          'NeedFix Customer';
      }

      const avatar =
        sbUser.user_metadata?.avatar_url ||
        sbUser.user_metadata?.picture ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;

      const synced = storageService.syncExternalUser({
        uid: sbUser.id,
        email: sbUser.email,
        displayName: fullName,
        photoURL: avatar,
        role: existingUser?.role || 'customer',
      });
      setCurrentUser(synced);
      supabaseService.upsertUserInDatabase(synced).catch(console.warn);
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
      clearTimeout(noticeTimer);
      unsubStorage();
      subscription.unsubscribe();
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  // Technician profile for the currently logged-in user (if any)
  const currentTechnicianProfile = currentUser
    ? technicians.find(
        (t) =>
          t.userId === currentUser.id ||
          t.id === currentUser.id ||
          (currentUser.technicianId && t.id === currentUser.technicianId)
      ) ||
      storageService
        .getTechnicians()
        .find(
          (t) =>
            t.userId === currentUser.id ||
            t.id === currentUser.id ||
            (currentUser.technicianId && t.id === currentUser.technicianId)
        ) ||
      null
    : null;

  // Toggle Favorite
  const handleToggleFavorite = (techId: string) => {
    storageService.toggleFavorite(techId);
    setFavorites(storageService.getFavorites());
  };

  // Auth completion handler
  const handleAuthSuccess = (user: UserProfile, _isNewUser: boolean) => {
    setShowAuthModal(false);
    setCurrentUser(user);

    const hasAgreed = storageService.hasAgreedImportantNotice(user.id, user.email);

    if (!hasAgreed) {
      setShowImportantNoticeModal(true);
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
    localStorage.removeItem('needfix_customer_custom_name');
    storageService.setCurrentUser(null);
    setCurrentUser(null);
    setActiveView('home');
    supabase.auth.signOut().catch(() => {});
  };

  // Universal IP & Device Blocking Lockdown: Completely freeze interface if blocked
  if (securityStatus?.isBlocked) {
    return (
      <BlockedAccessScreen
        status={securityStatus}
        onRefreshCheck={runDeviceSecurityVerification}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Offline PWA Connectivity Indicator */}
      <OfflineIndicator />

      {/* Main Top Navigation */}
      <Navbar
        currentUser={currentUser}
        technicianProfile={currentTechnicianProfile}
        guestLocation={guestLocation}
        activeView={activeView}
        canGoBack={activeView !== 'home'}
        onBack={handleGoBack}
        onNavigate={handleNavigateToView}
        onOpenAuth={() => {
          setAuthPromptMessage(undefined);
          setAuthInitialRole('customer');
          pushNavHistory('auth');
          setShowAuthModal(true);
        }}
        onOpenTechnicianRegistration={handleOpenTechnicianRegistration}
        onOpenHelpSupport={handleOpenHelpSupport}
        onLogout={handleLogout}
        onUpdateCity={handleUpdateCity}
        onUpdateLocation={handleUpdateLocation}
        onUpdateUser={(updated) => setCurrentUser(updated)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16 w-full max-w-full overflow-x-hidden">
        {activeView === 'home' && (
          <CustomerHome
            technicians={technicians}
            currentUser={currentUser}
            customerLocation={currentUser?.location || guestLocation}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectTechnician={handleSelectTechnician}
            onOpenTechnicianRegistration={handleOpenTechnicianRegistration}
            onUpdateLocation={handleUpdateLocation}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {activeView === 'technician_dashboard' && currentTechnicianProfile && (
          <TechnicianDashboard
            technician={currentTechnicianProfile}
            onOpenEditApplication={handleOpenTechnicianRegistration}
          />
        )}

        {activeView === 'admin_panel' && (
          <AdminPanel
            currentUser={currentUser}
            onUserChange={setCurrentUser}
            onExitAdmin={handleGoBack}
          />
        )}
      </main>

      {/* FOOTER */}
      <Footer
        onOpenHelpModal={handleOpenHelpSupport}
        onOpenNoticeModal={handleOpenNoticeModal}
        onOpenAdmin={() => handleNavigateToView('admin_panel')}
        onOpenTechnicianRegistration={handleOpenTechnicianRegistration}
      />

      {/* MODALS */}
      {/* 1. Unified Mobile OTP Login Modal */}
      {showAuthModal && (
        <UnifiedAuthModal
          isOpen={showAuthModal}
          onClose={handleGoBack}
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
          onClose={handleGoBack}
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
          onClose={handleGoBack}
          onRequireAuth={handleRequireAuth}
        />
      )}

      {/* 5. Help, Complaints & Support Modal */}
      <HelpSupportModal
        isOpen={showHelpModal}
        onClose={handleGoBack}
        userRole={currentUser?.role}
      />

      {/* 6. Mandatory Important Notice / Disclaimer Modal */}
      <ImportantNoticeModal
        isOpen={showImportantNoticeModal}
        onAgree={handleAgreeImportantNotice}
        onClose={handleGoBack}
        userName={currentUser?.name}
      />

      {/* Live SMS Notification Toast for OTP Simulation */}
      <SMSNotificationToast />
    </div>
  );
}
