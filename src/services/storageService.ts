import { Course, ResourceItem, Contributor, NoteRequest, Department, AdminCredentials } from '../types';
import { INITIAL_COURSES } from '../data/courses';
import { INITIAL_RESOURCES, INITIAL_CONTRIBUTORS } from '../data/seedResources';
import { INITIAL_DEPARTMENTS, DepartmentInfo } from '../data/departments';

const STORAGE_KEYS = {
  COURSES: 'uiu_courses_v2',
  RESOURCES: 'uiu_resources_v2',
  CONTRIBUTORS: 'uiu_contributors_v1',
  DEPARTMENTS: 'uiu_departments_v1',
  PINNED_COURSES: 'uiu_pinned_courses_v1',
  NOTE_REQUESTS: 'uiu_note_requests_v1',
  R2_CONFIG: 'uiu_r2_config_v1',
  SUPABASE_CONFIG: 'uiu_supabase_config_v1',
  ADMIN_AUTH: 'uiu_admin_auth_v1',
  ADMIN_CREDENTIALS: 'uiu_admin_credentials_v2'
};

export const StorageService = {
  // Courses
  getCourses(): Course[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (!raw) {
      this.saveCourses(INITIAL_COURSES);
      return INITIAL_COURSES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COURSES;
    }
  },

  saveCourses(courses: Course[]): void {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  addCourse(course: Course): void {
    const courses = this.getCourses();
    courses.unshift(course);
    this.saveCourses(courses);
  },

  updateCourse(updated: Course): void {
    const courses = this.getCourses().map(c => c.id === updated.id ? updated : c);
    this.saveCourses(courses);
  },

  deleteCourse(id: string): void {
    const courses = this.getCourses().filter(c => c.id !== id);
    this.saveCourses(courses);
  },

  // Resources / Notes
  getResources(): ResourceItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    if (!raw) {
      this.saveResources(INITIAL_RESOURCES);
      return INITIAL_RESOURCES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_RESOURCES;
    }
  },

  saveResources(resources: ResourceItem[]): void {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  },

  addResource(resource: ResourceItem): void {
    const resources = this.getResources();
    resources.unshift(resource);
    this.saveResources(resources);

    // Update contributor count if applicable
    if (resource.contributor?.id) {
      this.incrementContributorCount(resource.contributor.id);
    }
  },

  deleteResource(id: string): void {
    const resources = this.getResources().filter(r => r.id !== id);
    this.saveResources(resources);
  },

  // Contributors
  getContributors(): Contributor[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTRIBUTORS);
    if (!raw) {
      this.saveContributors(INITIAL_CONTRIBUTORS);
      return INITIAL_CONTRIBUTORS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CONTRIBUTORS;
    }
  },

  saveContributors(contributors: Contributor[]): void {
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTORS, JSON.stringify(contributors));
  },

  addContributor(contributor: Contributor): void {
    const list = this.getContributors();
    const existing = list.find(c => c.id === contributor.id || c.name.toLowerCase() === contributor.name.toLowerCase());
    if (!existing) {
      list.push(contributor);
      this.saveContributors(list);
    }
  },

  incrementContributorCount(contributorId: string): void {
    const list = this.getContributors().map(c => {
      if (c.id === contributorId) {
        return { ...c, contributionsCount: (c.contributionsCount || 0) + 1 };
      }
      return c;
    });
    this.saveContributors(list);
  },

  // Departments
  getDepartments(): DepartmentInfo[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
    if (!raw) {
      this.saveDepartments(INITIAL_DEPARTMENTS);
      return INITIAL_DEPARTMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  },

  saveDepartments(depts: DepartmentInfo[]): void {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(depts));
  },

  addDepartment(dept: DepartmentInfo): void {
    const depts = this.getDepartments();
    if (!depts.some(d => d.code.toLowerCase() === dept.code.toLowerCase())) {
      depts.push(dept);
      this.saveDepartments(depts);
    }
  },

  // Pinned Courses
  getPinnedCourseIds(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PINNED_COURSES);
    if (!raw) return ['cse-1111', 'cse-2215'];
    try {
      return JSON.parse(raw);
    } catch {
      return ['cse-1111', 'cse-2215'];
    }
  },

  togglePinCourse(courseId: string): string[] {
    const pinned = this.getPinnedCourseIds();
    const updated = pinned.includes(courseId)
      ? pinned.filter(id => id !== courseId)
      : [...pinned, courseId];
    localStorage.setItem(STORAGE_KEYS.PINNED_COURSES, JSON.stringify(updated));
    return updated;
  },

  // Note Requests
  getNoteRequests(): NoteRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTE_REQUESTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addNoteRequest(req: NoteRequest): void {
    const list = this.getNoteRequests();
    list.unshift(req);
    localStorage.setItem(STORAGE_KEYS.NOTE_REQUESTS, JSON.stringify(list));
  },

  // Admin Auth State & Security
  isAdminLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  setAdminLoggedIn(status: boolean): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, status ? 'true' : 'false');
  },

  getAdminCredentials(): AdminCredentials {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_CREDENTIALS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return {
          email: parsed.email || 'admin@uiu.ac.bd',
          password: parsed.password || localStorage.getItem('uiu_admin_password_custom') || 'uiuadmin123',
          securityPin: parsed.securityPin || '786221',
          lastLogin: parsed.lastLogin,
          failedAttempts: Number(parsed.failedAttempts || 0),
          lockUntil: parsed.lockUntil ? Number(parsed.lockUntil) : undefined
        };
      } catch {
        // Fallback below
      }
    }
    const legacyPass = localStorage.getItem('uiu_admin_password_custom') || 'uiuadmin123';
    const initialCreds: AdminCredentials = {
      email: 'admin@uiu.ac.bd',
      password: legacyPass,
      securityPin: '786221',
      failedAttempts: 0
    };
    this.saveAdminCredentials(initialCreds);
    return initialCreds;
  },

  saveAdminCredentials(creds: AdminCredentials): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_CREDENTIALS, JSON.stringify(creds));
    localStorage.setItem('uiu_admin_password_custom', creds.password);
  },

  isBruteForceLocked(): { locked: boolean; remainingSeconds: number } {
    const creds = this.getAdminCredentials();
    if (creds.lockUntil && Date.now() < creds.lockUntil) {
      const remaining = Math.ceil((creds.lockUntil - Date.now()) / 1000);
      return { locked: true, remainingSeconds: remaining };
    }
    if (creds.lockUntil && Date.now() >= creds.lockUntil) {
      // Lock expired, reset failed attempts
      creds.failedAttempts = 0;
      creds.lockUntil = undefined;
      this.saveAdminCredentials(creds);
    }
    return { locked: false, remainingSeconds: 0 };
  },

  recordFailedAttempt(): { failedAttempts: number; isLocked: boolean; lockSeconds: number } {
    const creds = this.getAdminCredentials();
    creds.failedAttempts = (creds.failedAttempts || 0) + 1;
    if (creds.failedAttempts >= 5) {
      // Lock out for 15 minutes (900 seconds)
      const lockDurationMs = 15 * 60 * 1000;
      creds.lockUntil = Date.now() + lockDurationMs;
      this.saveAdminCredentials(creds);
      return { failedAttempts: creds.failedAttempts, isLocked: true, lockSeconds: 900 };
    }
    this.saveAdminCredentials(creds);
    return { failedAttempts: creds.failedAttempts, isLocked: false, lockSeconds: 0 };
  },

  resetFailedAttempts(): void {
    const creds = this.getAdminCredentials();
    creds.failedAttempts = 0;
    creds.lockUntil = undefined;
    creds.lastLogin = new Date().toISOString();
    this.saveAdminCredentials(creds);
  },

  getAdminPassword(): string {
    return this.getAdminCredentials().password;
  },

  setAdminPassword(newPassword: string): void {
    const creds = this.getAdminCredentials();
    creds.password = newPassword;
    this.saveAdminCredentials(creds);
  }
};
