import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Eye, 
  Download, 
  Sparkles, 
  UploadCloud, 
  FileText, 
  Layers, 
  Users, 
  ShieldCheck, 
  MessageSquarePlus, 
  AlertCircle,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { ContributeModal } from '../components/ContributeModal';

export const HowToUsePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'contributor' | 'faq'>('student');
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Do I need an account or login to read or share notes?',
      a: 'No! UIU Note Share is 100% free and open. No account registration or login is required to browse, read, download, or contribute notes.'
    },
    {
      q: 'Will my raw Google Drive link be exposed to other students?',
      a: 'No. Your Google Drive URL is protected. Students view notes inside our secure in-app reader and download files with automated watermarks without seeing raw Drive URLs.'
    },
    {
      q: 'Which departments can I share notes for?',
      a: 'All UIU departments are supported! You can share handnotes, mid/final solves, and CT questions for CSE, Data Science, EEE, BBA, Civil, and general education courses.'
    },
    {
      q: 'How long does it take for a submitted note to be approved?',
      a: 'The admin team usually reviews and approves submissions within a few hours. Once approved, the note appears live in the course and on the Wall of Contributors immediately.'
    },
    {
      q: 'Will my name be stamped on the downloaded PDFs?',
      a: 'Yes! When anyone downloads your shared note, each page automatically displays a neat footer watermark: "UIU Note Share • Contributed by [Your Name]".'
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-[#FF6600] dark:text-orange-400 text-xs font-bold">
          <BookOpen className="w-4 h-4" />
          <span>User Guide & Instructions</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          How to Use <span className="text-[#FF6600]">UIU Note Share</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          A beginner-friendly guide on how to discover study notes, exam solves, and how to share your own notes to get credited on the platform.
        </p>

        {/* Segment Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
              activeTab === 'student'
                ? 'bg-[#FF6600] text-white shadow-orange-500/30 scale-105'
                : 'bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800'
            }`}
          >
            <span>🎓 For Students</span>
            <span className="text-[11px] opacity-80">(Browse & Read)</span>
          </button>

          <button
            onClick={() => setActiveTab('contributor')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
              activeTab === 'contributor'
                ? 'bg-[#FF6600] text-white shadow-orange-500/30 scale-105'
                : 'bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800'
            }`}
          >
            <span>✍️ For Contributors</span>
            <span className="text-[11px] opacity-80">(Share Notes)</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-[#FF6600] text-white shadow-orange-500/30 scale-105'
                : 'bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800'
            }`}
          >
            <span>❓ FAQs</span>
            <span className="text-[11px] opacity-80">(Common Questions)</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: FOR STUDENTS */}
      {/* ========================================================================= */}
      {activeTab === 'student' && (
        <section className="space-y-8 animate-in fade-in duration-300">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              How Students Can Find & Read Notes
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Get exam solves, handwritten lecture notes, and CT questions in 5 easy steps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800/90 rounded-3xl p-6 shadow-sm hover:border-[#FF6600]/40 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6600] dark:bg-orange-950/60 dark:text-orange-400 flex items-center justify-center font-black text-lg">
                  1
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Search className="w-4 h-4 text-[#FF6600]" />
                  <span>Search Your Course</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Type your course code (e.g., <strong>CSE 2118</strong>, <strong>MATH 1101</strong>, or <em>Algorithms</em>) into the search bar, or use the department filter (CSE, DS, EEE, BBA, Civil) to find your course.
                </p>
              </div>
              <div className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold bg-orange-50 dark:bg-orange-950/30 p-2.5 rounded-xl">
                💡 Quick Tip: Click the bookmark (📌) icon on any course card to save it to your "Saved" list for instant access.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800/90 rounded-3xl p-6 shadow-sm hover:border-[#FF6600]/40 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center font-black text-lg">
                  2
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span>Choose Note Category</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Open your course and switch between tabs: <strong>Handnotes</strong>, <strong>Mid Questions & Solves</strong>, <strong>Final Solves</strong>, <strong>CT Solves</strong>, and <strong>Assignments</strong>.
                </p>
              </div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/30 p-2.5 rounded-xl">
                🔍 Trimester tags (e.g., Trim 231, 241) help you identify the most recent exam solutions at a glance.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800/90 rounded-3xl p-6 shadow-sm hover:border-[#FF6600]/40 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center font-black text-lg">
                  3
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-emerald-500" />
                  <span>Read In-App (No Redirects)</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Click <strong>"Open in Reader"</strong> to view any PDF, document, or image directly inside the browser with full-screen, zoom in/out, and rotation controls.
                </p>
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl">
                🌙 Eye Comfort: Toggle the built-in <strong>Dark Mode</strong> button inside the viewer for comfortable night studying.
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800/90 rounded-3xl p-6 shadow-sm hover:border-[#FF6600]/40 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center font-black text-lg">
                  4
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Download className="w-4 h-4 text-purple-500" />
                  <span>1-Click Fast Download</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Click <strong>Download</strong> to save the file with the contributor attribution watermark. There are zero ads, no pop-ups, and no countdown timers.
                </p>
              </div>
              <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/30 p-2.5 rounded-xl">
                📦 You can also click <strong>"Download Course as ZIP"</strong> to download all notes in a single bundle.
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800/90 rounded-3xl p-6 shadow-sm hover:border-[#FF6600]/40 transition-all flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-2">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center font-black text-lg">
                  5
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <MessageSquarePlus className="w-4 h-4 text-amber-500" />
                  <span>Request Notes if Missing</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Cannot find a specific midterm solve, final answer script, or lecture note? Click the <strong>"Request Note"</strong> button inside the course to notify fellow students and contributors.
                </p>
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl">
                ⚡ Contributors and senior students check note requests frequently to upload solutions.
              </div>
            </div>

          </div>

          <div className="text-center pt-4">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#FF6600] text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95"
            >
              <span>Explore All Courses Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FOR CONTRIBUTORS */}
      {/* ========================================================================= */}
      {activeTab === 'contributor' && (
        <section className="space-y-8 animate-in fade-in duration-300">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              How to Share Your Notes & Get Credited
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Help hundreds of UIU students by sharing your clean lecture notes or past exam solves in 3 easy steps:
            </p>
          </div>

          {/* 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Contrib Step 1 */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-[#FF6600]/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6600] dark:bg-orange-950/60 dark:text-orange-400 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#FF6600]" />
                <span>Scan & Prepare Notes</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Take clear, upright photos of your handwritten notes or exam papers using a phone scanning app (e.g. <strong>Adobe Scan</strong>, <strong>CamScanner</strong>), and save them as a single clean PDF file.
              </p>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800">
                ✨ Keeping pages in proper sequence (Page 1, 2, 3...) makes it much easier for students to study.
              </div>
            </div>

            {/* Contrib Step 2 */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-[#FF6600]/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <UploadCloud className="w-4 h-4 text-amber-500" />
                <span>Submit Form & Drive Link</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Click the <strong>"Submit Notes"</strong> button on the site. Choose your course, trimester code (e.g., 241, 242), and provide your Google Drive link or upload the PDF directly.
              </p>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-200/50 dark:border-amber-900/30">
                ⚠️ Make sure your Google Drive link permission is set to <strong>"Anyone with the link can view"</strong>!
              </div>
            </div>

            {/* Contrib Step 3 */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-[#FF6600]/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verification & Recognition</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                The admin team quickly checks the content. Once approved, your profile and name are published on the <strong>Wall of Contributors</strong> and your contribution count increases.
              </p>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200/50 dark:border-emerald-900/30">
                🏷️ Your name will also be permanently watermarked on every downloaded PDF page as the contributor!
              </div>
            </div>

          </div>

          {/* Special Helper: How to set Google Drive permission */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-zinc-900 dark:to-zinc-850 border border-orange-200/80 dark:border-zinc-700/80 space-y-4">
            <div className="flex items-center space-x-2 text-base font-bold text-gray-900 dark:text-white">
              <AlertCircle className="w-5 h-5 text-[#FF6600]" />
              <span>How to share your Google Drive link correctly:</span>
            </div>
            
            <ol className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>In your Google Drive, right-click on the note's PDF file and select <strong>Share</strong>.</li>
              <li>Under the <strong>General Access</strong> section, change <em>Restricted</em> to <strong>"Anyone with the link"</strong>.</li>
              <li>Keep the role as <strong>Viewer</strong> (to protect your original file from being edited).</li>
              <li>Click <strong>Copy link</strong> and paste it into our note submission form.</li>
            </ol>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsContributeModalOpen(true)}
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-[#FF6600] text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Your Notes Now</span>
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FAQs */}
      {/* ========================================================================= */}
      {activeTab === 'faq' && (
        <section className="space-y-4 max-w-3xl mx-auto animate-in fade-in duration-300">
          <div className="text-center max-w-xl mx-auto pb-4 space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Clear answers to common questions about using and contributing to UIU Note Share:
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#FF6600]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800/80 leading-relaxed bg-orange-50/30 dark:bg-zinc-900/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* Bottom CTA Banner */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#FF6600] to-amber-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span>Join the UIU Student Movement</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            Ready to Help Your Fellow UIUans?
          </h2>

          <p className="text-sm sm:text-base text-orange-100 leading-relaxed">
            A single note shared by you can save a classmate's entire semester. Join the student-led knowledge-sharing movement today.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsContributeModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white text-orange-600 font-bold text-sm shadow-md hover:bg-orange-50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Notes / Direct PDF</span>
            </button>

            <Link
              to="/contributors"
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-black/20 hover:bg-black/30 backdrop-blur-md text-white font-bold text-sm transition-all border border-white/20"
            >
              <Users className="w-4 h-4" />
              <span>View Wall of Contributors</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Contribute Modal */}
      <ContributeModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
      />

    </div>
  );
};
