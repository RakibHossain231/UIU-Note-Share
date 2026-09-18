import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Moon, 
  Sun, 
  Users, 
  Info, 
  ShieldCheck, 
  Bookmark, 
  Menu, 
  X, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

export const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery, pinnedCourseIds, courses, isAdmin } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Secret keyboard shortcut (Ctrl + Shift + A or Alt + A) for Admin to open portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'A' || e.key === 'a'))
      ) {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const navLinks = [
    { label: 'All Courses', path: '/', icon: Layers },
    { label: 'Contributors', path: '/contributors', icon: Users },
    { label: 'About Creator', path: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-[#121212]/90 border-b border-gray-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6600] to-[#FF8533] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-white">
                  UIU <span className="text-[#FF6600]">Note</span> Share
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-orange-100 text-[#FF6600] dark:bg-orange-950/60 dark:text-orange-400 rounded-md">
                  HUB
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:block">
                Open Academic Knowledge Repository
              </p>
            </div>
          </Link>

          {/* Search Bar in Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim() && location.pathname !== '/') {
                    navigate('/');
                  }
                }}
                placeholder="Search course code, topic, or keyword (e.g. CSE 2118, Algo)..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-gray-100 dark:bg-zinc-800/80 border border-transparent focus:border-[#FF6600] focus:bg-white dark:focus:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    if (location.pathname === link.path) {
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-orange-50 text-[#FF6600] dark:bg-orange-950/40 dark:text-orange-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#FF6600] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Pinned Courses Quick Badge */}
            <Link
              to="/#pinned"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800/50"
              title="Pinned Courses"
            >
              <Bookmark className="w-4 h-4 text-orange-500" />
              <span className="hidden lg:inline">Saved</span>
              <span className="px-1.5 py-0.2 text-xs bg-orange-100 dark:bg-zinc-800 text-[#FF6600] rounded-full font-bold">
                {pinnedCourseIds.length}
              </span>
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            {/* Admin Dashboard (Only visible when Admin is authenticated) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                title="Admin Control Center"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim() && location.pathname !== '/') {
                  navigate('/');
                }
              }}
              placeholder="Search course or topic..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-gray-100 dark:bg-zinc-800 border border-transparent focus:border-[#FF6600] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
          </form>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#121212] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (location.pathname === link.path) {
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }
                }}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-zinc-800"
              >
                <Icon className="w-5 h-5 text-[#FF6600]" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-semibold text-white bg-emerald-600"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
