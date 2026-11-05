import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Bookmark, 
  Search, 
  FolderPlus, 
  GraduationCap, 
  Users, 
  Filter,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { CourseCard } from '../components/CourseCard';
import { DepartmentFilter } from '../components/DepartmentFilter';
import { cn } from '@/lib/utils';

export const HomePage: React.FC = () => {
  const { courses, resources, contributors, visitorCount, selectedDepartment, searchQuery, setSearchQuery, pinnedCourseIds } = useData();
  const [selectedTrimester, setSelectedTrimester] = useState<number | 'all'>('all');

  // Filter courses by department, trimester, and search query
  const filteredCourses = useMemo(() => {
    // 1. If searching, perform universal global search across all departments and trimesters!
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().replace(/[\s-]/g, '');
      return courses.filter((course) => {
        const code = course.code.toLowerCase().replace(/[\s-]/g, '');
        const title = course.title.toLowerCase().replace(/[\s-]/g, '');
        const abbr = (course.abbr || '').toLowerCase().replace(/[\s-]/g, '');
        const dept = course.department.toLowerCase().replace(/[\s-]/g, '');
        return code.includes(q) || title.includes(q) || abbr.includes(q) || dept.includes(q);
      });
    }

    // 2. When not searching, filter by the selected department and trimester
    return courses.filter((course) => {
      // Department filter
      if (selectedDepartment !== 'All' && course.department.toLowerCase() !== selectedDepartment.toLowerCase()) {
        return false;
      }
      // Trimester filter
      if (selectedTrimester !== 'all' && course.trimester !== selectedTrimester) {
        return false;
      }
      return true;
    });
  }, [courses, selectedDepartment, selectedTrimester, searchQuery]);

  // Pinned courses
  const pinnedCourses = useMemo(() => {
    return courses.filter(c => pinnedCourseIds.includes(c.id));
  }, [courses, pinnedCourseIds]);

  const ink = 'border-foreground dark:border-border';

  const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; count: React.ReactNode }> = ({ icon, title, count }) => (
    <div className={cn('flex items-center gap-3 border-b-2 pb-3', ink)}>
      <span className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground">{icon}</span>
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      <span className="ml-auto bg-foreground px-2 py-0.5 font-mono text-xs font-bold text-background">{count}</span>
    </div>
  );

  const Grid: React.FC<{ list: typeof courses; prefix?: string }> = ({ list, prefix = '' }) => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {list.map((course) => (
        <CourseCard key={`${prefix}${course.id}`} course={course} />
      ))}
    </div>
  );

  const stats = [
    { label: 'Courses Archived', value: `${courses.length}+`, accent: false },
    { label: 'Verified Solves & Notes', value: `${resources.length}+`, accent: true },
    { label: 'Total Visitors', value: `${visitorCount.toLocaleString()}+`, accent: false },
    { label: 'Active Contributors', value: `${contributors.length}`, accent: false },
    { label: 'Free Forever', value: '100%', accent: true },
  ];

  return (
    <div className="space-y-12 pb-16">

      {/* Hero (hidden during search) */}
      {!searchQuery.trim() && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="hard paper-grid grid gap-8 bg-card p-6 sm:p-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10 lg:p-10"
        >
          <div className="flex flex-col items-start gap-5">
            <div className={cn('inline-flex items-center gap-2 border-2 bg-background px-2.5 py-1 font-mono text-[11px] font-bold uppercase', ink)}>
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>United International University (UIU) Open Knowledge Repository</span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              All Your UIU{' '}
              <span className="bg-primary px-2 text-primary-foreground [box-decoration-break:clone]">Handnotes &amp; Solves</span>{' '}
              in One Place.
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Free, fast, and community-driven archive of handwritten lecture notes, midterm &amp; final question solves, class tests, and assignments for CSE, Data Science, and all departments.
            </p>
          </div>

          <dl className={cn('self-end border-2 bg-background', ink)}>
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={cn('flex items-baseline justify-between gap-4 px-4 py-3', i > 0 && 'border-t-2 border-dashed border-border')}
              >
                <dt className="text-xs font-medium text-muted-foreground sm:text-sm">{s.label}</dt>
                <dd className={cn('font-mono text-2xl font-bold tabular-nums', s.accent && 'text-primary')}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </motion.section>
      )}

      {/* Pinned courses (hidden during search) */}
      {pinnedCourses.length > 0 && !searchQuery.trim() && (
        <section id="pinned" className="scroll-mt-24 space-y-6">
          <SectionTitle icon={<Bookmark className="h-4 w-4 fill-current" />} title="My Pinned Courses" count={pinnedCourses.length} />
          <Grid list={pinnedCourses} prefix="pinned-" />
        </section>
      )}

      {searchQuery.trim() ? (
        /* SEARCH RESULTS VIEW */
        <section className="space-y-6">
          <SectionTitle
            icon={<Search className="h-4 w-4" />}
            title="Search Results"
            count={`${filteredCourses.length} ${filteredCourses.length === 1 ? 'course' : 'courses'} found`}
          />
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              Showing matching courses for &quot;<span className="font-bold text-foreground">{searchQuery}</span>&quot; across all departments and trimesters.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className={cn('inline-flex items-center gap-2 self-start border-2 px-3 py-2 font-mono text-xs font-bold uppercase hover:bg-accent sm:self-auto', ink)}
            >
              <span>Clear Search</span>
              <span className="text-sm leading-none">&times;</span>
            </button>
          </div>

          {filteredCourses.length === 0 ? (
            <div className={cn('border-2 border-dashed bg-card px-4 py-16 text-center', ink)}>
              <GraduationCap className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-bold">No courses match &quot;{searchQuery}&quot;</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Try searching by course code (e.g. CSE 2213, EEE), course title (e.g. Algorithm), or acronym.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className={cn('mt-5 border-2 bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-md', ink)}
              >
                Clear Search &amp; View All Courses
              </button>
            </div>
          ) : (
            <Grid list={filteredCourses} />
          )}
        </section>
      ) : (
        /* BROWSE VIEW */
        <section className="space-y-8">
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Department</h3>
            <DepartmentFilter />
          </div>

          <div className={cn('flex overflow-x-auto border-2 scrollbar-none', ink)}>
            {(['all', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as Array<number | 'all'>).map((trim, i) => {
              const active = selectedTrimester === trim;
              return (
                <button
                  key={trim}
                  onClick={() => setSelectedTrimester(trim)}
                  aria-pressed={active}
                  className={cn(
                    'whitespace-nowrap px-4 py-2.5 font-mono text-xs font-bold uppercase transition-colors',
                    i > 0 && 'border-l-2 border-foreground dark:border-border',
                    active ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-accent'
                  )}
                >
                  {trim === 'all' ? 'All Trimesters' : `Trimester ${trim}`}
                </button>
              );
            })}
          </div>

          <div className="space-y-6">
            <SectionTitle
              icon={<BookOpen className="h-4 w-4" />}
              title="Courses"
              count={`${filteredCourses.length} ${filteredCourses.length === 1 ? 'course' : 'courses'} found`}
            />

            {filteredCourses.length === 0 ? (
              <div className={cn('border-2 border-dashed bg-card px-4 py-16 text-center', ink)}>
                <GraduationCap className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-bold">No courses match your filter</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                  Try selecting a different trimester or department.
                </p>
                <button
                  onClick={() => setSelectedTrimester('all')}
                  className={cn('mt-5 border-2 bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-md', ink)}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <Grid list={filteredCourses} />
            )}
          </div>
        </section>
      )}

    </div>
  );
};
