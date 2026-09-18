import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  BookOpen, 
  FileText, 
  Users, 
  HardDrive, 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  Inbox, 
  LogOut, 
  Sparkles, 
  Search, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Shield, 
  Clock, 
  ArrowLeft, 
  Mail, 
  Key, 
  ShieldAlert,
  Camera,
  Copy,
  RefreshCw,
  UserCheck,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Activity,
  Flame,
  ArrowUpRight,
  Download,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Course, ResourceItem, Contributor, ResourceType, PendingContribution } from '../types';
import { CloudflareR2Service } from '../services/cloudflareR2Service';
import { CreatorProfileData } from '../services/storageService';

export const COURSE_PRESET_COLORS = [
  { label: 'UIU Orange', value: '#FF6600' },
  { label: 'Royal Blue', value: '#3B82F6' },
  { label: 'Emerald Green', value: '#10B981' },
  { label: 'Purple', value: '#8B5CF6' },
  { label: 'Rose Pink', value: '#EC4899' },
  { label: 'Amber Gold', value: '#F59E0B' },
  { label: 'Cyan', value: '#06B6D4' },
  { label: 'Indigo', value: '#6366F1' },
  { label: 'Teal', value: '#14B8A6' },
  { label: 'Ruby Red', value: '#EF4444' }
];

