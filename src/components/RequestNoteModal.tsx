import React, { useState } from 'react';
import { X, Send, CheckCircle2, BookOpen } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ResourceType } from '../types';

interface RequestNoteModalProps {
  courseCode: string;
  courseTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RequestNoteModal: React.FC<RequestNoteModalProps> = ({
  courseCode,
  courseTitle,
  isOpen,
  onClose,
}) => {
  const { addNoteRequest } = useData();
  const [requestedBy, setRequestedBy] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('handnote');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedBy.trim()) return;

    addNoteRequest({
      courseCode,
      courseTitle,
      resourceType,
      requestedBy,
      contactInfo,
      notes
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Request Submitted!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              We have noted your request for {courseCode}. Our contributors will prioritize this course soon!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6600] dark:bg-orange-950/50 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Request Note or Solution
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {courseCode} • {courseTitle}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  What kind of resource do you need?
                </label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value as ResourceType)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                >
                  <option value="handnote">Handwritten Lecture Notes</option>
                  <option value="question_mid">Mid Term Question & Solve</option>
                  <option value="question_final">Final Exam Question & Solve</option>
                  <option value="ct">Class Test (CT) Questions & Solves</option>
                  <option value="assignment">Assignment Solution & Code</option>
                  <option value="cheatsheet">Formula / Cheat Sheet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Your Name / Trimester
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shakil (Trimester 4)"
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Contact / Facebook / Email (Optional, to notify you when ready)
                </label>
                <input
                  type="text"
                  placeholder="e.g. fb.com/yourname or email@uiu.ac.bd"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Specific chapters or topics needed?
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Need Chapter 4 trees & graph BFS solve..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-5 py-2 text-sm font-semibold bg-[#FF6600] text-white hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
