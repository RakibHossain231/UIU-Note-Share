import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  Download, 
  ChevronDown, 
  ArrowUpDown,
  Sparkles,
  Award
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ResourceItem } from '../types';
import { CategoryScrollIcon } from '../components/CategoryScrollIcon';
import { PdfModalViewer } from '../components/PdfModalViewer';
import { BulkDownloadModal } from '../components/BulkDownloadModal';
import { EmptyState } from '../components/EmptyState';
import { RequestNoteModal } from '../components/RequestNoteModal';
import { ZipDownloadService, DownloadProgress } from '../services/zipDownloadService';
import { formatTrimesterCode, getLatestTrimesterForCourse, getTrimesterScore, detectNoteScope } from '../utils/trimesterHelper';

type CategoryKey = 
  | 'handnote'
  | 'mid'
  | 'final'
  | 'ct'
  | 'assignment'
  | 'cheatsheet';

const CATEGORY_ORDER: CategoryKey[] = [
  'handnote',
  'mid',
  'final',
  'ct',
  'assignment',
  'cheatsheet'
];

export const isSolutionItem = (item: ResourceItem): boolean => {
  if (item.type === 'mid_solve' || item.type === 'final_solve' || item.type === 'ct_solve' || item.type === 'assignment_solve') {
    return true;
  }
  if (item.hasSolution) return true;
  const title = (item.title || '').toLowerCase();
  return title.includes('solve') || title.includes('solution') || title.includes('answer') || title.includes('soln');
};

