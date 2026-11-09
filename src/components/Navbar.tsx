import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Layers,
  HelpCircle,
  GraduationCap,
  FileText,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

export const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery, pinnedCourseIds, courses, resources, isAdmin } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Only count saved courses that actually exist in current courses catalog
  const savedCount = useMemo(() => {
    return courses.filter(c => pinnedCourseIds.includes(c.id)).length;
  }, [courses, pinnedCourseIds]);

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

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      return { matchingCourses: [], matchingResources: [] };
    }
    const q = searchQuery.toLowerCase().replace(/[\s-]/g, '');

    const matchingCourses = courses.filter(c => {
      const code = c.code.toLowerCase().replace(/[\s-]/g, '');
      const title = c.title.toLowerCase().replace(/[\s-]/g, '');
      const abbr = (c.abbr || '').toLowerCase().replace(/[\s-]/g, '');
      return code.includes(q) || title.includes(q) || abbr.includes(q);
    }).slice(0, 4);

    const matchingResources = resources.filter(r => {
      const title = (r.title || '').toLowerCase().replace(/[\s-]/g, '');
      const trim = (r.trimesterCode || '').toLowerCase();
      const term = (r.term || '').toLowerCase();
      return title.includes(q) || trim.includes(q) || term.includes(q);
    }).slice(0, 4);

    return { matchingCourses, matchingResources };
  }, [searchQuery, courses, resources]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const navLinks = [
    { label: 'All Courses', path: '/', icon: Layers },
    { label: 'Contributors', path: '/contributors', icon: Users },
    { label: 'How to Use', path: '/how-to-use', icon: HelpCircle },
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

          {/* Search Bar in Desktop with Omni-Search Dropdown */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowSearchDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setShowSearchDropdown(false);
                  }}
                  placeholder="Search course code, solve, or topic (e.g. SPL, Algo)..."
                  className="w-full pl-10 pr-12 py-2 text-sm rounded-full bg-gray-100 dark:bg-zinc-800/80 border border-transparent focus:border-[#FF6600] focus:bg-white dark:focus:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchDropdown(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            {/* Instant Omni-Search Dropdown Results */}
            {showSearchDropdown && searchQuery.trim().length >= 2 && (searchResults.matchingCourses.length > 0 || searchResults.matchingResources.length > 0) && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 space-y-3">
                
                {/* Matching Courses */}
                {searchResults.matchingCourses.length > 0 && (
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500 px-2 mb-1.5 flex items-center space-x-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#FF6600]" />
                      <span>Courses</span>
                    </div>
                    <div className="space-y-1">
                      {searchResults.matchingCourses.map(c => (
                        <button
                          key={`omnidrop-c-${c.id}`}
                          type="button"
                          onClick={() => {
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                            navigate(`/course/${c.id}`);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: c.color || '#FF6600' }}
                            />
                            <div className="truncate">
                              <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#FF6600] transition-colors">
                                {c.code}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-zinc-400 ml-2 truncate">
                                {c.title}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 shrink-0">
                            {c.department}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Notes & Solves */}
                {searchResults.matchingResources.length > 0 && (
                  <div className="pt-2 border-t border-gray-100 dark:border-zinc-800/80">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500 px-2 mb-1.5 flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>Direct Notes & Solves</span>
                    </div>
                    <div className="space-y-1">
                      {searchResults.matchingResources.map(r => (
                        <button
                          key={`omnidrop-r-${r.id}`}
                          type="button"
                          onClick={() => {
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                            navigate(`/course/${r.courseId}?openResource=${r.id}`);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-[#FF6600] shrink-0">
                              {r.trimesterCode || 'NOTE'}
                            </span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#FF6600] truncate transition-colors">
                              {r.title}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF6600] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dropdown Footer */}
                <div className="pt-2 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between px-2 text-[10px] text-gray-400">
                  <span>Press <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 font-mono text-[9px]">Enter</kbd> to view all</span>
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="font-bold text-[#FF6600] hover:underline cursor-pointer"
                  >
                    View in Catalog &rarr;
                  </button>
                </div>

              </div>
            )}
          </div>

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
                {savedCount}
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
          <Link
            to="/#pinned"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-zinc-800"
          >
            <div className="flex items-center space-x-3">
              <Bookmark className="w-5 h-5 text-[#FF6600]" />
              <span>Saved Courses</span>
            </div>
            <span className="px-2 py-0.5 text-xs bg-orange-100 dark:bg-zinc-800 text-[#FF6600] rounded-full font-bold">
              {savedCount}
            </span>
          </Link>
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
