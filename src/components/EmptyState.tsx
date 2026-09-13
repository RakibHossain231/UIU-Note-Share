import React from 'react';
import { FileQuestion, PlusCircle, Sparkles, Send } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onRequestClick: () => void;
  categoryName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No resources uploaded yet',
  description = 'Be the first hero to share notes, exam solves, or CT questions for this section!',
  onRequestClick,
  categoryName
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-gray-50/50 dark:bg-zinc-900/30 my-6">
      <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-[#FF6600] flex items-center justify-center mb-4 shadow-inner">
        <FileQuestion className="w-8 h-8" />
      </div>

      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
        {title} {categoryName ? `in ${categoryName}` : ''}
      </h4>

      <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRequestClick}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FF6600] text-white font-semibold text-sm hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
        >
          <Send className="w-4 h-4" />
          <span>Request Notes for this Course</span>
        </button>
      </div>

      <div className="mt-4 flex items-center space-x-1.5 text-xs text-gray-400">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Have these notes? Send them to get featured on the Wall of Contributors!</span>
      </div>
    </div>
  );
};
