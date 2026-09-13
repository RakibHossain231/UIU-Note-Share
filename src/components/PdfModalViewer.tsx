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
  Award
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

  // Format URL for clean in-browser preview
  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      return url.replace(/\/view(\?.*)?$/, '/preview');
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

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* External / Download */}
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FF6600] text-white hover:bg-orange-600 transition-colors shadow-sm"
              title="Download or Open in New Tab"
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
          <div 
            className="w-full h-full transition-all duration-200 flex items-center justify-center"
            style={{
              filter: darkInvert ? 'invert(90%) hue-rotate(180deg)' : 'none',
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
          >
            <iframe
              src={embedUrl}
              title={item.title}
              className="w-full h-full border-0 bg-white"
              allow="autoplay"
              loading="lazy"
            />
          </div>

          {/* Cookie / Fallback Banner for Google Drive */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-4 py-2 rounded-full text-xs text-gray-300 flex items-center space-x-2 border border-white/10 shadow-lg pointer-events-auto">
            <span>If PDF doesn't preview in your browser:</span>
            <a 
              href={item.fileUrl} 
              target="_blank" 
              rel="noreferrer"
              className="text-[#FF6600] font-bold underline flex items-center space-x-1 hover:text-orange-400"
            >
              <span>Open Directly</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
