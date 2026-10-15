import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { ResourceItem } from '../types';

/**
 * Extracts Google Drive file ID if present.
 */
export function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];

  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];

  return null;
}

/**
 * Get direct download candidate URLs for a resource.
 */
export function getCandidateDownloadUrls(url: string): string[] {
  if (!url) return [];

  if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
    const fileId = extractDriveFileId(url);
    if (fileId) {
      return [
        `/api/drive-download?id=${fileId}`,
        `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`,
        `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`
      ];
    }
  }

  // Google Docs / Sheets / Slides export links
  if (url.includes('docs.google.com/document/d/')) {
    const docId = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/)?.[1];
    if (docId) return [`https://docs.google.com/document/d/${docId}/export?format=pdf`];
  }
  if (url.includes('docs.google.com/presentation/d/')) {
    const presId = url.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/)?.[1];
    if (presId) return [`https://docs.google.com/presentation/d/${presId}/export/pdf`];
  }
  if (url.includes('docs.google.com/spreadsheets/d/')) {
    const sheetId = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)?.[1];
    if (sheetId) return [`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=pdf`];
  }

  return [url];
}

/**
 * Ensures text only contains characters compatible with Standard PDF Type-1 Helvetica (WinAnsi).
 * Falls back safely to prevent encoding exceptions on non-Latin strings.
 */
export function sanitizeForPdf(text?: string, fallback = 'UIU Contributor'): string {
  if (!text) return fallback;
  let clean = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 32 && code <= 126) {
      clean += ch;
    }
  }
  clean = clean.trim();
  return clean.length > 0 ? clean : fallback;
}

/**
 * Attempts to fetch raw PDF binary bytes using same-origin proxy or direct fallbacks.
 */
export async function fetchPdfBinary(fileUrl: string): Promise<ArrayBuffer | null> {
  const candidates = getCandidateDownloadUrls(fileUrl);

  for (const targetUrl of candidates) {
    try {
      const response = await fetch(targetUrl, { mode: 'cors' });
      if (!response.ok) continue;

      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      if (contentType.includes('text/html')) {
        continue;
      }

      const buffer = await response.arrayBuffer();
      // Verify magic bytes: %PDF-
      if (buffer.byteLength >= 5) {
        const header = new TextDecoder().decode(buffer.slice(0, 5));
        if (header.startsWith('%PDF-')) {
          return buffer;
        }
      }

      // If it's a non-empty binary
      if (buffer.byteLength > 1000 && !contentType.includes('text/')) {
        return buffer;
      }
    } catch (err) {
      console.warn(`Could not fetch PDF from candidate: ${targetUrl}`, err);
    }
  }

  return null;
}

/**
 * Stretches or stamps the branding watermark onto every page of a PDF document:
 * Format: "UIU Note Share  •  Contributed by [Contributor Name]"
 */
