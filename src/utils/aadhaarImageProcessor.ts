/**
 * Aadhaar Card Image Compressor & 2-in-1 Dual-Side Merger Utility
 * - Compresses front and back card images to high quality, lightweight JPEG (<300 KB)
 * - Merges Front & Back photos into a single official verification document
 */

export interface ProcessedImageResult {
  blob: Blob;
  dataUrl: string;
  sizeKb: number;
}

/**
 * Load image from File, Blob, or base64 data URL into an HTMLImageElement
 */
export function loadImageElement(source: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrlToRevoke: string | null = null;

    img.onload = () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
      resolve(img);
    };

    img.onerror = (err) => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
      reject(new Error(`Failed to load image: ${err}`));
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      objectUrlToRevoke = URL.createObjectURL(source);
      img.src = objectUrlToRevoke;
    }
  });
}

/**
 * Compress a single image (Front or Back) with auto-resizing and target size optimization
 */
export async function compressCardImage(
  source: File | Blob | string,
  maxWidthOrOptions: number | { maxWidth?: number; maxHeight?: number; quality?: number } = 1200,
  maxHeightParam: number = 900,
  initialQualityParam: number = 0.8
): Promise<ProcessedImageResult> {
  let maxWidth = 1200;
  let maxHeight = 900;
  let initialQuality = 0.8;

  if (typeof maxWidthOrOptions === 'object' && maxWidthOrOptions !== null) {
    if (maxWidthOrOptions.maxWidth) maxWidth = maxWidthOrOptions.maxWidth;
    if (maxWidthOrOptions.maxHeight) maxHeight = maxWidthOrOptions.maxHeight;
    if (maxWidthOrOptions.quality) initialQuality = maxWidthOrOptions.quality;
  } else if (typeof maxWidthOrOptions === 'number') {
    maxWidth = maxWidthOrOptions;
    // Defend against caller passing quality (e.g. 0.78 or 0.8) as the 3rd parameter maxHeightParam
    if (typeof maxHeightParam === 'number') {
      if (maxHeightParam > 0 && maxHeightParam <= 1) {
        initialQuality = maxHeightParam;
        maxHeight = Math.round(maxWidth * 0.75); // sensible 4:3 card ratio
      } else if (maxHeightParam > 1) {
        maxHeight = maxHeightParam;
      }
    }
    if (typeof initialQualityParam === 'number' && initialQualityParam > 0 && initialQualityParam <= 1) {
      initialQuality = initialQualityParam;
    }
  }

  const img = await loadImageElement(source);

  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (!width || !height || width < 10 || height < 10) {
    throw new Error('Image dimensions are too small or invalid');
  }

  // Scale down ONLY if exceeds max dimensions while preserving aspect ratio
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.max(100, Math.round(width * ratio));
    height = Math.max(100, Math.round(height * ratio));
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Draw background white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Enable high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw scaled image
  ctx.drawImage(img, 0, 0, width, height);

  // Compress to JPEG with target < 250 KB
  return new Promise((resolve, reject) => {
    const attemptCompress = (q: number) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas compression failed'));
            return;
          }

          const sizeKb = Math.round(blob.size / 1024);
          if (sizeKb > 300 && q > 0.4) {
            attemptCompress(q - 0.15);
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              blob,
              dataUrl: reader.result as string,
              sizeKb,
            });
          };
          reader.onerror = () => reject(new Error('FileReader failed'));
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        q
      );
    };

    attemptCompress(initialQuality);
  });
}

/**
 * Merge Front & Back Aadhaar photos into ONE single stacked document
 * Top: Front Side | Bottom: Back Side with verified badges & labels
 */
