import React, { useState, useRef } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Building,
  Briefcase,
  MapPin,
  FileText,
  Phone,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  Store,
  Upload,
  Image as ImageIcon,
  Camera,
  Trash2,
  FileCheck,
  FolderOpen,
  AlertCircle,
  Navigation,
  RefreshCw,
  Building2,
  Minus,
  Plus,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserProfile, TechnicianProfile, UserLocation } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/categories';
import { CategoryLogo } from '../common/CategoryLogo';
import { storageService } from '../../services/storage';
import { supabaseService } from '../../services/supabaseService';
import { deviceSecurityService } from '../../services/deviceSecurityService';
import { accountService } from '../../services/accountService';
import { getCurrentGPSLocation, DEFAULT_USER_LOCATION } from '../../services/locationService';
import { GuidedAadhaarKYCModal } from '../kyc/GuidedAadhaarKYCModal';
import { compressCardImage, mergeAadhaarFrontAndBack } from '../../utils/aadhaarImageProcessor';

interface TechnicianRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onSubmitted: (submittedProfile: TechnicianProfile) => void;
}

export const TechnicianRegistrationModal: React.FC<TechnicianRegistrationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitted,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // 1. Business / Store / Company & Contact Details
  const [companyName, setCompanyName] = useState('');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser?.mobile || '');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [secretPin, setSecretPin] = useState('');
  const [showSecretPin, setShowSecretPin] = useState(false);
  const [existingCustomerRecord, setExistingCustomerRecord] = useState<any>(null);
  const [isCheckingCustomer, setIsCheckingCustomer] = useState(false);
  const [workshopLocation, setWorkshopLocation] = useState<UserLocation | null>(
    currentUser?.location || null
  );
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsLockSuccess, setGpsLockSuccess] = useState(false);
  const [gpsLockError, setGpsLockError] = useState<string | null>(null);

  // Check if entered mobile belongs to an existing customer to link accounts seamlessly
  React.useEffect(() => {
    if (currentUser) return;
    const clean = mobile.replace(/\D/g, '').slice(-10);
    if (clean.length === 10) {
      setIsCheckingCustomer(true);
      let isCurrent = true;
      accountService.findCustomerByMobile(clean).then((cust) => {
        if (isCurrent) {
          setExistingCustomerRecord(cust);
          setIsCheckingCustomer(false);
        }
      });
      return () => {
        isCurrent = false;
      };
    } else {
      setExistingCustomerRecord(null);
      setIsCheckingCustomer(false);
    }
  }, [mobile, currentUser]);

  // Automatically fetch current location on map when technician opens location setup
  React.useEffect(() => {
    if (isOpen) {
      if (!workshopLocation) {
        setIsLocatingGPS(true);
        setGpsLockError(null);
        getCurrentGPSLocation()
          .then((loc) => {
            setWorkshopLocation(loc);
            setGpsLockSuccess(true);
          })
          .catch((err) => {
            console.warn('Notice: GPS auto-detect fallback:', err);
            setWorkshopLocation(currentUser?.location || DEFAULT_USER_LOCATION);
          })
          .finally(() => {
            setIsLocatingGPS(false);
          });
      }
    }
  }, [isOpen]);

  const handleFetchCurrentLocation = async () => {
    setIsLocatingGPS(true);
    setGpsLockError(null);
    setGpsLockSuccess(false);
    try {
      const loc = await getCurrentGPSLocation();
      setWorkshopLocation(loc);
      setGpsLockSuccess(true);
      setTimeout(() => setGpsLockSuccess(false), 4000);
    } catch (err: any) {
      setGpsLockError('Could not fetch GPS coordinates. Please ensure location permission is allowed in your browser.');
    } finally {
      setIsLocatingGPS(false);
    }
  };

  const [coverageRadiusKm, setCoverageRadiusKm] = useState(5); // Default 5 KM as per system specification
  const [businessDescription, setBusinessDescription] = useState('');

  // 2. Multi-Trade / Skills Selection (Technician can select 1, 2, 3, or more trades)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // 3. Store / Company Photo / Logo (Gallery / Camera Upload)
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [logoLoadError, setLogoLoadError] = useState<boolean>(false);
  const [showLogoUrlInput, setShowLogoUrlInput] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // 4. Mandatory Aadhaar Details (12-Digit UID + Dual-Side Document Upload)
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarDocUrl, setAadhaarDocUrl] = useState<string>('');
  const [aadhaarBackDocUrl, setAadhaarBackDocUrl] = useState<string>('');
  const [aadhaarFileName, setAadhaarFileName] = useState<string>('');
  const [aadhaarBackFileName, setAadhaarBackFileName] = useState<string>('');
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [aadhaarBackFile, setAadhaarBackFile] = useState<File | null>(null);
  const [showAadhaarUrlInput, setShowAadhaarUrlInput] = useState(false);
  const [isGuidedKYCOpen, setIsGuidedKYCOpen] = useState<boolean>(false);
  const [isGuidedKYCComplete, setIsGuidedKYCComplete] = useState<boolean>(false);
  const aadhaarFrontFileInputRef = useRef<HTMLInputElement>(null);
  const aadhaarBackFileInputRef = useRef<HTMLInputElement>(null);

  // 5. Merged 2-in-1 Aadhaar State (front + back = 1 compressed photo)
  const [mergedAadhaarDocUrl, setMergedAadhaarDocUrl] = useState<string>('');
  const [mergedAadhaarBlob, setMergedAadhaarBlob] = useState<Blob | null>(null);
  const [mergedSizeKb, setMergedSizeKb] = useState<number>(0);
  const [isMerging, setIsMerging] = useState<boolean>(false);

  // Status Indicators for Dual-Side Aadhaar KYC
  const isFrontCaptured = Boolean(aadhaarDocUrl && aadhaarDocUrl.trim());
  const isBackCaptured = Boolean(aadhaarBackDocUrl && aadhaarBackDocUrl.trim());
  const isAadhaarComplete = isFrontCaptured && isBackCaptured;

  const [hasAgreedTerms, setHasAgreedTerms] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatusText, setSubmissionStatusText] = useState<string>('');
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Auto-merge front and back photos into 1 single compressed document
  const triggerMergeIfBothPresent = async (
    front: string | Blob,
    back: string | Blob,
    uid: string
  ) => {
    if (!front || !back) return;
    setIsMerging(true);
    try {
      const merged = await mergeAadhaarFrontAndBack(front, back, uid || aadhaarNumber);
      setMergedAadhaarDocUrl(merged.dataUrl);
      setMergedAadhaarBlob(merged.blob);
      setMergedSizeKb(merged.sizeKb);
    } catch (err) {
      console.warn('Auto merge error:', err);
    } finally {
      setIsMerging(false);
    }
  };

  // Handle Shop Logo File Upload from Gallery/Camera
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP) for the store logo.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Store logo image must be under 8MB in size.');
      return;
    }
    setLogoFileName(file.name);
    setLogoLoadError(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCompanyLogoUrl(event.target.result as string);
        setLogoLoadError(false);
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Aadhaar Card Front Photo Upload with client-side compression & auto-merge
  const handleAadhaarFrontFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setErrorMessage('Please select a clear Aadhaar Front card photo (JPG, PNG) or PDF document.');
      return;
    }
    setAadhaarFileName(file.name);
    setErrorMessage(null);

    try {
      // Client-side compression to under 250KB with high clarity
      const compressed = await compressCardImage(file, { maxWidth: 1280, maxHeight: 960, quality: 0.82 });
      const compressedFile = new File([compressed.blob], file.name, { type: 'image/jpeg' });
      setAadhaarFile(compressedFile);
      setAadhaarDocUrl(compressed.dataUrl);

      // If back side is already available, trigger 2-in-1 merge
      if (aadhaarBackDocUrl || aadhaarBackFile) {
        triggerMergeIfBothPresent(
          compressed.blob,
          aadhaarBackFile || aadhaarBackDocUrl,
          aadhaarNumber
        );
      }
    } catch (compressErr) {
      // Fallback to standard reader
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          setAadhaarDocUrl(url);
          setAadhaarFile(file);
          if (aadhaarBackDocUrl) {
            triggerMergeIfBothPresent(url, aadhaarBackDocUrl, aadhaarNumber);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Aadhaar Card Back Photo Upload with client-side compression & auto-merge
  const handleAadhaarBackFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setErrorMessage('Please select a clear Aadhaar Back card photo (JPG, PNG) or PDF document.');
      return;
    }
    setAadhaarBackFileName(file.name);
    setErrorMessage(null);

    try {
      // Client-side compression to under 250KB with high clarity
      const compressed = await compressCardImage(file, { maxWidth: 1280, maxHeight: 960, quality: 0.82 });
      const compressedFile = new File([compressed.blob], file.name, { type: 'image/jpeg' });
      setAadhaarBackFile(compressedFile);
      setAadhaarBackDocUrl(compressed.dataUrl);

      // If front side is already available, trigger 2-in-1 merge
      if (aadhaarDocUrl || aadhaarFile) {
        triggerMergeIfBothPresent(
          aadhaarFile || aadhaarDocUrl,
          compressed.blob,
          aadhaarNumber
        );
      }
    } catch (compressErr) {
      // Fallback to standard reader
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          setAadhaarBackDocUrl(url);
          setAadhaarBackFile(file);
          if (aadhaarDocUrl) {
            triggerMergeIfBothPresent(aadhaarDocUrl, url, aadhaarNumber);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Single streamlined Gallery upload helper (routes to missing side or front)
  const handleGalleryUploadClick = () => {
    if (!aadhaarDocUrl) {
      aadhaarFrontFileInputRef.current?.click();
    } else if (!aadhaarBackDocUrl) {
      aadhaarBackFileInputRef.current?.click();
    } else {
      aadhaarFrontFileInputRef.current?.click();
    }
  };

  // Clear all Aadhaar KYC documents
  const handleClearAadhaar = () => {
    setAadhaarDocUrl('');
    setAadhaarBackDocUrl('');
    setAadhaarFileName('');
    setAadhaarBackFileName('');
    setAadhaarFile(null);
    setAadhaarBackFile(null);
    setMergedAadhaarDocUrl('');
    setMergedAadhaarBlob(null);
    setMergedSizeKb(0);
    setIsGuidedKYCComplete(false);
  };

  const toggleCategory = (catId: string) => {
    if (selectedCategoryIds.includes(catId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== catId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, catId]);
    }
    setErrorMessage(null);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!companyName.trim()) {
        setErrorMessage('Please enter your Shop / Store / Company Name.');
        return;
      }
      const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
      if (!cleanMobile || cleanMobile.length !== 10) {
        setErrorMessage('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!whatsappNumber.trim()) {
        setErrorMessage('Please enter a valid WhatsApp number.');
        return;
      }

      // Check PIN requirements if not already logged in as a customer
      if (!currentUser) {
        const cleanPin = secretPin.trim();
        if (!cleanPin || cleanPin.length !== 4) {
          setErrorMessage('Please enter a 4-digit secret PIN for account security.');
          return;
        }

        if (existingCustomerRecord) {
          const storedPin = String(existingCustomerRecord.pin || existingCustomerRecord.security_pin || '');
          if (storedPin && storedPin !== cleanPin) {
            setErrorMessage('The 4-digit PIN does not match your existing customer account. Please enter your correct customer PIN to link your profile.');
            return;
          }
        }
      }

      if (!workshopLocation) {
        setErrorMessage('Please click "Fetch Current Location" to set your workshop GPS coordinates.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedCategoryIds.length === 0) {
        setErrorMessage('Please select at least one skill/trade.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanAadhaar = aadhaarNumber.replace(/\D/g, '');
    if (!cleanAadhaar || cleanAadhaar.length !== 12) {
      setErrorMessage('Please enter a valid 12-digit Aadhaar number for identity verification.');
      return;
    }

    // Aadhaar Card Front and Back Photos are strictly mandatory
    if (!aadhaarDocUrl || !aadhaarDocUrl.trim()) {
      setErrorMessage('Aadhaar Front Side photo is required. Please launch guided camera or upload from gallery.');
      return;
    }
    if (!aadhaarBackDocUrl || !aadhaarBackDocUrl.trim()) {
      setErrorMessage('Aadhaar Back Side photo is required. Please launch guided camera or upload from gallery.');
      return;
    }
    if (!hasAgreedTerms) {
      setErrorMessage('Please accept the verification terms to proceed.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    const cleanPin = secretPin.trim();

    // Single Identity Policy: Preserve existing user/customer ID so no conflicting ID is generated
    const effectiveUserId =
      currentUser?.id ||
      existingCustomerRecord?.id ||
      (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `usr_${cleanMobile}_${Date.now()}`);

    // If registering directly without a prior customer account, register customer record now
    if (!currentUser && !existingCustomerRecord && cleanPin.length === 4) {
      try {
        await accountService.registerCustomer({
          name: companyName.trim(),
          mobileNumber: cleanMobile,
          pin: cleanPin,
        });
      } catch (custErr) {
        console.warn('Customer auto-registration notice:', custErr);
      }
    }

    setIsSubmitting(true);
    setSubmissionStatusText('Preparing and compressing KYC documents...');

    try {
      // Helper for network operations to prevent infinite hanging
      function withTimeout<T>(promise: Promise<T>, ms: number, fallbackVal: T): Promise<T> {
        return Promise.race([
          promise,
          new Promise<T>((resolve) => setTimeout(() => resolve(fallbackVal), ms)),
        ]);
      }

      // 1. Auto-Merge Front & Back into 1 Compressed Document if not already done
      let finalMergedUrl = mergedAadhaarDocUrl;
      let finalMergedBlob = mergedAadhaarBlob;

      if (!finalMergedUrl && aadhaarDocUrl && aadhaarBackDocUrl) {
        try {
          const merged = await mergeAadhaarFrontAndBack(
            aadhaarFile || aadhaarDocUrl,
            aadhaarBackFile || aadhaarBackDocUrl,
            cleanAadhaar
          );
          finalMergedUrl = merged.dataUrl;
          finalMergedBlob = merged.blob;
          setMergedAadhaarDocUrl(merged.dataUrl);
          setMergedAadhaarBlob(merged.blob);
          setMergedSizeKb(merged.sizeKb);
        } catch (mergeErr) {
          console.warn('Auto-merge during submit warning:', mergeErr);
        }
      }

      setSubmissionStatusText('Uploading verified 2-in-1 Aadhaar document...');

      let finalAadhaarDocUrl = finalMergedUrl || aadhaarDocUrl.trim();
      let finalAadhaarBackDocUrl = aadhaarBackDocUrl.trim();

      // Upload the 2-in-1 merged document (with 4.5s safe timeout)
      if (finalMergedBlob) {
        try {
          finalAadhaarDocUrl = await withTimeout(
            supabaseService.uploadAadhaarDocument(
              new File([finalMergedBlob], `Aadhaar-2in1-${effectiveUserId}.jpg`, { type: 'image/jpeg' }),
              effectiveUserId,
              `Aadhaar-2in1-${effectiveUserId}.jpg`
            ),
            4500,
            finalAadhaarDocUrl
          );
        } catch (uploadErr) {
          console.warn('Aadhaar merged upload warning:', uploadErr);
        }
      } else if (aadhaarFile) {
        try {
          finalAadhaarDocUrl = await withTimeout(
            supabaseService.uploadAadhaarDocument(aadhaarFile, effectiveUserId, aadhaarFileName),
            4500,
            finalAadhaarDocUrl
          );
        } catch (uploadErr) {
          console.warn('Aadhaar front upload warning:', uploadErr);
        }
      }

      if (aadhaarBackFile) {
        try {
          finalAadhaarBackDocUrl = await withTimeout(
            supabaseService.uploadKYCDocument(
              aadhaarBackFile,
              effectiveUserId,
              'aadhaar',
              'back',
              aadhaarBackFileName || 'Aadhaar-Back-Document.jpg'
            ),
            4500,
            finalAadhaarBackDocUrl
          );
        } catch (uploadBackErr) {
          console.warn('Aadhaar back upload warning:', uploadBackErr);
        }
      }

      setSubmissionStatusText('Assigning technician ID & registering application...');

      // Sequence code generator with safe timeout
      const technicianCode = await withTimeout(
        deviceSecurityService.generateTechnicianIdAsync(),
        2500,
        deviceSecurityService.generateTechnicianId()
      );

      const selectedCategories = SERVICE_CATEGORIES.filter((c) =>
        selectedCategoryIds.includes(c.id)
      );
      const primaryCat = selectedCategories[0] || SERVICE_CATEGORIES[0];
      const categoryNames = selectedCategories.map((c) => c.name);

      // Build services list with category mentioned and no individual prices
      const servicesOffered: { name: string; categoryId?: string; categoryName?: string; description?: string }[] = [];
      selectedCategories.forEach((cat) => {
        cat.popularServices.forEach((srv) => {
          servicesOffered.push({
            name: srv,
            categoryId: cat.id,
            categoryName: cat.name,
            description: `Expert ${srv} service by certified technicians in ${cat.name}.`,
          });
        });
      });

      const applicationData = {
        userId: effectiveUserId,
        technicianCode,
        ipAddress: '',
        deviceId: '',
        fullName: companyName.trim(),
        mobile: mobile.trim(),
        pin: cleanPin || existingCustomerRecord?.pin || '0000',
        whatsappNumber: whatsappNumber.trim(),
        email: currentUser?.email || undefined,
        companyName: companyName.trim(),
        categoryId: primaryCat.id,
        categoryName: primaryCat.name,
        categoryIds: selectedCategoryIds,
        categoryNames: categoryNames,
        experienceYears: 5,
        coverageRadiusKm: Number(coverageRadiusKm),
        coverageAreaText: `${workshopLocation?.area || 'Local Area'}, ${workshopLocation?.city || 'Delhi'}`,
        businessAddress: workshopLocation?.address || `${workshopLocation?.area || ''}, ${workshopLocation?.city || ''}`,
        location: workshopLocation || {
          latitude: 28.6139,
          longitude: 77.2090,
          city: 'Delhi',
          area: 'Central',
          address: 'Auto GPS Location',
        },
        businessDescription:
          businessDescription.trim() ||
          `${companyName} offers expert services for ${categoryNames.join(
            ', '
          )} with verified tools, genuine parts, and satisfaction guarantee.`,
        profilePhotoUrl:
          companyLogoUrl.trim() ||
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80',
        companyLogoUrl:
          companyLogoUrl.trim() ||
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80',
        portfolioImages: [],
        documents: {
          aadhaarNumber: cleanAadhaar,
          aadhaarDocUrl: finalAadhaarDocUrl,
          aadhaarBackDocUrl: finalAadhaarBackDocUrl || undefined,
          kyc_status: 'pending_verification' as const,
        },
        startingPrice: 299,
        priceUnit: 'Visiting Fee',
        inspectionFee: 299,
        hourlyRate: undefined,
        rateCardNotes: undefined,
        servicesOffered: servicesOffered.slice(0, 10),
        workingHours: '08:30 AM - 08:30 PM (All Days)',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        isOnline: false,
      };

      setSubmissionStatusText('Submitting to Admin Dashboard...');

      // Save locally first to ensure zero data loss
      const localProfile = storageService.submitTechnicianApplication(applicationData);

      // Submit to Supabase with fallback
      const newProfile = await withTimeout(
        supabaseService.submitTechnicianApplication(applicationData),
        4000,
        localProfile
      );

      // Update current user role
      const updatedUser: UserProfile = {
        ...(currentUser || {}),
        id: effectiveUserId,
        username: mobile.trim(),
        name: companyName.trim(),
        mobile: mobile.trim(),
        countryCode: '+91',
        role: 'technician',
        email: currentUser?.email,
        isTechnicianRegistered: true,
        technicianId: effectiveUserId,
        createdAt: currentUser?.createdAt || existingCustomerRecord?.createdAt || new Date().toISOString(),
      };
      storageService.setCurrentUser(updatedUser);

      setIsSubmissionSuccess(true);
      setSubmissionStatusText('Submitted to Admin Dashboard Successfully!');

      setTimeout(() => {
        setIsSubmitting(false);
        onSubmitted(newProfile || localProfile);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Registration submission error:', err);
      // Fail-safe: Always save to local database so request appears in Admin Dashboard
      try {
        const selectedCategories = SERVICE_CATEGORIES.filter((c) =>
          selectedCategoryIds.includes(c.id)
        );
        const primaryCat = selectedCategories[0] || SERVICE_CATEGORIES[0];
        const categoryNames = selectedCategories.map((c) => c.name);

        const fallbackProfile = storageService.submitTechnicianApplication({
          userId: effectiveUserId,
          technicianCode: `TECH-${Date.now().toString().slice(-4)}`,
          fullName: companyName.trim(),
          mobile: mobile.trim(),
          pin: cleanPin || existingCustomerRecord?.pin || '0000',
          whatsappNumber: whatsappNumber.trim(),
          companyName: companyName.trim(),
          categoryId: primaryCat.id,
          categoryName: primaryCat.name,
          categoryIds: selectedCategoryIds,
          categoryNames: categoryNames,
          experienceYears: 5,
          coverageRadiusKm: Number(coverageRadiusKm),
          coverageAreaText: workshopLocation?.area || 'Local Area',
          businessAddress: workshopLocation?.address || 'Workshop',
          location: workshopLocation || { latitude: 28.6139, longitude: 77.2090, city: 'Delhi', area: 'Central', address: 'Workshop' },
          businessDescription: businessDescription.trim() || `${companyName} services`,
          profilePhotoUrl: companyLogoUrl.trim() || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80',
          portfolioImages: [],
          startingPrice: 299,
          priceUnit: 'Visiting Fee',
          documents: {
            aadhaarNumber: cleanAadhaar,
            aadhaarDocUrl: mergedAadhaarDocUrl || aadhaarDocUrl,
            aadhaarBackDocUrl: aadhaarBackDocUrl,
            kyc_status: 'pending_verification' as const,
          },
          servicesOffered: [],
          workingHours: '08:30 AM - 08:30 PM',
          availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          isOnline: false,
        });

        const updatedUser: UserProfile = {
          ...(currentUser || {}),
          id: effectiveUserId,
          username: mobile.trim(),
          name: companyName.trim(),
          mobile: mobile.trim(),
          countryCode: '+91',
          role: 'technician',
          isTechnicianRegistered: true,
          technicianId: effectiveUserId,
          createdAt: currentUser?.createdAt || existingCustomerRecord?.createdAt || new Date().toISOString(),
        };
        storageService.setCurrentUser(updatedUser);

        // Sync to Central API
        try {
          fetch('/api/technicians', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fallbackProfile),
          }).catch(() => {});
        } catch {}

        setIsSubmissionSuccess(true);
        setTimeout(() => {
          setIsSubmitting(false);
          onSubmitted(fallbackProfile);
          onClose();
        }, 1200);
      } catch (finalErr) {
        setIsSubmitting(false);
        setErrorMessage('Could not complete submission. Please verify your connection and try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-x-hidden max-w-full">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl max-h-[92vh] overflow-hidden flex flex-col relative box-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Store size={20} />
            </span>
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                Register Technician / Store Profile
              </h2>
              <p className="text-xs text-blue-200">
                Service Provider Registration (Admin Approval Required)
              </p>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
            <div
              className={`flex items-center gap-1.5 pb-1 border-b-2 font-medium transition-all ${
                currentStep >= 1 ? 'border-blue-400 text-white' : 'border-white/20 text-white/40'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span>Shop & Details</span>
            </div>

            <div
              className={`flex items-center gap-1.5 pb-1 border-b-2 font-medium transition-all ${
                currentStep >= 2 ? 'border-blue-400 text-white' : 'border-white/20 text-white/40'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span>Select Trades ({selectedCategoryIds.length})</span>
            </div>

            <div
              className={`flex items-center gap-1.5 pb-1 border-b-2 font-medium transition-all ${
                currentStep >= 3 ? 'border-blue-400 text-white' : 'border-white/20 text-white/40'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <span>Aadhaar & Verification</span>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-medium flex items-center gap-2">
              <Info size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: SHOP & CONTACT INFORMATION */}
          {currentStep === 1 && (
            <form id="step-1-form" onSubmit={handleNext} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-blue-900 text-xs">
                <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Enter your Store / Business Name, Calling & WhatsApp contact, and Location.
                  Customers will reach out to you directly via Call & WhatsApp.
                </p>
              </div>

              {/* Shop / Company Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Store / Company / Business Name <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                  <Store size={18} className="text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Metro Electricals & AC Care, City Care Services"
                    className="w-full bg-transparent outline-none text-sm text-slate-900 font-bold"
                    required
                  />
                </div>
              </div>

              {/* Mobile & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Calling Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                    <Phone size={18} className="text-slate-400 mr-2.5 shrink-0" />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        if (sameAsMobile) setWhatsappNumber(e.target.value);
                      }}
                      placeholder="10-digit mobile"
                      className="w-full bg-transparent outline-none text-sm text-slate-900 font-medium font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <label className="flex items-center gap-1 text-[11px] text-blue-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsMobile}
                        onChange={(e) => {
                          setSameAsMobile(e.target.checked);
                          if (e.target.checked) setWhatsappNumber(mobile);
                        }}
                        className="rounded text-blue-600 focus:ring-0"
                      />
                      <span>Same as Mobile</span>
                    </label>
                  </div>
                  <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                    <span className="text-emerald-600 font-bold text-xs mr-2 shrink-0">WA</span>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => {
                        setWhatsappNumber(e.target.value);
                        setSameAsMobile(false);
                      }}
                      placeholder="WhatsApp enabled number"
                      className="w-full bg-transparent outline-none text-sm text-slate-900 font-medium font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Account Linking & 4-Digit Secret PIN */}
              {currentUser ? (
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-emerald-900 text-xs">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-800">
                      Linked to your active customer account (+91 {currentUser.mobile})
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Your existing user ID and 4-digit secret PIN will remain unified across Customer and Partner modes.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {existingCustomerRecord ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-start gap-2 text-blue-900 text-xs">
                        <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">
                            Existing Customer Account Found (+91 {mobile.replace(/\D/g, '').slice(-10)})
                          </p>
                          <p className="text-[11px] text-blue-700">
                            Enter your existing 4-digit PIN to link your Service Provider profile seamlessly to this account without creating a new ID.
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Lock size={14} className="text-slate-500" />
                          <span>Enter your 4-Digit Customer PIN <span className="text-red-500">*</span></span>
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type={showSecretPin ? 'text' : 'password'}
                            inputMode="numeric"
                            maxLength={4}
                            value={secretPin}
                            onChange={(e) => setSecretPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="••••"
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-bold tracking-widest"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowSecretPin(!showSecretPin)}
                            className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showSecretPin ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Lock size={14} className="text-slate-500" />
                          <span>Create 4-Digit Secret PIN <span className="text-red-500">*</span></span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">used for partner login</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showSecretPin ? 'text' : 'password'}
                          inputMode="numeric"
                          maxLength={4}
                          value={secretPin}
                          onChange={(e) => setSecretPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="Set 4-digit PIN (e.g. 1234)"
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-bold tracking-widest text-slate-900"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSecretPin(!showSecretPin)}
                          className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showSecretPin ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Workshop Location: Native GPS Fetch & Text Status Badge */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    Workshop / Store Location <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Fetch your exact workshop GPS coordinates for accurate doorstep customer matching
                  </span>
                </div>

                {gpsLockError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{gpsLockError}</span>
                  </div>
                )}

                {/* Single "Fetch Current Location" Button & Status Badge */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleFetchCurrentLocation}
                    disabled={isLocatingGPS}
                    className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    title="Fetch current device GPS coordinates"
                  >
                    {isLocatingGPS ? (
                      <RefreshCw size={14} className="animate-spin text-white" />
                    ) : (
                      <Navigation size={14} className="fill-white text-white" />
                    )}
                    <span>{isLocatingGPS ? 'Fetching Location...' : 'Fetch Current Location'}</span>
                  </button>

                  {/* Text Status Badge displaying coordinates */}
                  <div className="flex-1 flex items-center">
                    {workshopLocation ? (
                      <div className="w-full flex flex-wrap items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 font-mono">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          GPS Locked: Lat {workshopLocation.latitude.toFixed(5)}, Lng {workshopLocation.longitude.toFixed(5)}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-medium">
                          ({workshopLocation.city || 'Workshop'}{workshopLocation.state ? `, ${workshopLocation.state}` : ''})
                        </span>
                      </div>
                    ) : (
                      <div className="w-full flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-500">
                        <Navigation size={13} className="text-slate-400 shrink-0" />
                        <span>GPS not fetched yet. Click "Fetch Current Location".</span>
                      </div>
                    )}
                  </div>
                </div>

                {workshopLocation && (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 px-1 font-mono">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">
                      {workshopLocation.address || `${workshopLocation.area || 'Workshop Area'}, ${workshopLocation.city}`}
                    </span>
                  </div>
                )}
              </div>

                {/* Service Coverage Radius Slider - 1km to 20km Custom Range */}
                <div className="pt-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <label className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span>🎯 Service Coverage Radius</span>
                      </label>
                      <p className="text-[10px] text-slate-500 font-normal">
                        Select exact service distance around your workshop (1 km to 20 km)
                      </p>
                    </div>

                    {/* Interactive Stepper & Value Badge */}
                    <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setCoverageRadiusKm((prev) => Math.max(1, prev - 1))}
                        disabled={coverageRadiusKm <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold transition-all cursor-pointer"
                        title="Decrease 1 km"
                      >
                        <Minus size={14} />
                      </button>

                      <div className="flex items-center justify-center min-w-[58px] px-1 text-center font-extrabold text-blue-600 text-sm">
                        <span>{coverageRadiusKm}</span>
                        <span className="text-[11px] font-semibold text-slate-500 ml-0.5">km</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCoverageRadiusKm((prev) => Math.min(20, prev + 1))}
                        disabled={coverageRadiusKm >= 20}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold transition-all cursor-pointer"
                        title="Increase 1 km"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Smooth Real-Time Range Slider (1 to 20 km with dynamic fill & touch-none) */}
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min={1}
                      max={20}
                      step={1}
                      value={coverageRadiusKm}
                      onInput={(e) => {
                        const val = parseInt((e.target as HTMLInputElement).value, 10);
                        if (!isNaN(val)) setCoverageRadiusKm(Math.min(20, Math.max(1, val)));
                      }}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setCoverageRadiusKm(Math.min(20, Math.max(1, val)));
                      }}
                      className="w-full accent-blue-600 cursor-pointer h-2.5 rounded-lg appearance-none touch-none"
                      style={{
                        background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((coverageRadiusKm - 1) / 19) * 100}%, #e2e8f0 ${((coverageRadiusKm - 1) / 19) * 100}%, #e2e8f0 100%)`,
                      }}
                    />
                  </div>

                  {/* Quick One-Tap Preset Buttons */}
                  <div className="flex items-center justify-between gap-1 sm:gap-1.5">
                    {[1, 2, 3, 5, 8, 10, 15, 20].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setCoverageRadiusKm(step)}
                        className={`flex-1 py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                          coverageRadiusKm === step
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-105 z-10'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {step}k
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>1 km (Local)</span>
                    <span>5 km (City Zone)</span>
                    <span>10 km (Standard)</span>
                    <span>20 km (Max)</span>
                  </div>
                </div>
            </form>
          )}

          {/* STEP 2: MULTI-TRADE / SKILLS SELECTION */}
          {currentStep === 2 && (
            <form id="step-2-form" onSubmit={handleNext} className="space-y-4">
              <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-amber-950 text-xs">
                <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Select All Services You Provide</p>
                  <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                    You can select 1, 2, 3, or more categories (e.g. Electrician + AC Repair + Plumber).
                    Your shop will show up in customer searches for all selected trades!
                  </p>
                </div>
              </div>

              {/* Category Multi-Select Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CategoryLogo categoryId={cat.id} size="sm" className="w-7 h-7 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate">
                            {cat.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {cat.description}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold'
                            : 'border-2 border-slate-300 text-transparent'
                        }`}
                      >
                        <Check size={14} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Selected Trades:</span>
                <span className="font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  {selectedCategoryIds.length} Categories Selected
                </span>
              </div>
            </form>
          )}

          {/* STEP 3: AADHAAR ID & SHOP PHOTO */}
          {currentStep === 3 && (
            <form id="step-3-form" onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-4 flex items-start gap-3 text-emerald-950">
                <ShieldCheck size={24} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Photo Upload & Document Verification (Admin Desk: 8092805945)
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    Provide your 12-digit Aadhaar number and upload your store logo and Aadhaar card photo/document directly from your gallery or camera for official administrator approval.
                  </p>
                </div>
              </div>

              {/* Hidden File Inputs for Gallery/Camera Access */}
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoFileChange}
              />
              <input
                ref={aadhaarFrontFileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleAadhaarFrontFileChange}
              />
              <input
                ref={aadhaarBackFileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleAadhaarBackFileChange}
              />

              {/* 1. Shop Logo / Photo */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    Store / Shop Photo or Logo <span className="text-slate-500 font-semibold text-[11px] normal-case tracking-normal">(Optional)</span>
                  </label>
                  <span className="text-[11px] text-blue-700 font-semibold">Upload from Gallery or Camera</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-2xl">
                  <div className="flex flex-col sm:flex-row items-center gap-3.5">
                    {/* Logo Preview: Clean SVG camera/store placeholder icon when no image is uploaded */}
                    <div className="relative group shrink-0">
                      {companyLogoUrl && !logoLoadError ? (
                        <div className="relative">
                          <img
                            src={companyLogoUrl}
                            alt="Store logo preview"
                            onError={() => setLogoLoadError(true)}
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-600 shadow-sm bg-white shrink-0"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCompanyLogoUrl('');
                              setLogoFileName('');
                              setLogoLoadError(false);
                            }}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                            title="Remove photo"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => logoFileInputRef.current?.click()}
                          className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/40 flex flex-col items-center justify-center text-slate-400 shrink-0 cursor-pointer transition-all group shadow-2xs"
                          title="Click to select store logo or photo"
                        >
                          <div className="relative flex items-center justify-center">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Store size={18} />
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                              <Camera size={10} />
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-500 group-hover:text-blue-600 mt-1 uppercase tracking-tight transition-colors">
                            Upload Logo
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Logo Actions */}
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => logoFileInputRef.current?.click()}
                          className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <FolderOpen size={14} />
                          <span>Choose from Gallery</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => logoFileInputRef.current?.click()}
                          className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Camera size={14} className="text-slate-500" />
                          <span>Camera</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="truncate max-w-[200px]">
                          {logoFileName ? `📁 ${logoFileName}` : 'JPG, PNG, WebP (Max 8MB)'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCompanyLogoUrl(
                                'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80'
                              );
                              setLogoFileName('sample-shop-photo.jpg');
                              setLogoLoadError(false);
                              setErrorMessage(null);
                            }}
                            className="text-blue-600 hover:underline text-[10px] font-medium cursor-pointer"
                          >
                            Sample Photo
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setShowLogoUrlInput(!showLogoUrlInput)}
                            className="text-slate-600 hover:underline text-[10px] cursor-pointer"
                          >
                            {showLogoUrlInput ? 'Hide URL' : 'Enter URL'}
                          </button>
                        </div>
                      </div>

                      {showLogoUrlInput && (
                        <input
                          type="url"
                          value={companyLogoUrl}
                          onChange={(e) => {
                            setCompanyLogoUrl(e.target.value);
                            setLogoFileName('Custom URL');
                            setLogoLoadError(false);
                          }}
                          placeholder="https://..."
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 12-Digit Aadhaar Number (Mandatory) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span>12-Digit Aadhaar Number</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">UIDAI Identity Verification</span>
                </div>
                <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                  <ShieldCheck size={18} className="text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    maxLength={14}
                    value={aadhaarNumber}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                      const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
                      setAadhaarNumber(formatted);
                    }}
                    placeholder="e.g. 5432 8901 2345"
                    className="w-full bg-transparent outline-none text-sm text-slate-900 font-mono font-bold tracking-wider placeholder:tracking-normal placeholder:font-normal"
                    required
                  />
                  {aadhaarNumber.replace(/\D/g, '').length === 12 && (
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 ml-2" />
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  <span>Enter the 12 digits from your official Aadhaar card (e.g. 5432 8901 2345)</span>
                </div>
              </div>

              {/* 3. Streamlined Aadhaar KYC Action Card (Dual-Side Front & Back) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span>Aadhaar Identity Verification (Dual-Side)</span>
                    <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                      Mandatory *
                    </span>
                  </label>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    1.6:1 UIDAI Ratio • Compressed &lt;300 KB
                  </span>
                </div>

                {/* SINGLE STREAMLINED KYC ACTION CARD */}
                <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl shadow-md border border-blue-800/40 space-y-4">
                  {/* Card Header & Description */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
                        <ShieldCheck size={22} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>National ID KYC Verification</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold border border-emerald-500/30">
                            Required for Activation
                          </span>
                        </h4>
                        <p className="text-xs text-blue-200/80 leading-tight mt-0.5">
                          Capture or upload both sides of your official Aadhaar card for quick administrator verification.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL STATUS BADGES & DUAL-SIDE PREVIEWS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {/* FRONT SIDE */}
                    <div
                      className={`p-3 rounded-xl border transition-all ${
                        isFrontCaptured
                          ? 'bg-emerald-950/40 border-emerald-500/60'
                          : 'bg-slate-800/60 border-slate-700/80'
                      }`}
                    >
                      {/* Explicit Status Indicator Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-200">Front Side (Photo & Name)</span>
                        {isFrontCaptured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span>Front: Captured</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <AlertCircle size={12} className="text-amber-400" />
                            <span>Front: Pending</span>
                          </span>
                        )}
                      </div>

                      {/* Preview or Placeholder Box */}
                      {isFrontCaptured ? (
                        <div className="relative group">
                          <img
                            src={aadhaarDocUrl}
                            alt="Front Aadhaar Card"
                            className="w-full aspect-[1.6/1] object-cover rounded-lg border border-emerald-400/40 shadow-xs bg-black/40"
                          />
                          <button
                            type="button"
                            onClick={() => aadhaarFrontFileInputRef.current?.click()}
                            className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 hover:bg-black text-white rounded text-[10px] font-medium backdrop-blur-sm transition-colors cursor-pointer"
                          >
                            Replace
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => aadhaarFrontFileInputRef.current?.click()}
                          className="w-full aspect-[1.6/1] rounded-lg border-2 border-dashed border-slate-600 hover:border-blue-400 bg-slate-850/50 hover:bg-slate-800 flex flex-col items-center justify-center text-slate-400 cursor-pointer transition-colors p-2 text-center"
                        >
                          <FileCheck size={22} className="text-slate-500 mb-1" />
                          <span className="text-[11px] font-semibold text-slate-300">Front of Aadhaar</span>
                          <span className="text-[9px] text-slate-500">Must show clear face & UID</span>
                        </div>
                      )}
                    </div>

                    {/* BACK SIDE */}
                    <div
                      className={`p-3 rounded-xl border transition-all ${
                        isBackCaptured
                          ? 'bg-emerald-950/40 border-emerald-500/60'
                          : 'bg-slate-800/60 border-slate-700/80'
                      }`}
                    >
                      {/* Explicit Status Indicator Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-200">Back Side (Address & QR)</span>
                        {isBackCaptured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span>Back: Captured</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <AlertCircle size={12} className="text-amber-400" />
                            <span>Back: Pending</span>
                          </span>
                        )}
                      </div>

                      {/* Preview or Placeholder Box */}
                      {isBackCaptured ? (
                        <div className="relative group">
                          <img
                            src={aadhaarBackDocUrl}
                            alt="Back Aadhaar Card"
                            className="w-full aspect-[1.6/1] object-cover rounded-lg border border-emerald-400/40 shadow-xs bg-black/40"
                          />
                          <button
                            type="button"
                            onClick={() => aadhaarBackFileInputRef.current?.click()}
                            className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 hover:bg-black text-white rounded text-[10px] font-medium backdrop-blur-sm transition-colors cursor-pointer"
                          >
                            Replace
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => aadhaarBackFileInputRef.current?.click()}
                          className="w-full aspect-[1.6/1] rounded-lg border-2 border-dashed border-slate-600 hover:border-blue-400 bg-slate-850/50 hover:bg-slate-800 flex flex-col items-center justify-center text-slate-400 cursor-pointer transition-colors p-2 text-center"
                        >
                          <FileCheck size={22} className="text-slate-500 mb-1" />
                          <span className="text-[11px] font-semibold text-slate-300">Back of Aadhaar</span>
                          <span className="text-[9px] text-slate-500">Must show address & QR code</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2-in-1 MERGED AADHAAR PREVIEW (Compress & Merge 2 photos into 1 photo) */}
                  {mergedAadhaarDocUrl && (
                    <div className="p-3.5 bg-emerald-950/70 border-2 border-emerald-500/80 rounded-2xl space-y-2 mt-3">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                          <CheckCircle2 size={16} className="text-emerald-400" />
                          <span>2 Photos Merged into 1 Compressed Document</span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-900 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-700 font-semibold">
                          Compressed: {mergedSizeKb || '~180'} KB
                        </span>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-emerald-500/40 bg-black/50 max-h-48 overflow-y-auto">
                        <img
                          src={mergedAadhaarDocUrl}
                          alt="2-in-1 Merged Aadhaar Card"
                          className="w-full object-contain"
                        />
                      </div>
                      <p className="text-[11px] text-emerald-200/90 leading-tight">
                        Front and back sides combined into a single official verification card for instant Admin approval.
                      </p>
                    </div>
                  )}

                  {isMerging && (
                    <div className="p-3 bg-blue-950/60 border border-blue-500/40 rounded-xl flex items-center gap-2.5 text-xs text-blue-300 mt-2">
                      <RefreshCw size={15} className="animate-spin text-blue-400" />
                      <span>Compressing and merging front and back photos into 1 card document...</span>
                    </div>
                  )}

                  {/* STREAMLINED ACTION BUTTONS: One Primary + One Secondary */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                      {/* Primary Button */}
                      <button
                        type="button"
                        onClick={() => setIsGuidedKYCOpen(true)}
                        className="w-full sm:w-auto py-2.5 px-4.5 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <Camera size={16} className="text-slate-950" />
                        <span>Launch Guided Camera (Front & Back)</span>
                      </button>

                      {/* Secondary Button */}
                      <button
                        type="button"
                        onClick={handleGalleryUploadClick}
                        className="w-full sm:w-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <FolderOpen size={15} className="text-blue-400" />
                        <span>Upload from Gallery</span>
                      </button>
                    </div>

                    {/* Reset Helper */}
                    {(isFrontCaptured || isBackCaptured) && (
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={handleClearAadhaar}
                          className="text-red-400 hover:text-red-300 hover:underline font-medium cursor-pointer"
                        >
                          Clear Photos
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Real-time submission status notification */}
              {isSubmitting && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2.5 text-xs text-blue-800 font-semibold animate-pulse">
                  <RefreshCw size={16} className="animate-spin text-blue-600 shrink-0" />
                  <span>{submissionStatusText || 'Submitting application to Admin Dashboard...'}</span>
                </div>
              )}

              {isSubmissionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Application Submitted! You will now see this request in the Admin Dashboard.</span>
                </div>
              )}

              {/* Agreement */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAgreedTerms}
                    onChange={(e) => setHasAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    I confirm that the store details, contact numbers, and uploaded Aadhaar document are authentic.
                    I authorize NeedFix administrators to review my credentials before public directory activation.
                  </span>
                </label>
              </div>
            </form>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 shrink-0 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setCurrentStep((prev) => (prev - 1) as any);
              }}
              className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Previous</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="submit"
              form={`step-${currentStep}-form`}
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
              {!isAadhaarComplete && (
                <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                  <AlertCircle size={13} className="text-amber-600 shrink-0" />
                  <span>Front & Back Aadhaar cards required to submit</span>
                </span>
              )}
              <button
                type="submit"
                form="step-3-form"
                disabled={isSubmitting || !hasAgreedTerms || !isAadhaarComplete}
                className="py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-white" />
                    <span>{submissionStatusText || 'Submitting Application...'}</span>
                  </>
                ) : isSubmissionSuccess ? (
                  <>
                    <CheckCircle2 size={16} className="text-white" />
                    <span>Submitted to Admin!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Submit for Admin Approval</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* GUIDED DUAL-SIDE CAMERA KYC MODAL */}
      <GuidedAadhaarKYCModal
        isOpen={isGuidedKYCOpen}
        onClose={() => setIsGuidedKYCOpen(false)}
        currentUser={
          currentUser || {
            id: 'tech_kyc',
            name: companyName || 'Technician',
            mobile: mobile || '9999999999',
            countryCode: '+91',
            role: 'technician',
            createdAt: new Date().toISOString(),
          }
        }
        initialAadhaarNumber={aadhaarNumber}
        onKYCComplete={(data) => {
          setAadhaarNumber(data.aadhaarNumber);
          setAadhaarDocUrl(data.frontUrl);
          setAadhaarBackDocUrl(data.backUrl);
          if (data.mergedUrl) {
            setMergedAadhaarDocUrl(data.mergedUrl);
          }
          if (data.mergedBlob) {
            setMergedAadhaarBlob(data.mergedBlob);
            setMergedSizeKb(Math.round(data.mergedBlob.size / 1024));
          }
          setAadhaarFileName('Aadhaar-Dual-Side-Camera-KYC.jpg');
          setIsGuidedKYCComplete(true);
          setIsGuidedKYCOpen(false);
          setErrorMessage(null);
        }}
      />
    </div>
  );
};
