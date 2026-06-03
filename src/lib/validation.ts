/**
 * Validates if the given string is a valid UAE phone number.
 * Supported formats:
 * - Mobile: +971 5X XXX XXXX, 05X XXX XXXX, 5X XXX XXXX (9 digits after country code or 10 digits starting with 0)
 * - Landline: +971 [234679] XXX XXXX, 0[234679] XXX XXXX, [234679] XXX XXXX (8 digits after country code or 9 digits starting with 0)
 */
export function validateUAEPhone(phone: string): boolean {
  if (!phone) return false;
  // Clean spaces, hyphens, and parentheses
  const cleaned = phone.replace(/[\s\-()]/g, "");
  // Combined regex for UAE mobile and landlines:
  // - Starts with optional +971, 00971, or 0
  // - Followed by 5X (mobile) or 2, 3, 4, 6, 7, 9 (landline prefixes)
  // - Followed by 7 digits
  const uaeRegex = /^(?:\+971|00971|0)?(?:5\d|[234679])\d{7}$/;
  return uaeRegex.test(cleaned);
}

/**
 * Standardizes a valid UAE phone number to E.164 format (+9715XXXXXXXX).
 */
export function standardizeUAEPhone(phone: string): string {
  // Strip all non-digits
  let digits = phone.replace(/\D/g, "");
  
  if (digits.startsWith("00971")) {
    digits = digits.slice(5);
  } else if (digits.startsWith("971")) {
    digits = digits.slice(3);
  }
  
  // If it starts with 0 (like 050...), strip it
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  
  return `+971${digits}`;
}
