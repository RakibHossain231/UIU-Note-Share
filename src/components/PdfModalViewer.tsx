import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Download, 
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
  RefreshCw,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  SquareSplitHorizontal,
  Layers,
  FileText,
  Search
} from 'lucide-react';
import { ResourceItem } from '../types';
import { downloadResourceWithWatermark, triggerDirectDownload } from '../services/pdfWatermarkService';

export interface PdfModalViewerProps {
  item?: ResourceItem | null;
  items?: ResourceItem[];
  activeItemId?: string | null;
  onSelectTab?: (id: string) => void;
  onCloseTab?: (id: string) => void;
  onClose?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: (minimized: boolean) => void;
  availableResources?: ResourceItem[];
  onOpenResource?: (item: ResourceItem) => void;
  onAddTab?: (item: ResourceItem) => void;
}

const getFileType = (url: string, title?: string): 'image' | 'doc' | 'pdf' => {
  const cleanUrl = (url || '').split('?')[0].toLowerCase();
  const cleanTitle = (title || '').toLowerCase();

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp', '.avif'];
  const docExtensions = ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.rtf', '.odt', '.txt', '.csv'];

  if (imageExtensions.some(ext => cleanUrl.endsWith(ext) || cleanTitle.endsWith(ext))) {
    return 'image';
  }

  if (docExtensions.some(ext => cleanUrl.endsWith(ext) || cleanTitle.endsWith(ext))) {
    return 'doc';
  }

  if (url.includes('docs.google.com/document') || url.includes('docs.google.com/presentation') || url.includes('docs.google.com/spreadsheets')) {
    return 'doc';
  }

  return 'pdf';
};

const getImageSrc = (url: string) => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD && matchD[1]) {
      return `https://lh3.googleusercontent.com/d/${matchD[1]}`;
    }
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchId && matchId[1]) {
      return `https://lh3.googleusercontent.com/d/${matchId[1]}`;
    }
  }
  return url;
};

const getEmbedUrl = (url: string) => {
  if (!url) return '';

  if (url.includes('docs.google.com/document/d/')) {
    const matchDoc = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (matchDoc && matchDoc[1]) {
      return `https://docs.google.com/document/d/${matchDoc[1]}/preview`;
    }
  }

  if (url.includes('docs.google.com/spreadsheets/d/')) {
    const matchSheet = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (matchSheet && matchSheet[1]) {
      return `https://docs.google.com/spreadsheets/d/${matchSheet[1]}/preview`;
    }
  }

  if (url.includes('docs.google.com/presentation/d/')) {
    const matchSlide = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (matchSlide && matchSlide[1]) {
      return `https://docs.google.com/presentation/d/${matchSlide[1]}/preview`;
    }
  }

  if (url.includes('drive.google.com')) {
    const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD && matchD[1]) {
      return `https://drive.google.com/file/d/${matchD[1]}/preview`;
    }
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchId && matchId[1]) {
      return `https://drive.google.com/file/d/${matchId[1]}/preview`;
    }
    return url.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview');
  }

  if (url.includes('docs.google.com/viewer')) {
    return url;
  }

  const cleanUrl = url.split('?')[0].toLowerCase();
  if (
    cleanUrl.endsWith('.docx') || cleanUrl.endsWith('.doc') || 
    cleanUrl.endsWith('.pptx') || cleanUrl.endsWith('.ppt') || 
    cleanUrl.endsWith('.xlsx') || cleanUrl.endsWith('.xls')
  ) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  }

  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
};

