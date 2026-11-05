import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Search, Moon, Sun, Users, Info, ShieldCheck, Bookmark, Layers, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { cn } from '@/lib/utils';

const ink = 'border-foreground dark:border-border';

export const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery, pinnedCourseIds, courses, isAdmin } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const savedCount = useMemo(
    () => courses.filter(c => pinnedCourseIds.includes(c.id)).length,
    [courses, pinnedCourseIds]
  );

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
    if (location.pathname !== '/') navigate('/');
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim() && location.pathname !== '/') navigate('/');
  };

  const navLinks = [
    { label: 'All Courses', path: '/', icon: Layers },
    { label: 'Contributors', path: '/contributors', icon: Users },
    { label: 'How to Use', path: '/how-to-use', icon: HelpCircle },
    { label: 'About Creator', path: '/about', icon: Info },
  ];

  const scrollTopIfSame = (path: string) => {
    if (location.pathname === path) window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const searchBox = (placeholder: string, showClear: boolean) => (
    <form onSubmit={handleSearchSubmit} className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search courses"
        className={cn(
          'w-full border-2 bg-background py-2.5 pl-9 pr-14 text-sm text-foreground placeholder:text-muted-foreground',
          'focus:border-primary focus:outline-none',
          ink
        )}
      />
      {showClear && searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold uppercase text-muted-foreground hover:text-primary"
        >
          Clear
        </button>
      )}
    </form>
  );

  const logo = (
    <Link
      to="/"
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
      className="flex items-center gap-3"
    >
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center border-2 bg-primary text-primary-foreground', ink)}>
        <BookOpen className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-bold leading-none tracking-tight">
            UIU <span className="text-primary">Note</span> Share
          </span>
          <span className="bg-foreground px-1 py-0.5 font-mono text-[9px] font-bold text-background">HUB</span>
        </div>
        <p className="mt-1 hidden text-[10px] leading-tight text-muted-foreground sm:block">
          Open Academic Knowledge Repository
        </p>
      </div>
    </Link>
  );

  const themeIcon = isDark ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4" />;

  return (
    <>
      {/* Desktop: fixed left rail */}
      <aside className={cn('fixed inset-y-0 left-0 z-40 hidden w-64 flex-col gap-5 border-r-2 bg-card p-5 lg:flex', ink)}>
        {logo}
        {searchBox('Search course code, topic, or keyword (e.g. CSE 2118, Algo)...', true)}

        <nav className="flex flex-col gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => scrollTopIfSame(link.path)}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors',
                  isActive ? 'text-primary-foreground' : 'text-foreground hover:bg-accent'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="rail-active"
                    className={cn('absolute inset-0 border-2 bg-primary', ink)}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}

          <Link
            to="/#pinned"
            title="Pinned Courses"
            className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
          >
            <span className="flex items-center gap-3">
              <Bookmark className="h-4 w-4 text-primary" />
              Saved
            </span>
            <span className="bg-foreground px-1.5 font-mono text-xs font-bold text-background">{savedCount}</span>
          </Link>
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              title="Admin Control Center"
              className={cn('flex items-center justify-center gap-2 border-2 bg-foreground px-3 py-2.5 text-sm font-bold text-background hover:bg-primary hover:text-primary-foreground', ink)}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Panel
            </Link>
          )}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={cn('flex items-center justify-between border-2 px-3 py-2 font-mono text-xs font-bold uppercase hover:bg-accent', ink)}
          >
            <span>{isDark ? 'Light' : 'Dark'}</span>
            {themeIcon}
          </button>
        </div>
      </aside>

      {/* Mobile / tablet: compact top bar */}
      <header className={cn('sticky top-0 z-40 space-y-3 border-b-2 bg-card px-4 py-3 lg:hidden', ink)}>
        <div className="flex items-center justify-between">
          {logo}
          <div className="flex items-center gap-1">
            {isAdmin && (
              <Link to="/admin" aria-label="Admin Dashboard" className="p-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </Link>
            )}
            <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2">
              {themeIcon}
            </button>
          </div>
        </div>
        {searchBox('Search course or topic...', false)}
      </header>

      {/* Mobile / tablet: bottom tab bar */}
      <nav className={cn('fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t-2 bg-card lg:hidden', ink)}>
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => scrollTopIfSame(link.path)}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-semibold',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {isActive && (
                <motion.span layoutId="tab-active" className="absolute inset-x-3 top-0 h-[3px] bg-primary" />
              )}
              <Icon className="h-5 w-5" />
              <span className="max-w-full truncate">{link.label}</span>
            </Link>
          );
        })}
        <Link to="/#pinned" className="relative flex flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-semibold text-muted-foreground">
          <Bookmark className="h-5 w-5" />
          <span>Saved</span>
          <span className="absolute right-3 top-1 bg-primary px-1 font-mono text-[9px] font-bold text-primary-foreground">
            {savedCount}
          </span>
        </Link>
      </nav>
    </>
  );
};
