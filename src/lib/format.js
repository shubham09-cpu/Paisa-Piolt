/** Clamp a number into [min, max]. */
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Format a number as Indian rupees, e.g. 12500 -> "₹12,500". */
export function formatINR(value) {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? '-' : '';
  return `${sign}₹${Math.abs(rounded).toLocaleString('en-IN')}`;
}
