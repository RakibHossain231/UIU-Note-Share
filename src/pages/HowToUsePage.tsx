import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Eye, 
  Download, 
  Share2, 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  Users, 
  ShieldCheck, 
  MessageSquarePlus, 
  FileCheck,
  AlertCircle,
  Copy,
  ChevronDown
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
      q: 'নোট শেয়ার করতে কি কোনো অ্যাকাউন্ট খুলতে হবে বা ফি লাগবে?',
      a: 'না, কোনো অ্যাকাউন্ট বা রেজিস্ট্রেশনের প্রয়োজন নেই এবং এটি সম্পূর্ণ ফ্রি। যেকোনো শিক্ষার্থী সরাসরি নোট পড়তে এবং শেয়ার করতে পারবেন।'
    },
    {
      q: 'আমার গুগল ড্রাইভ লিংক কি অন্য সাধারণ ইউজাররা পেয়ে যাবে?',
      a: 'না। আপনার ড্রাইভ লিংক সুরক্ষিত থাকবে। শিক্ষার্থীরা আমাদের নিজস্ব ইন-অ্যাপ রিডারে সুরক্ষিতভাবে ফাইল পড়বে এবং স্বয়ংক্রিয় ওয়াটারমার্কসহ ডাউনলোড করতে পারবে।'
    },
    {
      q: 'কোন কোন ডিপার্টমেন্টের নোট শেয়ার করা যাবে?',
      a: 'CSE, Data Science, EEE, BBA এবং Civil সহ UIU-এর যেকোনো ডিপার্টমেন্টের লেকচার হ্যান্ডনোট, মিড/ফাইনাল সলভ এবং সিটি প্রশ্ন শেয়ার করা যাবে।'
    },
    {
      q: 'নোট সাবমিট করার পর কতক্ষণে অ্যাপ্রুভ ও পাবলিশ হয়?',
      a: 'অ্যাডমিন টিম সাধারণত কয়েক ঘণ্টার মধ্যে ফাইলটি যাচাই করে অ্যাপ্রুভ করে। অ্যাপ্রুভ হওয়ামাত্রই তা ওয়েবসাইটে এবং Wall of Contributors-এ লাইভ হয়ে যায়।'
    },
    {
      q: 'নোট ডাউনলোড করলে আমার নাম কি ফাইলে থাকবে?',
      a: 'হ্যাঁ! কেউ আপনার শেয়ার করা নোট ডাউনলোড করলে স্বয়ংক্রিয়ভাবে প্রতিটি পেজের ফুটারে "UIU Note Share • Contributed by [আপনার নাম]" খোদাই হয়ে যাবে।'
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
          UIU Note Share প্ল্যাটফর্মটি কীভাবে সহজে ব্যবহার করবেন এবং কীভাবে আপনার মূল্যবান নোট শেয়ার করে কন্ট্রিবিউটর হবেন — তার পূর্ণাঙ্গ ব্যবহার নির্দেশিকা।
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
            <span className="text-[11px] opacity-80">(নোট পড়ার নিয়ম)</span>
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
            <span className="text-[11px] opacity-80">(নোট শেয়ার করার নিয়ম)</span>
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
            <span className="text-[11px] opacity-80">(সাধারণ জিজ্ঞাসা)</span>
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
              শিক্ষার্থী হিসেবে কীভাবে প্রয়োজনীয় নোট পাবেন?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              পরীক্ষার আগের রাতে কোনো গ্রুপে না খুঁজে ৫টি সহজ ধাপে মুহূর্তের মধ্যে সব নোট পেয়ে যান:
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
                  <span>কোর্স বা সাবজেক্ট খুঁজুন</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  হোমপেজের সার্চবারে কোর্সের কোড (যেমন: <strong>CSE 2118</strong>, <strong>MATH 1101</strong>) লিখুন অথবা ডিপার্টমেন্ট ফিল্টার (CSE, DS, EEE, BBA, Civil) দিয়ে সিলেক্ট করুন।
                </p>
              </div>
              <div className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold bg-orange-50 dark:bg-orange-950/30 p-2.5 rounded-xl">
                💡 টিপস: আপনি কোর্স কার্ডের পিন (📌) আইকনে চাপ দিলে সেটি 'Saved' লিস্টে বুকমার্ক হয়ে থাকবে।
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
                  <span>ক্যাটাগরি বেছে নিন</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  কোর্সে প্রবেশের পর উপরে ক্যাটাগরি ট্যাব রয়েছে: <strong>Handnotes</strong>, <strong>Mid Questions & Solves</strong>, <strong>Final Solves</strong>, <strong>CT Solves</strong> এবং <strong>Assignments</strong>।
                </p>
              </div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/30 p-2.5 rounded-xl">
                🔍 ট্রাইমেস্টার ট্যাগ (যেমন: Trim 231, 241) দেখে সাম্প্রতিক সলভগুলো সহজে চিনে নিন।
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
                  <span>ইন-অ্যাপ রিডারে পড়ুন</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong>"Open in Reader"</strong> বাটনে ক্লিক করলে ব্রাউজারেই কোনো এক্সটার্নাল লিংকে না গিয়ে ফুলস্ক্রিন ও জুম কন্ট্রোলসহ দ্রুত ফাইল পড়া যাবে।
                </p>
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl">
                🌙 রাতে পড়ার জন্য ইন-ভিউয়ার <strong>Dark Mode Invert</strong> বাটন রয়েছে চোখের সুরক্ষায়।
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
                  <span>১-ক্লিকে ডাউনলোড করুন</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong>Download</strong> বাটনে ক্লিক করলেই স্বয়ংক্রিয়ভাবে কন্ট্রিবিউটরের নামসহ আসল ওয়াটারমার্ক ফাইল সেভ হয়ে যাবে। কোনো রিডাইরেকশন বা পপ-আপ অ্যাড নেই।
                </p>
              </div>
              <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/30 p-2.5 rounded-xl">
                📦 এছাড়া <strong>"Download Course as ZIP"</strong> দিয়ে সব ফাইল একসাথেও নামানো যায়।
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
                  <span>নোট না পেলে রিকোয়েস্ট করুন</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  আপনার প্রয়োজনীয় কোর্সের মিড/ফাইনাল সলভ বা হ্যান্ডনোট এখনো আপলোড না হয়ে থাকলে কোর্সের ভেতর <strong>"Request Note"</strong> বাটনে ক্লিক করে নির্দিষ্ট টপিক বা টার্মের রিকোয়েস্ট জানাতে পারেন।
                </p>
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl">
                ⚡ অ্যাডমিন ও অন্যান্য সিনিয়র কন্ট্রিবিউটররা রিকোয়েস্ট দেখে দ্রুত তা আপলোড করার চেষ্টা করেন।
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
              কীভাবে আপনার নোট শেয়ার করবেন ও ক্রেডিট পাবেন?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              আপনার খাতার নোট বা সলভটি অন্য সহপাঠীদের জন্য শেয়ার করতে ৩টি সহজ ধাপ অনুসরণ করুন:
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
                <span>নোট তৈরি ও স্ক্যান করা</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                আপনার খাতার হ্যান্ডনোট, মিড/ফাইনাল পরীক্ষার প্রশ্ন সমাধান বা সিটি সলভ মোবাইল স্ক্যানার অ্যাপ (যেমন <strong>Adobe Scan</strong>, <strong>CamScanner</strong> ইত্যাদি) দিয়ে পরিষ্কারভাবে সোজা করে PDF বানিয়ে নিন।
              </p>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800">
                ✨ পেইজগুলো ক্রমানুসারে (Page 1, 2, 3...) থাকলে শিক্ষার্থীদের পড়তে অনেক সুবিধা হয়।
              </div>
            </div>

            {/* Contrib Step 2 */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-[#FF6600]/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <UploadCloud className="w-4 h-4 text-amber-500" />
                <span>ড্রাইভ লিংক বা ফাইল সাবমিট</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                ওয়েবসাইটের <strong>"Submit Notes"</strong> বাটনে চাপ দিন। আপনার কোর্স, ট্রাইমেস্টার (যেমন 241, 242) সিলেক্ট করুন এবং গুগল ড্রাইভ শেয়ার লিংক দিন (অথবা সরাসরি PDF আপলোড করুন)।
              </p>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-200/50 dark:border-amber-900/30">
                ⚠️ ড্রাইভ লিংকের পারমিশন <strong>"Anyone with the link can view"</strong> করে দিতে ভুলবেন না!
              </div>
            </div>

            {/* Contrib Step 3 */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-[#FF6600]/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>ভেরিফিকেশন ও পাবলিক ক্রেডিট</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                অ্যাডমিন ফাইলটি দ্রুত ভেরিফাই করে অ্যাপ্রুভ করবে। অ্যাপ্রুভ হওয়ামাত্রই <strong>Wall of Contributors</strong>-এ আপনার প্রোফাইল ও নাম যুক্ত হবে এবং মোট কন্ট্রিবিউশন কাউন্ট বাড়বে।
              </p>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200/50 dark:border-emerald-900/30">
                🏷️ ডাউনলোডেড প্রতিটি পিডিএফে আপনার নামের স্থায়ী ওয়াটারমার্ক স্ট্যাম্প থাকবে!
              </div>
            </div>

          </div>

          {/* Special Helper: How to set Google Drive permission */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-zinc-900 dark:to-zinc-850 border border-orange-200/80 dark:border-zinc-700/80 space-y-4">
            <div className="flex items-center space-x-2 text-base font-bold text-gray-900 dark:text-white">
              <AlertCircle className="w-5 h-5 text-[#FF6600]" />
              <span>গুগল ড্রাইভ (Google Drive) লিংক শেয়ার করার সঠিক নিয়ম:</span>
            </div>
            
            <ol className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>আপনার গুগল ড্রাইভে নোটের PDF ফাইলে রাইট ক্লিক করে <strong>Share</strong> চাপুন।</li>
              <li>নিচে <strong>General Access</strong> সেকশনে <em>Restricted</em> থাকলে সেটিতে ক্লিক করে <strong>"Anyone with the link"</strong> নির্বাচন করুন।</li>
              <li>রোল হিসেবে <strong>Viewer</strong> রাখা নিশ্চিত করুন (যাতে কেউ ফাইল এডিট করতে না পারে)।</li>
              <li><strong>Copy link</strong> বাটনে ক্লিক করে আমাদের সাবমিশন ফর্মে পেস্ট করে দিন।</li>
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
              সাধারণ জিজ্ঞাসা ও উত্তর (FAQs)
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              প্ল্যাটফর্ম সম্পর্কে শিক্ষার্থীদের সচরাচর জানতে চাওয়া প্রশ্নের উত্তর:
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
            একজনের শেয়ার করা একটি ছোট নোট বাঁচিয়ে দিতে পারে শত সহপাঠীর একটি সম্পূর্ণ কোর্স। আপনিও আপনার হাতের নোট বা প্রশ্ন শেয়ার করে আজই অবদান রাখুন।
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
