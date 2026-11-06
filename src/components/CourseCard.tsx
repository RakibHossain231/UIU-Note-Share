import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { Course } from '../types';
import { useData } from '../context/DataContext';
import { getLatestTrimesterForCourse } from '../utils/trimesterHelper';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
}

const MotionLink = motion.create(Link);

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { resources, pinnedCourseIds, togglePinCourse } = useData();

  const isPinned = pinnedCourseIds.includes(course.id);
  const courseResources = resources.filter(r => r.courseId === course.id);
  const latestTrimester = getLatestTrimesterForCourse(courseResources);

  const handlePinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePinCourse(course.id);
  };

  const cardColor = course.color || '#FF6600';

  return (
    <MotionLink
      to={`/course/${course.id}`}
      whileHover={{ x: -3, y: -3 }}
      whileTap={{ x: 0, y: 0 }}
      transition={{ type: 'spring', stiffness: 600, damping: 35 }}
      className={cn(
        'group relative flex flex-col justify-between border-2 bg-card py-5 pl-7 pr-5',
        'border-foreground shadow-[4px_4px_0_hsl(var(--foreground))] hover:shadow-[7px_7px_0_hsl(var(--foreground))]',
        'dark:border-border dark:shadow-[4px_4px_0_hsl(var(--border))] dark:hover:shadow-[7px_7px_0_hsl(var(--primary))]'
      )}
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-2.5" style={{ backgroundColor: cardColor }} />

      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="font-mono text-sm font-bold uppercase tracking-wider" style={{ color: cardColor }}>
            {course.code}
          </span>
          <button
            onClick={handlePinClick}
            aria-label={isPinned ? 'Remove from Saved' : 'Save course'}
            aria-pressed={isPinned}
            className={cn(
              'border-2 p-1.5 transition-colors',
              isPinned
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
            )}
          >
            <Bookmark className={cn('h-4 w-4', isPinned && 'fill-current')} />
          </button>
        </div>

        <h3 className="text-xl font-bold leading-tight tracking-tight text-card-foreground group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
          {course.title}
        </h3>
      </div>

      <div className="mt-6 flex items-center justify-between border-t-2 border-dashed border-border pt-3 font-mono text-[11px] font-medium uppercase text-muted-foreground">
        <span>{latestTrimester ? `Updated Till ${latestTrimester}` : 'No Resources Yet'}</span>
        <span className="inline-flex items-center gap-1 font-bold text-foreground">
          <FileText className="h-3.5 w-3.5" />
          {courseResources.length} {courseResources.length === 1 ? 'Resource' : 'Resources'}
        </span>
      </div>
    </MotionLink>
  );
};