const getDirectDownloadUrl = (url: string) => {
  if (!url) return '';

  if (url.includes('docs.google.com/document/d/')) {
    const matchDoc = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (matchDoc && matchDoc[1]) {
      return `https://docs.google.com/document/d/${matchDoc[1]}/export?format=docx`;
    }
  }

  if (url.includes('docs.google.com/spreadsheets/d/')) {
    const matchSheet = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (matchSheet && matchSheet[1]) {
      return `https://docs.google.com/spreadsheets/d/${matchSheet[1]}/export?format=xlsx`;
    }
  }

  if (url.includes('docs.google.com/presentation/d/')) {
    const matchSlide = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (matchSlide && matchSlide[1]) {
      return `https://docs.google.com/presentation/d/${matchSlide[1]}/export/pptx`;
    }
  }

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

const getItemBadge = (item: ResourceItem) => {
  const type = item.type;
  if (type === 'question_mid' || type === 'mid_question') return { label: 'Mid Ques', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' };
  if (type === 'mid_solve') return { label: 'Mid Solve', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' };
  if (type === 'question_final' || type === 'final_question') return { label: 'Final Ques', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' };
  if (type === 'final_solve') return { label: 'Final Solve', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' };
  if (type === 'handnote') return { label: 'Note', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' };
  if (type === 'ct') return { label: `CT ${item.ctNumber || '1'}`, color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' };
  if (type === 'assignment') return { label: `Assign ${item.assignmentNumber || '1'}`, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' };
  if (type === 'lab_report') return { label: 'Lab', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300' };
  return { label: 'PDF', color: 'bg-orange-100 text-[#FF6600] dark:bg-orange-950/60 dark:text-orange-400' };
};

interface TabSettings {
  zoom: number;
  rotation: number;
  darkInvert: boolean;
}

export const PdfModalViewer: React.FC<PdfModalViewerProps> = ({ 
  item, 
  items, 
  activeItemId, 
  onSelectTab, 
  onCloseTab, 
  onClose,
  isMinimized = false,
  onToggleMinimize,
  availableResources = [],
  onOpenResource,
  onAddTab
}) => {
  // Normalize items list (supports both items prop and single item legacy prop)
  const currentItems = useMemo(() => {
    if (items && items.length > 0) return items;
    if (item) return [item];
    return [];
  }, [items, item]);

  // Current active tab item
  const activeItem = useMemo(() => {
    if (currentItems.length === 0) return null;
    if (activeItemId) {
      const found = currentItems.find(t => t.id === activeItemId);
      if (found) return found;
    }
    return currentItems[0];
  }, [currentItems, activeItemId]);

  // Per-Tab Settings: Zoom, Rotation, and Dark Invert are remembered per tab!
  const [tabSettings, setTabSettings] = useState<Record<string, TabSettings>>({});

  // Split View state
  const [isSplitView, setIsSplitView] = useState<boolean>(false);
  const [focusedPane, setFocusedPane] = useState<'left' | 'right'>('left');
  const [secondTabId, setSecondTabId] = useState<string | null>(null);

  // General viewer state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [iframeKeyMap, setIframeKeyMap] = useState<Record<string, number>>({});
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgressText, setDownloadProgressText] = useState<string>('');
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);

  // Pane refs and Ctrl+Wheel Zoom state
  const leftPaneRef = useRef<HTMLDivElement | null>(null);
  const rightPaneRef = useRef<HTMLDivElement | null>(null);
  const [isCtrlDown, setIsCtrlDown] = useState<boolean>(false);
  const [hoveredPane, setHoveredPane] = useState<'left' | 'right'>('left');
  const [zoomIndicator, setZoomIndicator] = useState<{ docId: string; zoom: number; visible: boolean } | null>(null);

  // Auto-hide zoom indicator after 1.2s
  useEffect(() => {
    if (zoomIndicator?.visible) {
      const timer = setTimeout(() => {
        setZoomIndicator(prev => prev ? { ...prev, visible: false } : null);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [zoomIndicator]);

  // Track Ctrl key press state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.ctrlKey) {
        setIsCtrlDown(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control' || !e.ctrlKey) {
        setIsCtrlDown(false);
      }
    };
    const handleBlur = () => {
      setIsCtrlDown(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);


  // Sync secondary tab for Split View
  useEffect(() => {
    if (isSplitView) {
      if (!secondTabId || secondTabId === activeItem?.id || !currentItems.some(t => t.id === secondTabId)) {
        const otherTab = currentItems.find(t => t.id !== activeItem?.id);
        if (otherTab) {
          setSecondTabId(otherTab.id);
        }
      }
    }
  }, [isSplitView, activeItem, currentItems, secondTabId]);

  // Secondary item in Split View
  const secondItem = useMemo(() => {
    if (!isSplitView) return null;
    return currentItems.find(t => t.id === secondTabId) || null;
  }, [isSplitView, currentItems, secondTabId]);

  // Focused item (controls zoom/rotate/dark mode in top toolbar)
  const focusedItem = useMemo(() => {
    if (!isSplitView || focusedPane === 'left') return activeItem;
    return secondItem || activeItem;
  }, [isSplitView, focusedPane, activeItem, secondItem]);

  // Helper to read / write per-tab settings
  const getSettingsFor = (id: string): TabSettings => {
    return tabSettings[id] || { zoom: 145, rotation: 0, darkInvert: false };
  };

  const updateSettingFor = (id: string, partial: Partial<TabSettings>) => {
    setTabSettings(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { zoom: 145, rotation: 0, darkInvert: false }),
        ...partial
      }
    }));
  };

  // Native non-passive Wheel listener for smooth Ctrl + Scroll Zooming
  useEffect(() => {
    const handlePaneWheel = (e: WheelEvent, targetItem: ResourceItem | null) => {
      if (!targetItem || !e.ctrlKey) return;
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY < 0 ? 10 : -10;
      const currentZoom = getSettingsFor(targetItem.id).zoom;
      const nextZoom = Math.min(250, Math.max(50, currentZoom + delta));

      updateSettingFor(targetItem.id, { zoom: nextZoom });
      setZoomIndicator({ docId: targetItem.id, zoom: nextZoom, visible: true });
    };

    const leftEl = leftPaneRef.current;
    const rightEl = rightPaneRef.current;

    const onLeftWheel = (e: WheelEvent) => {
      handlePaneWheel(e, activeItem);
    };
    const onRightWheel = (e: WheelEvent) => {
      handlePaneWheel(e, secondItem || activeItem);
    };

    if (leftEl) leftEl.addEventListener('wheel', onLeftWheel, { passive: false });
    if (rightEl) rightEl.addEventListener('wheel', onRightWheel, { passive: false });

    const container = document.getElementById('pdf-viewer-container');
    const onContainerWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      e.stopPropagation();
      const targetDoc = (isSplitView && hoveredPane === 'right' && secondItem) ? secondItem : activeItem;
      if (targetDoc) {
        const delta = e.deltaY < 0 ? 10 : -10;
        const currentZoom = getSettingsFor(targetDoc.id).zoom;
        const nextZoom = Math.min(250, Math.max(50, currentZoom + delta));
        updateSettingFor(targetDoc.id, { zoom: nextZoom });
        setZoomIndicator({ docId: targetDoc.id, zoom: nextZoom, visible: true });
      }
    };

    if (container) container.addEventListener('wheel', onContainerWheel, { passive: false });

    return () => {
      if (leftEl) leftEl.removeEventListener('wheel', onLeftWheel);
      if (rightEl) rightEl.removeEventListener('wheel', onRightWheel);
      if (container) container.removeEventListener('wheel', onContainerWheel);
    };
  }, [activeItem, secondItem, isSplitView, hoveredPane, tabSettings]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleMinimize = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error(err);
      }
      setIsFullscreen(false);
    }
    onToggleMinimize?.(true);
  };

  const handleCloseViewer = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error(err);
      }
      setIsFullscreen(false);
    }
    onClose?.();
  };

  const handlePlusClick = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error(err);
      }
      setIsFullscreen(false);
    }
    if (activeItem && onAddTab) {
      onAddTab(activeItem);
    } else {
      handleMinimize();
    }
  };

  // Keyboard shortcut Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isMinimized) {
          handleCloseViewer();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isMinimized]);

  if (currentItems.length === 0 || !activeItem) {
    return null;
  }

  // FLOATING BOTTOM DOCK WHEN MINIMIZED
  if (isMinimized) {
    return (
      <div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900/95 dark:bg-[#1C1C1E]/95 border-2 border-[#FF6600] text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-200 cursor-pointer hover:scale-[1.02] transition-all"
        onClick={() => onToggleMinimize?.(false)}
      >
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-1 rounded-xl bg-[#FF6600] text-white font-black text-xs shadow-sm flex items-center space-x-1 animate-pulse">
            <Plus className="w-3.5 h-3.5" />
            <span>Select Note</span>
          </span>
          <div className="max-w-[200px] sm:max-w-[280px] truncate text-left">
            <p className="text-xs font-bold text-gray-100 truncate">
              {activeItem.title}
            </p>
            <p className="text-[10px] text-orange-300 truncate">
              {currentItems.length > 1 ? `${currentItems.length} Notes Open • Click to expand` : 'Click any note/solve on page to add tab'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 pl-2 border-l border-zinc-700" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleMinimize?.(false)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
            title="Expand Viewer"
          >
            <ChevronUp className="w-4 h-4 text-orange-400" />
          </button>
          <button
            onClick={() => onClose?.()}
            className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-zinc-800 rounded-xl transition-colors"
            title="Close All Notes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Active settings for focused document
  const focusedSettings = focusedItem ? getSettingsFor(focusedItem.id) : { zoom: 145, rotation: 0, darkInvert: false };

  const handleDownload = async (itemToDownload: ResourceItem) => {
    if (isDownloading) return;
    const fType = getFileType(itemToDownload.fileUrl, itemToDownload.title);

    if (fType !== 'pdf') {
      const downloadUrl = getDirectDownloadUrl(itemToDownload.fileUrl);
      const fileName = itemToDownload.title.trim();
      triggerDirectDownload(downloadUrl, fileName);
      return;
    }

    setIsDownloading(true);
    setDownloadProgressText('Preparing...');

    try {
      await downloadResourceWithWatermark(itemToDownload, (status) => {
        if (status === 'fetching') {
          setDownloadProgressText('Fetching PDF...');
        } else if (status === 'watermarking') {
          setDownloadProgressText('Adding Watermark...');
        } else {
          setDownloadProgressText('');
        }
      });
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
      setDownloadProgressText('');
    }
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('pdf-viewer-container');
    if (!document.fullscreenElement) {
      el?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Resources that can be added as new tabs
  const unopenResources = availableResources.filter(r => !currentItems.some(ci => ci.id === r.id));

  // Single Pane Renderer
  const renderDocumentPane = (docItem: ResourceItem, paneType: 'left' | 'right') => {
    const isThisFocused = isSplitView && focusedPane === paneType;
    const settings = getSettingsFor(docItem.id);
    const fType = getFileType(docItem.fileUrl, docItem.title);
    const isLoading = loadingMap[docItem.id] !== false;
    const iframeKey = iframeKeyMap[docItem.id] || 0;
    const embedUrl = getEmbedUrl(docItem.fileUrl);
    const imageSrc = getImageSrc(docItem.fileUrl);

    return (
      <div
        key={docItem.id}
        ref={paneType === 'left' ? leftPaneRef : rightPaneRef}
        onClick={() => setFocusedPane(paneType)}
        onMouseEnter={() => {
          setHoveredPane(paneType);
          window.focus();
        }}
        onMouseMove={(e) => {
          if (e.ctrlKey && !isCtrlDown) setIsCtrlDown(true);
          else if (!e.ctrlKey && isCtrlDown) setIsCtrlDown(false);
        }}
        className={`relative flex-1 h-full flex flex-col bg-zinc-950 overflow-hidden transition-all duration-150 ${
          isSplitView ? (isThisFocused ? 'ring-2 ring-[#FF6600] shadow-xl' : 'opacity-90') : ''
        }`}
      >
        {/* Transparent Capture Shield for Ctrl + Wheel Zoom (only active when Ctrl is held down) */}
        {isCtrlDown && (
          <div
            className="absolute inset-0 z-30 cursor-zoom-in bg-transparent"
            onMouseMove={(e) => {
              if (!e.ctrlKey) setIsCtrlDown(false);
            }}
          />
        )}

        {/* Floating Zoom Indicator on Zoom */}
        {zoomIndicator?.visible && zoomIndicator.docId === docItem.id && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full bg-black/90 text-white text-xs font-mono font-bold tracking-wide shadow-2xl border border-white/20 backdrop-blur-md animate-in fade-in zoom-in duration-150 pointer-events-none flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6600] animate-ping" />
            <span className="text-[#FF6600]">{zoomIndicator.zoom}%</span>
            <span className="text-[10px] text-gray-400 font-sans">Ctrl + Scroll</span>
          </div>
        )}

        {/* Split View Pane Header (Shows which pane is active and quick selector) */}
        {isSplitView && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs z-20">
            <div className="flex items-center space-x-2 truncate">
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase ${
                isThisFocused 
                  ? 'bg-[#FF6600] text-white shadow-sm' 
                  : 'bg-zinc-800 text-zinc-400'
              }`}>
                {isThisFocused ? 'Active Focused Pane' : `Pane (${paneType === 'left' ? '1' : '2'})`}
              </span>
              <span className="font-semibold text-zinc-300 truncate text-[11px]">
                {docItem.title}
              </span>
            </div>

            {/* Right Pane Actions: Document Switcher & Swap Panes */}
            <div className="flex items-center space-x-2">
              {paneType === 'right' && currentItems.length > 1 && (
                <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[10px] text-gray-400 hidden sm:inline">Compare with:</span>
                  <select
                    value={secondTabId || ''}
                    onChange={(e) => setSecondTabId(e.target.value)}
                    className="text-xs font-semibold bg-zinc-800 text-orange-400 border border-zinc-700 hover:border-[#FF6600] rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                  >
                    {currentItems.filter(t => t.id !== activeItem.id).map(t => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Swap Panes Button */}
              {isSplitView && currentItems.length > 1 && paneType === 'right' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (secondItem) {
                      const temp = activeItem.id;
                      onSelectTab?.(secondItem.id);
                      setSecondTabId(temp);
                    }
                  }}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white border border-zinc-700 transition-colors flex items-center space-x-1"
                  title="Swap Left and Right Panes"
                >
                  <span>⇄ Swap</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 z-20 space-y-2 pointer-events-none">
            <Loader2 className="w-8 h-8 text-[#FF6600] animate-spin" />
            <p className="text-xs font-bold text-gray-300">
              Loading {docItem.title}...
            </p>
          </div>
        )}

        {/* Document Body */}
        <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center p-1 sm:p-2">
          {fType === 'image' ? (
            <div 
              className="w-full h-full flex items-center justify-center overflow-auto"
              style={{
                filter: settings.darkInvert ? 'invert(90%) hue-rotate(180deg)' : 'none',
              }}
            >
              <img
                key={iframeKey}
                src={imageSrc}
                alt={docItem.title}
                onLoad={() => setLoadingMap(prev => ({ ...prev, [docItem.id]: false }))}
                onError={() => setLoadingMap(prev => ({ ...prev, [docItem.id]: false }))}
                className="max-w-full max-h-full object-contain select-none transition-transform duration-150 rounded-lg shadow-xl"
                style={{
                  transform: `scale(${settings.zoom / 100}) rotate(${settings.rotation}deg)`,
                  transformOrigin: 'center center'
                }}
              />
            </div>
          ) : (
            <div 
              className="relative w-full h-full transition-all duration-200 flex items-center justify-center overflow-hidden"
              style={{
                filter: settings.darkInvert ? 'invert(90%) hue-rotate(180deg)' : 'none',
                transform: `scale(${settings.zoom / 100}) rotate(${settings.rotation}deg)`,
                transformOrigin: 'center center'
              }}
            >
              <iframe
                key={iframeKey}
                src={embedUrl}
                title={docItem.title}
                onLoad={() => setLoadingMap(prev => ({ ...prev, [docItem.id]: false }))}
                className="w-full h-full border-0 bg-white rounded-lg shadow-sm"
                allow="autoplay"
                loading="lazy"
              />

              {/* Protective Shield Blocker for Google Drive popup */}
              <div 
                className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-10 h-10 sm:w-11 sm:h-11 z-20 pointer-events-auto bg-[#181818] rounded-xl flex items-center justify-center shadow-lg border border-zinc-700/60 select-none cursor-default"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                title="UIU Note Share Reader"
              >
                <span className="text-[10px] font-black text-[#FF6600] tracking-wider uppercase">UIU</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div 
        id="pdf-viewer-container"
        className="relative w-full max-w-6xl h-[94vh] bg-white dark:bg-[#1A1A1C] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-zinc-800"
      >
        
        {/* 1. TOP TAB BAR (Multi-Tab Support) */}
        <div className="bg-gray-100 dark:bg-[#121214] border-b border-gray-200 dark:border-zinc-800 px-3 pt-2 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
            {currentItems.map((tab) => {
              const isActive = tab.id === activeItem.id;
              const badge = getItemBadge(tab);

              return (
                <div
                  key={tab.id}
                  onClick={() => {
                    if (isSplitView && focusedPane === 'right') {
                      setSecondTabId(tab.id);
                    } else {
                      onSelectTab?.(tab.id);
                    }
                  }}
                  className={`group relative flex items-center space-x-2 px-3 py-1.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-t-2 select-none ${
                    (isActive && (!isSplitView || focusedPane === 'left')) || (isSplitView && secondItem?.id === tab.id && focusedPane === 'right')
                      ? 'border-[#FF6600] bg-white dark:bg-[#1A1A1C] text-gray-900 dark:text-white shadow-sm'
                      : (isSplitView && (tab.id === activeItem.id || tab.id === secondItem?.id))
                      ? 'border-orange-400/50 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200'
                      : 'border-transparent bg-gray-200/70 dark:bg-zinc-900/60 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${badge.color}`}>
                    {badge.label}
                  </span>
                  <span className="truncate max-w-[130px] sm:max-w-[180px]">
                    {tab.title}
                  </span>
                  {isSplitView && (
                    tab.id === activeItem.id ? (
                      <span className="text-[8px] px-1 py-0.2 rounded bg-orange-500/20 text-orange-400 font-extrabold border border-orange-500/30">
                        LEFT
                      </span>
                    ) : tab.id === secondItem?.id ? (
                      <span className="text-[8px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-extrabold border border-cyan-500/30">
                        RIGHT
                      </span>
                    ) : null
                  )}
                  
                  {/* Close Tab Button */}
                  {currentItems.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab?.(tab.id);
                      }}
                      className="p-0.5 rounded text-gray-400 hover:text-rose-500 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                      title="Close tab"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}


            {/* PLUS (+) BUTTON TO OPEN ANOTHER PDF */}
            <button
              onClick={handlePlusClick}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:text-[#FF6600] dark:hover:text-[#FF6600] hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-dashed border-gray-300 dark:border-zinc-700 hover:border-[#FF6600] transition-all shadow-xs shrink-0 cursor-pointer group active:scale-95 ml-1"
              title="Add another note to compare (e.g. Question and Solve side-by-side)"
            >
              <Plus className="w-4 h-4 text-[#FF6600] group-hover:rotate-90 transition-transform duration-200" strokeWidth={2.5} />
              <span className="text-[11px] font-extrabold text-[#FF6600]">Add Note</span>
            </button>
          </div>

          {/* Tab count & mode indicator */}
          <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-400 pr-2 shrink-0">
            <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF6600] font-bold text-[11px]">
              {currentItems.length} {currentItems.length === 1 ? 'Tab Open' : 'Tabs Open'}
            </span>
          </div>
        </div>

        {/* 2. CONTROLS TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#18181A] gap-2">
          
          {/* Active Note Title & Contributor */}
          <div className="flex items-center space-x-2 truncate max-w-sm sm:max-w-md">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
              {focusedItem?.title}
            </h3>
            {focusedItem?.contributor && (
              <span className="hidden md:inline-flex items-center space-x-1 text-[11px] text-gray-400">
                <span>·</span>
                <Award className="w-3 h-3 text-amber-500" />
                <span className="truncate">{focusedItem.contributor.name}</span>
              </span>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            
            {/* SPLIT VIEW TOGGLE */}
            <button
              onClick={() => setIsSplitView(!isSplitView)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isSplitView
                  ? 'bg-[#FF6600] text-white shadow-orange-500/20'
                  : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-[#FF6600]'
              }`}
              title="Compare two notes side by side"
            >
              <SquareSplitHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isSplitView ? 'Split View ON' : 'Split View'}</span>
            </button>

            <div className="h-4 w-[1px] bg-gray-300 dark:bg-zinc-700 mx-0.5 sm:mx-1" />

            {/* Night Reading Filter (Per-Tab) */}
            <button
              onClick={() => {
                if (focusedItem) {
                  updateSettingFor(focusedItem.id, { darkInvert: !focusedSettings.darkInvert });
                }
              }}
              className={`p-1.5 rounded-xl text-xs font-medium transition-colors ${
                focusedSettings.darkInvert 
                  ? 'bg-amber-500 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800'
              }`}
              title="Night Reading Filter (Invert)"
            >
              {focusedSettings.darkInvert ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Rotate Clockwise (Per-Tab) */}
            <button
              onClick={() => {
                if (focusedItem) {
                  updateSettingFor(focusedItem.id, { rotation: (focusedSettings.rotation + 90) % 360 });
                }
              }}
              className="p-1.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
              title="Rotate 90 degrees"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Zoom Controls (Per-Tab with Active Pane Focus!) */}
            <div className="flex items-center bg-gray-200 dark:bg-zinc-800/80 rounded-xl p-0.5">
              <button
                onClick={() => {
                  if (focusedItem) {
                    updateSettingFor(focusedItem.id, { zoom: Math.max(50, focusedSettings.zoom - 15) });
                  }
                }}
                className="p-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (focusedItem) {
                    updateSettingFor(focusedItem.id, { zoom: 145 });
                    setZoomIndicator({ docId: focusedItem.id, zoom: 145, visible: true });
                  }
                }}
                className="text-xs font-mono font-bold text-gray-700 dark:text-gray-200 px-1 hover:text-[#FF6600] transition-colors cursor-pointer"
                title="Click to reset to default 145% zoom (or use Ctrl + Mouse Scroll)"
              >
                {focusedSettings.zoom}%
              </button>
              <button
                onClick={() => {
                  if (focusedItem) {
                    updateSettingFor(focusedItem.id, { zoom: Math.min(220, focusedSettings.zoom + 15) });
                  }
                }}
                className="p-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reload Current Iframe */}
            <button
              onClick={() => {
                if (focusedItem) {
                  setLoadingMap(prev => ({ ...prev, [focusedItem.id]: true }));
                  setIframeKeyMap(prev => ({ ...prev, [focusedItem.id]: (prev[focusedItem.id] || 0) + 1 }));
                }
              }}
              className="p-1.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
              title="Reload Document"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition-all border ${
                isFullscreen
                  ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm'
                  : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-zinc-700 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 shadow-xs'
              } active:scale-95`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 stroke-[2.2]" /> : <Maximize2 className="w-4 h-4 stroke-[2.2]" />}
            </button>

            {/* MINIMIZE BUTTON (Highlighted, tactile, distinct) */}
            <button
              onClick={handleMinimize}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white shadow-xs transition-all active:scale-95 group"
              title="Minimize Viewer (Floating Dock)"
            >
              <Minus className="w-4 h-4 stroke-[3] group-hover:scale-110 transition-transform" />
            </button>

            {/* CLOSE BUTTON (Highlighted, tactile, distinct) */}
            <button
              onClick={handleCloseViewer}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white shadow-xs transition-all active:scale-95 group"
              title="Close Viewer (Esc)"
            >
              <X className="w-4 h-4 stroke-[2.8] group-hover:scale-110 transition-transform" />
            </button>

            <div className="h-4 w-[1px] bg-gray-300 dark:bg-zinc-700 mx-0.5 sm:mx-1" />

            {/* Direct Download Button (At the extreme right) */}
            <button
              onClick={() => focusedItem && handleDownload(focusedItem)}
              disabled={isDownloading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FF6600] text-white hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-80 shrink-0 cursor-pointer"
              title="Download with watermark"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden md:inline">{downloadProgressText || 'Downloading...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Download</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* 3. MAIN VIEWER CONTENT AREA */}
        <div className="relative flex-1 w-full h-full bg-zinc-950 overflow-hidden flex flex-col md:flex-row">
          
          {/* PRIMARY PANE (Left / Main Tab) */}
          {renderDocumentPane(activeItem, 'left')}

          {/* SECONDARY PANE (Right Pane in Split View) */}
          {isSplitView && (
            secondItem ? (
              renderDocumentPane(secondItem, 'right')
            ) : (
              <div className="flex-1 h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-900 border-l border-zinc-800 text-gray-400">
                <SquareSplitHorizontal className="w-10 h-10 text-[#FF6600] mb-3 opacity-80" />
                <h4 className="text-sm font-bold text-gray-200 mb-1">
                  Split View Comparison
                </h4>
                <p className="text-xs text-gray-400 max-w-xs mb-4">
                  Open another note (e.g. Solution or Question) to view and compare both side-by-side.
                </p>
                <p className="text-[11px] text-gray-500">
                  Tip: Minimize the viewer (—) and click any other note on the course page to open it here!
                </p>
              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
};
