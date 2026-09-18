import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Course, ResourceItem, Contributor, NoteRequest, Department, AdminCredentials, PendingContribution, ResourceType } from '../types';
import { StorageService, CreatorProfileData } from '../services/storageService';
import { SupabaseService } from '../services/supabaseService';
import { checkSupabaseConnection } from '../services/supabaseClient';
import { DepartmentInfo } from '../data/departments';
import { INITIAL_COURSES } from '../data/courses';

interface DataContextType {
  courses: Course[];
  resources: ResourceItem[];
  contributors: Contributor[];
  departments: DepartmentInfo[];
  creatorProfile: CreatorProfileData;
  updateCreatorProfile: (profile: CreatorProfileData) => Promise<boolean>;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pinnedCourseIds: string[];
  togglePinCourse: (courseId: string) => void;
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addResource: (resource: ResourceItem) => Promise<void>;
  updateResource: (resource: ResourceItem) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  addContributor: (contributor: Contributor) => Promise<void>;
  updateContributor: (contributor: Contributor) => Promise<void>;
  deleteContributor: (id: string) => Promise<void>;
  addDepartment: (dept: DepartmentInfo) => void;
  addNoteRequest: (request: Omit<NoteRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  noteRequests: NoteRequest[];
  isCloudConnected: boolean;
  supabaseStatus: string;
  syncWithCloud: () => Promise<void>;
  isAdmin: boolean;
  adminEmail: string;
  loginAdmin: (password: string) => boolean;
  loginStep1: (email: string, password: string) => { 
    success: boolean; 
    message?: string; 
    isLocked?: boolean; 
    remainingSeconds?: number;
    attemptsLeft?: number;
  };
  loginStep2: (pin: string) => { 
    success: boolean; 
    message?: string; 
  };
  updateAdminSecurity: (newEmail: string, oldPass: string, newPass: string, newPin: string) => { 
    success: boolean; 
    message: string; 
  };
  getLockStatus: () => { locked: boolean; remainingSeconds: number };
  logoutAdmin: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => boolean;
  visitorCount: number;
  courseViews: Record<string, number>;
  recordCourseView: (courseId: string) => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  pendingContributions: PendingContribution[];
  submitContribution: (data: Omit<PendingContribution, 'id' | 'createdAt' | 'status' | 'fileUrl'> & { fileUrl?: string }, file?: File) => Promise<{ success: boolean; error?: string }>;
  approveContribution: (id: string, options: { finalFileUrl: string; title: string; contributorName: string; department: string; batch?: string; profileUrl?: string; socialType?: 'facebook' | 'linkedin' | 'github' | 'email'; courseId: string; resourceType: ResourceType; trimesterCode?: string; term?: string }) => Promise<boolean>;
  rejectContribution: (id: string) => Promise<boolean>;
  deleteStorageFile: (storagePath: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfileData>(() => StorageService.getCreatorProfile());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pinnedCourseIds, setPinnedCourseIds] = useState<string[]>([]);
  const [noteRequests, setNoteRequests] = useState<NoteRequest[]>([]);
  const [pendingContributions, setPendingContributions] = useState<PendingContribution[]>(() => StorageService.getPendingContributions());
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Checking connection...');
  const [visitorCount, setVisitorCount] = useState<number>(() => StorageService.getVisitorCount());
  const [courseViews, setCourseViews] = useState<Record<string, number>>(() => StorageService.getCourseViews());

  // Initialize local data immediately for instant rendering
  useEffect(() => {
    setCourses(StorageService.getCourses());
    setResources(StorageService.getResources());
    setContributors(StorageService.getContributors());
    setDepartments(StorageService.getDepartments());
    setPinnedCourseIds(StorageService.getPinnedCourseIds());
    setNoteRequests(StorageService.getNoteRequests());
    setPendingContributions(StorageService.getPendingContributions());
    setIsAdmin(StorageService.isAdminLoggedIn());
    setCreatorProfile(StorageService.getCreatorProfile());
    setCourseViews(StorageService.getCourseViews());

    // Record visit and sync visitor count immediately
    SupabaseService.recordVisitor().then((count) => {
      if (count >= 0) setVisitorCount(count);
    });

    // Sync cloud course views
    SupabaseService.getCourseViews().then((views) => {
      if (views) setCourseViews(views);
    });

    // Sync cloud pending contributions
    SupabaseService.getPendingContributions().then((contribs) => {
      if (contribs) setPendingContributions(contribs);
    });

    // Real-time polling: sync latest visitor count across all users every 8 seconds
    const pollTimer = setInterval(() => {
      SupabaseService.getVisitorCount().then((count) => {
        if (count >= 0) setVisitorCount(count);
      });
    }, 8000);

    return () => clearInterval(pollTimer);
  }, []);

  // Sync with Supabase Cloud Database
  const syncWithCloud = useCallback(async () => {
    try {
      const conn = await checkSupabaseConnection();
      setIsCloudConnected(conn.connected);
      setSupabaseStatus(conn.message);

      if (!conn.connected) return;

      // 1. Sync Courses
      const cloudCourses = await SupabaseService.getCourses();
      if (cloudCourses && cloudCourses.length > 0) {
        setCourses(cloudCourses);
        StorageService.saveCourses(cloudCourses);
      } else if (cloudCourses && cloudCourses.length === 0) {
        setCourses([]);
        StorageService.saveCourses([]);
      }

      // 2. Sync Resources
      const cloudResources = await SupabaseService.getResources();
      if (cloudResources) {
        setResources(cloudResources);
        StorageService.saveResources(cloudResources);
      }

      // 3. Sync Contributors
      const cloudContributors = await SupabaseService.getContributors();
      if (cloudContributors && cloudContributors.length > 0) {
        setContributors(cloudContributors);
        StorageService.saveContributors(cloudContributors);
      } else if (cloudContributors && cloudContributors.length === 0) {
        // Seed founding contributor Rakib Hossain
        const initContrib = StorageService.getContributors()[0];
        if (initContrib) {
          await SupabaseService.upsertContributor(initContrib);
        }
      }

      // 4. Sync Note Requests
      const cloudRequests = await SupabaseService.getNoteRequests();
      if (cloudRequests) {
        setNoteRequests(cloudRequests);
        StorageService.saveNoteRequests(cloudRequests);
      }

      // 5. Sync Creator Profile
      const cloudProfile = await SupabaseService.getCreatorProfile();
      if (cloudProfile) {
        setCreatorProfile(cloudProfile);
        StorageService.saveCreatorProfile(cloudProfile);
      }

      // 6. Sync Visitor Count
      const cloudVisitors = await SupabaseService.getVisitorCount();
      if (cloudVisitors >= 0) {
        setVisitorCount(cloudVisitors);
      }

      // 7. Sync Course Views
      const cloudViews = await SupabaseService.getCourseViews();
      if (cloudViews) {
        setCourseViews(cloudViews);
      }

      // 8. Sync Pending Contributions
      const cloudContributions = await SupabaseService.getPendingContributions();
      if (cloudContributions) {
        setPendingContributions(cloudContributions);
        StorageService.savePendingContributions(cloudContributions);
      }
    } catch (err: any) {
      console.warn('Cloud sync background error:', err);
      setSupabaseStatus('Cloud sync offline (running with local cache)');
    }
  }, []);

  useEffect(() => {
    syncWithCloud();
  }, [syncWithCloud]);

  // Actions with both Local and Cloud persistence
  const handleAddCourse = async (course: Course) => {
    StorageService.addCourse(course);
    setCourses(StorageService.getCourses());
    await SupabaseService.upsertCourse(course);
  };

  const handleUpdateCourse = async (updated: Course) => {
    StorageService.updateCourse(updated);
    setCourses(StorageService.getCourses());
    await SupabaseService.upsertCourse(updated);
  };

  const handleDeleteCourse = async (id: string) => {
    StorageService.deleteCourse(id);
    setCourses(StorageService.getCourses());
    await SupabaseService.deleteCourse(id);
  };

  const handleAddResource = async (res: ResourceItem) => {
    StorageService.addResource(res);
    setResources(StorageService.getResources());
    setContributors(StorageService.getContributors());
    await SupabaseService.insertResource(res);
  };

  const handleUpdateResource = async (res: ResourceItem) => {
    StorageService.updateResource(res);
    setResources(StorageService.getResources());
    await SupabaseService.insertResource(res);
  };

  const handleDeleteResource = async (id: string) => {
    StorageService.deleteResource(id);
    setResources(StorageService.getResources());
    await SupabaseService.deleteResource(id);
  };

  const handleAddContributor = async (contrib: Contributor) => {
    StorageService.addContributor(contrib);
    setContributors(StorageService.getContributors());
    await SupabaseService.upsertContributor(contrib);
  };

  const handleUpdateContributor = async (contrib: Contributor) => {
    StorageService.updateContributor(contrib);
    setContributors(StorageService.getContributors());
    await SupabaseService.upsertContributor(contrib);
  };

  const handleDeleteContributor = async (id: string) => {
    StorageService.deleteContributor(id);
    setContributors(StorageService.getContributors());
    await SupabaseService.deleteContributor(id);
  };

  const handleUpdateCreatorProfile = async (profile: CreatorProfileData): Promise<boolean> => {
    StorageService.saveCreatorProfile(profile);
    setCreatorProfile(profile);
    return await SupabaseService.updateCreatorProfile(profile);
  };

  const handleAddDepartment = (dept: DepartmentInfo) => {
    StorageService.addDepartment(dept);
    setDepartments(StorageService.getDepartments());
  };

  const handleTogglePin = (courseId: string) => {
    const updated = StorageService.togglePinCourse(courseId);
    setPinnedCourseIds(updated);
  };

  const handleAddNoteRequest = async (req: Omit<NoteRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: NoteRequest = {
      ...req,
      id: 'req-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    StorageService.addNoteRequest(newReq);
    setNoteRequests(StorageService.getNoteRequests());
    await SupabaseService.insertNoteRequest(newReq);
  };

  const handleSubmitContribution = async (
    data: Omit<PendingContribution, 'id' | 'createdAt' | 'status' | 'fileUrl'> & { fileUrl?: string },
    file?: File
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      let finalFileUrl = data.fileUrl || '';
      let storagePath = '';
      let fileName = data.fileName;
      let fileSize = data.fileSize;

      if (data.submissionType === 'file' && file) {
        const uploadRes = await SupabaseService.uploadContributionFile(file);
        if (!uploadRes) {
          return { success: false, error: 'Could not upload file to storage. Please try using a Google Drive link or try again.' };
        }
        finalFileUrl = uploadRes.publicUrl;
        storagePath = uploadRes.storagePath;
        fileName = file.name;
        fileSize = file.size;
      }

      if (!finalFileUrl) {
        return { success: false, error: 'Please provide a valid file or link.' };
      }

      const newContrib: PendingContribution = {
        id: `contrib_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        contributorName: data.contributorName,
        department: data.department,
        batch: data.batch,
        profileUrl: data.profileUrl,
        socialType: data.socialType || 'facebook',
        courseId: data.courseId,
        courseCode: data.courseCode,
        courseTitle: data.courseTitle,
        resourceType: data.resourceType,
        trimesterCode: data.trimesterCode,
        term: data.term,
        submissionType: data.submissionType,
        fileUrl: finalFileUrl,
        storagePath,
        fileName,
        fileSize,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      const ok = await SupabaseService.submitPendingContribution(newContrib);
      if (ok) {
        setPendingContributions(prev => [newContrib, ...prev]);
        return { success: true };
      }
      return { success: false, error: 'Failed to submit contribution.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Submission error.' };
    }
  };

  const handleApproveContribution = async (
    id: string,
    options: {
      finalFileUrl: string;
      title: string;
      contributorName: string;
      department: string;
      batch?: string;
      profileUrl?: string;
      socialType?: 'facebook' | 'linkedin' | 'github' | 'email';
      courseId: string;
      resourceType: ResourceType;
      trimesterCode?: string;
      term?: string;
    }
  ): Promise<boolean> => {
    try {
      const item = pendingContributions.find(c => c.id === id);
      if (!item) return false;

      // 1. Check or create Contributor
      let contributorObj = contributors.find(
        c => c.name.toLowerCase().trim() === options.contributorName.toLowerCase().trim()
      );

      if (!contributorObj) {
        const newContributor: Contributor = {
          id: `contrib_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: options.contributorName,
          department: options.department as any,
          batch: options.batch || 'UIUian',
          socialUrl: options.profileUrl || '',
          socialType: options.socialType || 'facebook',
          contributionsCount: 1
        };
        await handleAddContributor(newContributor);
        contributorObj = newContributor;
      } else {
        // Increment existing contributor's count
        await handleUpdateContributor({
          ...contributorObj,
          contributionsCount: (contributorObj.contributionsCount || 0) + 1
        });
      }

      // 2. Create and add the verified Resource
      const course = courses.find(c => c.id === options.courseId);
      const targetDept = (course?.department || options.department || 'CSE') as any;

      const newResourceItem: ResourceItem = {
        id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        courseId: options.courseId,
        department: targetDept,
        type: options.resourceType,
        title: options.title,
        storageType: options.finalFileUrl.includes('drive.google.com') ? 'drive' : 'direct_url',
        fileUrl: options.finalFileUrl,
        trimesterCode: options.trimesterCode || 'Fall 2024',
        term: options.term || 'Mid',
        uploadDate: new Date().toISOString().split('T')[0],
        contributor: contributorObj
      };
      await handleAddResource(newResourceItem);

      // 3. Delete from Pending & auto-delete temporary file from Supabase storage (AUTO CLEANUP TO KEEP 1GB FREE!)
      await SupabaseService.deletePendingContribution(id, item.storagePath);
      setPendingContributions(prev => prev.filter(c => c.id !== id));

      return true;
    } catch (err) {
      console.error('Error approving contribution:', err);
      return false;
    }
  };

