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
      const filename = `${sanitizeFilename(item.title)}.pdf`;

      onProgress({
        currentFile: item.title,
        loaded: i,
        total,
        percentage: Math.round((i / total) * 90),
        status: 'downloading',
      });

      try {
        // Fetch raw bytes
        const response = await fetch(item.fileUrl, { mode: 'cors' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const blob = await response.blob();
        zip.file(filename, blob);
      } catch (err) {
        console.warn(`Could not fetch file for ZIP: ${item.fileUrl}`, err);
        // Add a fallback text file inside ZIP explaining how to access this resource
        zip.file(
          `${sanitizeFilename(item.title)}_link.txt`,
          `Resource Title: ${item.title}\nDirect Link: ${item.fileUrl}\nNote: Direct download was restricted by host CORS. You can open the link directly in your browser.`
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
  return name.replace(/[^a-z0-9_\-\s]/gi, '_').substring(0, 50).trim();
}
