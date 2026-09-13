import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Course, ResourceItem, Contributor, ResourceType } from '../types';
import { CloudflareR2Service } from '../services/cloudflareR2Service';

type AdminTab = 'courses' | 'resources' | 'contributors' | 'requests' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdmin, 
    loginAdmin, 
    logoutAdmin, 
    changeAdminPassword,
    courses, 
    addCourse, 
    updateCourse,
    deleteCourse,
    resources, 
    addResource, 
    deleteResource,
    contributors, 
    addContributor,
    departments,
    noteRequests 
  } = useData();

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<AdminTab>('courses');

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

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Resource modal state
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [newResource, setNewResource] = useState<{
    courseId: string;
    type: ResourceType;
    title: string;
    description: string;
    trimesterCode: string;
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
    trimesterCode: '241',
    ctNumber: 1,
    assignmentNumber: 1,
    hasSolution: true,
    storageType: 'r2',
    fileUrl: '',
    fileSize: '2.5 MB',
    contributorId: contributors[0]?.id || '',
    newContribName: '',
    newContribDept: 'CSE',
    newContribBatch: 'Batch 231',
    newContribSocial: '',
    newContribPlatform: 'facebook'
  });

  // Contributor modal state
  const [contribModalOpen, setContribModalOpen] = useState(false);
  const [newContrib, setNewContrib] = useState({
    name: '',
    department: 'CSE',
    batch: 'Batch 231',
    avatarUrl: '',
    socialUrl: '',
    socialType: 'facebook' as const
  });

  // Settings state
  const [r2PublicDomain, setR2PublicDomain] = useState(
    CloudflareR2Service.getConfig()?.publicDomain || ''
  );
  const [r2BucketName, setR2BucketName] = useState(
    CloudflareR2Service.getConfig()?.bucketName || ''
  );
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Search in tables
  const [adminSearch, setAdminSearch] = useState('');

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
      setPasswordInput('');
    }
  };

  // Handle Create Course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.title) return;

    const courseId = newCourse.code.toLowerCase().replace(/[\s_]/g, '-');
    const created: Course = {
      id: courseId,
      code: newCourse.code.trim().toUpperCase(),
      title: newCourse.title.trim(),
      abbr: newCourse.abbr?.trim() || newCourse.code.substring(0, 4),
      department: newCourse.department || 'CSE',
      trimester: Number(newCourse.trimester) || 1,
      color: newCourse.color || '#FF6600',
      description: newCourse.description || '',
      credit: Number(newCourse.credit) || 3
    };

    addCourse(created);
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

  // Handle Update Course (Edit)
  const handleUpdateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.title || !editingCourse.code) return;
    updateCourse(editingCourse);
    setEditingCourse(null);
  };

  // Handle Change Admin Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setPasswordStatus({ type: 'error', msg: 'Password must be at least 4 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', msg: 'New passwords do not match.' });
      return;
    }
    const success = changeAdminPassword(currentPassword, newPassword);
    if (!success) {
      setPasswordStatus({ type: 'error', msg: 'Current password is incorrect.' });
    } else {
      setPasswordStatus({ type: 'success', msg: 'Admin password updated successfully! Please remember it.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordStatus(null), 3500);
    }
  };

  // Handle Create Resource
  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title || !newResource.fileUrl) return;

    const selectedCourse = courses.find(c => c.id === newResource.courseId) || courses[0];

    // Determine contributor
    let chosenContributor: Contributor | undefined;
    if (newResource.newContribName.trim()) {
      chosenContributor = {
        id: 'contrib-' + Date.now(),
        name: newResource.newContribName.trim(),
        department: newResource.newContribDept,
        batch: newResource.newContribBatch,
        socialUrl: newResource.newContribSocial,
        socialType: newResource.newContribPlatform,
        contributionsCount: 1
      };
      addContributor(chosenContributor);
    } else {
      chosenContributor = contributors.find(c => c.id === newResource.contributorId);
    }

    const item: ResourceItem = {
      id: 'res-' + Date.now(),
      courseId: selectedCourse.id,
      department: selectedCourse.department,
      type: newResource.type,
      title: newResource.title.trim(),
      description: newResource.description.trim(),
      trimesterCode: newResource.trimesterCode,
      ctNumber: (newResource.type === 'ct' || newResource.type === 'ct_question' || newResource.type === 'ct_solve') ? Number(newResource.ctNumber) : undefined,
      assignmentNumber: (newResource.type === 'assignment' || newResource.type === 'assignment_question' || newResource.type === 'assignment_solve') ? Number(newResource.assignmentNumber) : undefined,
      hasSolution: (newResource.type === 'mid_solve' || newResource.type === 'final_solve' || newResource.type === 'ct_solve' || newResource.type === 'assignment_solve') ? true : newResource.hasSolution,
      storageType: newResource.storageType,
      fileUrl: newResource.fileUrl.trim(),
      fileSize: newResource.fileSize || '3 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      contributor: chosenContributor
    };

    addResource(item);
    setResourceModalOpen(false);
    setNewResource({
      ...newResource,
      title: '',
      description: '',
      fileUrl: ''
    });
  };

  // Handle Save Settings
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
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // If not logged in, show Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF6600] dark:bg-orange-950/60 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-white">
            Admin Access
          </h2>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1 mb-6">
            Enter the master password to manage courses, notes, and contributors.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Admin Master Key
              </label>
              <input
                type="password"
                required
                placeholder="Enter password (default: uiuadmin123)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/90 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#FF6600]"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Incorrect password. Use: <strong>uiuadmin123</strong></span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-md shadow-orange-500/25"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 text-center">
            <span className="text-[11px] text-gray-400">
              Default demo key: <code className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-orange-500">uiuadmin123</code>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Admin Control Center
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                Live
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Manage courses, upload Cloudflare R2 / Drive notes, and attribute contributors.
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-4">
          <span className="text-xs text-gray-500 font-medium">Total Courses</span>
          <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">{courses.length}</div>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-2xl p-4">
          <span className="text-xs text-gray-500 font-medium">Total Notes & Solves</span>
          <div className="text-2xl font-black text-[#FF6600] mt-1">{resources.length}</div>
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
          { key: 'contributors', label: 'Contributors', icon: Users, count: contributors.length },
          { key: 'requests', label: 'Student Requests', icon: Inbox, count: noteRequests.length },
          { key: 'settings', label: 'Cloud Storage (R2/Supabase)', icon: Settings },
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
                  isActive ? 'bg-orange-100 dark:bg-orange-950/60 text-[#FF6600]' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
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
                          <td className="px-4 py-3 font-bold text-[#FF6600]">{course.code}</td>
                          <td className="px-4 py-3 font-medium">{course.title}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-semibold text-[10px]">
                              {course.department}
                            </span>
                          </td>
                          <td className="px-4 py-3">Trimester {course.trimester}</td>
                          <td className="px-4 py-3 font-semibold">{notesCount} items</td>
                          <td className="px-4 py-3 text-right space-x-1">
                            <button
                              onClick={() => setEditingCourse({ ...course })}
                              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                              title="Edit Course"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${course.code}?`)) {
                                  deleteCourse(course.id);
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
                              title="Delete Course"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* TAB 2: RESOURCES MANAGEMENT */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Showing {resources.length} uploaded notes & exam solves</span>
            <button
              onClick={() => setResourceModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FF6600] text-white hover:bg-orange-600"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Upload Note / Solve</span>
            </button>
          </div>

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
        </div>
      )}

      {/* TAB 3: CONTRIBUTORS */}
      {activeTab === 'contributors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{contributors.length} registered contributors</span>
            <button
              onClick={() => setContribModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FF6600] text-white hover:bg-orange-600"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Contributor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contributors.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 truncate">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{c.name}</h4>
                  <p className="text-xs text-gray-400">{c.department} • {c.batch || 'Student'}</p>
                </div>
                <span className="text-xs font-bold text-[#FF6600] px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40">
                  {c.contributionsCount || 1}
                </span>
              </div>
            ))}
          </div>
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

      {/* TAB 5: CLOUD STORAGE & SUPABASE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Cloudflare R2 & Hybrid Storage Config
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Configure your free 10GB Cloudflare R2 bucket for direct PDF streaming.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Cloudflare R2 Public Domain / Custom Subdomain
              </label>
              <input
                type="text"
                placeholder="e.g. https://pub-abc123xyz.r2.dev or https://notes.uiunoteshare.com"
                value={r2PublicDomain}
                onChange={(e) => setR2PublicDomain(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Cloudflare R2 Bucket Name
              </label>
              <input
                type="text"
                placeholder="e.g. uiu-notes-archive"
                value={r2BucketName}
                onChange={(e) => setR2BucketName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
              />
            </div>

            {settingsSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cloudflare R2 configuration saved successfully!</span>
              </div>
            )}

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#FF6600] text-white font-bold text-xs hover:bg-orange-600 transition-colors shadow"
            >
              Save Configuration
            </button>
          </form>

          {/* Security & Admin Password Section */}
          <div className="pt-6 border-t border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Change Admin Master Password
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Update your master password so only you can access this panel.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password (default: uiuadmin123)"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    New Secret Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {passwordStatus && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                }`}>
                  {passwordStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{passwordStatus.msg}</span>
                </div>
              )}

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-800 hover:bg-black dark:hover:bg-zinc-700 font-bold text-xs transition-colors shadow"
              >
                Update Password
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
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Theme Color</label>
                  <input
                    type="color"
                    value={editingCourse.color || '#FF6600'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, color: e.target.value })}
                    className="w-full h-8 px-1 py-1 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 cursor-pointer"
                  />
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
              Create New Course
            </h3>
            <p className="text-xs text-gray-500">
              When created, all 5 options (Handnotes, Mid/Final Solves, CTs, Assignments, Cheatsheets) are generated automatically.
            </p>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Course Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DS 2101 or CSE 2118"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Short Abbreviation</label>
                  <input
                    type="text"
                    placeholder="e.g. AOOP or ML"
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
                    <option value={1.5}>1.5 (Lab)</option>
                    <option value={1}>1.0</option>
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
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                    ))}
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
                    <option value="question_mid">❓ Mid Term Question</option>
                    <option value="mid_solve">💡 Mid Term Solution</option>
                    <option value="question_final">❓ Final Exam Question</option>
                    <option value="final_solve">💡 Final Exam Solution</option>
                    <option value="ct_question">🎯 Class Test (CT) Question</option>
                    <option value="ct_solve">🎯 Class Test (CT) Solution</option>
                    <option value="assignment_question">📋 Assignment Question</option>
                    <option value="assignment_solve">📋 Assignment Solution</option>
                    <option value="cheatsheet">📌 Cheat Sheet / Formula</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 3 Linked List Master Notes"
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
                    placeholder="e.g. 231, 241"
                    value={newResource.trimesterCode}
                    onChange={(e) => setNewResource({ ...newResource, trimesterCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">Storage Type</label>
                  <select
                    value={newResource.storageType}
                    onChange={(e) => setNewResource({ ...newResource, storageType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  >
                    <option value="r2">Cloudflare R2</option>
                    <option value="drive">Google Drive</option>
                    <option value="direct_url">Direct URL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">File Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 4.2 MB"
                    value={newResource.fileSize}
                    onChange={(e) => setNewResource({ ...newResource, fileSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">File URL (Cloudflare R2 or Drive link) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://.../file.pdf or https://drive.google.com/file/d/.../view"
                  value={newResource.fileUrl}
                  onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
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
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Add New Contributor</h3>
            
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

    </div>
  );
};