export const isQuestionItem = (item: ResourceItem): boolean => {
  if (item.type === 'question_mid' || item.type === 'mid_question' || item.type === 'question_final' || item.type === 'final_question' || item.type === 'ct_question' || item.type === 'assignment_question') {
    return true;
  }
  const title = (item.title || '').toLowerCase();
  if (title.includes('question') || title.includes('ques') || title.includes('qp')) {
    return true;
  }
  return !isSolutionItem(item);
};

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, resources, pinnedCourseIds, togglePinCourse } = useData();

  // Selected Category (null = Level 1 Category Hub, string = Level 2 Trimester Grid)
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [subFilter, setSubFilter] = useState<string>('all');

  // Modals state
  const [previewItem, setPreviewItem] = useState<ResourceItem | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);

  // Scroll to top and reset sub-filter whenever category view changes (level 1 <-> level 2)
  React.useEffect(() => {
    setSubFilter('all');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [selectedCategory]);

  // Find course
  const course = courses.find(
    c => c.id === courseId || c.code.toLowerCase().replace(/[\s-]/g, '') === (courseId || '').toLowerCase().replace(/[\s-]/g, '')
  );

  const isPinned = course ? pinnedCourseIds.includes(course.id) : false;
  const cardColor = course?.color || '#FF6600';

  // Filter resources for this course
  const courseResources = useMemo(() => {
    if (!course) return [];
    return resources.filter(r => r.courseId === course.id);
  }, [course, resources]);

  // Latest updated trimester across all categories for this course
  const latestTrimester = useMemo(() => {
    return getLatestTrimesterForCourse(courseResources);
  }, [courseResources]);

  // Unified 5 Primary Categories (+ Cheat Sheets if available)
  const categoryData = useMemo(() => {
    // 1. Handnotes
    const handnotes = courseResources.filter(r => r.type === 'handnote');

    // 2. Mid Questions & Solves (combined)
    const midItems = courseResources.filter(r => 
      r.type === 'question_mid' || 
      r.type === 'mid_question' || 
      r.type === 'mid_solve' ||
      r.term === 'mid' ||
      (r.title && /\bmid\b/i.test(r.title))
    );

    // 3. Final Questions & Solves (combined)
    const finalItems = courseResources.filter(r => 
      r.type === 'question_final' || 
      r.type === 'final_question' || 
      r.type === 'final_solve' ||
      r.term === 'final' ||
      (r.title && /\bfinal\b/i.test(r.title))
    );

    // 4. CT Questions & Solves (combined)
    const ctItems = courseResources.filter(r => 
      r.type === 'ct' || 
      r.type === 'ct_question' || 
      r.type === 'ct_solve' ||
      (r.ctNumber !== undefined && r.ctNumber !== null) ||
      (r.title && /\bct\b|\bclass test\b/i.test(r.title))
    );

    // 5. Assignments & Solves (combined)
    const assignmentItems = courseResources.filter(r => 
      r.type === 'assignment' || 
      r.type === 'assignment_question' || 
      r.type === 'assignment_solve' ||
      (r.assignmentNumber !== undefined && r.assignmentNumber !== null) ||
      (r.title && /\bassign/i.test(r.title))
    );

    // 6. Cheat Sheets (optional)
    const cheatsheets = courseResources.filter(r => r.type === 'cheatsheet');

    return {
      handnote: {
        title: 'Handwritten Notes',
        badge: 'NOTE',
        count: handnotes.length,
        items: handnotes,
        questionCount: 0,
        solutionCount: 0,
        iconType: 'handnote' as const
      },
      mid: {
        title: 'Mid Questions & Solves',
        badge: 'MID',
        count: midItems.length,
        items: midItems,
        questionCount: midItems.filter(isQuestionItem).length,
        solutionCount: midItems.filter(isSolutionItem).length,
        iconType: 'question' as const
      },
      final: {
        title: 'Final Questions & Solves',
        badge: 'FINAL',
        count: finalItems.length,
        items: finalItems,
        questionCount: finalItems.filter(isQuestionItem).length,
        solutionCount: finalItems.filter(isSolutionItem).length,
        iconType: 'solution' as const
      },
      ct: {
        title: 'CT Questions & Solves',
        badge: 'CT',
        count: ctItems.length,
        items: ctItems,
        questionCount: ctItems.filter(isQuestionItem).length,
        solutionCount: ctItems.filter(isSolutionItem).length,
        iconType: 'ct' as const
      },
      assignment: {
        title: 'Assignments & Solves',
        badge: 'ASSIGN',
        count: assignmentItems.length,
        items: assignmentItems,
        questionCount: assignmentItems.filter(isQuestionItem).length,
        solutionCount: assignmentItems.filter(isSolutionItem).length,
        iconType: 'assignment' as const
      },
      cheatsheet: {
        title: 'Formula & Cheat Sheets',
        badge: 'CHEAT',
        count: cheatsheets.length,
        items: cheatsheets,
        questionCount: 0,
        solutionCount: 0,
        iconType: 'cheatsheet' as const
      }
    };
  }, [courseResources]);

  // Visible categories in Level 1 (5 primary ones + cheatsheets if present)
  const visibleCategories = useMemo(() => {
    return CATEGORY_ORDER.filter(key => {
      if (key === 'cheatsheet') return categoryData.cheatsheet.count > 0;
      return true;
    });
  }, [categoryData]);

  // Selected category items with sub-filter and sorting
  const activeItems = useMemo(() => {
    if (!selectedCategory) return [];
    let rawItems = [...categoryData[selectedCategory].items];

    if (subFilter !== 'all') {
      if (selectedCategory === 'handnote') {
        rawItems = rawItems.filter(item => detectNoteScope(item) === subFilter);
      } else if (subFilter === 'question') {
        rawItems = rawItems.filter(item => isQuestionItem(item));
      } else if (subFilter === 'solve') {
        rawItems = rawItems.filter(item => isSolutionItem(item));
      } else if (subFilter.startsWith('ct')) {
        const num = parseInt(subFilter.replace('ct', ''), 10);
        rawItems = rawItems.filter(item => 
          item.ctNumber === num || 
          new RegExp(`\\bct\\s*${num}\\b|\\bct-${num}\\b`, 'i').test(item.title || '')
        );
      } else if (subFilter.startsWith('a')) {
        const num = parseInt(subFilter.replace('a', ''), 10);
        rawItems = rawItems.filter(item => 
          item.assignmentNumber === num || 
          new RegExp(`\\bassign(ment)?\\s*${num}\\b|\\ba${num}\\b`, 'i').test(item.title || '')
        );
      }
    }

    return rawItems.sort((a, b) => {
      const scoreA = getTrimesterScore(a.trimesterCode || a.title);
      const scoreB = getTrimesterScore(b.trimesterCode || b.title);
      if (scoreA !== scoreB) {
        return sortOrder === 'newest' ? scoreB - scoreA : scoreA - scoreB;
      }
      return (b.uploadDate || '').localeCompare(a.uploadDate || '');
    });
  }, [selectedCategory, categoryData, subFilter, sortOrder]);

  if (!course) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Not Found</h2>
        <p className="text-gray-500">The requested course could not be located in our repository.</p>
        <Link to="/" className="inline-flex items-center space-x-2 text-[#FF6600] font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </Link>
      </div>
    );
  }

  // Handle Bulk ZIP Download
  const handleDownloadZip = async () => {
    if (activeItems.length === 0) return;
    setBulkModalOpen(true);
    try {
      const catTitle = selectedCategory ? categoryData[selectedCategory].title : 'resources';
      await ZipDownloadService.downloadResourcesAsZip(
        `${course.code}_${catTitle.replace(/\s+/g, '_')}`,
        activeItems,
        (prog) => setDownloadProgress(prog)
      );
    } catch (err) {
      console.error(err);
      setDownloadProgress({
        currentFile: 'Error packaging files',
        loaded: 0,
        total: activeItems.length,
        percentage: 0,
        status: 'error',
        errorMessage: 'Some files could not be downloaded due to CORS restrictions.'
      });
    }
  };

  return (
    <div className="space-y-8 pb-24 relative min-h-[80vh]">
      
      {/* Back to All Courses Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-500 hover:text-[#FF6600] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </Link>

        <button
          onClick={() => togglePinCourse(course.id)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isPinned
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isPinned ? 'fill-white' : ''}`} />
          <span>{isPinned ? 'Saved' : 'Pin Course'}</span>
        </button>
      </div>

      {/* Course Header Banner (Matches Screenshot 1 & 2) */}
      <div 
        style={{ borderBottom: `5px solid ${cardColor}` }}
        className="bg-white dark:bg-[#1E1E1E] border-t border-l border-r border-gray-200/80 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm"
      >
        <div 
          style={{ color: cardColor }} 
          className="text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-1"
        >
          {course.code}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
          {course.title}
        </h1>
        {course.description && (
          <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {course.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800/80 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {latestTrimester ? `Updated Till ${latestTrimester}` : 'No Resources Yet'}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-700" />
          <span>
            {courseResources.length} {courseResources.length === 1 ? 'Total Resource' : 'Total Resources'}
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LEVEL 1: CATEGORY HUB (Matches Screenshot 1)               */}
      {/* ========================================================= */}
      {!selectedCategory && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Select Category
            </h2>
            <span className="text-xs text-gray-400">
              {courseResources.length} Total Resources
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {visibleCategories.map((key) => {
              const cat = categoryData[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className="group relative flex flex-col items-center justify-between text-center bg-[#FFF9F5] dark:bg-[#201A16] border border-orange-200/70 dark:border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-[#FF6600]/60 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                >
                  {/* Top-Right Badge (e.g. MID, FINAL, NOTE, CT, ASSIGN) */}
                  <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider bg-[#C2671A] text-white shadow-sm">
                    {cat.badge}
                  </span>

                  {/* Center Themed Scroll/Document Illustration */}
                  <div className="my-4 transform group-hover:scale-105 transition-transform">
                    <CategoryScrollIcon
                      type={cat.iconType}
                      color="#C2671A"
                      className="w-20 h-20 sm:w-24 sm:h-24"
                    />
                  </div>

                  {/* Bottom Title & Total Count (User Request: "total count ta raikho") */}
                  <div className="w-full pt-2 border-t border-orange-200/50 dark:border-zinc-800/80">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug">
                      {cat.title}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-[#C2671A] dark:text-orange-400">
                      {cat.count > 0 ? `${cat.count} ${cat.count === 1 ? 'Item' : 'Items'} Available` : '0 Available (Request)'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LEVEL 2: TRIMESTER GRID (Matches Screenshot 2)             */}
      {/* ========================================================= */}
      {selectedCategory && (
        <div className="space-y-6">
          
          {/* Breadcrumb / Subheader (Screenshot 2) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200 dark:border-zinc-800">
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-[#FF6600] hover:text-white transition-colors shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Categories</span>
              </button>

              <div className="flex items-center space-x-2">
                <span 
                  style={{ backgroundColor: cardColor }} 
                  className="w-2.5 h-2.5 rounded-full inline-block"
                />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {categoryData[selectedCategory].title}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF6600]">
                  {activeItems.length}
                </span>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-[#FF6600] transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>

          </div>

          {/* Sub-Filter Tabs for Categories */}
          {selectedCategory && categoryData[selectedCategory].items.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1">Filter:</span>

              <button
                onClick={() => setSubFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  subFilter === 'all'
                    ? 'bg-[#FF6600] text-white shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-orange-400'
                }`}
              >
                All ({categoryData[selectedCategory].items.length})
              </button>

              {/* Handnote specific tabs */}
              {selectedCategory === 'handnote' && (
                <>
                  {[
                    { id: 'mid', label: '📘 Mid Term' },
                    { id: 'final', label: '📕 Final Term' },
                    { id: 'topicwise', label: '📙 Topicwise / Chapter' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSubFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        subFilter === tab.id
                          ? 'bg-[#FF6600] text-white shadow-sm'
                          : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-orange-400'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </>
              )}

              {/* CT specific tabs: CT 1, 2, 3, 4 */}
              {selectedCategory === 'ct' && (
                <>
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={`ct${num}`}
                      onClick={() => setSubFilter(`ct${num}`)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        subFilter === `ct${num}`
                          ? 'bg-[#FF6600] text-white shadow-sm'
                          : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-orange-400'
                      }`}
                    >
                      🎯 CT {num}
                    </button>
                  ))}
                </>
              )}

              {/* Assignment specific tabs: Assign 1, 2, 3 */}
              {selectedCategory === 'assignment' && (
                <>
                  {[1, 2, 3].map(num => (
                    <button
                      key={`a${num}`}
                      onClick={() => setSubFilter(`a${num}`)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        subFilter === `a${num}`
                          ? 'bg-[#FF6600] text-white shadow-sm'
                          : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-orange-400'
                      }`}
                    >
                      📋 Assign {num}
                    </button>
                  ))}
                </>
              )}

              {/* Question and Solution tabs for Mid, Final, CT, Assignment */}
              {(selectedCategory === 'mid' || selectedCategory === 'final' || selectedCategory === 'ct' || selectedCategory === 'assignment') && (
                <>
                  <button
                    onClick={() => setSubFilter('question')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      subFilter === 'question'
                        ? 'bg-[#FF6600] text-white shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-orange-400'
                    }`}
                  >
                    ❓ Questions ({categoryData[selectedCategory].questionCount})
                  </button>
                  <button
                    onClick={() => setSubFilter('solve')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      subFilter === 'solve'
                        ? 'bg-[#FF6600] text-white shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-orange-400'
                    }`}
                  >
                    💡 Solutions ({categoryData[selectedCategory].solutionCount})
                  </button>
                </>
              )}
            </div>
          )}

          {/* Grid of Resource Cards */}
          {activeItems.length === 0 ? (
            <EmptyState
              categoryName={categoryData[selectedCategory].title}
              onRequestClick={() => setRequestModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {activeItems.map((item) => {
                const isSol = isSolutionItem(item);
                const codeBadge = item.trimesterCode 
                  ? item.trimesterCode 
                  : (item.ctNumber ? `CT ${item.ctNumber}` : (item.assignmentNumber ? `Assign ${item.assignmentNumber}` : (item.type === 'handnote' ? 'NOTE' : 'PDF')));
                const readableSemester = item.trimesterCode ? formatTrimesterCode(item.trimesterCode) : '';
                const scope = detectNoteScope(item);

                return (
                  <div
                    key={item.id}
                    onClick={() => setPreviewItem(item)}
                    style={{ borderBottom: `4px solid ${cardColor}` }}
                    className="group relative flex flex-col justify-between text-left bg-white dark:bg-[#1E1E1E] border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                  >
                    <div>
                      {/* Top Row: Trimester Pill + Question/Solution or Scope Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FDF0E7] dark:bg-zinc-800 border border-[#F6D3BC] dark:border-zinc-700 text-[#C2671A] dark:text-orange-400 font-extrabold text-xs tracking-wide shadow-inner">
                          {codeBadge}
                        </span>

                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {/* CT Number Badge */}
                          {item.ctNumber && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800 shadow-sm">
                              CT {item.ctNumber}
                            </span>
                          )}
                          
                          {/* Assignment Number Badge */}
                          {item.assignmentNumber && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 shadow-sm">
                              ASSIGN {item.assignmentNumber}
                            </span>
                          )}

                          {/* Handnote Scope Badge */}
                          {selectedCategory === 'handnote' && (
                            <>
                              {scope === 'mid' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 shadow-sm">
                                  MID TERM
                                </span>
                              )}
                              {scope === 'final' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800 shadow-sm">
                                  FINAL TERM
                                </span>
                              )}
                              {scope === 'topicwise' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 shadow-sm">
                                  TOPICWISE
                                </span>
                              )}
                              {scope === 'full' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800 shadow-sm">
                                  FULL SYLLABUS
                                </span>
                              )}
                            </>
                          )}

                          {/* Question vs Solution Badge (for Mid, Final, CT, Assignment) */}
                          {selectedCategory !== 'handnote' && (
                            isSol ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 shadow-sm flex items-center space-x-1">
                                <span>💡 SOLVE</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800 shadow-sm flex items-center space-x-1">
                                <span>❓ QUESTION</span>
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      {/* Note Title / Topic Name (Prominent & Clear!) */}
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white group-hover:text-[#FF6600] transition-colors leading-snug line-clamp-2">
                        {item.title || (readableSemester ? `${readableSemester} Note` : 'Resource Item')}
                      </h4>

                      {/* Semester Name & Trimester Tag */}
                      {readableSemester && readableSemester !== 'General' && (
                        <p className="text-xs font-semibold text-[#C2671A] dark:text-orange-400 mt-1.5 flex items-center space-x-1">
                          <span>📅 {readableSemester}</span>
                        </p>
                      )}

                      {/* Optional Description */}
                      {item.description && (
                        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Card Footer: Contributor Credit & Read Action */}
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="truncate max-w-[130px] font-medium">
                        {item.contributor ? `By ${item.contributor.name}` : 'UIU Community'}
                      </span>
                      <span className="text-[11px] font-bold text-[#FF6600] group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                        <span>Read PDF</span>
                        <span>&rarr;</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Floating "Download all in ZIP File" Button (Screenshot 2) */}
          {activeItems.length > 0 && (
            <div className="fixed bottom-6 right-6 z-30">
              <button
                onClick={handleDownloadZip}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/30 transition-all transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download all in ZIP File</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* PDF Modal Viewer */}
      <PdfModalViewer
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />

      {/* Bulk Download Progress Modal */}
      <BulkDownloadModal
        isOpen={bulkModalOpen}
        progress={downloadProgress}
        onClose={() => setBulkModalOpen(false)}
      />

      {/* Request Note Modal */}
      <RequestNoteModal
        courseCode={course.code}
        courseTitle={course.title}
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />

    </div>
  );
};
