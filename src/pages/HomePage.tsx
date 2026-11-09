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
import { useData } from '../context/DataContext';
import { CourseCard } from '../components/CourseCard';
import { DepartmentFilter } from '../components/DepartmentFilter';

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

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Banner (Hidden during search - matches user requirement: "Search korle second ss ta hide hoye jabe") */}
      {!searchQuery.trim() && (
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-5 sm:p-6 lg:py-6 lg:px-8 border border-zinc-800 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#FF6600]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center flex flex-col items-center space-y-3.5">
            {/* Badge (Varsity Name Centered) */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6600]" />
              <span>United International University (UIU) Open Knowledge Repository</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              All Your UIU <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-amber-400">Handnotes & Solves</span> in One Place.
            </h1>

            {/* Description (Full Width) */}
            <p className="text-xs sm:text-sm text-zinc-300 w-full leading-relaxed">
              Free, fast, and community-driven archive of handwritten lecture notes, midterm & final question solves, class tests, and assignments for CSE, Data Science, and all departments.
            </p>

            {/* Quick Metrics (Full Width) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 pt-4 border-t border-zinc-800/80 w-full text-center">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{courses.length}+</div>
                <div className="text-xs text-zinc-400 font-medium mt-0.5">Courses Archived</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#FF6600]">{resources.length}+</div>
                <div className="text-xs text-zinc-400 font-medium mt-0.5">Verified Solves & Notes</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-sky-400">{visitorCount.toLocaleString()}+</div>
                <div className="text-xs text-zinc-400 font-medium mt-0.5">Total Visitors</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{contributors.length}</div>
                <div className="text-xs text-zinc-400 font-medium mt-0.5">Active Contributors</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
                <div className="text-xs text-zinc-400 font-medium mt-0.5">Free Forever</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pinned Courses Section (Hidden during search) */}
      {pinnedCourses.length > 0 && !searchQuery.trim() && (
        <section id="pinned" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-[#FF6600] fill-[#FF6600]" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                My Pinned Courses
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-zinc-800 text-[#FF6600] font-bold">
                {pinnedCourses.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pinnedCourses.map((course) => (
              <CourseCard key={`pinned-${course.id}`} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* SEARCH RESULTS VIEW: Shown right at the top when searching */}
      {searchQuery.trim() ? (
        <section className="space-y-6 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-[#FF6600] flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Search Results
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/60 text-[#FF6600]">
                  {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Showing matching courses for &quot;<span className="font-bold text-gray-800 dark:text-zinc-200">{searchQuery}</span>&quot; across all departments and trimesters.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 transition-colors shadow-sm self-start sm:self-auto"
            >
              <span>Clear Search</span>
              <span className="font-bold text-sm leading-none">&times;</span>
            </button>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-zinc-800">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
                No courses match &quot;{searchQuery}&quot;
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try searching by course code (e.g. CSE 2213, EEE), course title (e.g. Algorithm), or acronym.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-[#FF6600] text-white rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
              >
                Clear Search & View All Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* NORMAL VIEW: Main Browse & Filters Section when NOT searching */
        <section className="space-y-6">
          {/* Department Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Select Department
              </h3>
            </div>
            <DepartmentFilter />
          </div>

          {/* Trimester Filter Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedTrimester('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTrimester === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              All Trimesters
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((trim) => (
              <button
                key={trim}
                onClick={() => setSelectedTrimester(trim)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTrimester === trim
                    ? 'bg-[#FF6600] text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
              >
                Trimester {trim}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <span>Courses</span>
                <span className="text-xs font-normal text-gray-500">
                  ({filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found)
                </span>
              </h2>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-zinc-800">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
                  No courses match your filter
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Try selecting a different trimester or department.
                </p>
                <button
                  onClick={() => {
                    setSelectedTrimester('all');
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold bg-[#FF6600] text-white rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
};
