import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { BookmarkCheck, BookmarkMinus } from 'lucide-react';

interface ToastOptions {
  message: string;
  variant?: 'saved' | 'removed';
  actionLabel?: string;
  actionTo?: string;
}

interface ToastItem extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const counter = useRef(0);
  const navigate = useNavigate();

  const dismiss = useCallback(() => setToast(null), []);

  const showToast = useCallback((options: ToastOptions) => {
    counter.current += 1;
    setToast({ ...options, id: counter.current });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex justify-center px-4 lg:bottom-6 lg:pl-64">
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div
              key={toast.id}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto flex max-w-md items-center gap-3 border-2 border-foreground bg-foreground py-2.5 pl-2.5 pr-4 text-background shadow-[4px_4px_0_hsl(var(--primary))] dark:border-border dark:bg-card dark:text-card-foreground"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground">
                {toast.variant === 'removed' ? <BookmarkMinus className="h-4 w-4" /> : <BookmarkCheck className="h-4 w-4" />}
              </span>
              <span className="text-sm font-semibold">{toast.message}</span>
              {toast.actionLabel && toast.actionTo && (
                <button
                  onClick={() => {
                    dismiss();
                    navigate(toast.actionTo as string);
                  }}
                  className="ml-1 font-mono text-xs font-bold uppercase text-primary underline underline-offset-4"
                >
                  {toast.actionLabel}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
