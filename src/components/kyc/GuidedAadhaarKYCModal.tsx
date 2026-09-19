import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  FolderOpen,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Lock,
  Calendar,
  User,
  Zap,
  Check,
} from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { storageService } from '../../services/storage';
import { UserProfile } from '../../types';

interface GuidedAadhaarKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  initialAadhaarNumber?: string;
  onKYCComplete?: (kycData: {
    aadhaarNumber: string;
    fullName: string;
    dob: string;
    frontUrl: string;
    backUrl: string;
  }) => void;
}

interface CapturedCardSide {
  blob: Blob;
  previewUrl: string;
  sizeKb: number;
}

export const GuidedAadhaarKYCModal: React.FC<GuidedAadhaarKYCModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialAadhaarNumber = '',
  onKYCComplete,
}) => {
  // Step state: 1 = Front side, 2 = Back side, 3 = Review & Submit
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Captured images for both sides
  const [frontSide, setFrontSide] = useState<CapturedCardSide | null>(null);
  const [backSide, setBackSide] = useState<CapturedCardSide | null>(null);

  // Manual Form Fields
  const [aadhaarNumber, setAadhaarNumber] = useState<string>(() => {
    if (initialAadhaarNumber) {
      const raw = initialAadhaarNumber.replace(/\D/g, '').slice(0, 12);
      return raw.replace(/(\d{4})(?=\d)/g, '$1-');
    }
    return '';
  });
  const [fullName, setFullName] = useState<string>(currentUser.name || '');
  const [dob, setDob] = useState<string>('1992-05-15');

  // Camera & Stream states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cardFrameOverlayRef = useRef<HTMLDivElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsTorchOn(false);
    setHasTorch(false);
  }, []);

  // Start camera helper
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);

    // If browser does not support getUserMedia
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported on this browser. Please use the "Upload from Gallery" option.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      setIsCameraActive(true);

      // Check for torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities ? (videoTrack.getCapabilities() as any) : {};
        if (capabilities.torch) {
          setHasTorch(true);
        }
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      let msg = 'Unable to access device camera. Please check your camera permissions.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera access in your browser or select an image from gallery.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera found on this device. Please select an image from your gallery.';
      }
      setCameraError(msg);
      setIsCameraActive(false);
    }
  }, [facingMode, stopCamera]);

  // Handle Torch toggle
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const nextTorch = !isTorchOn;
      await (videoTrack as any).applyConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setIsTorchOn(nextTorch);
    } catch (e) {
      console.warn('Could not toggle torch:', e);
    }
  };

  // Switch between back and front camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Camera lifecycle based on modal open and current step
  useEffect(() => {
    if (isOpen && (currentStep === 1 || currentStep === 2)) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, currentStep, facingMode, startCamera, stopCamera]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (frontSide?.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(frontSide.previewUrl);
      }
      if (backSide?.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(backSide.previewUrl);
      }
    };
  }, [frontSide, backSide]);

  // Client-Side Canvas Image Crop strictly to 1.6:1 card frame & compress below 300KB
  const processImageToCardBlob = (
    source: CanvasImageSource,
    sourceCrop: { sx: number; sy: number; sw: number; sh: number }
  ): Promise<CapturedCardSide> => {
    return new Promise((resolve, reject) => {
      // Standard ID-1 Card aspect ratio is 1.6:1 (e.g. 960x600 px)
      const targetWidth = 960;
      const targetHeight = 600;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('HTML5 Canvas context unavailable'));
        return;
      }

      // Smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw cropped card area strictly to canvas
      ctx.drawImage(
        source,
        sourceCrop.sx,
        sourceCrop.sy,
        sourceCrop.sw,
        sourceCrop.sh,
        0,
        0,
        targetWidth,
        targetHeight
      );

      // Compression pass with native canvas.toBlob (target strictly < 300 KB)
      const attemptCompress = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Image blob conversion failed'));
              return;
            }

            const sizeKb = Math.round(blob.size / 1024);

            // If exceeds 300 KB, do a second compression pass at lower quality
            if (sizeKb > 300 && quality > 0.4) {
              attemptCompress(quality - 0.2);
              return;
            }

            const previewUrl = URL.createObjectURL(blob);
            resolve({
              blob,
              previewUrl,
              sizeKb,
            });
          },
          'image/jpeg',
          quality
        );
      };

      attemptCompress(0.75);
    });
  };

  // Capture photo from Live Camera Feed
  const handleCapturePhoto = async () => {
    if (!videoRef.current || !cardFrameOverlayRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const video = videoRef.current;
      const videoRect = video.getBoundingClientRect();
      const frameRect = cardFrameOverlayRef.current.getBoundingClientRect();

      const vidWidth = video.videoWidth;
      const vidHeight = video.videoHeight;

      if (!vidWidth || !vidHeight) {
        throw new Error('Video frame not loaded yet.');
      }

      // Calculate the display scale factor (object-fit: cover)
      const scaleX = vidWidth / videoRect.width;
      const scaleY = vidHeight / videoRect.height;
      const scale = Math.max(scaleX, scaleY);

      const displayedVideoWidth = vidWidth / scale;
      const displayedVideoHeight = vidHeight / scale;

      const offsetX = (videoRect.width - displayedVideoWidth) / 2;
      const offsetY = (videoRect.height - displayedVideoHeight) / 2;

      // Crop coordinates in video source space
      const cropX = Math.max(0, (frameRect.left - videoRect.left - offsetX) * scale);
      const cropY = Math.max(0, (frameRect.top - videoRect.top - offsetY) * scale);
      const cropW = Math.min(vidWidth - cropX, frameRect.width * scale);
      const cropH = Math.min(vidHeight - cropY, frameRect.height * scale);

      const capturedCard = await processImageToCardBlob(video, {
        sx: cropX,
        sy: cropY,
        sw: cropW,
        sh: cropH,
      });

      if (currentStep === 1) {
        setFrontSide(capturedCard);
        setCurrentStep(2); // Automatically advance to Step 2: Back Side
      } else if (currentStep === 2) {
        setBackSide(capturedCard);
        setCurrentStep(3); // Advance to Step 3: Review & Submit
      }
    } catch (err: any) {
      console.warn('Capture error:', err);
      setCameraError('Failed to capture card frame. Please try again or upload from gallery.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Fallback: Gallery File Picker with Canvas 1.6:1 Card Crop & Compression
  const handleGalleryFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = async () => {
      try {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        // Card ratio is 1.6:1
        const targetRatio = 1.6;
        let cropW = iw;
        let cropH = iw / targetRatio;

        if (cropH > ih) {
          cropH = ih;
          cropW = ih * targetRatio;
        }

        const cropX = (iw - cropW) / 2;
        const cropY = (ih - cropH) / 2;

        const capturedCard = await processImageToCardBlob(img, {
          sx: cropX,
          sy: cropY,
          sw: cropW,
          sh: cropH,
        });

        if (currentStep === 1) {
          setFrontSide(capturedCard);
          setCurrentStep(2);
        } else if (currentStep === 2) {
          setBackSide(capturedCard);
          setCurrentStep(3);
        }
      } catch (cropErr) {
        console.warn('Gallery image processing error:', cropErr);
        setCameraError('Failed to process uploaded image. Please pick another photo.');
      } finally {
        URL.revokeObjectURL(objectUrl);
        if (galleryInputRef.current) galleryInputRef.current.value = '';
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setCameraError('Could not load selected image file.');
    };
  };

  // Aadhaar Number Input Visual Formatter: 12 digits formatted as "xxxx-xxxx-xxxx"
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 12);
    // Format into xxxx-xxxx-xxxx chunks
    const formatted = cleanDigits.replace(/(\d{4})(?=\d)/g, '$1-');
    setAadhaarNumber(formatted);
  };

  // Final Submission: Upload to Supabase Storage Bucket `kyc-documents/aadhaar/` & Update Profile
  const handleSubmitKYC = async () => {
    setSubmitError(null);

    const cleanAadhaar = aadhaarNumber.replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      setSubmitError('Please enter a valid 12-digit Aadhaar number (e.g. 5432-8901-2345).');
      return;
    }

    if (!fullName.trim()) {
      setSubmitError('Please enter your Full Name as printed on your Aadhaar card.');
      return;
    }

    if (!frontSide) {
      setSubmitError('Front Side Aadhaar photo is missing. Please capture Step 1.');
      return;
    }

    if (!backSide) {
      setSubmitError('Back Side Aadhaar photo is missing. Please capture Step 2.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload Front Side to Supabase Storage bucket `kyc-documents/aadhaar/`
      const frontUrl = await supabaseService.uploadKYCDocument(
        frontSide.blob,
        currentUser.id,
        'aadhaar',
        'front',
        'aadhaar_front.jpg'
      );

      // 2. Upload Back Side to Supabase Storage bucket `kyc-documents/aadhaar/`
      const backUrl = await supabaseService.uploadKYCDocument(
        backSide.blob,
        currentUser.id,
        'aadhaar',
        'back',
        'aadhaar_back.jpg'
      );

      // 3. Update User Profile in Supabase DB with kyc_status: "pending_verification"
      await supabaseService.updateUserKYCStatus(currentUser.id, {
        kyc_status: 'pending_verification',
        aadhaar_number: aadhaarNumber,
        aadhaar_front_url: frontUrl,
        aadhaar_back_url: backUrl,
        full_name_aadhaar: fullName.trim(),
        dob: dob,
      });

      // 4. Update local storage profile state for instant offline reactivity
      storageService.updateUserKYC(currentUser.id, {
        kyc_status: 'pending_verification',
        aadhaar_number: aadhaarNumber,
        aadhaar_front_url: frontUrl,
        aadhaar_back_url: backUrl,
        full_name_aadhaar: fullName.trim(),
        dob: dob,
      });

      setIsSubmittedSuccess(true);

      if (onKYCComplete) {
        onKYCComplete({
          aadhaarNumber,
          fullName: fullName.trim(),
          dob,
          frontUrl,
          backUrl,
        });
      }

      // Auto close after 3 seconds or user can tap close
      setTimeout(() => {
        setIsSubmittedSuccess(false);
        onClose();
      }, 3500);
    } catch (err: any) {
      console.warn('KYC Submission error:', err);
      setSubmitError(err?.message || 'KYC submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Aadhaar KYC Camera Verification"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm animate-fade-in overflow-x-hidden max-w-full"
    >
      <div className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-xl bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 flex flex-col max-h-[92vh] box-border">
        {/* MODAL HEADER */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Guided Aadhaar Camera KYC</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  UIDAI Card
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                100% Native Browser KYC • Zero Third-Party Tools • Compressed &lt;300 KB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* 3-STEP PROGRESS STEPPER */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-900/90 border-b border-slate-800/80 grid grid-cols-3 gap-2 shrink-0">
          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all text-left ${
              currentStep === 1
                ? 'bg-blue-600 text-white shadow-xs'
                : frontSide
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                : 'bg-slate-800/60 text-slate-400'
            }`}
          >
            {frontSide ? (
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center shrink-0">
                1
              </span>
            )}
            <span className="truncate">Front Side</span>
          </button>

          {/* Step 2 Pill */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            disabled={!frontSide}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all text-left ${
              currentStep === 2
                ? 'bg-blue-600 text-white shadow-xs'
                : backSide
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                : 'bg-slate-800/60 text-slate-400 disabled:opacity-40'
            }`}
          >
            {backSide ? (
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center shrink-0">
                2
              </span>
            )}
            <span className="truncate">Back Side</span>
          </button>

          {/* Step 3 Pill */}
          <button
            type="button"
            onClick={() => {
              if (frontSide && backSide) setCurrentStep(3);
            }}
            disabled={!frontSide || !backSide}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all text-left ${
              currentStep === 3
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800/60 text-slate-400 disabled:opacity-40'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center shrink-0">
              3
            </span>
            <span className="truncate">Review & Submit</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* STEP 1 & STEP 2: GUIDED CAMERA VIEW WITH 1.6:1 OVERLAY */}
          {(currentStep === 1 || currentStep === 2) && (
            <div className="space-y-3">
              {/* Guidance Cue Banner */}
              <div className="flex items-center justify-between px-3 py-2 bg-slate-800/70 border border-slate-700/60 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-emerald-300">
                    {currentStep === 1
                      ? 'Align Aadhaar Front inside frame'
                      : 'Align Aadhaar Back inside frame'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">1.6:1 ID Card Ratio</span>
              </div>

              {cameraError && (
                <div className="p-3 bg-red-950/80 border border-red-700 text-red-200 rounded-2xl text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-red-400" />
                  <div className="flex-1">{cameraError}</div>
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="py-1 px-2 bg-red-900 hover:bg-red-800 text-white rounded-lg font-bold text-[11px]"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* CAMERA VIEWFINDER CONTAINER */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-inner flex items-center justify-center">
                {/* Live Video Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover ${
                    facingMode === 'user' ? 'scale-x-[-1]' : ''
                  }`}
                />

                {/* Dark Vignette Mask with Central Rounded Card Cutout */}
                <div className="absolute inset-0 bg-black/60 pointer-events-none flex items-center justify-center p-3">
                  {/* CENTRAL 1.6:1 CARD OVERLAY FRAME */}
                  <div
                    ref={cardFrameOverlayRef}
                    className="relative w-full max-w-[420px] aspect-[1.6/1] rounded-2xl border-2 border-emerald-400/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] flex flex-col justify-between p-3"
                  >
                    {/* Corner Indicators (L-shapes in vibrant green) */}
                    <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

                    {/* Subtle Top Cue inside card */}
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-300 drop-shadow">
                      <span>{currentStep === 1 ? 'Front Photo / Name Side' : 'Back Address Side'}</span>
                      <span>UIDAI</span>
                    </div>

                    {/* Subtle Center Scanline or Watermark */}
                    <div className="text-center opacity-40">
                      <ShieldCheck size={32} className="mx-auto text-emerald-400 mb-1" />
                      <span className="text-[10px] tracking-widest uppercase font-mono text-emerald-200">
                        {currentStep === 1 ? 'Aadhaar Front' : 'Aadhaar Back'}
                      </span>
                    </div>

                    {/* Subtle Bottom Instruction */}
                    <div className="text-center text-[11px] font-medium text-white/90 bg-black/40 py-0.5 px-2 rounded-full mx-auto backdrop-blur-xs">
                      {currentStep === 1
                        ? 'Fit front photo & 12 digits inside box'
                        : 'Fit barcode & address inside box'}
                    </div>
                  </div>
                </div>

                {/* Camera Control Badges (Flip Camera, Torch) */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                  {hasTorch && (
                    <button
                      type="button"
                      onClick={toggleTorch}
                      className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                        isTorchOn ? 'bg-amber-500 text-black' : 'bg-black/60 text-white hover:bg-black/80'
                      }`}
                      title={isTorchOn ? 'Turn Torch Off' : 'Turn Torch On'}
                    >
                      <Zap size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all"
                    title="Switch Back / Front Camera"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>

              {/* ACTION BAR: Shutter Button & Gallery Fallback */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                {/* Fallback "Upload from Gallery" File Picker */}
                <div>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryFileSelected}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors w-full sm:w-auto justify-center cursor-pointer"
                  >
                    <FolderOpen size={15} className="text-blue-400" />
                    <span>Upload from Gallery</span>
                  </button>
                </div>

                {/* Main Shutter Capture Button */}
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  disabled={isCapturing || !isCameraActive}
                  className="w-full sm:w-auto py-3 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  {isCapturing ? (
                    <RefreshCw size={18} className="animate-spin text-slate-950" />
                  ) : (
                    <Camera size={18} className="text-slate-950" />
                  )}
                  <span>
                    {isCapturing
                      ? 'Cropping & Compressing...'
                      : currentStep === 1
                      ? 'Capture Aadhaar Front'
                      : 'Capture Aadhaar Back'}
                  </span>
                </button>
              </div>

              {/* Already Captured Preview Thumbnails below camera */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div
                  onClick={() => setCurrentStep(1)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    frontSide
                      ? 'bg-slate-800/80 border-emerald-500/50'
                      : 'bg-slate-900 border-dashed border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-300">Front Side</span>
                    {frontSide ? (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        {frontSide.sizeKb} KB • Ready
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Not Captured</span>
                    )}
                  </div>
                  {frontSide ? (
                    <img
                      src={frontSide.previewUrl}
                      alt="Front Captured"
                      className="w-full aspect-[1.6/1] object-cover rounded-lg border border-slate-700"
                    />
                  ) : (
                    <div className="w-full aspect-[1.6/1] bg-slate-950 rounded-lg flex items-center justify-center text-slate-600 text-xs font-mono">
                      Step 1
                    </div>
                  )}
                </div>

                <div
                  onClick={() => {
                    if (frontSide) setCurrentStep(2);
                  }}
                  className={`p-2 rounded-xl border transition-all ${
                    frontSide ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  } ${
                    backSide
                      ? 'bg-slate-800/80 border-emerald-500/50'
                      : 'bg-slate-900 border-dashed border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-300">Back Side</span>
                    {backSide ? (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        {backSide.sizeKb} KB • Ready
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Not Captured</span>
                    )}
                  </div>
                  {backSide ? (
                    <img
                      src={backSide.previewUrl}
                      alt="Back Captured"
                      className="w-full aspect-[1.6/1] object-cover rounded-lg border border-slate-700"
                    />
                  ) : (
                    <div className="w-full aspect-[1.6/1] bg-slate-950 rounded-lg flex items-center justify-center text-slate-600 text-xs font-mono">
                      Step 2
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DATA REVIEW & SUBMISSION FORM */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              {/* Success Notification Banner */}
              {isSubmittedSuccess ? (
                <div className="p-5 bg-emerald-950/90 border-2 border-emerald-500 rounded-3xl text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 mx-auto flex items-center justify-center shadow-lg">
                    <Check size={24} />
                  </div>
                  <h4 className="text-base font-extrabold text-emerald-200">
                    Aadhaar KYC Submitted Successfully!
                  </h4>
                  <p className="text-xs text-emerald-300/90 max-w-md mx-auto leading-relaxed">
                    Status set to <span className="font-bold text-white font-mono">pending_verification</span>. Documents uploaded to Supabase Storage (<span className="font-mono text-white">kyc-documents/aadhaar/</span>).
                  </p>
                </div>
              ) : null}

              {submitError && (
                <div className="p-3 bg-red-950/90 border border-red-700 text-red-200 rounded-2xl text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-red-400" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* DUAL-SIDE CAPTURED CARDS REVIEW PREVIEWS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Front Side Card Card */}
                <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      Front Side (Photo)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {frontSide?.sizeKb} KB (&lt;300 KB)
                    </span>
                  </div>
                  {frontSide && (
                    <img
                      src={frontSide.previewUrl}
                      alt="Front Aadhaar"
                      className="w-full aspect-[1.6/1] object-cover rounded-xl border border-slate-700 shadow-sm"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-full py-1.5 px-3 bg-slate-700/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Retake Front Side</span>
                  </button>
                </div>

                {/* Back Side Card Card */}
                <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      Back Side (Address)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {backSide?.sizeKb} KB (&lt;300 KB)
                    </span>
                  </div>
                  {backSide && (
                    <img
                      src={backSide.previewUrl}
                      alt="Back Aadhaar"
                      className="w-full aspect-[1.6/1] object-cover rounded-xl border border-slate-700 shadow-sm"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-1.5 px-3 bg-slate-700/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Retake Back Side</span>
                  </button>
                </div>
              </div>

              {/* MANUAL FORM FIELDS */}
              <div className="p-4 bg-slate-800/50 border border-slate-700/80 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-blue-400" />
                    <span>UIDAI Aadhaar Credentials</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">All Fields Required</span>
                </div>

                {/* 1. Aadhaar Number with xxxx-xxxx-xxxx visual formatting */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    12-Digit Aadhaar Number (xxxx-xxxx-xxxx) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={aadhaarNumber}
                      onChange={handleAadhaarChange}
                      placeholder="e.g. 5432-8901-2345"
                      maxLength={14}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white tracking-widest placeholder:tracking-normal placeholder:font-normal outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {aadhaarNumber.replace(/\D/g, '').length === 12 && (
                      <CheckCircle2
                        size={18}
                        className="absolute right-3 top-3 text-emerald-400 pointer-events-none"
                      />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Enter the 12 digits as printed on your Aadhaar card.
                  </p>
                </div>

                {/* 2. Full Name as on Aadhaar */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name (As on Aadhaar) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 3. Date of Birth (DOB) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Date of Birth (DOB) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* STORAGE BUCKET SPECIFICATION NOTE */}
              <div className="p-3 bg-blue-950/50 border border-blue-800/60 rounded-xl text-xs text-blue-200 flex items-start gap-2">
                <Lock size={15} className="text-blue-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed text-[11px]">
                  Files will be uploaded directly to Supabase Storage Bucket{' '}
                  <span className="font-mono font-bold text-white bg-blue-900/60 px-1 py-0.5 rounded">
                    kyc-documents/aadhaar/
                  </span>
                  . Your profile will be marked{' '}
                  <span className="font-mono font-bold text-white bg-blue-900/60 px-1 py-0.5 rounded">
                    kyc_status: "pending_verification"
                  </span>{' '}
                  for admin authorization.
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="button"
                onClick={handleSubmitKYC}
                disabled={isSubmitting || isSubmittedSuccess}
                className="w-full py-3 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={17} className="animate-spin text-slate-950" />
                    <span>Uploading to kyc-documents/aadhaar/ ...</span>
                  </>
                ) : isSubmittedSuccess ? (
                  <>
                    <Check size={18} className="text-slate-950" />
                    <span>KYC Application Submitted!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} className="text-slate-950" />
                    <span>Submit Aadhaar KYC for Verification</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
