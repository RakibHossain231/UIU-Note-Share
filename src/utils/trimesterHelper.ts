/**
 * Converts a UIU 3-digit trimester code (e.g. "261", "253") into a readable string (e.g. "Spring 2026", "Fall 2025")
 */
export function formatTrimesterCode(code?: string): string {
  if (!code) return 'General';
  const clean = code.trim();
  if (/^\d{3}$/.test(clean)) {
    const year = '20' + clean.slice(0, 2);
    const termDigit = clean.slice(2);
    let termName = 'Trimester';
    if (termDigit === '1') termName = 'Spring';
    else if (termDigit === '2') termName = 'Summer';
    else if (termDigit === '3') termName = 'Fall';
    return `${termName} ${year}`;
  }
  return clean;
}
