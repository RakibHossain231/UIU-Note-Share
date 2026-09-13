import { ResourceItem } from '../types';

/**
 * Converts a UIU 3-digit trimester code (e.g. "231", "241", "253") into a readable string (e.g. "Spring 2023", "Spring 2024", "Fall 2025")
 */
export function formatTrimesterCode(code?: string): string {
  if (!code) return 'General';
  const clean = code.trim();
  if (/^\d{3}$/.test(clean)) {
    const rawYear = parseInt(clean.slice(0, 2), 10);
    const fullYear = rawYear >= 90 ? 1900 + rawYear : 2000 + rawYear;
    const termDigit = clean.slice(2);
    let termName = 'Trimester';
    if (termDigit === '1') termName = 'Spring';
    else if (termDigit === '2') termName = 'Summer';
    else if (termDigit === '3') termName = 'Fall';
    return `${termName} ${fullYear}`;
  }
  return clean;
}

/**
 * Computes a numeric comparison score for any trimester representation.
 * Higher score = more recent trimester.
 * Examples:
 *   "231" -> 20231 (Spring 2023)
 *   "241" -> 20241 (Spring 2024)
 *   "243" -> 20243 (Fall 2024)
 *   "Spring 2023" -> 20231
 *   "Fall 2024" -> 20243
 */
export function getTrimesterScore(codeOrStr?: string): number {
  if (!codeOrStr) return 0;
  const str = codeOrStr.trim();
  if (!str) return 0;

  // Case 1: 3-digit UIU code (e.g. "231", "242", "253")
  if (/^\d{3}$/.test(str)) {
    const rawYear = parseInt(str.slice(0, 2), 10);
    const term = parseInt(str.slice(2), 10); // 1: Spring, 2: Summer, 3: Fall
    const fullYear = rawYear >= 90 ? 1900 + rawYear : 2000 + rawYear;
    return fullYear * 10 + (term > 0 && term <= 3 ? term : 1);
  }

  // Case 2: Text representation like "Spring 2023", "Fall 2024", "Summer 24"
  const lower = str.toLowerCase();
  let term = 1;
  if (lower.includes('spring')) term = 1;
  else if (lower.includes('summer')) term = 2;
  else if (lower.includes('fall')) term = 3;

  // 4-digit year like 2023, 2024
  const match4 = str.match(/\b(19\d{2}|20\d{2})\b/);
  if (match4) {
    const fullYear = parseInt(match4[1], 10);
    return fullYear * 10 + term;
  }

  // 2-digit year like '23, '24
  const match2 = str.match(/(?:['’]?|\b)(\d{2})\b/);
  if (match2 && (lower.includes('spring') || lower.includes('summer') || lower.includes('fall'))) {
    const rawYear = parseInt(match2[1], 10);
    const fullYear = rawYear >= 90 ? 1900 + rawYear : 2000 + rawYear;
    return fullYear * 10 + term;
  }

  return 0;
}

/**
 * Finds the latest updated trimester across all categories for a given course.
 * Returns a human-friendly formatted string (e.g. "Spring 2023", "Fall 2024") or null if no resources exist.
 */
export function getLatestTrimesterForCourse(resources: ResourceItem[]): string | null {
  if (!resources || resources.length === 0) return null;

  let bestScore = -1;
  let bestItem: ResourceItem | null = null;

  for (const item of resources) {
    let score = getTrimesterScore(item.trimesterCode);

    // Fallback if trimesterCode wasn't explicitly given or scored 0
    if (score === 0 && item.title) {
      score = getTrimesterScore(item.title);
    }
    if (score === 0 && item.description) {
      score = getTrimesterScore(item.description);
    }
    if (score === 0 && item.uploadDate) {
      const yearMatch = item.uploadDate.match(/\b(20\d{2})\b/);
      if (yearMatch) {
        score = parseInt(yearMatch[1], 10) * 10;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  if (!bestItem || bestScore <= 0) {
    // If items exist without any parsed year/term, return General
    return 'General';
  }

  // If the best item has a clean 3-digit trimester code
  if (bestItem.trimesterCode && /^\d{3}$/.test(bestItem.trimesterCode.trim())) {
    return formatTrimesterCode(bestItem.trimesterCode);
  }

  const year = Math.floor(bestScore / 10);
  const term = bestScore % 10;
  let termName = 'Trimester';
  if (term === 1) termName = 'Spring';
  else if (term === 2) termName = 'Summer';
  else if (term === 3) termName = 'Fall';

  if (year > 1990) {
    return `${termName} ${year}`;
  }

  return bestItem.trimesterCode ? formatTrimesterCode(bestItem.trimesterCode) : 'General';
}

export type NoteScope = 'mid' | 'final' | 'topicwise' | 'full' | 'general';

/**
 * Detects whether a note/resource covers Mid Term, Final Term, Topicwise, or Full Syllabus.
 */
export function detectNoteScope(item: { term?: string; title?: string; description?: string }): NoteScope {
  if (item.term === 'mid') return 'mid';
  if (item.term === 'final') return 'final';
  if (item.term === 'topicwise') return 'topicwise';
  if (item.term === 'full') return 'full';

  const t = ((item.title || '') + ' ' + (item.description || '')).toLowerCase();
  if (t.includes('mid') || t.includes('midterm')) return 'mid';
  if (t.includes('final')) return 'final';
  if (t.includes('topic') || t.includes('chapter') || t.includes('ch-') || t.includes('ch ') || t.includes('module')) return 'topicwise';
  if (t.includes('full') || t.includes('complete') || t.includes('all')) return 'full';

  return 'general';
}
