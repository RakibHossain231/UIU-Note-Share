import JSZip from 'jszip';
import { ResourceItem } from '../types';

export interface DownloadProgress {
  currentFile: string;
  loaded: number;
  total: number;
  percentage: number;
  status: 'idle' | 'downloading' | 'compressing' | 'complete' | 'error';
  errorMessage?: string;
}

/**
 * Extracts all possible direct binary download URLs for a given resource URL.
 * Google Drive links are automatically converted to direct download endpoints
 * with CORS-enabled usercontent domains.
 */
function getDownloadUrls(url: string): string[] {
  if (!url) return [];

  // Google Drive links
  if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
    const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const fileId = (matchD && matchD[1]) || (matchId && matchId[1]);

    if (fileId) {
      return [
        // Primary: Same-origin proxy endpoint (Vite dev middleware & Vercel API) - 100% immune to browser CORS
        `/api/drive-download?id=${fileId}`,
        // Fallback 1: Direct endpoint
        `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`,
        // Fallback 2
        `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`
      ];
    }
  }

  return [url];
}

/**
 * Attempts to fetch a valid binary file (e.g. PDF).
 * Discards HTML viewer/login pages to prevent corrupted files.
 */
async function fetchValidBinary(candidates: string[]): Promise<{ blob: Blob; isPdf: boolean } | null> {
  for (const targetUrl of candidates) {
    try {
      const response = await fetch(targetUrl, { mode: 'cors' });
      if (!response.ok) continue;

      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      // If server returned an HTML webpage (e.g. Drive viewer/login page), it's not the file binary
      if (contentType.includes('text/html')) {
        continue;
      }

      const blob = await response.blob();

      // Verify PDF header magic bytes: %PDF-
      if (blob.size >= 5) {
        const header = await blob.slice(0, 5).text();
        if (header.startsWith('%PDF-')) {
          return { blob, isPdf: true };
        }
      }

      // If it's another non-HTML binary of non-trivial size
      if (blob.size > 1000 && !contentType.includes('text/')) {
        return { blob, isPdf: false };
      }
    } catch (err) {
      console.warn(`Could not download from candidate URL: ${targetUrl}`, err);
    }
  }

  return null;
}

export const ZipDownloadService = {
  async downloadResourcesAsZip(
    zipName: string,
    resources: ResourceItem[],
    onProgress: (progress: DownloadProgress) => void
  ): Promise<void> {
    if (!resources || resources.length === 0) {
      throw new Error('No resources to download.');
    }

    const zip = new JSZip();
    const total = resources.length;

    onProgress({
      currentFile: 'Initializing ZIP bundle...',
      loaded: 0,
      total,
      percentage: 0,
      status: 'downloading',
    });

    for (let i = 0; i < resources.length; i++) {
      const item = resources[i];
      const baseFilename = sanitizeFilename(item.title);

      onProgress({
        currentFile: item.title,
        loaded: i,
        total,
        percentage: Math.round((i / total) * 90),
        status: 'downloading',
      });

      const downloadCandidates = getDownloadUrls(item.fileUrl);
      const result = await fetchValidBinary(downloadCandidates);

      if (result && result.blob) {
        // Successfully downloaded real binary file
        const extension = result.isPdf ? '.pdf' : '';
        zip.file(`${baseFilename}${extension}`, result.blob);
      } else {
        // Direct download was restricted by Google Drive permission or CORS
        // We write a clean shortcut/link file instead of a corrupted .pdf file
        console.warn(`Direct PDF fetch failed for ${item.title}. Adding direct link shortcut.`);
        zip.file(
          `${baseFilename}_LINK.txt`,
          `Resource: ${item.title}\n` +
          `Trimester: ${item.trimesterCode || 'N/A'}\n` +
          `Direct Link: ${item.fileUrl}\n\n` +
          `Notice: This file requires direct Google Drive access or sign-in.\n` +
          `Please open the link above in your web browser to view or download directly.\n`
        );
      }
    }

    onProgress({
      currentFile: 'Generating ZIP archive...',
      loaded: total,
      total,
      percentage: 95,
      status: 'compressing',
    });

    const content = await zip.generateAsync(
      { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
      (metadata) => {
        onProgress({
          currentFile: 'Compressing...',
          loaded: total,
          total,
          percentage: 90 + Math.round(metadata.percent * 0.1),
          status: 'compressing',
        });
      }
    );

    // Trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${zipName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    onProgress({
      currentFile: 'Download started!',
      loaded: total,
      total,
      percentage: 100,
      status: 'complete',
    });
  }
};

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9_\-\s]/gi, '_').substring(0, 60).trim();
}
