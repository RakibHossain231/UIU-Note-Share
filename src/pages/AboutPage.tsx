import React from 'react';
import { 
  BookOpen, 
  Heart, 
  Sparkles, 
  Mail, 
  Cloud, 
  HardDrive, 
  ShieldCheck, 
  GraduationCap,
  Code,
  Coffee
} from 'lucide-react';
import { FacebookIcon, LinkedinIcon, GithubIcon } from '../components/SocialIcons';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16 pt-4">
      
      {/* Creator Profile Section */}
      <section className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative z-10">
          
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden ring-4 ring-[#FF6600]/30 shadow-xl bg-gradient-to-tr from-[#FF6600] to-amber-500 flex items-center justify-center text-white text-3xl font-extrabold">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt="Creator Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#FF6600] text-white text-[11px] font-bold shadow">
              Creator
            </div>
          </div>

          {/* Bio & Details */}
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF6600] text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Dept. of Computer Science & Engineering, UIU</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              UIU Note Share Creator
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Hello fellow UIUans! I am an undergraduate student from the Department of CSE at United International University (UIU). Throughout my academic journey, I realized that finding authentic, organized lecture handnotes, midterm & final exam solves, and class test questions before exams is one of the most frustrating hurdles for students.
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              I built <strong>UIU Note Share</strong> as an open, accessible, and community-driven initiative so that no junior or peer ever has to beg around Messenger groups the night before an exam for lecture slides or past question papers.
            </p>

            {/* Social Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-black hover:text-white dark:hover:bg-zinc-700 text-xs font-semibold transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-colors"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-600 hover:text-white text-xs font-semibold transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:creator@uiunoteshare.com"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF6600] hover:bg-[#FF6600] hover:text-white text-xs font-semibold transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* Architectural Vision */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Why & How UIU Note Share Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Cloudflare R2 Direct Streaming
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              We leverage Cloudflare R2's global edge network for our primary PDF notes. With 0$ egress fees and sub-second load times, students experience lightning-fast in-browser reading without server crashes or slow buffering.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Google Drive Scalability (10GB+ Free)
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              To support multiple departments (CSE, Data Science, EEE, BBA, Civil) with tens of gigabytes of materials without paid hosting, we integrated seamless Google Drive storage with custom direct viewer fallbacks.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Verified & Credited Solves
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Every single student contribution is tagged with their verified name, department, batch, and social links. We believe students who take the time to write clean notes deserve genuine appreciation from the university community.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Modern Full-Stack Stack
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Built with React, TypeScript, Tailwind CSS, JSZip bulk packaging, and Supabase / LocalStorage synchronization. Blazing fast client-side navigation with zero page reloads.
            </p>
          </div>

        </div>
      </section>

      {/* Support / Feedback */}
      <section className="p-8 rounded-3xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 text-center space-y-4">
        <div className="w-12 h-12 bg-white dark:bg-zinc-800 text-[#FF6600] rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <Coffee className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Support the Platform & Share Feedback
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
          This platform is maintained independently in my spare time between trimesters. If you find this archive helpful for your exam preparation, a quick word of encouragement or sharing your notes means the world!
        </p>

        <div className="pt-2">
          <a
            href="mailto:contact@uiunoteshare.com"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#FF6600] text-white font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
          >
            <Mail className="w-4 h-4" />
            <span>Send Feedback / Contact Creator</span>
          </a>
        </div>
      </section>

    </div>
  );
};
