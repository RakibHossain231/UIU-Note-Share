import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { useData } from '../context/DataContext';
import { CourseCard } from '../components/CourseCard';
import { cn } from '@/lib/utils';

const ink = 'border-foreground dark:border-border';

export const SavedPage: React.FC = () => {
  const { courses, pinnedCourseIds } = useData();

  const savedCourses = useMemo(
    () => courses.filter(c => pinnedCourseIds.includes(c.id)),
    [courses, pinnedCourseIds]
  );

  return (
    <div className="space-y-8 pb-16">
      <div className={cn('flex items-center gap-3 border-b-2 pb-3', ink)}>
        <span className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground">
          <Bookmark className="h-4 w-4 fill-current" />
        </span>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Saved Courses</h1>
        <span className="ml-auto bg-foreground px-2 py-0.5 font-mono text-xs font-bold text-background">
          {savedCourses.length}
        </span>
      </div>

      {savedCourses.length === 0 ? (
        <div className={cn('border-2 border-dashed bg-card px-4 py-16 text-center', ink)}>
          <Bookmark className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <h2 className="text-lg font-bold">No saved courses yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Tap the bookmark on any course card to save it here.
          </p>
          <Link
            to="/"
            className={cn('mt-5 inline-block border-2 bg-primary px-4 py-2 text-sm font-bold text-primary-foreground', ink)}
          >
            Browse All Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {savedCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};
