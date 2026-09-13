import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, FileText, CheckCircle2, Award, ClipboardList, ArrowRight } from 'lucide-react';
import { Course } from '../types';
import { useData } from '../context/DataContext';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { resources, pinnedCourseIds, togglePinCourse } = useData();

  const isPinned = pinnedCourseIds.includes(course.id);
  const courseResources = resources.filter(r => r.courseId === course.id);

  const handnotesCount = courseResources.filter(r => r.type === 'handnote').length;
  const questionsCount = courseResources.filter(r => r.type === 'question_mid' || r.type === 'question_final').length;
  const ctCount = courseResources.filter(r => r.type === 'ct').length;
  const assignmentCount = courseResources.filter(r => r.type === 'assignment').length;

  const handlePinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePinCourse(course.id);
  };

  return (
    <Link
      to={`/course/${course.id}`}
      className="group relative flex flex-col justify-between bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-zinc-800/90 rounded-2xl p-5 hover:border-[#FF6600]/60 dark:hover:border-[#FF6600]/60 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Top Bar with Badges & Pin */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide bg-orange-50 dark:bg-orange-950/50 text-[#FF6600] border border-orange-200 dark:border-orange-900/50">
              {course.code}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
              {course.department}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
              Trim {course.trimester}
            </span>
          </div>

          <button
            onClick={handlePinClick}
            aria-label={isPinned ? 'Unpin course' : 'Pin course'}
            className={`p-1.5 rounded-lg transition-colors ${
              isPinned
                ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/40'
                : 'text-gray-400 hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isPinned ? 'fill-orange-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#FF6600] transition-colors leading-snug line-clamp-2">
          {course.title}
        </h3>

        {/* Description snippet */}
        {course.description && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}
      </div>

      {/* Bottom Resource Summary Counters */}
      <div className="mt-5 pt-3 border-t border-gray-100 dark:border-zinc-800">
        <div className="grid grid-cols-4 gap-1 text-center py-1">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-900 dark:text-gray-200">
              {handnotesCount}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">Notes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-900 dark:text-gray-200">
              {questionsCount}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">Solves</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-900 dark:text-gray-200">
              {ctCount}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">CTs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-900 dark:text-gray-200">
              {assignmentCount}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">Assign</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#FF6600]">
          <span>View Archive</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
