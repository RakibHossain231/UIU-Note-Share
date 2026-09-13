import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Award, 
  Sparkles, 
  Heart, 
  Mail, 
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  FileCheck2,
  Send
} from 'lucide-react';
import { FacebookIcon, LinkedinIcon, GithubIcon } from '../components/SocialIcons';
import { useData } from '../context/DataContext';
import { DepartmentFilter } from '../components/DepartmentFilter';

export const ContributorsPage: React.FC = () => {
  const { contributors, resources, selectedDepartment, setSelectedDepartment } = useData();
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter contributors by selected department
  const filteredContributors = useMemo(() => {
    if (selectedDepartment === 'All') return contributors;
    return contributors.filter(c => c.department.toLowerCase() === selectedDepartment.toLowerCase());
  }, [contributors, selectedDepartment]);

  const renderSocialIcon = (type?: string) => {
    switch (type) {
      case 'facebook': return <FacebookIcon className="w-4 h-4 text-blue-500" />;
      case 'linkedin': return <LinkedinIcon className="w-4 h-4 text-sky-500" />;
      case 'github': return <GithubIcon className="w-4 h-4 text-gray-800 dark:text-gray-200" />;
      case 'email': return <Mail className="w-4 h-4 text-orange-500" />;
      default: return <ExternalLink className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-xs font-bold">
          <Award className="w-4 h-4 text-amber-500" />
          <span>UIU Community Hall of Fame</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Wall of <span className="text-[#FF6600]">Contributors</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          UIU Note Share is built on the spirit of mutual help and student solidarity. We proudly recognize every single student who generously donated their lecture handnotes, midterm & final exam solves, and CT questions.
        </p>

        <div className="flex items-center justify-center space-x-4 pt-2 text-xs font-semibold text-gray-500">
          <span className="flex items-center space-x-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Honoring Peer Collaboration</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verified Student Solves</span>
          </span>
        </div>
      </section>

      {/* Department Filter */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Filter Contributors by Department
        </h3>
        <DepartmentFilter />
      </div>

      {/* Contributors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContributors.map((contrib) => {
          const contribNotes = resources.filter(r => r.contributor?.id === contrib.id || r.contributor?.name.toLowerCase() === contrib.name.toLowerCase());
          const totalShared = contrib.contributionsCount || contribNotes.length;

          return (
            <div
              key={contrib.id}
              className="relative flex flex-col justify-between bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#FF6600]/40 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="relative">
                    {contrib.avatarUrl ? (
                      <img
                        src={contrib.avatarUrl}
                        alt={contrib.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#FF6600]/30 shadow-md group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6600] to-amber-400 text-white font-bold text-xl flex items-center justify-center shadow-md">
                        {contrib.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shadow">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {contrib.socialUrl && (
                    <a
                      href={contrib.socialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-[#FF6600] hover:bg-orange-50 dark:hover:bg-zinc-700 transition-colors"
                      title="Connect Profile"
                    >
                      {renderSocialIcon(contrib.socialType)}
                    </a>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                  {contrib.name}
                </h3>

                <div className="flex items-center space-x-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-orange-100 text-[#FF6600] dark:bg-orange-950/60 dark:text-orange-400">
                    {contrib.department}
                  </span>
                  {contrib.batch && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {contrib.batch}
                    </span>
                  )}
                </div>
              </div>

              {/* Stat footer */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-gray-500">Shared Resources</span>
                <span className="font-bold text-[#FF6600] bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-full">
                  {totalShared} {totalShared === 1 ? 'Resource' : 'Resources'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Become a Contributor CTA Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span>Join the Community Movement</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            Want to Share Your Notes & Get Credited?
          </h2>

          <p className="text-sm sm:text-base text-orange-100 leading-relaxed">
            Whether you are from CSE, Data Science, EEE, BBA, or Civil — if you have clean handwritten notes, past mid/final solves, or CT questions, send them to us! We verify each resource and feature your name and profile link on the Wall of Contributors.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="mailto:contribute@uiunoteshare.com?subject=Note%20Contribution"
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white text-orange-600 font-bold text-sm shadow-md hover:bg-orange-50 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Email Your Notes / Drive Link</span>
            </a>

            <button
              onClick={handleShareLink}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{copiedLink ? 'Link Copied!' : 'Share This Page'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
