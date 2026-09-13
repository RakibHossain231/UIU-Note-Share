import React from 'react';
import { Contributor } from '../types';
import { Award, ExternalLink, Mail } from 'lucide-react';
import { FacebookIcon, LinkedinIcon, GithubIcon } from './SocialIcons';

interface ContributorBadgeProps {
  contributor?: Contributor;
  compact?: boolean;
}

export const ContributorBadge: React.FC<ContributorBadgeProps> = ({ contributor, compact = false }) => {
  if (!contributor) return null;

  const renderSocialIcon = () => {
    switch (contributor.socialType) {
      case 'facebook': return <FacebookIcon className="w-3 h-3 text-blue-500" />;
      case 'linkedin': return <LinkedinIcon className="w-3 h-3 text-sky-500" />;
      case 'github': return <GithubIcon className="w-3 h-3 text-gray-700 dark:text-gray-300" />;
      case 'email': return <Mail className="w-3 h-3 text-orange-500" />;
      default: return <ExternalLink className="w-3 h-3 text-gray-400" />;
    }
  };

  if (compact) {
    return (
      <div className="inline-flex items-center space-x-1.5 text-[11px] text-gray-500 dark:text-gray-400">
        <Award className="w-3.5 h-3.5 text-amber-500" />
        <span>By: <strong className="text-gray-800 dark:text-gray-200">{contributor.name}</strong></span>
        {contributor.socialUrl && (
          <a
            href={contributor.socialUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:scale-110 transition-transform"
            title={`Connect with ${contributor.name}`}
          >
            {renderSocialIcon()}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-orange-50/60 dark:bg-zinc-800/60 border border-orange-200/50 dark:border-zinc-700/60">
      {contributor.avatarUrl ? (
        <img
          src={contributor.avatarUrl}
          alt={contributor.name}
          className="w-5 h-5 rounded-full object-cover ring-1 ring-orange-500/30"
        />
      ) : (
        <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">
          {contributor.name.charAt(0)}
        </div>
      )}

      <div className="flex items-center space-x-1 text-xs">
        <span className="text-gray-500 dark:text-gray-400 text-[11px]">Contributed by</span>
        <span className="font-semibold text-gray-900 dark:text-white">
          {contributor.name}
        </span>
        {contributor.department && (
          <span className="text-[10px] px-1 py-0.2 rounded bg-white dark:bg-zinc-700 text-gray-600 dark:text-gray-300 font-medium">
            {contributor.department} {contributor.batch ? `'${contributor.batch.replace(/batch\s*/i, '')}` : ''}
          </span>
        )}
      </div>

      {contributor.socialUrl && (
        <a
          href={contributor.socialUrl}
          target="_blank"
          rel="noreferrer"
          className="p-1 text-gray-400 hover:text-[#FF6600] transition-colors"
          title={`Visit ${contributor.name}'s profile`}
        >
          {renderSocialIcon()}
        </a>
      )}
    </div>
  );
};
