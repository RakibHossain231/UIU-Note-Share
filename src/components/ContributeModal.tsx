import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  User, 
  Send, 
  Loader2,
  FileCheck,
  Info
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ResourceType } from '../types';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCourseId?: string;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
  preselectedCourseId
}) => {
  const { courses, departments, submitContribution } = useData();

  // Mode: Link vs Direct File Upload
  const [submissionType, setSubmissionType] = useState<'link' | 'file'>('link');

  // Contributor Info
  const [contributorName, setContributorName] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [batch, setBatch] = useState('');
  const [socialType, setSocialType] = useState<'facebook' | 'linkedin' | 'github' | 'email'>('facebook');
  const [profileUrl, setProfileUrl] = useState('');

  // Course Info
  const [selectedCourseId, setSelectedCourseId] = useState<string>(preselectedCourseId || (courses[0]?.id || ''));
  const [customCourseCode, setCustomCourseCode] = useState('');
  const [customCourseTitle, setCustomCourseTitle] = useState('');

  // Resource Info
  const [resourceType, setResourceType] = useState<ResourceType>('handnote');
  const [trimesterCode, setTrimesterCode] = useState('Fall 2024');
  const [notes, setNotes] = useState('');

  // Link submission
  const [driveLink, setDriveLink] = useState('');

  // File submission
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    // Supabase Free Tier single-file upload limit is 50MB
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage('Direct upload-এ ফাইলের সর্বোচ্চ সীমা 50 MB। ৫০ MB-র বেশি বড় ফাইলের জন্য (যেমন 100 MB, 200 MB বা ১ GB) অনুগ্রহ করে "Google Drive / Public Link" অপশনটি ব্যবহার করুন।');
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!contributorName.trim()) {
      setErrorMessage('Please provide your name so we can give you proper credit!');
      return;
    }

    // Determine course code and title
    let finalCode = '';
    let finalTitle = '';
    let finalCourseId = selectedCourseId;

    if (selectedCourseId === 'other') {
      if (!customCourseCode.trim() || !customCourseTitle.trim()) {
        setErrorMessage('Please specify the Course Code and Course Title.');
        return;
      }
      finalCode = customCourseCode.trim().toUpperCase();
      finalTitle = customCourseTitle.trim();
      finalCourseId = undefined as any;
    } else {
      const found = courses.find(c => c.id === selectedCourseId);
      if (found) {
        finalCode = found.code;
        finalTitle = found.title;
      } else {
        setErrorMessage('Please select a course.');
        return;
      }
    }

    if (submissionType === 'link') {
      if (!driveLink.trim()) {
        setErrorMessage('Please enter the Google Drive / Public shareable link.');
        return;
      }
    } else {
      if (!selectedFile) {
        setErrorMessage('Please select or drag a PDF / Document file to upload.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const derivedTerm = resourceType === 'question_mid' ? 'Mid'
        : resourceType === 'question_final' ? 'Final'
        : resourceType === 'ct' ? 'CT'
        : undefined;

      const res = await submitContribution(
        {
          contributorName: contributorName.trim(),
          department,
          batch: batch.trim() || 'UIUian',
          profileUrl: profileUrl.trim() || undefined,
          socialType,
          courseId: finalCourseId,
          courseCode: finalCode,
          courseTitle: finalTitle,
          resourceType,
          trimesterCode: trimesterCode.trim() || undefined,
          term: derivedTerm,
          submissionType,
          fileUrl: submissionType === 'link' ? driveLink.trim() : undefined,
          notes: notes.trim() || undefined
        },
        submissionType === 'file' && selectedFile ? selectedFile : undefined
      );

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 3000);
      } else {
        setErrorMessage(res.error || 'Failed to submit contribution. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 backdrop-blur-md p-3 sm:p-4">
      <div className="flex min-h-full items-start justify-center py-6 sm:py-10">
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                Contribution Received! 🎉
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-[#FF6600]">{contributorName}</span>! Your note has been submitted for admin verification. Once verified, your resource will be published and your name will be honored on the Wall of Contributors!
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF6600] dark:bg-orange-950/60 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                    Contribute Study Material
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Share handnotes, midterm/final solves, or CT solutions with fellow UIUians
                  </p>
                </div>
              </div>

              {/* Submission Mode Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-zinc-800/70 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionType('link');
                    setErrorMessage(null);
                  }}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    submissionType === 'link'
                      ? 'bg-white dark:bg-zinc-900 text-[#FF6600] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Google Drive / Public Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubmissionType('file');
                    setErrorMessage(null);
                  }}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    submissionType === 'file'
                      ? 'bg-white dark:bg-zinc-900 text-[#FF6600] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Direct File Upload (PDF)</span>
                </button>
              </div>

              {/* Submission notice */}
              {submissionType === 'link' ? (
                <div className="flex items-start space-x-2.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs mb-5">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    Paste a viewable link (e.g. Google Drive, OneDrive). Please ensure link sharing is set to: <strong>&quot;Anyone with the link can view&quot;</strong>.
                  </span>
                </div>
              ) : (
                <div className="flex items-start space-x-2.5 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-blue-800 dark:text-blue-300 text-xs mb-5">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                  <span>
                    Upload clean PDF or documents up to 50 MB. For larger files (up to 15 GB), please choose the <strong>Google Drive / Public Link</strong> option.
                  </span>
                </div>
              )}

            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Contributor Profile Section */}
              <div className="bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-3">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                  <User className="w-3.5 h-3.5 text-[#FF6600]" />
                  <span>Contributor Credit Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sadia Islam / Tanvir Ahmed"
                      value={contributorName}
                      onChange={(e) => setContributorName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Department *
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                    >
                      {departments.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Batch (e.g. 231)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 231"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Profile Platform
                    </label>
                    <select
                      value={socialType}
                      onChange={(e) => setSocialType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                    >
                      <option value="facebook">Facebook</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="github">GitHub</option>
                      <option value="email">Email</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Profile Link (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://facebook.com/username"
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>
                </div>
              </div>

              {/* Course and Resource Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Select Course *
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.title}
                      </option>
                    ))}
                    <option value="other">+ Other (Not in list)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Material Type *
                  </label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value as ResourceType)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                  >
                    <option value="handnote">Lecture Handnotes</option>
                    <option value="question_mid">Mid Term Question / Solve</option>
                    <option value="question_final">Final Exam Question / Solve</option>
                    <option value="ct">Class Test (CT) Question / Solve</option>
                    <option value="assignment">Assignment Solution / Project</option>
                  </select>
                </div>
              </div>

              {/* If "Other" course is selected */}
              {selectedCourseId === 'other' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-2xl border border-orange-200/60 dark:border-orange-900/40">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Course Code *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CSE 1115"
                      value={customCourseCode}
                      onChange={(e) => setCustomCourseCode(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Object Oriented Programming"
                      value={customCourseTitle}
                      onChange={(e) => setCustomCourseTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>
                </div>
              )}

              {/* Trimester */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Trimester
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fall 2024, Summer 2024"
                  value={trimesterCode}
                  onChange={(e) => setTrimesterCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              {/* Submission Input (Link or Direct File) */}
              {submissionType === 'link' ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Google Drive or Public URL *
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Upload File (PDF / Doc / Image) *
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {selectedFile ? (
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/60">
                      <div className="flex items-center space-x-3 truncate">
                        <div className="w-9 h-9 rounded-xl bg-[#FF6600] text-white flex items-center justify-center shrink-0">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="truncate text-left">
                          <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {selectedFile.name}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                        dragActive
                          ? 'border-[#FF6600] bg-orange-50/50 dark:bg-orange-950/20'
                          : 'border-gray-300 dark:border-zinc-700 hover:border-[#FF6600] bg-gray-50 dark:bg-zinc-800/40'
                      }`}
                    >
                      <UploadCloud className="w-8 h-8 text-[#FF6600] mx-auto mb-2 opacity-80" />
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        Click to browse or drag & drop file here
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        PDF or Image files up to 50 MB (For larger files, use Google Drive Link)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Remarks / Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Additional Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Course instructor was Prof. ABC, includes questions 1-4 solution"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#FF6600] hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading & Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Contribution</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
