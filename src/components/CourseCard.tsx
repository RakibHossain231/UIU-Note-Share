import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { Course } from '../types';
import { useData } from '../context/DataContext';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { resources, pinnedCourseIds, togglePinCourse } = useData();

  const isPinned = pinnedCourseIds.includes(course.id);
  const courseResources = resources.filter(r => r.courseId === course.id);

  const handlePinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePinCourse(course.id);
  };

  // Ensure course has a vibrant fallback color if none provided
  const cardColor = course.color || '#FF6600';

  return (
    <Link
      to={`/course/${course.id}`}
      style={{ borderBottom: `5px solid ${cardColor}` }}
      className="group relative flex flex-col justify-between bg-white dark:bg-[#1E1E1E] border border-gray-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
    >
      <div>
        {/* Top Header: Code & Pin Button */}
        <div className="flex items-center justify-between mb-2">
          <span 
            style={{ color: cardColor }} 
            className="text-sm font-extrabold tracking-wider uppercase"
          >
            {course.code}
          </span>

          <button
            onClick={handlePinClick}
            aria-label={isPinned ? 'Unpin course' : 'Pin course'}
            className={`p-1 rounded-lg transition-colors ${
              isPinned
                ? 'text-orange-500 hover:text-orange-600'
                : 'text-gray-300 dark:text-zinc-600 hover:text-orange-500'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isPinned ? 'fill-orange-500 text-orange-500' : ''}`} />
          </button>
        </div>

        {/* Course Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#FF6600] transition-colors">
          {course.title}
        </h3>

        {/* Subtle Horizontal Divider */}
        <div className="w-12 h-[2px] bg-gray-200 dark:bg-zinc-700 mt-3 mb-4 rounded-full" />
      </div>

      {/* Clean Bottom Meta */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium pt-1">
        <span>Updated Till Spring 2026</span>
        {courseResources.length > 0 && (
          <span className="text-[11px] text-gray-400 dark:text-zinc-500">
            {courseResources.length} {courseResources.length === 1 ? 'Resource' : 'Resources'}
          </span>
        )}
      </div>
    </Link>
  );
};
