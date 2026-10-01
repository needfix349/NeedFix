/**
 * Returns the valid technician photo URL if the technician has explicitly chosen/uploaded one.
 * If the technician did NOT upload or select their own icon/photo (e.g. empty, unsplash, dicebear, placeholder),
 * it returns null so that NO person photo or dummy logo is displayed.
 */
export function getTechnicianDisplayPhoto(
  profilePhotoUrl?: string | null,
  companyLogoUrl?: string | null
): string | null {
  const url = (companyLogoUrl || profilePhotoUrl || '').trim();
  if (!url) return null;
  const lower = url.toLowerCase();
  if (
    lower.includes('unsplash.com') ||
    lower.includes('dicebear.com') ||
    lower.includes('placeholder') ||
    lower.includes('default') ||
    lower.includes('sample-shop-photo')
  ) {
    return null;
  }
  return url;
}

/**
 * Returns clean uppercase 1-2 initials for technician/company name fallback
 */
export function getTechnicianInitials(name?: string, company?: string): string {
  const target = (company || name || 'T').trim();
  const words = target.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return target.slice(0, 2).toUpperCase();
}
