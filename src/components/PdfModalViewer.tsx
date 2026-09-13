import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  Moon, 
  Sun, 
  RotateCw,
  HardDrive,
  Cloud,
  Award,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { ResourceItem } from '../types';

interface PdfModalViewerProps {
  item: ResourceItem | null;
  onClose: () => void;
}

export const PdfModalViewer: React.FC<PdfModalViewerProps> = ({ item, onClose }) => {
  const [zoom, setZoom] = useState<number>(100);
  const [darkInvert, setDarkInvert] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    setZoom(100);
    setRotation(0);
  }, [item]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  // Format URL for clean in-browser preview without triggering browser auto-download
  const getEmbedUrl = (url: string) => {
    if (!url) return '';

    // 1. Google Drive URLs
    if (url.includes('drive.google.com')) {
      const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (matchD && matchD[1]) {
        return `https://drive.google.com/file/d/${matchD[1]}/preview`;
      }
      const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (matchId && matchId[1]) {
        return `https://drive.google.com/file/d/${matchId[1]}/preview`;
      }
      return url.replace(/\/view(\?.*)?$/, '/preview');
    }

    // 2. Already wrapped with Google Docs Viewer
    if (url.includes('docs.google.com/viewer')) {
      return url;
    }

    // 3. For any web URL (GitHub raw, Cloudflare R2, Supabase, S3, etc.)
    // Wrapping with Google Docs Viewer displays the PDF directly in the browser
    // and prevents the browser's download manager from auto-downloading the file
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  const getDirectDownloadUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (matchD && matchD[1]) {
        return `https://drive.google.com/uc?export=download&id=${matchD[1]}`;
      }
      const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (matchId && matchId[1]) {
        return `https://drive.google.com/uc?export=download&id=${matchId[1]}`;
      }
    }
    return url;
  };

  const embedUrl = getEmbedUrl(item.fileUrl);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.getElementById('pdf-viewer-container')?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div 
        id="pdf-viewer-container"
        className="relative w-full max-w-5xl h-[92vh] bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-zinc-800"
      >
        
        {/* Top Header Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#181818]">
          <div className="flex items-center space-x-3 truncate">
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                {item.title}
              </h3>
              {item.contributor && (
                <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Contributed by: <strong>{item.contributor.name}</strong></span>
                  {item.contributor.department && (
                    <span className="text-[10px] px-1 bg-gray-200 dark:bg-zinc-700 rounded">
                      {item.contributor.department}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            
            {/* Dark Reader Filter */}
            <button
              onClick={() => setDarkInvert(!darkInvert)}
              className={`p-1.5 sm:p-2 rounded-lg text-xs font-medium transition-colors ${
                darkInvert 
                  ? 'bg-amber-500 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
              title="Night Reading Filter"
            >
              {darkInvert ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Rotate */}
            <button
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              title="Rotate Clockwise"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center space-x-1 bg-gray-200 dark:bg-zinc-800 rounded-lg p-0.5">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 15))}
                className="p-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-semibold px-1 text-gray-700 dark:text-gray-300 w-10 text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 15))}
                className="p-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reload Viewer */}
            <button
              onClick={() => {
                setIsLoading(true);
                setIframeKey(prev => prev + 1);
              }}
              className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              title="Reload Viewer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#FF6600]' : ''}`} />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Direct Download Button */}
            <a
              href={getDirectDownloadUrl(item.fileUrl)}
              download={`${item.title}.pdf`}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FF6600] text-white hover:bg-orange-600 transition-colors shadow-sm"
              title="Direct Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="relative flex-1 bg-zinc-900 overflow-auto flex items-center justify-center">
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 z-20 space-y-3">
              <Loader2 className="w-9 h-9 text-[#FF6600] animate-spin" />
              <p className="text-xs font-bold text-gray-300 tracking-wide">
                Loading Document in UIU Reader...
              </p>
              <p className="text-[11px] text-gray-400 max-w-xs text-center">
                Rendering preview in-browser without automatic file download.
              </p>
            </div>
          )}

          <div 
            className="w-full h-full transition-all duration-200 flex items-center justify-center"
            style={{
              filter: darkInvert ? 'invert(90%) hue-rotate(180deg)' : 'none',
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
          >
            <iframe
              key={iframeKey}
              src={embedUrl}
              title={item.title}
              onLoad={() => setIsLoading(false)}
              className="w-full h-full border-0 bg-white"
              allow="autoplay"
              loading="lazy"
            />
          </div>

          {/* Quick Reader Help Bar (Zero External Redirects) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md px-4 py-1.5 rounded-full text-xs text-gray-300 flex items-center space-x-2 border border-white/10 shadow-lg pointer-events-auto z-10">
            <span>Taking time to load?</span>
            <button 
              onClick={() => {
                setIsLoading(true);
                setIframeKey(prev => prev + 1);
              }}
              className="text-[#FF6600] font-bold underline flex items-center space-x-1 hover:text-orange-400"
            >
              <span>Reload Reader</span>
              <RefreshCw className="w-3 h-3" />
            </button>
            <span>•</span>
            <a 
              href={getDirectDownloadUrl(item.fileUrl)} 
              download={`${item.title}.pdf`}
              className="text-emerald-400 font-bold underline flex items-center space-x-1 hover:text-emerald-300"
            >
              <span>Download File</span>
              <Download className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