export async function applyWatermarkToPdf(
  pdfBuffer: ArrayBuffer,
  contributorName?: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const cleanContributor = sanitizeForPdf(contributorName, 'UIU Contributor');
  const brandPrefix = 'UIU Note Share';
  const restText = `  •  Contributed by ${cleanContributor}`;
  const fontSize = 8.5;

  const brandWidth = fontBold.widthOfTextAtSize(brandPrefix, fontSize);
  const restWidth = fontRegular.widthOfTextAtSize(restText, fontSize);
  const totalWidth = brandWidth + restWidth;

  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const rot = (page.getRotation().angle % 360 + 360) % 360;

    if (rot === 0) {
      const startX = (width - totalWidth) / 2;
      const yPos = 14;

      // Subtle separator line above the footer
      page.drawLine({
        start: { x: Math.max(30, startX - 15), y: yPos + 11 },
        end: { x: Math.min(width - 30, startX + totalWidth + 15), y: yPos + 11 },
        thickness: 0.5,
        color: rgb(0.85, 0.85, 0.85),
        opacity: 0.6,
      });

      // UIU Note Share in Brand Orange (#FF6600 -> rgb(1, 0.4, 0))
      page.drawText(brandPrefix, {
        x: startX,
        y: yPos,
        size: fontSize,
        font: fontBold,
        color: rgb(1, 0.4, 0),
      });

      // Contributor attribution in dark gray
      page.drawText(restText, {
        x: startX + brandWidth,
        y: yPos,
        size: fontSize,
        font: fontRegular,
        color: rgb(0.35, 0.35, 0.35),
      });
    } else if (rot === 90) {
      // 90 deg clockwise
      const startY = (height + totalWidth) / 2;
      const xPos = 14;

      page.drawText(brandPrefix, {
        x: xPos,
        y: startY,
        size: fontSize,
        font: fontBold,
        color: rgb(1, 0.4, 0),
        rotate: degrees(90),
      });

      page.drawText(restText, {
        x: xPos,
        y: startY - brandWidth,
        size: fontSize,
        font: fontRegular,
        color: rgb(0.35, 0.35, 0.35),
        rotate: degrees(90),
      });
    } else if (rot === 180) {
      // 180 deg
      const startX = (width + totalWidth) / 2;
      const yPos = height - 14;

      page.drawText(brandPrefix, {
        x: startX,
        y: yPos,
        size: fontSize,
        font: fontBold,
        color: rgb(1, 0.4, 0),
        rotate: degrees(180),
      });

      page.drawText(restText, {
        x: startX - brandWidth,
        y: yPos,
        size: fontSize,
        font: fontRegular,
        color: rgb(0.35, 0.35, 0.35),
        rotate: degrees(180),
      });
    } else if (rot === 270) {
      // 270 deg
      const startY = (height - totalWidth) / 2;
      const xPos = width - 14;

      page.drawText(brandPrefix, {
        x: xPos,
        y: startY,
        size: fontSize,
        font: fontBold,
        color: rgb(1, 0.4, 0),
        rotate: degrees(270),
      });

      page.drawText(restText, {
        x: xPos,
        y: startY + brandWidth,
        size: fontSize,
        font: fontRegular,
        color: rgb(0.35, 0.35, 0.35),
        rotate: degrees(270),
      });
    }
  }

  return await pdfDoc.save();
}

/**
 * Triggers a file download in the browser without exposing Google Drive URL in hover status bar.
 */
export function triggerDirectDownload(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 100);
}

/**
 * Main function to download a resource with an automatic watermark.
 * If anything fails (CORS, offline, etc.), it gracefully falls back to direct download.
 */
export async function downloadResourceWithWatermark(
  item: ResourceItem,
  onStatusChange?: (status: 'fetching' | 'watermarking' | 'done' | 'fallback') => void
): Promise<void> {
  const rawTitle = item.title ? item.title.trim() : 'UIU_Note';
  const fileName = rawTitle.toLowerCase().endsWith('.pdf') ? rawTitle : `${rawTitle}.pdf`;

  // Check if candidate URL exists
  const candidates = getCandidateDownloadUrls(item.fileUrl);
  const fallbackUrl = candidates[0] || item.fileUrl;

  try {
    onStatusChange?.('fetching');
    const pdfBuffer = await fetchPdfBinary(item.fileUrl);

    if (!pdfBuffer) {
      console.warn('Could not fetch PDF binary via proxy, falling back to direct download');
      onStatusChange?.('fallback');
      triggerDirectDownload(fallbackUrl, fileName);
      return;
    }

    onStatusChange?.('watermarking');
    const watermarkedBytes = await applyWatermarkToPdf(pdfBuffer, item.contributor?.name);

    // Create a Blob from the watermarked PDF and download
    const blob = new Blob([watermarkedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    triggerDirectDownload(blobUrl, fileName);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

    onStatusChange?.('done');
  } catch (error) {
    console.error('Error in PDF watermark pipeline, using direct download:', error);
    onStatusChange?.('fallback');
    triggerDirectDownload(fallbackUrl, fileName);
  }
}
