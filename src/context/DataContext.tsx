import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, ResourceItem, Contributor, NoteRequest, Department } from '../types';
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
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
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

  const loginAdmin = (password: string): boolean => {
    // Default master admin password for demonstration / initial setup
    if (password === 'uiuadmin123' || password === 'admin') {
      StorageService.setAdminLoggedIn(true);
      setIsAdmin(true);
      return true;
    }
    return false;
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
        loginAdmin,
        logoutAdmin,
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
