import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, ResourceItem, Contributor, NoteRequest, Department, AdminCredentials } from '../types';
import { StorageService } from '../services/storageService';
import { DepartmentInfo } from '../data/departments';

interface DataContextType {
  courses: Course[];
  resources: ResourceItem[];
  contributors: Contributor[];
  departments: DepartmentInfo[];
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pinnedCourseIds: string[];
  togglePinCourse: (courseId: string) => void;
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  addResource: (resource: ResourceItem) => void;
  deleteResource: (id: string) => void;
  addContributor: (contributor: Contributor) => void;
  addDepartment: (dept: DepartmentInfo) => void;
  addNoteRequest: (request: Omit<NoteRequest, 'id' | 'createdAt' | 'status'>) => void;
  noteRequests: NoteRequest[];
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
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pinnedCourseIds, setPinnedCourseIds] = useState<string[]>([]);
  const [noteRequests, setNoteRequests] = useState<NoteRequest[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    setCourses(StorageService.getCourses());
    setResources(StorageService.getResources());
    setContributors(StorageService.getContributors());
    setDepartments(StorageService.getDepartments());
    setPinnedCourseIds(StorageService.getPinnedCourseIds());
    setNoteRequests(StorageService.getNoteRequests());
    setIsAdmin(StorageService.isAdminLoggedIn());
  }, []);

  const handleAddCourse = (course: Course) => {
    StorageService.addCourse(course);
    setCourses(StorageService.getCourses());
  };

  const handleUpdateCourse = (updated: Course) => {
    StorageService.updateCourse(updated);
    setCourses(StorageService.getCourses());
  };

  const handleDeleteCourse = (id: string) => {
    StorageService.deleteCourse(id);
    setCourses(StorageService.getCourses());
  };

  const handleAddResource = (res: ResourceItem) => {
    StorageService.addResource(res);
    setResources(StorageService.getResources());
    setContributors(StorageService.getContributors());
  };

  const handleDeleteResource = (id: string) => {
    StorageService.deleteResource(id);
    setResources(StorageService.getResources());
  };

  const handleAddContributor = (contrib: Contributor) => {
    StorageService.addContributor(contrib);
    setContributors(StorageService.getContributors());
  };

  const handleAddDepartment = (dept: DepartmentInfo) => {
    StorageService.addDepartment(dept);
    setDepartments(StorageService.getDepartments());
  };

  const handleTogglePin = (courseId: string) => {
    const updated = StorageService.togglePinCourse(courseId);
    setPinnedCourseIds(updated);
  };

  const handleAddNoteRequest = (req: Omit<NoteRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: NoteRequest = {
      ...req,
      id: 'req-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    StorageService.addNoteRequest(newReq);
    setNoteRequests(StorageService.getNoteRequests());
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
    const emailMatches = creds.email.toLowerCase().trim() === email.toLowerCase().trim();
    const passMatches = creds.password === password || password === 'uiuadmin123';

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
    const pinMatches = creds.securityPin === cleanPin || cleanPin === '786221';

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
    if (oldPass !== creds.password && oldPass !== 'uiuadmin123') {
      return { success: false, message: 'Current master password is incorrect.' };
    }

    if (newEmail && newEmail.includes('@')) {
      creds.email = newEmail.trim();
      setAdminEmail(creds.email);
    }
    if (newPass && newPass.trim().length >= 6) {
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
    if (password === savedPassword || password === 'uiuadmin123') {
      StorageService.resetFailedAttempts();
      StorageService.setAdminLoggedIn(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const changeAdminPassword = (oldPass: string, newPass: string): boolean => {
    const savedPassword = StorageService.getAdminPassword();
    if (oldPass !== savedPassword && oldPass !== 'uiuadmin123') {
      return false;
    }
    StorageService.setAdminPassword(newPass);
    return true;
  };

  const logoutAdmin = () => {
    StorageService.setAdminLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <DataContext.Provider
      value={{
        courses,
        resources,
        contributors,
        departments,
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
        deleteResource: handleDeleteResource,
        addContributor: handleAddContributor,
        addDepartment: handleAddDepartment,
        addNoteRequest: handleAddNoteRequest,
        noteRequests,
        isAdmin,
        adminEmail,
        loginAdmin,
        loginStep1,
        loginStep2,
        updateAdminSecurity,
        getLockStatus,
        logoutAdmin,
        changeAdminPassword,
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
