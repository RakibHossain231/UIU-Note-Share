import React from "react";
import {
  BookOpen,
  Heart,
  Sparkles,
  Mail,
  Cloud,
  HardDrive,
  ShieldCheck,
  GraduationCap,
  Coffee,
  CheckCircle2,
  Share2,
} from "lucide-react";
import {
  FacebookIcon,
  LinkedinIcon,
  GithubIcon,
} from "../components/SocialIcons";
import { useData } from "../context/DataContext";
import { CO_CREATORS } from "../data/coCreators";

interface CreatorCardProps {
  role: string;
  name: string;
  department: string;
  batch: string;
  avatarUrl: string;
  fallbackAvatar?: string;
  bio: string;
  githubUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  email: string;
  mailLabel: string;
  primary?: boolean;
}

const CreatorCard: React.FC<CreatorCardProps> = ({
  role,
  name,
  department,
  batch,
  avatarUrl,
  fallbackAvatar,
  bio,
  githubUrl,
  facebookUrl,
  linkedinUrl,
  email,
  mailLabel,
  primary = false,
}) => {
  const Heading = primary ? "h1" : "h2";

  return (
    <section className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative z-10">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden ring-4 ring-[#FF6600]/30 shadow-xl bg-gradient-to-tr from-[#FF6600] to-amber-500 flex items-center justify-center text-white text-3xl font-extrabold">
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (fallbackAvatar && img.src !== fallbackAvatar) {
                  img.src = fallbackAvatar;
                } else {
                  img.style.visibility = "hidden";
                }
              }}
            />
          </div>
          <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#FF6600] text-white text-[11px] font-bold shadow">
            {role}
          </div>
        </div>

        {/* Bio & Details */}
        <div className="space-y-3 text-center sm:text-left flex-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF6600] text-xs font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>
              {department}, UIU ({batch})
            </span>
          </div>

          <Heading className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {name}
          </Heading>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {bio}
          </p>

          {primary && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <strong>UIU Note Share</strong> is an open-access,
              community-supported initiative designed to preserve academic
              notes, CT questions, and verified exam solves for future
              generations of UIU students.
            </p>
          )}

          {/* Social Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-black hover:text-white dark:hover:bg-zinc-700 text-xs font-semibold transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-colors"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-600 hover:text-white text-xs font-semibold transition-colors"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF6600] hover:bg-[#FF6600] hover:text-white text-xs font-semibold transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{mailLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutPage: React.FC = () => {
  const { creatorProfile, isAdmin } = useData();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16 pt-4">
      {/* Creator and Co-Creators share one card so they always look and read the same */}
      <CreatorCard
        primary
        role="Creator"
        name={creatorProfile.name}
        department={creatorProfile.department}
        batch={creatorProfile.batch}
        avatarUrl={
          creatorProfile.avatarUrl || "https://github.com/RakibHossain231.png"
        }
        fallbackAvatar="https://github.com/RakibHossain231.png"
        bio={
          creatorProfile.bio ||
          "Hello fellow UIUans! I am an undergraduate student from the Department of CSE at United International University (UIU), Batch 231. I built UIU Note Share to ensure no student ever has to struggle or beg in Messenger groups the night before an exam for class notes or question solutions."
        }
        githubUrl={
          creatorProfile.githubUrl || "https://github.com/RakibHossain231"
        }
        facebookUrl={
          creatorProfile.facebookUrl ||
          "https://www.facebook.com/RakibHossain231"
        }
        linkedinUrl={
          creatorProfile.linkedinUrl ||
          "https://www.linkedin.com/in/rakibhossain231"
        }
        email={creatorProfile.email || "rakibhossain0308@yahoo.com"}
        mailLabel="Yahoo Mail"
      />

      {CO_CREATORS.map((co) => (
        <CreatorCard
          key={co.email}
          {...co}
          department={creatorProfile.department}
          batch={creatorProfile.batch}
          bio="Hello fellow UIUans! I'm a co-creator of UIU Note Share, and I work on bringing new features to the platform. I try to make it as easy to use as possible for every student. I also work on the UI, so that finding and reading notes feels simple and smooth."
        />
      ))}

      {/* Architectural Vision */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Why & How UIU Note Share Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#FF6600] flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Effortless Google Drive Storage
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Upload notes directly to your personal Google Drive and share the
              link. Zero complicated bucket setups, 100% free forever.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Instant In-App PDF Reader
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Study notes, question papers, and solutions directly inside the
              browser with zero unwanted automatic downloads or clutter.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Community Contributor Attribution
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Every peer who donates their handwritten notes or verified
              question solve receives honorable recognition on our Wall of
              Contributors.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
