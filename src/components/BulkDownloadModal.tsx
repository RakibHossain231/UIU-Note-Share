import React from 'react';
import { Download, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { DownloadProgress } from '../services/zipDownloadService';

interface BulkDownloadModalProps {
  progress: DownloadProgress | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BulkDownloadModal: React.FC<BulkDownloadModalProps> = ({ progress, isOpen, onClose }) => {
  if (!isOpen || !progress) return null;

  const isComplete = progress.status === 'complete';
  const isError = progress.status === 'error';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        
        {/* Close button if complete or error */}
        {(isComplete || isError) && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center text-[#FF6600]">
            {isComplete ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : isError ? (
              <AlertCircle className="w-6 h-6 text-rose-500" />
            ) : (
              <Loader2 className="w-6 h-6 animate-spin text-[#FF6600]" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {isComplete ? 'ZIP Bundle Ready!' : isError ? 'Download Error' : 'Packaging ZIP Archive'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isComplete 
                ? 'Your download has started automatically.' 
                : 'Downloading and compressing course resources right in your browser.'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
            <span className="truncate max-w-[240px] text-gray-500">{progress.currentFile}</span>
            <span className="text-[#FF6600] font-bold">{progress.percentage}%</span>
          </div>
          
          <div className="w-full h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-gray-200 dark:border-zinc-700">
            <div
              className="h-full bg-gradient-to-r from-[#FF6600] to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-gray-400 pt-1">
            <span>Files processed: {progress.loaded} of {progress.total}</span>
            <span>Client-side compression (JSZip)</span>
          </div>
        </div>

        {isComplete && (
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#FF6600] text-white font-semibold text-sm hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
