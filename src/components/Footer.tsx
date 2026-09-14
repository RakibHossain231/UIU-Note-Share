import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Mail, ShieldAlert, Sparkles, Lock } from 'lucide-react';
import { FacebookIcon, LinkedinIcon, GithubIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#151515] transition-colors mt-8 sm:mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand & Tagline */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#FF6600] flex items-center justify-center text-white shadow-sm">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-base text-gray-900 dark:text-white">
                UIU <span className="text-[#FF6600]">Note</span> Share
              </span>
            </div>
            <span className="hidden sm:inline text-zinc-400 dark:text-zinc-600">•</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Open Academic Archive for UIU Students • 100% Free
            </p>
          </div>

          {/* Quick Links & Socials */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <nav className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 font-medium">
              <Link 
                to="/" 
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                className="hover:text-[#FF6600] dark:hover:text-orange-400 transition-colors"
              >
                Courses
              </Link>
              <Link to="/contributors" className="hover:text-[#FF6600] dark:hover:text-orange-400 transition-colors">
                Contributors 🎖️
              </Link>
              <Link to="/about" className="hover:text-[#FF6600] dark:hover:text-orange-400 transition-colors">
                About
              </Link>
            </nav>

            {/* Social Icons */}
            <div className="flex items-center space-x-2 pl-3 border-l border-gray-200 dark:border-zinc-800">
              <a 
                href="https://github.com/RakibHossain231" 
                target="_blank" 
                rel="noreferrer"
                className="w-6 h-6 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-black dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://facebook.com/RakibHossain231" 
                target="_blank" 
                rel="noreferrer"
                className="w-6 h-6 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-blue-600 flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/rakibhossain231" 
                target="_blank" 
                rel="noreferrer"
                className="w-6 h-6 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-sky-600 flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a 
                href="mailto:rakibhossain0308@yahoo.com" 
                className="w-6 h-6 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-[#FF6600] flex items-center justify-center transition-colors"
                title="Yahoo Mail"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 dark:text-gray-500 gap-1.5">
          <p>© {new Date().getFullYear()} UIU Note Share. Built for UIU peers & juniors.</p>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>by Rakib Hossain (CSE 231, UIU)</span>
            </div>
            <Link 
              to="/admin" 
              className="text-gray-300 dark:text-zinc-700 hover:text-gray-500 dark:hover:text-zinc-500 transition-colors p-0.5"
              title="Admin Portal (Shortcut: Ctrl + Shift + A)"
              aria-label="Admin Portal"
            >
              <Lock className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
