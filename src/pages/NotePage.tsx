import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PdfModalViewer } from '../components/PdfModalViewer';
import { ResourceItem } from '../types';

export const NotePage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const { resources } = useData();
  const navigate = useNavigate();
  const [timedOut, setTimedOut] = useState(false);

  const item = useMemo(
    () => resources.find(r => r.id === resourceId) || null,
    [resources, resourceId]
  );

  const courseResources = useMemo(
    () => (item ? resources.filter(r => r.courseId === item.courseId) : []),
    [resources, item]
  );

  // Resources load asynchronously on a fresh tab, so wait a little before declaring "not found"
  useEffect(() => {
    setTimedOut(false);
    const t = window.setTimeout(() => setTimedOut(true), 8000);
    return () => window.clearTimeout(t);
  }, [resourceId]);

  useEffect(() => {
    if (item) document.title = `${item.title} | UIU Note Share`;
  }, [item]);

  const handleClose = () => {
    // Go back to where the user came from (course page, same category); fall back to the course page
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) {
      navigate(-1);
    } else {
      navigate(item ? `/course/${item.courseId}` : '/', { replace: true });
    }
  };

  const handleOpenResource = (next: ResourceItem) => navigate(`/note/${encodeURIComponent(next.id)}`, { replace: true });

  if (!item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        {timedOut ? (
          <>
            <h1 className="text-xl font-bold">Note not found</h1>
            <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
              This note may have been removed, or the link is incorrect.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6600] hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to all courses
            </Link>
          </>
        ) : (
          <Loader2 className="h-8 w-8 animate-spin text-[#FF6600]" aria-label="Loading note" />
        )}
      </div>
    );
  }

  return (
    <PdfModalViewer
      asPage
      items={[item]}
      activeItemId={item.id}
      onSelectTab={() => {}}
      onCloseTab={handleClose}
      onClose={handleClose}
      availableResources={courseResources}
      onOpenResource={handleOpenResource}
    />
  );
};