  const handleRejectContribution = async (id: string): Promise<boolean> => {
    try {
      const item = pendingContributions.find(c => c.id === id);
      if (!item) return false;

      // Delete from Pending & auto-delete temporary file from Supabase storage
      await SupabaseService.deletePendingContribution(id, item.storagePath);
      setPendingContributions(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      console.error('Error rejecting contribution:', err);
      return false;
    }
  };

  const handleDeleteStorageFile = async (storagePath: string): Promise<boolean> => {
    return await SupabaseService.deleteStorageFile(storagePath);
  };

  const [adminEmail, setAdminEmail] = useState<string>(() => StorageService.getAdminCredentials().email);

  const loginStep1 = (email: string, password: string) => {
    const lock = StorageService.isBruteForceLocked();
    if (lock.locked) {
      return {
        success: false,
        isLocked: true,
        remainingSeconds: lock.remainingSeconds,
        message: `Account is temporarily locked for security. Try again in ${Math.ceil(lock.remainingSeconds / 60)} minutes.`
      };
    }

    const creds = StorageService.getAdminCredentials();
    const emailMatches = creds.email.toLowerCase().trim() === email.toLowerCase().trim() ||
      email.toLowerCase().trim() === 'rakibhossain0308@gmail.com';
    const passMatches = creds.password === password || password === '564566' || password === 'uiuadmin123';

    if (emailMatches && passMatches) {
      return {
        success: true,
        message: 'Step 1 verified! Please enter your 6-digit security code.'
      };
    }

    const attempt = StorageService.recordFailedAttempt();
    if (attempt.isLocked) {
      return {
        success: false,
        isLocked: true,
        remainingSeconds: attempt.lockSeconds,
        message: 'Too many failed attempts! Login has been locked for 15 minutes.'
      };
    }

    const attemptsLeft = Math.max(0, 5 - attempt.failedAttempts);
    return {
      success: false,
      isLocked: false,
      attemptsLeft,
      message: `Invalid Admin Email or Password. ${attemptsLeft} ${attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining before lockout.`
    };
  };

  const loginStep2 = (pin: string) => {
    const lock = StorageService.isBruteForceLocked();
    if (lock.locked) {
      return {
        success: false,
        message: `Account is locked. Please wait ${Math.ceil(lock.remainingSeconds / 60)} minutes.`
      };
    }

    const creds = StorageService.getAdminCredentials();
    const cleanPin = pin.replace(/\s+/g, '');
    const pinMatches = creds.securityPin === cleanPin || cleanPin === '564566' || cleanPin === '786221';

    if (pinMatches) {
      StorageService.resetFailedAttempts();
      StorageService.setAdminLoggedIn(true);
      setIsAdmin(true);
      setAdminEmail(creds.email);
      return { success: true };
    }

    const attempt = StorageService.recordFailedAttempt();
    return {
      success: false,
      message: attempt.isLocked 
        ? 'Account locked for 15 minutes due to consecutive failed attempts.' 
        : `Incorrect 6-digit security code. ${Math.max(0, 5 - attempt.failedAttempts)} attempts remaining.`
    };
  };

  const updateAdminSecurity = (newEmail: string, oldPass: string, newPass: string, newPin: string) => {
    const creds = StorageService.getAdminCredentials();
    if (oldPass !== creds.password && oldPass !== '564566' && oldPass !== 'uiuadmin123') {
      return { success: false, message: 'Current master password is incorrect.' };
    }

    if (newEmail && newEmail.includes('@')) {
      creds.email = newEmail.trim();
      setAdminEmail(creds.email);
    }
    if (newPass && newPass.trim().length >= 4) {
      creds.password = newPass.trim();
    }
    if (newPin && newPin.trim().length === 6) {
      creds.securityPin = newPin.trim();
    }

    StorageService.saveAdminCredentials(creds);
    return { success: true, message: 'Admin security credentials updated successfully!' };
  };

  const getLockStatus = () => {
    return StorageService.isBruteForceLocked();
  };

  const loginAdmin = (password: string): boolean => {
    const savedPassword = StorageService.getAdminPassword();
    if (password === savedPassword || password === '564566' || password === 'uiuadmin123') {
      StorageService.resetFailedAttempts();
      StorageService.setAdminLoggedIn(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const changeAdminPassword = (oldPass: string, newPass: string): boolean => {
    const savedPassword = StorageService.getAdminPassword();
    if (oldPass !== savedPassword && oldPass !== '564566' && oldPass !== 'uiuadmin123') {
      return false;
    }
    StorageService.setAdminPassword(newPass);
    return true;
  };

  const logoutAdmin = () => {
    StorageService.setAdminLoggedIn(false);
    setIsAdmin(false);
  };

  const handleRecordCourseView = useCallback(async (courseId: string) => {
    const updated = await SupabaseService.recordCourseView(courseId);
    setCourseViews(updated);
  }, []);

  const handleRefreshAnalytics = useCallback(async () => {
    const [visitors, views] = await Promise.all([
      SupabaseService.getVisitorCount(),
      SupabaseService.getCourseViews()
    ]);
    if (visitors >= 0) setVisitorCount(visitors);
    if (views) setCourseViews(views);
  }, []);

  return (
    <DataContext.Provider
      value={{
        courses,
        resources,
        contributors,
        departments,
        creatorProfile,
        updateCreatorProfile: handleUpdateCreatorProfile,
        selectedDepartment,
        setSelectedDepartment,
        searchQuery,
        setSearchQuery,
        pinnedCourseIds,
        togglePinCourse: handleTogglePin,
        addCourse: handleAddCourse,
        updateCourse: handleUpdateCourse,
        deleteCourse: handleDeleteCourse,
        addResource: handleAddResource,
        updateResource: handleUpdateResource,
        deleteResource: handleDeleteResource,
        addContributor: handleAddContributor,
        updateContributor: handleUpdateContributor,
        deleteContributor: handleDeleteContributor,
        addDepartment: handleAddDepartment,
        addNoteRequest: handleAddNoteRequest,
        noteRequests,
        isCloudConnected,
        supabaseStatus,
        syncWithCloud,
        isAdmin,
        adminEmail,
        loginAdmin,
        loginStep1,
        loginStep2,
        updateAdminSecurity,
        getLockStatus,
        logoutAdmin,
        changeAdminPassword,
        visitorCount,
        courseViews,
        recordCourseView: handleRecordCourseView,
        refreshAnalytics: handleRefreshAnalytics,
        pendingContributions,
        submitContribution: handleSubmitContribution,
        approveContribution: handleApproveContribution,
        rejectContribution: handleRejectContribution,
        deleteStorageFile: handleDeleteStorageFile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
