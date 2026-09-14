import React from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Cloud, 
  HardDrive, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ResourceItem } from '../types';
import { ContributorBadge } from './ContributorBadge';

interface NoteCardProps {
  item: ResourceItem;
  onPreview: (item: ResourceItem) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ item, onPreview }) => {
  const isDrive = item.storageType === 'drive' || item.fileUrl.includes('drive.google.com');

  const getTypeLabel = () => {
    switch (item.type) {
      case 'handnote': return 'Handwritten Note';
      case 'mid':
      case 'question_mid': return 'Mid Questions & Solves';
      case 'final':
      case 'question_final': return 'Final Questions & Solves';
      case 'ct': return `Class Test (CT-${item.ctNumber || '1'})`;
      case 'assignment': return `Assignment ${item.assignmentNumber || '1'}`;
      case 'cheatsheet': return 'Formula & Cheat Sheet';
      default: return 'Resource';
    }
  };

  const getTypeBadgeClass = () => {
    switch (item.type) {
      case 'handnote': return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'mid':
      case 'question_mid': return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'final':
      case 'question_final': return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'ct': return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'assignment': return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'cheatsheet': return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      default: return 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-zinc-700';
    }
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

  return (
    <div className="flex flex-col justify-between bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-zinc-800/80 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-zinc-700 transition-all shadow-sm hover:shadow-md">
      
      {/* Top Header - Click to Open In-App Reader */}
      <div onClick={() => onPreview(item)} className="cursor-pointer group">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTypeBadgeClass()}`}>
              {getTypeLabel()}
            </span>
            {item.trimesterCode && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6600] dark:bg-orange-950/40 dark:text-orange-400">
                Trim {item.trimesterCode}
              </span>
            )}
            {item.hasSolution && (
              <span className="flex items-center space-x-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Solved</span>
              </span>
            )}
          </div>

          {/* Storage Provider Badge */}
          <div className="flex items-center space-x-1 text-[11px] text-gray-400">
            {isDrive ? (
              <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md font-medium">
                <HardDrive className="w-3 h-3" />
                <span>Drive</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 px-2 py-0.5 rounded-md font-medium">
                <Cloud className="w-3 h-3" />
                <span>Cloudflare R2</span>
              </span>
            )}
            {item.fileSize && <span>• {item.fileSize}</span>}
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#FF6600] transition-colors">
          {item.title}
        </h4>

        {/* Description */}
        {item.description && (
          <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Footer with Contributor attribution & Actions */}
      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800/80 space-y-3">
        {/* Contributor Credit */}
        <ContributorBadge contributor={item.contributor} />

        {/* Actions Button Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => onPreview(item)}
            className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-[#FF6600] hover:text-white dark:hover:bg-[#FF6600] dark:hover:text-white transition-all shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open in Reader</span>
          </button>

          <a
            href={getDirectDownloadUrl(item.fileUrl)}
            download={`${item.title}.pdf`}
            className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-orange-50 dark:bg-orange-950/40 text-[#FF6600] dark:text-orange-400 hover:bg-[#FF6600] hover:text-white dark:hover:bg-[#FF6600] dark:hover:text-white transition-all border border-orange-200 dark:border-orange-900/40"
            title="Direct Download File (No Google Drive Redirection)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>

    </div>
  );
};
