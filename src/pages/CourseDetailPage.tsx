import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  Download, 
  FileText, 
  HelpCircle, 
  Award, 
  ClipboardList, 
  BookMarked,
  Sparkles,
  Search,
  Filter,
  Layers
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ResourceType, ResourceItem } from '../types';
import { NoteCard } from '../components/NoteCard';
import { PdfModalViewer } from '../components/PdfModalViewer';
import { BulkDownloadModal } from '../components/BulkDownloadModal';
import { EmptyState } from '../components/EmptyState';
import { RequestNoteModal } from '../components/RequestNoteModal';
import { ZipDownloadService, DownloadProgress } from '../services/zipDownloadService';

type TabKey = 'all' | 'handnote' | 'question_solve' | 'ct' | 'assignment' | 'cheatsheet';

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, resources, pinnedCourseIds, togglePinCourse } = useData();

  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [questionSubTab, setQuestionSubTab] = useState<'all' | 'mid' | 'final'>('all');
  const [previewItem, setPreviewItem] = useState<ResourceItem | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  
  // Bulk ZIP download state
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  // Find course
  const course = courses.find(c => c.id === courseId || c.code.toLowerCase().replace(/[\s-]/g, '') === (courseId || '').toLowerCase().replace(/[\s-]/g, ''));

  const isPinned = course ? pinnedCourseIds.includes(course.id) : false;

  // Filter resources for this course
  const courseResources = useMemo(() => {
    if (!course) return [];
    return resources.filter(r => r.courseId === course.id);
  }, [course, resources]);

  // Tab filtered resources
  const tabFilteredResources = useMemo(() => {
    return courseResources.filter(r => {
      if (activeTab === 'all') return true;
      if (activeTab === 'handnote') return r.type === 'handnote';
      if (activeTab === 'question_solve') {
        if (questionSubTab === 'mid') return r.type === 'question_mid';
        if (questionSubTab === 'final') return r.type === 'question_final';
        return r.type === 'question_mid' || r.type === 'question_final';
      }
      if (activeTab === 'ct') return r.type === 'ct';
      if (activeTab === 'assignment') return r.type === 'assignment';
      if (activeTab === 'cheatsheet') return r.type === 'cheatsheet';
      return true;
    });
  }, [courseResources, activeTab, questionSubTab]);

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
  const handleDownloadAllZip = async () => {
    if (tabFilteredResources.length === 0) return;
    setBulkModalOpen(true);
    try {
      await ZipDownloadService.downloadResourcesAsZip(
        `${course.code}_${activeTab}_resources`,
        tabFilteredResources,
        (prog) => setDownloadProgress(prog)
      );
    } catch (err) {
      console.error(err);
      setDownloadProgress({
        currentFile: 'Error packaging files',
        loaded: 0,
        total: tabFilteredResources.length,
        percentage: 0,
        status: 'error',
        errorMessage: 'Some files could not be downloaded due to CORS restrictions.'
      });
    }
  };

  const getCategoryCount = (type: TabKey) => {
    if (type === 'all') return courseResources.length;
    if (type === 'question_solve') {
      return courseResources.filter(r => r.type === 'question_mid' || r.type === 'question_final').length;
    }
    return courseResources.filter(r => r.type === type).length;
  };

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: 'all', label: 'All Resources', icon: Layers },
    { key: 'handnote', label: 'Handnotes', icon: FileText },
    { key: 'question_solve', label: 'Question Solves', icon: HelpCircle },
    { key: 'ct', label: 'Class Tests (CT)', icon: Award },
    { key: 'assignment', label: 'Assignments', icon: ClipboardList },
    { key: 'cheatsheet', label: 'Cheat Sheets', icon: BookMarked },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-500 hover:text-[#FF6600] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course Directory</span>
      </Link>

      {/* Course Hero Banner */}
      <div className="relative overflow-hidden bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-sm font-black tracking-wider bg-orange-100 dark:bg-orange-950/60 text-[#FF6600]">
                {course.code}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
                {course.department}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
                Trimester {course.trimester}
              </span>
              {course.credit && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
                  {course.credit} Credits
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {course.title}
            </h1>

            {course.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {course.description}
              </p>
            )}
          </div>

          {/* Quick Actions (Pin & ZIP download) */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <button
              onClick={() => togglePinCourse(course.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isPinned
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isPinned ? 'fill-white' : ''}`} />
              <span>{isPinned ? 'Pinned to Saved' : 'Pin Course'}</span>
            </button>

            {courseResources.length > 0 && (
              <button
                onClick={handleDownloadAllZip}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-[#FF6600] dark:hover:bg-[#FF6600] dark:hover:text-white transition-all shadow-sm"
                title="Download all resources in a single ZIP file"
              >
                <Download className="w-4 h-4" />
                <span>Download All in ZIP</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Category Tabs */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200 dark:border-zinc-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = getCategoryCount(tab.key);
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#FF6600] text-[#FF6600]'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-orange-100 dark:bg-orange-950/60 text-[#FF6600]' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subfilter for Question Solves (Mid vs Final) */}
        {activeTab === 'question_solve' && (
          <div className="flex items-center space-x-2 pt-1">
            <span className="text-xs font-medium text-gray-500">Filter Exam:</span>
            <button
              onClick={() => setQuestionSubTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                questionSubTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              All Exams
            </button>
            <button
              onClick={() => setQuestionSubTab('mid')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                questionSubTab === 'mid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              Mid Term Only
            </button>
            <button
              onClick={() => setQuestionSubTab('final')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                questionSubTab === 'final'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              Final Exam Only
            </button>
          </div>
        )}
      </div>

      {/* Resources List */}
      <div>
        {tabFilteredResources.length === 0 ? (
          <EmptyState
            categoryName={tabs.find(t => t.key === activeTab)?.label}
            onRequestClick={() => setRequestModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tabFilteredResources.map((item) => (
              <NoteCard
                key={item.id}
                item={item}
                onPreview={(selected) => setPreviewItem(selected)}
              />
            ))}
          </div>
        )}
      </div>

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
