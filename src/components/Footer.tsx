import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Mail, ShieldAlert, Sparkles, Lock, Users } from 'lucide-react';
import { FacebookIcon, LinkedinIcon, GithubIcon } from './SocialIcons';
import { useData } from '../context/DataContext';

export const Footer: React.FC = () => {
  const { visitorCount } = useData();
  return (
    <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#151515] transition-colors mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF6600] flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                UIU <span className="text-[#FF6600]">Note</span> Share
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              A community-driven open academic archive dedicated to United International University (UIU) students. Share, discover, and download handnotes, CT questions, semester solves, and study guides for CSE, Data Science, and all departments.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-1">
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
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-200">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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

          {/* Connect & Disclaimer */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-200">
              Connect & Contribute
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Have notes, CT questions, or past exam solves from your trimester? Share them with us to get featured on the Wall of Contributors!
            </p>
            <div className="flex items-center space-x-2.5 pt-0.5">
              <a 
                href="https://github.com/RakibHossain231" 
                target="_blank" 
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-black dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://facebook.com/RakibHossain231" 
                target="_blank" 
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-blue-600 flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/rakibhossain231" 
                target="_blank" 
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-sky-600 flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a 
                href="mailto:rakibhossain0308@yahoo.com" 
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-[#FF6600] flex items-center justify-center transition-colors"
                title="Yahoo Mail"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-500">
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
