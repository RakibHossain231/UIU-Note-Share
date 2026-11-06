import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { fetchPdfBinary } from '../services/pdfWatermarkService';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

/** Loaded documents are kept for the session so switching tabs does not download again. */
const documentCache = new Map<string, Promise<PDFDocumentProxy>>();

const loadPdf = (fileUrl: string): Promise<PDFDocumentProxy> => {
  let cached = documentCache.get(fileUrl);
  if (!cached) {
    cached = (async () => {
      const buffer = await fetchPdfBinary(fileUrl);
      if (!buffer) throw new Error('PDF could not be downloaded');
      return pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
    })();
    documentCache.set(fileUrl, cached);
    cached.catch(() => documentCache.delete(fileUrl));
    if (documentCache.size > 6) {
      const oldest = documentCache.keys().next().value;
      if (oldest) documentCache.delete(oldest);
    }
  }
  return cached;
};

interface PdfPageProps {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  rotation: number;
  width: number;
  height: number;
  wrapRef: (el: HTMLDivElement | null) => void;
}

/** One page drawn on a canvas. It is only rendered while it is near the screen. */
const PdfPage: React.FC<PdfPageProps> = ({ pdf, pageNumber, scale, rotation, width, height, wrapRef }) => {
  const holder = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '800px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let task: RenderTask | undefined;
    let cancelled = false;

    (async () => {
      const page = await pdf.getPage(pageNumber);
      if (cancelled) return;
      const viewport = page.getViewport({ scale, rotation: (page.rotate + rotation) % 360 });
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context) return;

      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);

      task = page.render({
        canvasContext: context,
        viewport,
        transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined
      });
      await task.promise;
    })().catch((err: { name?: string }) => {
      if (err?.name !== 'RenderingCancelledException') console.error('PDF page render error:', err);
    });

    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [visible, pdf, pageNumber, scale, rotation]);

  return (
    <div
      ref={(el) => {
        holder.current = el;
        wrapRef(el);
      }}
      className="relative bg-white shadow-lg"
      style={{ width, height }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

interface PdfCanvasViewerProps {
  fileUrl: string;
  zoom: number; // 100 = fit to width
  rotation: number;
  onReady: () => void;
  /** Shown instead when the PDF cannot be fetched or parsed (e.g. Google Docs links). */
  fallback: React.ReactNode;
}

/**
 * Real PDF viewer: only the pages zoom/rotate. No third-party toolbar is involved,
 * so nothing else on screen changes size. Scroll both ways, or drag to pan.
 */
export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({ fileUrl, zoom, rotation, onReady, fallback }) => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number }[]>([]);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [grabbing, setGrabbing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const anchor = useRef({ x: 0.5, y: 0 }); // x: centre ratio, y: top-edge ratio
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const frame = useRef<number | null>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  // Load the document and measure every page once
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setPdf(null);
    setDims([]);

    (async () => {
      const doc = await loadPdf(fileUrl);
      const sizes = await Promise.all(
        Array.from({ length: doc.numPages }, async (_, index) => {
          const page = await doc.getPage(index + 1);
          const view = page.getViewport({ scale: 1 });
          return { w: view.width, h: view.height };
        })
      );
      if (cancelled) return;
      setPdf(doc);
      setDims(sizes);
      setStatus('ready');
      onReadyRef.current();
    })().catch((err) => {
      if (cancelled) return;
      console.error('PDF viewer fell back to the embedded preview:', err);
      setStatus('failed');
    });

    return () => {
      cancelled = true;
    };
  }, [fileUrl]);

  // Track the width of the scroll area
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => setViewportWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [status]);

  const rotated = rotation % 180 !== 0;
  const first = dims[0];
  const fitScale = first && viewportWidth ? Math.max(0.1, (viewportWidth - 24) / (rotated ? first.h : first.w)) : 1;
  const scale = fitScale * (zoom / 100);

  const updateCurrentPage = () => {
    const el = scrollRef.current;
    if (!el) return;
    const line = el.getBoundingClientRect().top + el.clientHeight * 0.4;
    let found = 1;
    pageRefs.current.forEach((page, index) => {
      if (page && page.getBoundingClientRect().bottom <= line) found = Math.min(index + 2, pageRefs.current.length);
    });
    setCurrentPage(found);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth) anchor.current.x = (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth;
    if (el.scrollHeight > el.clientHeight) anchor.current.y = el.scrollTop / el.scrollHeight;
    if (frame.current === null) {
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        updateCurrentPage();
      });
    }
  };

  // Keep the same part of the document in view after zoom / rotate / resize
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollWidth <= el.clientWidth) anchor.current.x = 0.5;
    el.scrollLeft = anchor.current.x * el.scrollWidth - el.clientWidth / 2;
    el.scrollTop = anchor.current.y * el.scrollHeight;
  }, [scale, rotation, dims.length]);

  // Drag to pan
  useEffect(() => {
    if (!grabbing) return;
    const move = (e: MouseEvent) => {
      const el = scrollRef.current;
      const start = drag.current;
      if (!el || !start) return;
      el.scrollLeft = start.left - (e.clientX - start.x);
      el.scrollTop = start.top - (e.clientY - start.y);
    };
    const up = () => {
      drag.current = null;
      setGrabbing(false);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [grabbing]);

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  if (status === 'failed') return <>{fallback}</>;

  return (
    <div className="relative h-full w-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={(e) => {
          const el = scrollRef.current;
          if (!el || e.button !== 0) return;
          drag.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
          setGrabbing(true);
        }}
        className={`h-full w-full overflow-auto bg-zinc-950 select-none ${grabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <div className="mx-auto flex w-max flex-col gap-3 p-3">
          {pdf &&
            dims.map((d, index) => (
              <PdfPage
                key={index}
                pdf={pdf}
                pageNumber={index + 1}
                scale={scale}
                rotation={rotation}
                width={(rotated ? d.h : d.w) * scale}
                height={(rotated ? d.w : d.h) * scale}
                wrapRef={(el) => {
                  pageRefs.current[index] = el;
                }}
              />
            ))}
        </div>
      </div>

      {pdf && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900/90 px-3 py-1 font-mono text-xs font-semibold text-white shadow-lg">
          Page {currentPage} / {pdf.numPages}
        </div>
      )}
    </div>
  );
};