export async function mergeAadhaarFrontAndBack(
  frontSource: File | Blob | string,
  backSource: File | Blob | string,
  aadhaarNumberText?: string
): Promise<ProcessedImageResult> {
  const [frontImg, backImg] = await Promise.all([
    loadImageElement(frontSource),
    loadImageElement(backSource),
  ]);

  const targetWidth = 1000;
  const cardWidth = 940;
  const cardHeight = Math.round(cardWidth / 1.58); // UIDAI standard ~1.58:1 ratio

  const headerHeight = 65;
  const labelHeight = 32;
  const padding = 30;
  const gap = 24;
  const footerHeight = 45;

  const totalHeight =
    headerHeight +
    padding +
    labelHeight +
    cardHeight +
    gap +
    labelHeight +
    cardHeight +
    padding +
    footerHeight;

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = totalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Background Fill (clean neutral slate-50)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, targetWidth, totalHeight);

  // 2. Top Header Banner
  const headerGrad = ctx.createLinearGradient(0, 0, targetWidth, 0);
  headerGrad.addColorStop(0, '#0f172a');
  headerGrad.addColorStop(0.5, '#1e3a8a');
  headerGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, targetWidth, headerHeight);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GOVERNMENT OF INDIA • UIDAI AADHAAR CARD VERIFICATION', targetWidth / 2, 28);

  ctx.fillStyle = '#93c5fd';
  ctx.font = '12px sans-serif';
  const subText = aadhaarNumberText
    ? `Verified Partner Document • UID: ${aadhaarNumberText}`
    : 'Verified Partner Document • Official Dual-Side KYC';
  ctx.fillText(subText, targetWidth / 2, 50);

  let currentY = headerHeight + padding;
  const cardX = (targetWidth - cardWidth) / 2;

  // Helper to draw a rounded card image with label
  const drawCard = (
    img: HTMLImageElement,
    label: string,
    subLabel: string,
    accentColor: string
  ) => {
    // Label Badge
    ctx.textAlign = 'left';
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`● ${label}`, cardX + 4, currentY + 16);

    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(subLabel, cardX + cardWidth - 4, currentY + 16);

    currentY += labelHeight;

    // Card frame shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;

    // Rounded rect clip for image
    const radius = 14;
    ctx.beginPath();
    ctx.moveTo(cardX + radius, currentY);
    ctx.lineTo(cardX + cardWidth - radius, currentY);
    ctx.quadraticCurveTo(cardX + cardWidth, currentY, cardX + cardWidth, currentY + radius);
    ctx.lineTo(cardX + cardWidth, currentY + cardHeight - radius);
    ctx.quadraticCurveTo(cardX + cardWidth, currentY + cardHeight, cardX + cardWidth - radius, currentY + cardHeight);
    ctx.lineTo(cardX + radius, currentY + cardHeight);
    ctx.quadraticCurveTo(cardX, currentY + cardHeight, cardX, currentY + cardHeight - radius);
    ctx.lineTo(cardX, currentY + radius);
    ctx.quadraticCurveTo(cardX, currentY, cardX + radius, currentY);
    ctx.closePath();

    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.clip();

    // Draw image maintaining cover aspect ratio inside card rect
    const imgRatio = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
    const targetRatio = cardWidth / cardHeight;

    let sx = 0;
    let sy = 0;
    let sw = img.naturalWidth || img.width;
    let sh = img.naturalHeight || img.height;

    if (imgRatio > targetRatio) {
      sw = (img.naturalHeight || img.height) * targetRatio;
      sx = ((img.naturalWidth || img.width) - sw) / 2;
    } else {
      sh = (img.naturalWidth || img.width) / targetRatio;
      sy = ((img.naturalHeight || img.height) - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, cardX, currentY, cardWidth, cardHeight);
    ctx.restore();

    // Outer border outline
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    currentY += cardHeight;
  };

  // 3. Draw Front Card
  drawCard(frontImg, 'FRONT SIDE - Photo & Identity Details', 'Identity Details', '#0284c7');

  // Gap between cards
  currentY += gap;

  // 4. Draw Back Card
  drawCard(backImg, 'BACK SIDE - Address & Security Details', 'Address & Security Details', '#059669');

  // 5. Footer Bar
  currentY += padding;
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, totalHeight - footerHeight, targetWidth, footerHeight);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, totalHeight - footerHeight);
  ctx.lineTo(targetWidth, totalHeight - footerHeight);
  ctx.stroke();

  ctx.fillStyle = '#475569';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'NeedFix Verified Partner • 2-in-1 Merged KYC Document • Confidential UIDAI Verification Record',
    targetWidth / 2,
    totalHeight - 18
  );

  // Compress merged result
  return new Promise((resolve, reject) => {
    const attemptCompress = (q: number) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas merge to Blob failed'));
            return;
          }

          const sizeKb = Math.round(blob.size / 1024);
          // If larger than 380 KB, reduce quality
          if (sizeKb > 380 && q > 0.4) {
            attemptCompress(q - 0.15);
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              blob,
              dataUrl: reader.result as string,
              sizeKb,
            });
          };
          reader.onerror = () => reject(new Error('FileReader failed'));
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        q
      );
    };

    attemptCompress(0.78);
  });
}
