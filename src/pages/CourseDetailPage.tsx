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
import { formatTrimesterCode } from '../utils/trimesterHelper';

type CategoryKey = 
  | 'handnote'
  | 'mid_question'
  | 'mid_solve'
  | 'final_question'
  | 'final_solve'
  | 'ct_question'
  | 'ct_solve'
  | 'assignment_question'
  | 'assignment_solve'
  | 'cheatsheet';

const CATEGORY_ORDER: CategoryKey[] = [
  'handnote',
  'mid_question',
  'mid_solve',
  'final_question',
  'final_solve',
  'ct_question',
  'ct_solve',
  'assignment_question',
  'assignment_solve',
  'cheatsheet'
];

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, resources, pinnedCourseIds, togglePinCourse } = useData();

  // Selected Category (null = Level 1 Category Hub, string = Level 2 Trimester Grid)
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Modals state
  const [previewItem, setPreviewItem] = useState<ResourceItem | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);

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

  // Category counts and categorization in strict user-requested order
  const categoryData = useMemo(() => {
    // 1. Handnotes
    const handnotes = courseResources.filter(r => r.type === 'handnote');

    // 2. Mid Questions (question papers)
    const midQuestions = courseResources.filter(r => 
      (r.type === 'question_mid' || r.type === 'mid_question') && 
      (!r.hasSolution || r.type === 'mid_question' || r.title.toLowerCase().includes('question') || !r.title.toLowerCase().includes('solve'))
    );

    // 3. Mid Solves (verified solutions)
    const midSolves = courseResources.filter(r => 
      r.type === 'mid_solve' || 
      ((r.type === 'question_mid' || r.term === 'mid') && (r.hasSolution || r.title.toLowerCase().includes('solve') || r.title.toLowerCase().includes('solution')))
    );

    // 4. Final Questions
    const finalQuestions = courseResources.filter(r => 
      (r.type === 'question_final' || r.type === 'final_question') && 
      (!r.hasSolution || r.type === 'final_question' || r.title.toLowerCase().includes('question') || !r.title.toLowerCase().includes('solve'))
    );

    // 5. Final Solves
    const finalSolves = courseResources.filter(r => 
      r.type === 'final_solve' || 
      ((r.type === 'question_final' || r.term === 'final') && (r.hasSolution || r.title.toLowerCase().includes('solve') || r.title.toLowerCase().includes('solution')))
    );

    // 6. CT Questions
    const ctQuestions = courseResources.filter(r => 
      (r.type === 'ct' || r.type === 'ct_question') && 
      (!r.hasSolution || r.type === 'ct_question' || r.title.toLowerCase().includes('question') || !r.title.toLowerCase().includes('solve'))
    );

    // 7. CT Solves
    const ctSolves = courseResources.filter(r => 
      r.type === 'ct_solve' || 
      (r.type === 'ct' && (r.hasSolution || r.title.toLowerCase().includes('solve') || r.title.toLowerCase().includes('solution')))
    );

    // 8. Assignments
    const assignments = courseResources.filter(r => 
      (r.type === 'assignment' || r.type === 'assignment_question') && 
      (!r.hasSolution || r.type === 'assignment_question' || r.title.toLowerCase().includes('question') || r.title.toLowerCase().includes('specification') || !r.title.toLowerCase().includes('solve'))
    );

    // 9. Assignment Solves
    const assignmentSolves = courseResources.filter(r => 
      r.type === 'assignment_solve' || 
      (r.type === 'assignment' && (r.hasSolution || r.title.toLowerCase().includes('solve') || r.title.toLowerCase().includes('solution') || r.title.toLowerCase().includes('code')))
    );

    // 10. Cheat Sheets
    const cheatsheets = courseResources.filter(r => r.type === 'cheatsheet');

    return {
      handnote: {
        title: 'Handwritten Notes',
        badge: 'NOTE',
        count: handnotes.length,
        items: handnotes,
        iconType: 'handnote' as const
      },
      mid_question: {
        title: 'Mid-Term Questions',
        badge: 'MID',
        count: midQuestions.length,
        items: midQuestions,
        iconType: 'question' as const
      },
      mid_solve: {
        title: 'Mid-Term Solutions',
        badge: 'MID SOLVE',
        count: midSolves.length,
        items: midSolves,
        iconType: 'solution' as const
      },
      final_question: {
        title: 'Final Questions',
        badge: 'FINAL',
        count: finalQuestions.length,
        items: finalQuestions,
        iconType: 'question' as const
      },
      final_solve: {
        title: 'Final Solutions',
        badge: 'FINAL SOLVE',
        count: finalSolves.length,
        items: finalSolves,
        iconType: 'solution' as const
      },
      ct_question: {
        title: 'Class Tests (CT)',
        badge: 'CT',
        count: ctQuestions.length,
        items: ctQuestions,
        iconType: 'ct' as const
      },
      ct_solve: {
        title: 'Class Tests (CT) Solves',
        badge: 'CT SOLVE',
        count: ctSolves.length,
        items: ctSolves,
        iconType: 'ct_solve' as const
      },
      assignment_question: {
        title: 'Assignments',
        badge: 'ASSIGN',
        count: assignments.length,
        items: assignments,
        iconType: 'assignment' as const
      },
      assignment_solve: {
        title: 'Assignment Solutions',
        badge: 'ASSIGN SOLVE',
        count: assignmentSolves.length,
        items: assignmentSolves,
        iconType: 'assignment_solve' as const
      },
      cheatsheet: {
        title: 'Formula & Cheat Sheets',
        badge: 'CHEAT',
        count: cheatsheets.length,
        items: cheatsheets,
        iconType: 'cheatsheet' as const
      }
    };
  }, [courseResources]);

  // Selected category items with sorting
  const activeItems = useMemo(() => {
    if (!selectedCategory) return [];
    const rawItems = [...categoryData[selectedCategory].items];
    return rawItems.sort((a, b) => {
      const codeA = a.trimesterCode || '';
      const codeB = b.trimesterCode || '';
      if (sortOrder === 'newest') {
        return codeB.localeCompare(codeA);
      }
      return codeA.localeCompare(codeB);
    });
  }, [selectedCategory, categoryData, sortOrder]);

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
            {CATEGORY_ORDER.map((key) => {
              const cat = categoryData[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className="group relative flex flex-col items-center justify-between text-center bg-[#FFF9F5] dark:bg-[#201A16] border border-orange-200/70 dark:border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-[#FF6600]/60 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                >
                  {/* Top-Right Badge (e.g. MID, FINAL, NOTE) */}
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

          {/* Grid of Trimester Cards (Matches Screenshot 2) */}
          {activeItems.length === 0 ? (
            <EmptyState
              categoryName={categoryData[selectedCategory].title}
              onRequestClick={() => setRequestModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {activeItems.map((item) => {
                const codeBadge = item.trimesterCode 
                  ? item.trimesterCode 
                  : (item.ctNumber ? `CT ${item.ctNumber}` : (item.assignmentNumber ? `Assign ${item.assignmentNumber}` : (item.type === 'handnote' ? 'NOTE' : (item.type === 'cheatsheet' ? 'CHEAT' : 'PDF'))));
                const readableSemester = item.trimesterCode ? formatTrimesterCode(item.trimesterCode) : item.title;

                return (
                  <div
                    key={item.id}
                    onClick={() => setPreviewItem(item)}
                    style={{ borderBottom: `4px solid ${cardColor}` }}
                    className="group relative flex flex-col items-center justify-center text-center bg-white dark:bg-[#1E1E1E] border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Oval Trimester Pill (e.g. 261, 253, 252) */}
                    <div className="px-5 py-1 rounded-full bg-[#FDF0E7] dark:bg-zinc-800 border border-[#F6D3BC] dark:border-zinc-700 text-[#C2671A] dark:text-orange-400 font-extrabold text-sm sm:text-base tracking-wide shadow-inner mb-3">
                      {codeBadge}
                    </div>

                    {/* Semester Name (e.g. Spring 2026, Fall 2025) */}
                    <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#FF6600] transition-colors">
                      {readableSemester !== 'General' ? readableSemester : item.title}
                    </h4>

                    {/* Contributor Credit (Miniature) */}
                    {item.contributor && (
                      <span className="mt-2 text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
                        By {item.contributor.name}
                      </span>
                    )}
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
