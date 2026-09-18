import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Mail, Sparkles, Lock, Users, ExternalLink, Copy, Check } from 'lucide-react';
import { FacebookIcon, LinkedinIcon, GithubIcon } from './SocialIcons';
import { useData } from '../context/DataContext';

export const Footer: React.FC = () => {
  const { visitorCount, creatorProfile } = useData();
  const [emailMenuOpen, setEmailMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const creatorEmail = creatorProfile?.email || 'rakibhossain0308@yahoo.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(creatorEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#151515] transition-colors mt-8 sm:mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#FF6600] flex items-center justify-center text-white shadow-sm">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-base text-gray-900 dark:text-white">
                UIU <span className="text-[#FF6600]">Note</span> Share
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              A community-driven open academic archive dedicated to United International University (UIU) students. Share, discover, and download handnotes, CT questions, semester solves, and study guides for CSE, Data Science, and all departments.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-0.5">
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6600] dark:bg-orange-950/40 dark:text-orange-400 font-semibold text-[11px]">
                <Sparkles className="w-3 h-3 mr-1" />
                100% Free & Open
              </span>
              <span>•</span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-[11px]">
                <Users className="w-3 h-3 mr-1 text-sky-500" />
                {visitorCount.toLocaleString()}+ Visits
              </span>
              <span>•</span>
              <span>Zero Ads</span>
              <span>•</span>
              <span>Built by UIUans</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-200">
              Navigation
            </h4>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <Link 
                  to="/" 
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                  className="hover:text-[#FF6600] dark:hover:text-orange-400 transition-colors"
                >
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/contributors" className="hover:text-[#FF6600] dark:hover:text-orange-400 transition-colors">
                  Wall of Contributors 🎖️
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FF6600] dark:hover:text-orange-400 transition-colors">
                  About the Creator & Vision
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Social Icons */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-200">
              Connect & Contribute
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Have notes, CT questions, or past exam solves from your trimester? Share them with us to get featured on the Wall of Contributors!
            </p>
            <div className="flex items-center space-x-2 pt-0.5">
              <a 
                href="https://github.com/RakibHossain231" 
                target="_blank" 
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-black dark:hover:bg-zinc-700 flex items-center justify-center transition-colors shadow-sm"
                title="GitHub"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://facebook.com/RakibHossain231" 
                target="_blank" 
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-blue-600 flex items-center justify-center transition-colors shadow-sm"
                title="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/rakibhossain231" 
                target="_blank" 
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-sky-600 flex items-center justify-center transition-colors shadow-sm"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              
              {/* Direct Workable Email Button & Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setEmailMenuOpen((prev) => !prev)}
                  className={`w-7 h-7 rounded-lg transition-all flex items-center justify-center shadow-sm ${
                    emailMenuOpen
                      ? 'bg-[#FF6600] text-white ring-2 ring-orange-400/40'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-[#FF6600]'
                  }`}
                  title="Send Email to Creator"
                  aria-label="Send Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </button>

                {/* Email Options Popover */}
                {emailMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setEmailMenuOpen(false)} 
                    />

                    <div className="absolute right-0 bottom-full mb-2 w-64 p-3 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-zinc-700 shadow-2xl z-50 text-left">
                      {/* Popover Header */}
                      <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center space-x-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#FF6600]" />
                          <span className="text-xs font-bold text-gray-900 dark:text-white">Send Direct Email</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEmailMenuOpen(false)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs px-1"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Email display */}
                      <div className="py-2">
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Recipient</div>
                        <div className="text-xs font-mono font-bold text-[#FF6600] truncate mt-0.5">
                          {creatorEmail}
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="space-y-1.5 pt-1 border-t border-gray-100 dark:border-zinc-800">
                        {/* 1. Gmail Web */}
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(creatorEmail)}&su=${encodeURIComponent('UIU Note Share - Inquiry / Contribution')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setEmailMenuOpen(false)}
                          className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/60 text-[#FF6600] transition-colors"
                        >
                          <span className="flex items-center space-x-1.5">
                            <span>✉️</span>
                            <span>Open Gmail (Web)</span>
                          </span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>

                        {/* 2. Default System Mail Client */}
                        <a
                          href={`mailto:${creatorEmail}?subject=${encodeURIComponent('UIU Note Share - Inquiry / Contribution')}`}
                          onClick={() => setEmailMenuOpen(false)}
                          className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <span className="flex items-center space-x-1.5">
                            <span>📧</span>
                            <span>Default Mail App</span>
                          </span>
                        </a>

                        {/* 3. Copy Email */}
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <span className="flex items-center space-x-1.5">
                            {copied ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-400" />
                            )}
                            <span className={copied ? 'text-emerald-500 font-bold' : ''}>
                              {copied ? 'Copied to Clipboard!' : 'Copy Email Address'}
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          <p>© {new Date().getFullYear()} UIU Note Share. Built with passion for UIU peers & juniors.</p>
          <div className="flex items-center space-x-3 mt-2 sm:mt-0">
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>by Rakib Hossain, Dept. of CSE (Batch 231), UIU</span>
            </div>
            <Link 
              to="/admin" 
              className="text-gray-300 dark:text-zinc-700 hover:text-gray-500 dark:hover:text-zinc-500 transition-colors p-1"
              title="Admin Portal (Shortcut: Ctrl + Shift + A)"
              aria-label="Admin Portal"
            >
              <Lock className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