type AdminTab = 'courses' | 'resources' | 'contributors' | 'contributions' | 'requests' | 'analytics' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdmin, 
    adminEmail, 
    loginAdmin, 
    loginStep1, 
    loginStep2, 
    updateAdminSecurity, 
    getLockStatus, 
    logoutAdmin, 
    courses, 
    addCourse, 
    updateCourse, 
    deleteCourse, 
    resources, 
    addResource, 
    updateResource,
    deleteResource, 
    contributors, 
    addContributor, 
    updateContributor,
    deleteContributor,
    creatorProfile,
    updateCreatorProfile,
    isCloudConnected,
    supabaseStatus,
    syncWithCloud,
    departments, 
    noteRequests,
    visitorCount,
    courseViews,
    refreshAnalytics,
    pendingContributions,
    approveContribution,
    rejectContribution,
    deleteStorageFile
  } = useData();

  // Pending contribution approval modal state
  const [approvingItem, setApprovingItem] = useState<PendingContribution | null>(null);
  const [approvalTitle, setApprovalTitle] = useState('');
  const [approvalCourseId, setApprovalCourseId] = useState('');
  const [approvalResourceType, setApprovalResourceType] = useState<ResourceType>('handnote');
  const [approvalTrimester, setApprovalTrimester] = useState('Fall 2024');
  const [approvalTerm, setApprovalTerm] = useState('Mid');
  const [approvalFileUrl, setApprovalFileUrl] = useState('');
  const [approvalContribName, setApprovalContribName] = useState('');
  const [approvalDept, setApprovalDept] = useState('CSE');
  const [approvalBatch, setApprovalBatch] = useState('');
  const [approvalProfileUrl, setApprovalProfileUrl] = useState('');
  const [approvalSocialType, setApprovalSocialType] = useState<'facebook' | 'linkedin' | 'github' | 'email'>('facebook');
  const [isApproving, setIsApproving] = useState(false);
  const [isDeletingStorageId, setIsDeletingStorageId] = useState<string | null>(null);

  // 2-Step Login form state
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [emailInput, setEmailInput] = useState<string>('rakibhossain0308@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState<{ type: 'error' | 'success' | 'warning'; msg: string } | null>(null);
  const [lockSeconds, setLockSeconds] = useState<number>(0);

  // Security Credentials management state in Settings tab
  const [editAdminEmail, setEditAdminEmail] = useState<string>(adminEmail);
  const [editCurrentPass, setEditCurrentPass] = useState('');
  const [editNewPass, setEditNewPass] = useState('');
  const [editConfirmPass, setEditConfirmPass] = useState('');
  const [editNewPin, setEditNewPin] = useState('');
  const [securityStatus, setSecurityStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Creator Profile management state in Settings tab
  const [editCreator, setEditCreator] = useState<CreatorProfileData>(creatorProfile);
  const [creatorSaveStatus, setCreatorSaveStatus] = useState<string | null>(null);
  const creatorFileRef = useRef<HTMLInputElement | null>(null);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<AdminTab>('courses');

  // Traffic & Course Analytics state
  const [isRefreshingAnalytics, setIsRefreshingAnalytics] = useState(false);
  const [analyticsSearch, setAnalyticsSearch] = useState('');

  const analyticsData = useMemo(() => {
    const viewsMap = courseViews || {};
    const courseList = courses.map(course => {
      const views = viewsMap[course.id] || 0;
      return {
        ...course,
        views
      };
    });

    // Sort descending by views, then alphabetically by code
    courseList.sort((a, b) => b.views - a.views || a.code.localeCompare(b.code));

    const totalCourseAccesses = Object.values(viewsMap).reduce((sum, v) => sum + (v || 0), 0);
    const maxViews = courseList[0]?.views || 0;

    // Department breakdown
    const deptViews: Record<string, { count: number; accesses: number }> = {};
    courses.forEach(c => {
      const dept = c.department || 'Other';
      const views = viewsMap[c.id] || 0;
      if (!deptViews[dept]) {
        deptViews[dept] = { count: 0, accesses: 0 };
      }
      deptViews[dept].count += 1;
      deptViews[dept].accesses += views;
    });

    const sortedDepts = Object.entries(deptViews)
      .map(([dept, data]) => ({
        dept,
        count: data.count,
        accesses: data.accesses,
        percentage: totalCourseAccesses > 0 ? Math.round((data.accesses / totalCourseAccesses) * 100) : 0
      }))
      .sort((a, b) => b.accesses - a.accesses);

    const topCourse = courseList.find(c => c.views > 0) || null;
    const topDept = sortedDepts.find(d => d.accesses > 0)?.dept || sortedDepts[0]?.dept || 'CSE';

    return {
      coursesWithViews: courseList,
      totalCourseAccesses,
      maxViews: Math.max(maxViews, 1),
      deptBreakdown: sortedDepts,
      topCourse,
      topDept
    };
  }, [courses, courseViews]);

  // Course modal state
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    code: '',
    title: '',
    abbr: '',
    department: 'CSE',
    trimester: 1,
    color: '#FF6600',
    description: '',
    credit: 3
  });

  // Edit Course state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Edit Resource state
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);

  // Resource modal state
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [newResource, setNewResource] = useState<{
    courseId: string;
    type: ResourceType;
    title: string;
    description: string;
    trimesterCode: string;
    term: string;
    ctNumber: number;
    assignmentNumber: number;
    hasSolution: boolean;
    storageType: 'r2' | 'drive' | 'direct_url';
    fileUrl: string;
    fileSize: string;
    contributorId: string;
    newContribName: string;
    newContribDept: string;
    newContribBatch: string;
    newContribSocial: string;
    newContribPlatform: 'facebook' | 'linkedin' | 'github' | 'email';
  }>({
    courseId: courses[0]?.id || '',
    type: 'handnote',
    title: '',
    description: '',
    trimesterCode: '',
    term: '',
    ctNumber: 1,
    assignmentNumber: 1,
    hasSolution: false,
    storageType: 'drive',
    fileUrl: '',
    fileSize: '',
    contributorId: contributors[0]?.id || '',
    newContribName: '',
    newContribDept: 'CSE',
    newContribBatch: 'Batch 231',
    newContribSocial: '',
    newContribPlatform: 'facebook'
  });

  // Contributor modal state (Add)
  const [contribModalOpen, setContribModalOpen] = useState(false);
  const [newContrib, setNewContrib] = useState({
    name: '',
    department: 'CSE',
    batch: 'Batch 231',
    avatarUrl: '',
    socialUrl: '',
    socialType: 'facebook' as const
  });
  const contribFileRef = useRef<HTMLInputElement | null>(null);

  // Contributor modal state (Edit)
  const [editingContrib, setEditingContrib] = useState<Contributor | null>(null);
  const editContribFileRef = useRef<HTMLInputElement | null>(null);

  // Settings state
  const [r2PublicDomain, setR2PublicDomain] = useState(
    CloudflareR2Service.getConfig()?.publicDomain || ''
  );
  const [r2BucketName, setR2BucketName] = useState(
    CloudflareR2Service.getConfig()?.bucketName || ''
  );
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Search in tables
  const [adminSearch, setAdminSearch] = useState('');

  // Sync creator state when context updates
  useEffect(() => {
    setEditCreator(creatorProfile);
  }, [creatorProfile]);

  useEffect(() => {
    setEditAdminEmail(adminEmail);
  }, [adminEmail]);

  // Check brute-force lock status on mount
  useEffect(() => {
    const lock = getLockStatus();
    if (lock.locked) {
      setLockSeconds(lock.remainingSeconds);
    }
  }, [getLockStatus]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockSeconds]);

  // Handle Step 1 Login (Email + Password)
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFeedback(null);
    const res = loginStep1(emailInput, passwordInput);
    if (res.isLocked) {
      setLockSeconds(res.remainingSeconds || 900);
      setLoginFeedback({
        type: 'error',
        msg: res.message || 'Account is locked for 15 minutes due to too many failed attempts.'
      });
      return;
    }
    if (!res.success) {
      setLoginFeedback({
        type: 'error',
        msg: res.message || 'Invalid administrator email or password.'
      });
      return;
    }
    setLoginStep(2);
    setPinInput('');
  };

  // Handle Step 2 Login (6-Digit Security PIN)
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFeedback(null);
    const res = loginStep2(pinInput);
    if (!res.success) {
      setLoginFeedback({
        type: 'error',
        msg: res.message || 'Incorrect security PIN. Please try again.'
      });
      return;
    }
    setLoginStep(1);
    setPasswordInput('');
    setPinInput('');
  };

  // Handle Update Security Settings
  const handleUpdateSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityStatus(null);
    if (editNewPass && editNewPass !== editConfirmPass) {
      setSecurityStatus({ type: 'error', msg: 'New password and confirmation do not match.' });
      return;
    }
    const res = updateAdminSecurity(editAdminEmail, editCurrentPass, editNewPass, editNewPin);
    if (res.success) {
      setSecurityStatus({ type: 'success', msg: res.message });
      setEditCurrentPass('');
      setEditNewPass('');
      setEditConfirmPass('');
      setEditNewPin('');
    } else {
      setSecurityStatus({ type: 'error', msg: res.message });
    }
  };

  // Handle Creator Profile Save
  const handleSaveCreatorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatorSaveStatus('Saving profile...');
    const ok = await updateCreatorProfile(editCreator);
    if (ok) {
      setCreatorSaveStatus('Profile saved and synced with cloud!');
    } else {
      setCreatorSaveStatus('Saved locally (cloud offline).');
    }
    setTimeout(() => setCreatorSaveStatus(null), 3000);
  };

  // Handle File to Base64 image upload
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (dataUrl: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be under 2MB for optimal performance.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        callback(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Create course handler
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.title) return;
    const id = newCourse.code.toLowerCase().replace(/\s+/g, '-');
    addCourse({
      id,
      code: newCourse.code.trim().toUpperCase(),
      title: newCourse.title.trim(),
      abbr: newCourse.abbr?.trim() || undefined,
      department: newCourse.department || 'CSE',
      trimester: Number(newCourse.trimester) || 1,
      color: newCourse.color || '#FF6600',
      description: newCourse.description?.trim() || undefined,
      credit: Number(newCourse.credit) || 3
    });
    setCourseModalOpen(false);
    setNewCourse({
      code: '',
      title: '',
      abbr: '',
      department: 'CSE',
      trimester: 1,
      color: '#FF6600',
      description: '',
      credit: 3
    });
  };

  // Update course handler
  const handleUpdateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    updateCourse(editingCourse);
    setEditingCourse(null);
  };

  // Create resource handler
  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title || !newResource.fileUrl) return;

    let targetContributor: Contributor | undefined;

    if (newResource.newContribName.trim()) {
      targetContributor = {
        id: 'contrib-' + Date.now(),
        name: newResource.newContribName.trim(),
        department: newResource.newContribDept,
        batch: newResource.newContribBatch,
        socialUrl: newResource.newContribSocial,
        socialType: newResource.newContribPlatform,
        contributionsCount: 1
      };
      addContributor(targetContributor);
    } else {
      targetContributor = contributors.find(c => c.id === newResource.contributorId) || contributors[0];
    }

    const targetCourseId = newResource.courseId || courses[0]?.id;
    if (!targetCourseId) {
      alert('Please create at least one course first before adding resources!');
      return;
    }

    const course = courses.find(c => c.id === targetCourseId);

    const isCt = newResource.type === 'ct' || newResource.type === 'ct_question' || newResource.type === 'ct_solve';
    const isAssign = newResource.type === 'assignment' || newResource.type === 'assignment_question' || newResource.type === 'assignment_solve';

    const item: ResourceItem = {
      id: 'res-' + Date.now(),
      courseId: targetCourseId,
      department: course?.department || 'CSE',
      type: newResource.type,
      title: newResource.title.trim(),
      description: newResource.description.trim() || undefined,
      trimesterCode: newResource.trimesterCode.trim() || undefined,
      term: newResource.type.includes('mid') ? 'mid' : (newResource.type.includes('final') ? 'final' : undefined),
      ctNumber: isCt ? newResource.ctNumber : undefined,
      assignmentNumber: isAssign ? newResource.assignmentNumber : undefined,
      storageType: newResource.storageType,
      fileUrl: newResource.fileUrl.trim(),
      hasSolution: newResource.type.includes('solve') || Boolean(newResource.hasSolution),
      fileSize: newResource.fileSize.trim() || undefined,
      uploadDate: new Date().toISOString().split('T')[0],
      contributor: targetContributor
    };

    addResource(item);
    setResourceModalOpen(false);
    setNewResource({
      courseId: courses[0]?.id || '',
      type: 'handnote',
      title: '',
      description: '',
      trimesterCode: '',
      term: '',
      ctNumber: 1,
      assignmentNumber: 1,
      hasSolution: false,
      storageType: 'drive',
      fileUrl: '',
      fileSize: '',
      contributorId: contributors[0]?.id || '',
      newContribName: '',
      newContribDept: 'CSE',
      newContribBatch: 'Batch 231',
      newContribSocial: '',
      newContribPlatform: 'facebook'
    });
  };

  // Contribution approval and rejection handlers
  const openApprovalModal = (item: PendingContribution) => {
    setApprovingItem(item);
    let matchedCourseId = item.courseId;
    if (!matchedCourseId) {
      const found = courses.find(c => c.code.toLowerCase() === item.courseCode.toLowerCase());
      matchedCourseId = found?.id || courses[0]?.id || '';
    }
    setApprovalCourseId(matchedCourseId);

    const typeLabel = item.resourceType === 'question_mid' ? 'Midterm Solve'
      : item.resourceType === 'question_final' ? 'Final Solve'
      : item.resourceType === 'ct' ? 'CT Solve'
      : item.resourceType === 'assignment' ? 'Assignment Solve'
      : 'Lecture Handnote';

    setApprovalTitle(`${item.courseCode} ${typeLabel} - ${item.term || ''} ${item.trimesterCode || ''}`.trim());
    setApprovalResourceType(item.resourceType);
    setApprovalTrimester(item.trimesterCode || 'Fall 2024');
    setApprovalTerm(item.term || 'Mid');
    setApprovalFileUrl(item.fileUrl);
    setApprovalContribName(item.contributorName);
    setApprovalDept(item.department || 'CSE');
    setApprovalBatch(item.batch || 'UIUian');
    setApprovalProfileUrl(item.profileUrl || '');
    setApprovalSocialType(item.socialType || 'facebook');
  };

  const handleConfirmApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingItem) return;

    if (!approvalTitle.trim() || !approvalFileUrl.trim()) {
      alert('Please provide resource title and file/drive URL.');
      return;
    }

    setIsApproving(true);
    try {
      const success = await approveContribution(approvingItem.id, {
        finalFileUrl: approvalFileUrl.trim(),
        title: approvalTitle.trim(),
        contributorName: approvalContribName.trim(),
        department: approvalDept,
        batch: approvalBatch.trim() || undefined,
        profileUrl: approvalProfileUrl.trim() || undefined,
        socialType: approvalSocialType,
        courseId: approvalCourseId,
        resourceType: approvalResourceType,
        trimesterCode: approvalTrimester.trim() || undefined,
        term: approvalTerm.trim() || undefined,
      });

      if (success) {
        setApprovingItem(null);
      } else {
        alert('Could not approve contribution. Please check your connection.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error approving contribution.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectClick = async (item: PendingContribution) => {
    const ok = window.confirm(`Are you sure you want to reject this contribution from "${item.contributorName}"? If there is an uploaded file on Supabase, it will also be permanently deleted to save cloud storage.`);
    if (!ok) return;

    await rejectContribution(item.id);
  };

  const handleManualDeleteStorageFile = async (item: PendingContribution) => {
    if (!item.storagePath) return;
    const ok = window.confirm(`Are you sure you want to delete this file (${item.fileName || 'uploaded file'}) from Supabase cloud storage right now? Make sure you have downloaded it to your PC first.`);
    if (!ok) return;

    setIsDeletingStorageId(item.id);
    try {
      const success = await deleteStorageFile(item.storagePath);
      if (success) {
        alert('File successfully deleted from Supabase cloud storage! Your storage quota has been freed.');
      } else {
        alert('Could not delete file from storage or already removed.');
      }
    } finally {
      setIsDeletingStorageId(null);
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    CloudflareR2Service.saveConfig({
      accountId: '',
      accessKeyId: '',
      secretAccessKey: '',
      bucketName: r2BucketName,
      publicDomain: r2PublicDomain
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleCopySqlScript = () => {
    const sql = `-- Run this in Supabase Dashboard -> SQL Editor
create table if not exists public.courses (
  id text primary key,
  code text not null,
  title text not null,
  abbr text,
  department text not null,
  trimester integer not null,
  color text default '#FF6600',
  description text,
  credit numeric default 3,
  created_at timestamp with time zone default now()
);

create table if not exists public.contributors (
  id text primary key,
  name text not null,
  department text not null,
  batch text,
  avatar_url text,
  social_url text,
  social_type text default 'facebook',
  contributions_count integer default 0,
  created_at timestamp with time zone default now()
);

create table if not exists public.resources (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  department text not null,
  type text not null,
  title text not null,
  description text,
  trimester_code text,
  term text,
  ct_number integer,
  assignment_number integer,
  storage_type text not null default 'drive',
  file_url text not null,
  has_solution boolean default false,
  solution_url text,
  file_size text,
  upload_date text,
  contributor_id text references public.contributors(id) on delete set null,
  created_at timestamp with time zone default now()
);

create table if not exists public.note_requests (
  id text primary key,
  course_code text not null,
  course_title text not null,
  resource_type text not null,
  requested_by text not null,
  contact_info text,
  notes text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

create table if not exists public.creator_profile (
  id text primary key default 'creator',
  name text not null default 'Rakib Hossain',
  department text not null default 'CSE',
  batch text default 'Batch 231',
  avatar_url text default 'https://github.com/RakibHossain231.png',
  bio text,
  github_url text default 'https://github.com/RakibHossain231',
  linkedin_url text default 'https://www.linkedin.com/in/rakibhossain231',
  facebook_url text default 'https://www.facebook.com/RakibHossain231',
  email text default 'rakibhossain0308@yahoo.com',
  updated_at timestamp with time zone default now()
);

insert into public.creator_profile (id, name, department, batch, avatar_url, github_url, linkedin_url, facebook_url, email)
values ('creator', 'Rakib Hossain', 'CSE', 'Batch 231', 'https://github.com/RakibHossain231.png', 'https://github.com/RakibHossain231', 'https://www.linkedin.com/in/rakibhossain231', 'https://www.facebook.com/RakibHossain231', 'rakibhossain0308@yahoo.com')
on conflict (id) do nothing;

alter table public.courses enable row level security;
alter table public.contributors enable row level security;
alter table public.resources enable row level security;
alter table public.note_requests enable row level security;
alter table public.creator_profile enable row level security;

create policy "Enable all for courses" on public.courses for all using (true) with check (true);
create policy "Enable all for contributors" on public.contributors for all using (true) with check (true);
create policy "Enable all for resources" on public.resources for all using (true) with check (true);
create policy "Enable all for note_requests" on public.note_requests for all using (true) with check (true);
create policy "Enable all for creator_profile" on public.creator_profile for all using (true) with check (true);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // ------------------------------------------------------------------
  // RENDER: NOT LOGGED IN (2-STEP AUTHENTICATION)
  // ------------------------------------------------------------------
  if (!isAdmin) {
    if (loginStep === 1) {
      return (
        <div className="min-h-[75vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF6600] dark:bg-orange-950/60 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Shield className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 dark:bg-orange-950/50 text-[#FF6600] uppercase tracking-wider mb-2">
                Step 1 of 2 • Identity Verification
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Admin Control Center
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter your registered administrator email and master password to proceed.
              </p>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Admin Registered Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="rakibhossain0308@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/90 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Master Password *
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/90 border border-gray-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginFeedback && (
                <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                  loginFeedback.type === 'error'
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {loginFeedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <span>{loginFeedback.msg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-md shadow-orange-500/25 flex items-center justify-center space-x-2"
              >
                <span>Continue to 2FA Verification</span>
                <span>→</span>
              </button>
            </form>

            <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 text-center">
              {/* <span className="text-[11px] text-gray-400">
                Default: <code className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-orange-500">rakibhossain0308@gmail.com</code> • <code className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-orange-500">564566</code>
              </span> */}
            </div>
          </div>
        </div>
      );
    }

    // Case 2: Step 2 of 2 (6-Digit Security PIN / 2FA)
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 uppercase tracking-wider mb-2">
              Step 2 of 2 • 2FA Verification
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Two-Factor Authentication
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter your registered 6-digit Security PIN to verify identity for <strong className="text-gray-800 dark:text-gray-200">{emailInput}</strong>.
            </p>
          </div>

          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 text-center">
                6-Digit Security PIN *
              </label>
              <input
                type="password"
                maxLength={6}
                autoFocus
                required
                placeholder="• • • • • •"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.6em] font-mono text-2xl py-3 rounded-xl bg-gray-50 dark:bg-zinc-800/90 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {loginFeedback && (
              <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                loginFeedback.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
              }`}>
                {loginFeedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{loginFeedback.msg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginStep(1);
                setLoginFeedback(null);
              }}
              className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Step 1 (Change Email/Password)</span>
            </button>
          </form>

          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 text-center">
            <span className="text-[11px] text-gray-400">
              Default 2FA PIN: <code className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-emerald-500">564566</code>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER: ADMIN DASHBOARD (LOGGED IN)
  // ------------------------------------------------------------------
  return (
    <div className="space-y-8 pb-20">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Admin Control Center
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                2FA Verified
              </span>
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-zinc-700">
                {adminEmail}
              </span>
              {isCloudConnected ? (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                  <span>Supabase Cloud Connected</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Offline / Local Cache</span>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Creator: {creatorProfile.name} • Dept of {creatorProfile.department} ({creatorProfile.batch})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCourseModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FF6600] text-white hover:bg-orange-600 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Course</span>
          </button>

          <button
            onClick={() => setResourceModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-800 hover:bg-black transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Note / Solve</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-rose-500 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-4">
          <span className="text-xs text-gray-500 font-medium">Total Courses</span>
          <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">{courses.length}</div>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-4">
          <span className="text-xs text-gray-500 font-medium">Total Notes & Solves</span>
          <div className="text-2xl font-black text-[#FF6600] mt-1">{resources.length}</div>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-4">
          <span className="text-xs text-gray-500 font-medium">Pending Notes</span>
          <div className={`text-2xl font-black mt-1 ${pendingContributions.length > 0 ? 'text-rose-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
            {pendingContributions.length}
          </div>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-4">
          <span className="text-xs text-gray-500 font-medium">Total Visitors</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">{visitorCount.toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-4">
          <span className="text-xs text-gray-500 font-medium">Contributors</span>
          <div className="text-2xl font-black text-blue-500 mt-1">{contributors.length}</div>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-4">
          <span className="text-xs text-gray-500 font-medium">Student Requests</span>
          <div className="text-2xl font-black text-purple-500 mt-1">{noteRequests.length}</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="border-b border-gray-200 dark:border-zinc-800 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'courses', label: 'Course Directory', icon: BookOpen, count: courses.length },
          { key: 'resources', label: 'Notes & Exam Solves', icon: FileText, count: resources.length },
          { key: 'contributions', label: 'Student Submissions', icon: Sparkles, count: pendingContributions.length },
          { key: 'contributors', label: 'Contributors', icon: Users, count: contributors.length },
          { key: 'requests', label: 'Student Requests', icon: Inbox, count: noteRequests.length },
          { key: 'analytics', label: 'Traffic & Course Analytics', icon: BarChart3 },
          { key: 'settings', label: 'Settings & Cloud Database', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as AdminTab)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'border-[#FF6600] text-[#FF6600]'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  tab.key === 'contributions' && pendingContributions.length > 0
                    ? 'bg-rose-500 text-white animate-pulse'
                    : isActive 
                      ? 'bg-orange-100 dark:bg-orange-950/60 text-[#FF6600]' 
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COURSES MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Filter courses..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={() => setCourseModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FF6600] text-white hover:bg-orange-600"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-zinc-800/80 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-zinc-700">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Course Title</th>
                    <th className="px-4 py-3">Dept</th>
                    <th className="px-4 py-3">Trimester</th>
                    <th className="px-4 py-3">Notes</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-800 dark:text-gray-200">
                  {courses
                    .filter(c => c.code.toLowerCase().includes(adminSearch.toLowerCase()) || c.title.toLowerCase().includes(adminSearch.toLowerCase()))
                    .map((course) => {
                      const notesCount = resources.filter(r => r.courseId === course.id).length;
                      return (
                        <tr key={course.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50">
                          <td className="px-4 py-3 font-bold flex items-center">
                            <span 
                              className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0" 
                              style={{ backgroundColor: course.color || '#FF6600' }} 
                            />
                            <span style={{ color: course.color || '#FF6600' }}>
                              {course.code}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium">{course.title}</td>
                          <td className="px-4 py-3">{course.department}</td>
                          <td className="px-4 py-3">Trimester {course.trimester}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                              {notesCount} notes
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => setEditingCourse(course)}
                              className="text-gray-400 hover:text-blue-500 transition-colors"
                              title="Edit Course Name / Code"
                            >
                              <Edit3 className="w-4 h-4 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${course.code} - ${course.title}?`)) {
                                  deleteCourse(course.id);
                                }
                              }}
                              className="text-gray-400 hover:text-rose-500 transition-colors"
                              title="Delete Course"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESOURCES / NOTES */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{resources.length} active notes & solves</span>
            <button
              onClick={() => setResourceModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FF6600] text-white hover:bg-orange-600"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Note</span>
            </button>
          </div>

          {resources.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2">
              <FileText className="w-10 h-10 text-gray-300 dark:text-zinc-700 mx-auto" />
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">No Notes Uploaded Yet</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                All mock dummy notes have been cleaned out. Click "Add Note" to add your first real lecture note or exam solve using Google Drive!
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-zinc-800/80 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-zinc-700">
                    <tr>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Storage</th>
                      <th className="px-4 py-3">Contributor</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-800 dark:text-gray-200">
                    {resources.map((item) => {
                      const course = courses.find(c => c.id === item.courseId);
                      return (
                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50">
                          <td className="px-4 py-3 font-semibold capitalize text-orange-600">
                            {item.type.replace('_', ' ')}
                          </td>
                          <td className="px-4 py-3 font-medium max-w-xs truncate">{item.title}</td>
                          <td className="px-4 py-3 font-bold">{course?.code || item.courseId}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.storageType === 'drive'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300'
                            }`}>
                              {item.storageType.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{item.contributor?.name || 'Anonymous'}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => setEditingResource(item)}
                              className="text-gray-400 hover:text-blue-500 transition-colors"
                              title="Edit Note / Resource"
                            >
                              <Edit3 className="w-4 h-4 inline" />
                            </button>
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-400 hover:text-black dark:hover:text-white"
                              title="Open Link"
                            >
                              <ExternalLink className="w-4 h-4 inline" />
                            </a>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${item.title}?`)) {
                                  deleteResource(item.id);
                                }
                              }}
                              className="text-gray-400 hover:text-rose-500"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONTRIBUTORS */}
      {activeTab === 'contributors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Wall of Contributors Management
              </h3>
              <p className="text-xs text-gray-500">
                Add, edit, or delete contributors and click to set their profile pictures.
              </p>
            </div>
            <button
              onClick={() => setContribModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FF6600] text-white hover:bg-orange-600 shadow"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Contributor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contributors.map((c) => (
              <div 
                key={c.id} 
                className="p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 flex items-center justify-between gap-3 shadow-sm hover:border-orange-500/40 transition-all"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#FF6600] to-amber-500 flex items-center justify-center text-white font-extrabold text-sm shrink-0 ring-2 ring-orange-500/20">
                    {c.avatarUrl ? (
                      <img 
                        src={c.avatarUrl} 
                        alt={c.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }} 
                      />
                    ) : (
                      <span>{c.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {c.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {c.department} • {c.batch || 'Student'}
                    </p>
                    <span className="text-[10px] font-semibold text-[#FF6600]">
                      {c.contributionsCount || 0} contributions
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => setEditingContrib(c)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors"
                    title="Edit Contributor"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {contributors.length > 1 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete contributor ${c.name}?`)) {
                          deleteContributor(c.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-zinc-800 transition-colors"
                      title="Delete Contributor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: STUDENT SUBMISSIONS (PENDING CONTRIBUTIONS) */}
      {activeTab === 'contributions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#FF6600]" />
                <span>Student Submissions & Pending Notes</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF6600] font-bold">
                  {pendingContributions.length} Pending
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Review submitted notes, download PDFs to your PC, and publish to the live site.
              </p>
            </div>
          </div>

          {/* Storage Quota Auto-Cleanup Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs space-y-1.5 leading-relaxed">
            <div className="flex items-center space-x-2 font-bold text-amber-800 dark:text-amber-300 text-sm">
              <HardDrive className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Free Cloud Storage Auto-Purge Guarantee</span>
            </div>
            <p>
              When students upload direct files (PDFs), they are held in temporary cloud storage. Once you <strong>Approve</strong> or <strong>Reject</strong> a submission, the file is <strong>automatically deleted from cloud storage</strong> so your 1GB free quota stays 100% empty and never fills up! You can also click <em>&quot;Delete from Cloud&quot;</em> after downloading to free up space anytime.
            </p>
          </div>

          {pendingContributions.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-zinc-800 text-gray-400 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">No Pending Submissions</p>
              <p>When students submit notes via the Contributors page, they will appear here for review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingContributions.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 hover:border-orange-500/40 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-orange-100 text-[#FF6600] dark:bg-orange-950/60 dark:text-orange-400">
                          {item.courseCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
                          {item.resourceType.toUpperCase().replace('_', ' ')}
                        </span>
                        {item.term && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                            {item.term} Term
                          </span>
                        )}
                        {item.trimesterCode && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                            {item.trimesterCode}
                          </span>
                        )}
                        {item.submissionType === 'file' ? (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                            📁 Direct File ({item.fileSize ? `${(item.fileSize / (1024 * 1024)).toFixed(1)} MB` : 'PDF'})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400">
                            🔗 Drive / Public Link
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        {item.courseTitle || item.courseCode}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <span className="font-semibold text-gray-900 dark:text-white">Contributor:</span>
                        <span className="font-bold text-[#FF6600]">{item.contributorName}</span>
                        <span>•</span>
                        <span>{item.department}</span>
                        <span>•</span>
                        <span>{item.batch || 'UIUian'}</span>
                        {item.profileUrl && (
                          <>
                            <span>•</span>
                            <a
                              href={item.profileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 hover:underline inline-flex items-center space-x-1"
                            >
                              <span>{item.socialType || 'Profile'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </>
                        )}
                      </div>

                      {item.notes && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Student Notes: </span>
                          {item.notes}
                        </div>
                      )}
                    </div>

                    <div className="text-right text-[11px] text-gray-400 shrink-0">
                      Submitted: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.submissionType === 'file' ? (
                        <>
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            download={item.fileName || true}
                            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download File ({item.fileName || 'PDF'})</span>
                          </a>

                          {item.storagePath && (
                            <button
                              type="button"
                              onClick={() => handleManualDeleteStorageFile(item)}
                              disabled={isDeletingStorageId === item.id}
                              className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Delete from Supabase storage now to free 1GB quota"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Free Cloud Space</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white transition-colors shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Drive Link</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleRejectClick(item)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        Reject & Delete
                      </button>

                      <button
                        type="button"
                        onClick={() => openApprovalModal(item)}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6600] hover:bg-orange-600 text-white transition-colors shadow-sm cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STUDENT REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Notes Requested by Students
          </h3>

          {noteRequests.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-zinc-800 text-gray-400 text-xs">
              No pending student requests.
            </div>
          ) : (
            <div className="space-y-3">
              {noteRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-[#FF6600]">
                      {req.courseCode}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      Requested {req.resourceType.replace('_', ' ')} by {req.requestedBy}
                    </h4>
                    {req.notes && <p className="text-xs text-gray-500">{req.notes}</p>}
                    {req.contactInfo && (
                      <p className="text-xs text-blue-500">Contact: {req.contactInfo}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">{req.createdAt.split('T')[0]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: TRAFFIC & COURSE ACCESS ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-[#FF6600]" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Course Traffic & Access Analytics
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Live statistics showing which courses and departments students view most frequently on UIU Note Share.
              </p>
            </div>
            <button
              onClick={async () => {
                setIsRefreshingAnalytics(true);
                try {
                  await refreshAnalytics();
                } finally {
                  setTimeout(() => setIsRefreshingAnalytics(false), 500);
                }
              }}
              disabled={isRefreshingAnalytics}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-[#FF6600] dark:hover:border-[#FF6600] text-gray-800 dark:text-zinc-200 transition-all shadow-sm shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingAnalytics ? 'animate-spin text-[#FF6600]' : ''}`} />
              <span>{isRefreshingAnalytics ? 'Refreshing...' : 'Refresh Cloud Stats'}</span>
            </button>
          </div>

          {/* 4 Overview Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 flex items-start justify-between">
              <div>
                <span className="text-xs text-gray-500 font-medium">Total Site Visitors</span>
                <div className="text-2xl font-black text-emerald-500 mt-1">
                  {visitorCount.toLocaleString()}
                </div>
                <span className="text-[10px] text-gray-400">Total website hits tracked</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 flex items-start justify-between">
              <div>
                <span className="text-xs text-gray-500 font-medium">Total Course Accesses</span>
                <div className="text-2xl font-black text-blue-500 mt-1">
                  {analyticsData.totalCourseAccesses.toLocaleString()}
                </div>
                <span className="text-[10px] text-gray-400">Total course views by students</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 flex items-start justify-between">
              <div>
                <span className="text-xs text-gray-500 font-medium">#1 Most Popular Course</span>
                <div className="text-lg font-black text-[#FF6600] mt-1 truncate max-w-[170px]" title={analyticsData.topCourse ? `${analyticsData.topCourse.code} - ${analyticsData.topCourse.title}` : 'None'}>
                  {analyticsData.topCourse ? analyticsData.topCourse.code : 'No visits yet'}
                </div>
                <span className="text-[10px] text-gray-400">
                  {analyticsData.topCourse ? `${analyticsData.topCourse.views} student views` : 'Browse course to start'}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-[#FF6600] flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 flex items-start justify-between">
              <div>
                <span className="text-xs text-gray-500 font-medium">Top Department</span>
                <div className="text-2xl font-black text-purple-500 mt-1">
                  {analyticsData.topDept}
                </div>
                <span className="text-[10px] text-gray-400">Highest student engagement</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-500 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Department Breakdown Section */}
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Department Traffic Share
                </h4>
              </div>
              <span className="text-xs text-gray-500">
                Across {analyticsData.deptBreakdown.length} departments
              </span>
            </div>

            {/* Department Stacked Distribution Bar */}
            {analyticsData.totalCourseAccesses > 0 ? (
              <div className="space-y-3">
                <div className="h-3 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                  {analyticsData.deptBreakdown.map((d, index) => {
                    const colors = ['#FF6600', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4'];
                    const color = colors[index % colors.length];
                    const widthPct = (d.accesses / analyticsData.totalCourseAccesses) * 100;
                    if (widthPct === 0) return null;
                    return (
                      <div
                        key={d.dept}
                        style={{ width: `${widthPct}%`, backgroundColor: color }}
                        className="h-full transition-all duration-500 hover:opacity-80"
                        title={`${d.dept}: ${d.accesses} views (${Math.round(widthPct)}%)`}
                      />
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
                  {analyticsData.deptBreakdown.map((d, index) => {
                    const colors = ['#FF6600', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4'];
                    const color = colors[index % colors.length];
                    return (
                      <div key={d.dept} className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200/70 dark:border-zinc-700/60">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{d.dept}</span>
                        </div>
                        <div className="text-sm font-black text-gray-900 dark:text-white">
                          {d.accesses} <span className="text-[10px] font-normal text-gray-400">views</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {d.percentage}% share • {d.count} courses
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-gray-400">
                No course visits recorded yet. As students explore courses, department distribution will appear here.
              </div>
            )}
          </div>

          {/* Course Popularity Visual Bar Graphs */}
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Course Access Leaderboard & Graphs
                </h4>
                <p className="text-xs text-gray-500">
                  Ranking and visual view progress for every course in the catalog.
                </p>
              </div>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={analyticsSearch}
                  onChange={(e) => setAnalyticsSearch(e.target.value)}
                  placeholder="Filter by code or title..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                />
              </div>
            </div>

            {/* Visual Course List with Bar Graphs */}
            <div className="space-y-2.5">
              {analyticsData.coursesWithViews
                .filter(c => 
                  c.code.toLowerCase().includes(analyticsSearch.toLowerCase()) ||
                  c.title.toLowerCase().includes(analyticsSearch.toLowerCase()) ||
                  (c.department && c.department.toLowerCase().includes(analyticsSearch.toLowerCase()))
                )
                .map((course, index) => {
                  const percentageOfMax = analyticsData.maxViews > 0 
                    ? (course.views / analyticsData.maxViews) * 100 
                    : 0;
                  const percentageOfTotal = analyticsData.totalCourseAccesses > 0
                    ? Math.round((course.views / analyticsData.totalCourseAccesses) * 100)
                    : 0;

                  return (
                    <div
                      key={course.id}
                      className="p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200/80 dark:border-zinc-700/60 hover:border-gray-300 dark:hover:border-zinc-600 transition-all space-y-2.5"
                    >
                      {/* Course Row Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-3 min-w-0">
                          {/* Rank Badge */}
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                            index === 0 && course.views > 0
                              ? 'bg-amber-400/20 text-amber-500 border border-amber-400/40 shadow-sm'
                              : index === 1 && course.views > 0
                              ? 'bg-slate-300/20 text-slate-300 border border-slate-300/40'
                              : index === 2 && course.views > 0
                              ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40'
                              : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 text-[11px]'
                          }`}>
                            #{index + 1}
                          </div>

                          {/* Course Details */}
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2 flex-wrap">
                              <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">
                                {course.code}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-100 dark:bg-orange-950/60 text-[#FF6600]">
                                {course.department}
                              </span>
                              {course.trimester && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300">
                                  Trim {course.trimester}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-zinc-400 truncate max-w-sm sm:max-w-md mt-0.5">
                              {course.title}
                            </p>
                          </div>
                        </div>

                        {/* Views & Link */}
                        <div className="flex items-center space-x-3 shrink-0">
                          <div className="text-right">
                            <div className="text-sm font-black text-gray-900 dark:text-white flex items-center justify-end space-x-1">
                              <span>{course.views}</span>
                              <span className="text-[10px] font-medium text-gray-500">views</span>
                            </div>
                            <span className="text-[10px] text-gray-400">
                              {percentageOfTotal}% share
                            </span>
                          </div>

                          <a
                            href={`/course/${course.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#FF6600] hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                            title="Open course in new tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* Visual Progress Graph Bar */}
                      <div className="space-y-1">
                        <div className="h-2 w-full bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${course.views > 0 ? Math.max(percentageOfMax, 3) : 0}%`,
                              backgroundColor: course.color || '#FF6600',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

              {analyticsData.coursesWithViews.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400">
                  No courses found to display analytics for.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS & CLOUD DATABASE */}
      {activeTab === 'settings' && (
        <div className="space-y-8 max-w-3xl">
          
          {/* SUPABASE STATUS CARD */}
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Supabase Cloud Database
                  </h3>
                  <p className="text-xs text-gray-500">
                    Project: <code className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-600 font-mono">zupoqrpdcptuxatmztuy</code>
                  </p>
                </div>
              </div>

              <button
                onClick={async () => {
                  setIsSyncing(true);
                  await syncWithCloud();
                  setIsSyncing(false);
                }}
                disabled={isSyncing}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isCloudConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Status: {supabaseStatus}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
                If your tables are not yet created in Supabase, click the button below to copy the complete SQL script, then paste it in your Supabase Dashboard under <strong>SQL Editor</strong> and click <strong>Run</strong>.
              </p>

              <button
                type="button"
                onClick={handleCopySqlScript}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FF6600] text-white hover:bg-orange-600 transition-colors shadow-sm"
              >
                {copiedSql ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'SQL Script Copied to Clipboard!' : 'Copy Supabase SQL Setup Script'}</span>
              </button>
            </div>
          </div>

          {/* CREATOR PROFILE SETTINGS (RAKIB HOSSAIN) */}
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6600] dark:bg-orange-950/60 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Creator Profile Settings
                </h3>
                <p className="text-xs text-gray-500">
                  Manage your personal photo, batch, biography, and social links.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCreatorProfile} className="space-y-4 text-xs">
              {/* Click-to-upload Avatar */}
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-orange-50/50 dark:bg-zinc-900/60 border border-orange-200/50 dark:border-zinc-800">
                <div 
                  onClick={() => creatorFileRef.current?.click()}
                  className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#FF6600] to-amber-500 flex items-center justify-center text-white cursor-pointer relative group ring-4 ring-orange-500/20 shadow-md shrink-0"
                  title="Click to change profile picture"
                >
                  <img 
                    src={editCreator.avatarUrl || "https://github.com/RakibHossain231.png"} 
                    alt={editCreator.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold text-white">
                    <Camera className="w-4 h-4 mb-0.5" />
                    <span>Change</span>
                  </div>
                </div>

                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">Click image to upload photo from your computer</h4>
                  <p className="text-gray-500 text-[11px]">Supports JPG, PNG, WEBP (under 2MB). You can also provide an online image link below.</p>
                  <input 
                    type="file" 
                    ref={creatorFileRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleImageFileUpload(e, (dataUrl) => setEditCreator({ ...editCreator, avatarUrl: dataUrl }))} 
                  />
                  <input 
                    type="url" 
                    placeholder="Or enter direct Avatar URL..." 
                    value={editCreator.avatarUrl} 
                    onChange={(e) => setEditCreator({ ...editCreator, avatarUrl: e.target.value })} 
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Creator Name *</label>
                  <input
                    type="text"
                    required
                    value={editCreator.name}
                    onChange={(e) => setEditCreator({ ...editCreator, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Department</label>
                  <input
                    type="text"
                    value={editCreator.department}
                    onChange={(e) => setEditCreator({ ...editCreator, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Batch</label>
                  <input
                    type="text"
                    value={editCreator.batch}
                    onChange={(e) => setEditCreator({ ...editCreator, batch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Biography & Vision</label>
                <textarea
                  rows={3}
                  value={editCreator.bio || ''}
                  onChange={(e) => setEditCreator({ ...editCreator, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={editCreator.githubUrl}
                    onChange={(e) => setEditCreator({ ...editCreator, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={editCreator.linkedinUrl}
                    onChange={(e) => setEditCreator({ ...editCreator, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Facebook Profile URL</label>
                  <input
                    type="url"
                    value={editCreator.facebookUrl}
                    onChange={(e) => setEditCreator({ ...editCreator, facebookUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Yahoo / Public Email</label>
                  <input
                    type="email"
                    value={editCreator.email}
                    onChange={(e) => setEditCreator({ ...editCreator, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {creatorSaveStatus && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{creatorSaveStatus}</span>
                </div>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#FF6600] text-white font-bold text-xs hover:bg-orange-600 transition-colors shadow"
              >
                Save Creator Profile
              </button>
            </form>
          </div>

          {/* GOOGLE DRIVE STORAGE CLARIFICATION */}
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Effortless Google Drive Storage Guide
                </h3>
                <p className="text-xs text-gray-500">
                  How to upload notes without dealing with complex Cloudflare R2 configurations.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800">
              <p><strong>Step 1:</strong> Upload your PDF handnote or exam solve to your personal Google Drive.</p>
              <p><strong>Step 2:</strong> Right-click the file &rarr; Click <strong>Share</strong> &rarr; Change General Access to <strong>"Anyone with the link can view"</strong>.</p>
              <p><strong>Step 3:</strong> Click <strong>Copy Link</strong> and paste it into the <strong>"File URL"</strong> field in the Add Note modal!</p>
              <p className="text-[#FF6600] font-semibold pt-1">
                ✓ UIU Note Share automatically formats the Google Drive link to render in our embedded zero-download PDF viewer!
              </p>
            </div>
          </div>

          {/* SECURITY & ADMIN CREDENTIALS */}
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Admin Login & 2FA Credentials
                </h3>
                <p className="text-xs text-gray-500">
                  Change your admin login email, password, and 6-digit security PIN.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateSecuritySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Registered Administrator Email *
                </label>
                <input
                  type="email"
                  required
                  value={editAdminEmail}
                  onChange={(e) => setEditAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Current Master Password (Authorization) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password to authorize changes"
                  value={editCurrentPass}
                  onChange={(e) => setEditCurrentPass(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    New Master Password (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={editNewPass}
                    onChange={(e) => setEditNewPass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={editConfirmPass}
                    onChange={(e) => setEditConfirmPass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  New 6-Digit 2FA Security PIN (Optional)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="6 digits (e.g. 123456)"
                  value={editNewPin}
                  onChange={(e) => setEditNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white font-mono tracking-widest"
                />
              </div>

              {securityStatus && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                  securityStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                }`}>
                  {securityStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{securityStatus.msg}</span>
                </div>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#FF6600] text-white hover:bg-orange-600 font-bold text-xs transition-colors shadow"
              >
                Save Security Credentials
              </button>
            </form>
          </div>

        </div>
      )}

      {/* MODAL: EDIT COURSE */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Edit Course Information
            </h3>
            <p className="text-xs text-gray-500">
              Update the course title, code, trimester, or description if you made any spelling mistake.
            </p>

            <form onSubmit={handleUpdateCourseSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.code}
                    onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Short Abbreviation</label>
                  <input
                    type="text"
                    value={editingCourse.abbr || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, abbr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Course Title *</label>
                <input
                  type="text"
                  required
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Department</label>
                  <select
                    value={editingCourse.department}
                    onChange={(e) => setEditingCourse({ ...editingCourse, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    {departments.map((d) => (
                      <option key={d.code} value={d.code}>{d.shortName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Trimester</label>
                  <select
                    value={editingCourse.trimester}
                    onChange={(e) => setEditingCourse({ ...editingCourse, trimester: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((t) => (
                      <option key={t} value={t}>Trimester {t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Credits</label>
                  <select
                    value={editingCourse.credit || 3}
                    onChange={(e) => setEditingCourse({ ...editingCourse, credit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    <option value={3}>3.0</option>
                    <option value={1.5}>2.0</option>
                    <option value={1}>1.0 (LAB)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  rows={2}
                  value={editingCourse.description || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                  Card Theme Color
                </label>
                <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200 dark:border-zinc-700">
                  {COURSE_PRESET_COLORS.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setEditingCourse({ ...editingCourse, color: c.value })}
                      title={c.label}
                      style={{ backgroundColor: c.value }}
                      className={`w-6 h-6 rounded-full transition-transform border-2 ${
                        (editingCourse.color || '#FF6600').toLowerCase() === c.value.toLowerCase()
                          ? 'scale-125 border-gray-900 dark:border-white shadow-md'
                          : 'border-transparent hover:scale-110'
                      }`}
                    />
                  ))}
                  <div className="flex items-center space-x-1.5 ml-auto">
                    <input
                      type="color"
                      value={editingCourse.color || '#FF6600'}
                      onChange={(e) => setEditingCourse({ ...editingCourse, color: e.target.value })}
                      className="w-7 h-7 rounded-lg cursor-pointer border border-gray-300 dark:border-zinc-700 p-0.5 bg-white"
                      title="Custom Color"
                    />
                    <span className="text-[11px] font-mono text-gray-600 dark:text-gray-300 uppercase font-semibold">
                      {editingCourse.color || '#FF6600'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 font-semibold text-gray-500 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF6600] text-white font-bold hover:bg-orange-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW COURSE */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Add New Course
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Course Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE 2118"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Short Abbr</label>
                  <input
                    type="text"
                    placeholder="e.g. AOOP"
                    value={newCourse.abbr}
                    onChange={(e) => setNewCourse({ ...newCourse, abbr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Object Oriented Programming"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Department</label>
                  <select
                    value={newCourse.department}
                    onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    {departments.map((d) => (
                      <option key={d.code} value={d.code}>{d.shortName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Trimester</label>
                  <select
                    value={newCourse.trimester}
                    onChange={(e) => setNewCourse({ ...newCourse, trimester: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((t) => (
                      <option key={t} value={t}>Trimester {t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Credits</label>
                  <select
                    value={newCourse.credit}
                    onChange={(e) => setNewCourse({ ...newCourse, credit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    <option value={3}>3.0</option>
                    <option value={1.5}>2.0</option>
                    <option value={1}>1.0 (Lab)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  rows={2}
                  placeholder="Key topics covered..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                  Card Theme Color
                </label>
                <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200 dark:border-zinc-700">
                  {COURSE_PRESET_COLORS.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setNewCourse({ ...newCourse, color: c.value })}
                      title={c.label}
                      style={{ backgroundColor: c.value }}
                      className={`w-6 h-6 rounded-full transition-transform border-2 ${
                        (newCourse.color || '#FF6600').toLowerCase() === c.value.toLowerCase()
                          ? 'scale-125 border-gray-900 dark:border-white shadow-md'
                          : 'border-transparent hover:scale-110'
                      }`}
                    />
                  ))}
                  <div className="flex items-center space-x-1.5 ml-auto">
                    <input
                      type="color"
                      value={newCourse.color || '#FF6600'}
                      onChange={(e) => setNewCourse({ ...newCourse, color: e.target.value })}
                      className="w-7 h-7 rounded-lg cursor-pointer border border-gray-300 dark:border-zinc-700 p-0.5 bg-white"
                      title="Custom Color"
                    />
                    <span className="text-[11px] font-mono text-gray-600 dark:text-gray-300 uppercase font-semibold">
                      {newCourse.color || '#FF6600'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-500 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF6600] text-white font-bold hover:bg-orange-600"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RESOURCE / NOTE / SOLVE */}
      {resourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl my-8 space-y-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Add Note, CT, or Exam Solve
            </h3>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Target Course *</label>
                  <select
                    value={newResource.courseId}
                    onChange={(e) => setNewResource({ ...newResource, courseId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    {courses.length === 0 ? (
                      <option value="">⚠️ No courses created yet - Please add a course first!</option>
                    ) : (
                      courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Resource Category *</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value as ResourceType })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    <option value="handnote">📝 Handwritten Note</option>
                    <option value="mid">📘 Mid Questions & Solves</option>
                    <option value="final">📕 Final Questions & Solves</option>
                    <option value="ct">🎯 Class Test (CT)</option>
                    <option value="assignment">📋 Assignment</option>
                    <option value="cheatsheet">📌 Cheat Sheet / Formula</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid Term Lecture Notes or CT 1 Question Paper"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Trimester Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 241"
                    value={newResource.trimesterCode}
                    onChange={(e) => setNewResource({ ...newResource, trimesterCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Storage Provider</label>
                  <select
                    value={newResource.storageType}
                    onChange={(e) => setNewResource({ ...newResource, storageType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    <option value="drive">Google Drive (Recommended)</option>
                    <option value="r2">Cloudflare R2</option>
                    <option value="direct_url">Direct PDF URL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">File Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 2.5 MB"
                    value={newResource.fileSize}
                    onChange={(e) => setNewResource({ ...newResource, fileSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  File URL (Google Drive Share Link or R2/PDF URL) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/.../view or https://..."
                  value={newResource.fileUrl}
                  onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Tip: In Google Drive, click Share &rarr; set &quot;Anyone with the link&quot; &rarr; Copy link and paste here.
                </p>
              </div>

              {/* Contributor Attribution */}
              <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-zinc-800/60 border border-orange-200/60 dark:border-zinc-700 space-y-2.5">
                <div className="flex items-center space-x-1.5 font-bold text-[#FF6600]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Contributor Attribution</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1 text-gray-600 dark:text-gray-300">Select Existing Contributor</label>
                    <select
                      value={newResource.contributorId}
                      onChange={(e) => setNewResource({ ...newResource, contributorId: e.target.value, newContribName: '' })}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600"
                    >
                      {contributors.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.department})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-gray-600 dark:text-gray-300">OR New Contributor Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tashin Parvez"
                      value={newResource.newContribName}
                      onChange={(e) => setNewResource({ ...newResource, newContribName: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600"
                    />
                  </div>
                </div>

                {newResource.newContribName && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <input
                        type="text"
                        placeholder="Batch (e.g. Batch 231)"
                        value={newResource.newContribBatch}
                        onChange={(e) => setNewResource({ ...newResource, newContribBatch: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600"
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        placeholder="Social Profile Link (Facebook/LinkedIn)"
                        value={newResource.newContribSocial}
                        onChange={(e) => setNewResource({ ...newResource, newContribSocial: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResourceModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-500 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF6600] text-white font-bold hover:bg-orange-600"
                >
                  Publish Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CONTRIBUTOR */}
      {contribModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-[#FF6600]" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Add New Contributor</h3>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newContrib.name) return;
              addContributor({
                id: 'contrib-' + Date.now(),
                name: newContrib.name.trim(),
                department: newContrib.department,
                batch: newContrib.batch,
                avatarUrl: newContrib.avatarUrl,
                socialUrl: newContrib.socialUrl,
                socialType: newContrib.socialType,
                contributionsCount: 1
              });
              setContribModalOpen(false);
              setNewContrib({ name: '', department: 'CSE', batch: 'Batch 231', avatarUrl: '', socialUrl: '', socialType: 'facebook' });
            }} className="space-y-3">

              {/* Click-to-Upload Avatar Picker */}
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700">
                <div 
                  onClick={() => contribFileRef.current?.click()}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6600] to-amber-500 flex items-center justify-center text-white cursor-pointer relative group overflow-hidden shrink-0 shadow"
                  title="Click to select image file from your computer"
                >
                  {newContrib.avatarUrl ? (
                    <img src={newContrib.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-white/90" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] font-bold text-white text-center">
                    Upload
                  </div>
                </div>

                <div className="flex-1">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 block">Contributor Photo</span>
                  <span className="text-[10px] text-gray-400 block mb-1">Click circle to upload image from PC</span>
                  <input 
                    type="file" 
                    ref={contribFileRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleImageFileUpload(e, (dataUrl) => setNewContrib({ ...newContrib, avatarUrl: dataUrl }))} 
                  />
                  <input
                    type="url"
                    placeholder="Or enter Image URL..."
                    value={newContrib.avatarUrl}
                    onChange={(e) => setNewContrib({ ...newContrib, avatarUrl: e.target.value })}
                    className="w-full px-2.5 py-1 text-[11px] rounded-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Contributor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tashin Parvez"
                  value={newContrib.name}
                  onChange={(e) => setNewContrib({ ...newContrib, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <select
                    value={newContrib.department}
                    onChange={(e) => setNewContrib({ ...newContrib, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                  >
                    {departments.map((d) => (
                      <option key={d.code} value={d.code}>{d.shortName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Batch</label>
                  <input
                    type="text"
                    placeholder="e.g. Batch 231"
                    value={newContrib.batch}
                    onChange={(e) => setNewContrib({ ...newContrib, batch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Social Profile URL</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={newContrib.socialUrl}
                  onChange={(e) => setNewContrib({ ...newContrib, socialUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Platform Type</label>
                <select
                  value={newContrib.socialType}
                  onChange={(e) => setNewContrib({ ...newContrib, socialType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                >
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setContribModalOpen(false)}
                  className="px-3 py-1.5 text-gray-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#FF6600] text-white font-bold"
                >
                  Add Contributor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CONTRIBUTOR */}
      {editingContrib && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-blue-500" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Edit Contributor</h3>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!editingContrib.name) return;
              updateContributor(editingContrib);
              setEditingContrib(null);
            }} className="space-y-3">

              {/* Click-to-Upload Avatar Picker */}
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700">
                <div 
                  onClick={() => editContribFileRef.current?.click()}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6600] to-amber-500 flex items-center justify-center text-white cursor-pointer relative group overflow-hidden shrink-0 shadow"
                  title="Click to select image file from your computer"
                >
                  {editingContrib.avatarUrl ? (
                    <img src={editingContrib.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-white/90" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] font-bold text-white text-center">
                    Upload
                  </div>
                </div>

                <div className="flex-1">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 block">Change Photo</span>
                  <span className="text-[10px] text-gray-400 block mb-1">Click circle to upload image from PC</span>
                  <input 
                    type="file" 
                    ref={editContribFileRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleImageFileUpload(e, (dataUrl) => setEditingContrib({ ...editingContrib, avatarUrl: dataUrl }))} 
                  />
                  <input
                    type="url"
                    placeholder="Or enter Image URL..."
                    value={editingContrib.avatarUrl || ''}
                    onChange={(e) => setEditingContrib({ ...editingContrib, avatarUrl: e.target.value })}
                    className="w-full px-2.5 py-1 text-[11px] rounded-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Contributor Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingContrib.name}
                  onChange={(e) => setEditingContrib({ ...editingContrib, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <select
                    value={editingContrib.department}
                    onChange={(e) => setEditingContrib({ ...editingContrib, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                  >
                    {departments.map((d) => (
                      <option key={d.code} value={d.code}>{d.shortName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Batch</label>
                  <input
                    type="text"
                    value={editingContrib.batch || ''}
                    onChange={(e) => setEditingContrib({ ...editingContrib, batch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Social Profile URL</label>
                <input
                  type="url"
                  value={editingContrib.socialUrl || ''}
                  onChange={(e) => setEditingContrib({ ...editingContrib, socialUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Platform Type</label>
                <select
                  value={editingContrib.socialType || 'facebook'}
                  onChange={(e) => setEditingContrib({ ...editingContrib, socialType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                >
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingContrib(null)}
                  className="px-3 py-1.5 text-gray-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT RESOURCE */}
      {editingResource && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl my-8 space-y-5 text-xs">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-[#FF6600]" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Edit Note / Exam Solve
              </h3>
            </div>
            <p className="text-gray-500">
              Update the resource title, category, Google Drive URL, trimester, or contributor attribution.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!editingResource.title || !editingResource.fileUrl) return;
              updateResource(editingResource);
              setEditingResource(null);
            }} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Target Course *</label>
                  <select
                    value={editingResource.courseId}
                    onChange={(e) => {
                      const course = courses.find(c => c.id === e.target.value);
                      setEditingResource({ 
                        ...editingResource, 
                        courseId: e.target.value,
                        department: course?.department || editingResource.department
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Resource Category *</label>
                  <select
                    value={editingResource.type}
                    onChange={(e) => setEditingResource({ ...editingResource, type: e.target.value as ResourceType })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    <option value="handnote">📝 Handwritten Note</option>
                    <option value="mid">📘 Mid Questions & Solves</option>
                    <option value="final">📕 Final Questions & Solves</option>
                    <option value="ct">🎯 Class Test (CT)</option>
                    <option value="assignment">📋 Assignment</option>
                    <option value="cheatsheet">📌 Cheat Sheet / Formula</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid Term Lecture Handnote or CT 1 Question Paper"
                  value={editingResource.title}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Trimester Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 231, 241"
                    value={editingResource.trimesterCode || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, trimesterCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Storage Provider</label>
                  <select
                    value={editingResource.storageType}
                    onChange={(e) => setEditingResource({ ...editingResource, storageType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    <option value="drive">Google Drive</option>
                    <option value="r2">Cloudflare R2</option>
                    <option value="direct_url">Direct URL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">File Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 3.5 MB"
                    value={editingResource.fileSize || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, fileSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  File URL (Google Drive Share Link or Direct URL) *
                </label>
                <input
                  type="url"
                  required
                  value={editingResource.fileUrl}
                  onChange={(e) => setEditingResource({ ...editingResource, fileUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Contributor Attribution</label>
                <select
                  value={editingResource.contributor?.id || ''}
                  onChange={(e) => {
                    const contrib = contributors.find(c => c.id === e.target.value);
                    setEditingResource({ ...editingResource, contributor: contrib });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                >
                  <option value="">None / Anonymous</option>
                  {contributors.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.department} - {c.batch})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="editHasSolution"
                  checked={Boolean(editingResource.hasSolution)}
                  onChange={(e) => setEditingResource({ ...editingResource, hasSolution: e.target.checked })}
                  className="rounded text-[#FF6600] focus:ring-[#FF6600]"
                />
                <label htmlFor="editHasSolution" className="font-semibold text-gray-700 dark:text-gray-300">
                  Includes Question Paper Solution / Answer Script
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-4 py-2 font-semibold text-gray-500 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF6600] text-white font-bold hover:bg-orange-600 transition-colors shadow"
                >
                  Save Resource Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPROVAL MODAL FOR STUDENT CONTRIBUTIONS */}
      {approvingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in">
            <button
              onClick={() => setApprovingItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-[#FF6600] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Approve & Publish Resource
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Verify details, attach your permanent Drive URL, and publish to the live site.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmApproval} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={approvalTitle}
                  onChange={(e) => setApprovalTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Target Course *
                  </label>
                  <select
                    value={approvalCourseId}
                    onChange={(e) => setApprovalCourseId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Resource Type *
                  </label>
                  <select
                    value={approvalResourceType}
                    onChange={(e) => setApprovalResourceType(e.target.value as ResourceType)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                  >
                    <option value="handnote">Lecture Handnotes</option>
                    <option value="question_mid">Mid Term Question / Solve</option>
                    <option value="question_final">Final Exam Question / Solve</option>
                    <option value="ct">Class Test (CT) Question / Solve</option>
                    <option value="assignment">Assignment Solution / Project</option>
                    <option value="book">Book / Reference Material</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Trimester
                  </label>
                  <input
                    type="text"
                    value={approvalTrimester}
                    onChange={(e) => setApprovalTrimester(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Term / Exam
                  </label>
                  <input
                    type="text"
                    value={approvalTerm}
                    onChange={(e) => setApprovalTerm(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Permanent File / Drive URL *
                </label>
                <input
                  type="url"
                  required
                  value={approvalFileUrl}
                  onChange={(e) => setApprovalFileUrl(e.target.value)}
                  placeholder="Paste your organized Google Drive share link"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  You can keep the student&apos;s link or upload the file to your own Google Drive and paste the link here.
                </p>
              </div>

              {/* Contributor Credit info */}
              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  Contributor Credit Information
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={approvalContribName}
                    onChange={(e) => setApprovalContribName(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                  <select
                    value={approvalDept}
                    onChange={(e) => setApprovalDept(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    {departments.map(d => (
                      <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Batch (e.g. 231)"
                    value={approvalBatch}
                    onChange={(e) => setApprovalBatch(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                  <select
                    value={approvalSocialType}
                    onChange={(e) => setApprovalSocialType(e.target.value as any)}
                    className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="email">Email</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Profile URL"
                    value={approvalProfileUrl}
                    onChange={(e) => setApprovalProfileUrl(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Auto Cleanup Notice */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
                ✅ <strong>Storage Auto-Purge:</strong> Approving this will automatically delete the temporary file from Supabase Storage so your 1GB free storage remains 100% empty!
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApprovingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApproving}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#FF6600] hover:bg-orange-600 text-white text-xs font-bold shadow transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isApproving ? 'Publishing & Purging Storage...' : 'Confirm & Publish Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
