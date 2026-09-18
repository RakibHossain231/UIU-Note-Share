export type Department = 'CSE' | 'DS' | 'EEE' | 'BBA' | 'Civil' | string;

export type ResourceType = 
  | 'handnote'
  | 'mid'
  | 'final'
  | 'ct'
  | 'assignment'
  | 'cheatsheet'
  | 'question_mid'
  | 'mid_question'
  | 'mid_solve'
  | 'question_final'
  | 'final_question'
  | 'final_solve'
  | 'ct_question'
  | 'ct_solve'
  | 'assignment_question'
  | 'assignment_solve';

export interface Contributor {
  id: string;
  name: string;
  department: Department;
  batch?: string;
  avatarUrl?: string;
  socialUrl?: string;
  socialType?: 'facebook' | 'linkedin' | 'github' | 'email';
  contributionsCount?: number;
}

export interface ResourceItem {
  id: string;
  courseId: string;
  department: Department;
  type: ResourceType;
  title: string;
  description?: string;
  trimesterCode?: string; // e.g. "231", "241", "242"
  term?: 'mid' | 'final' | 'topicwise' | 'full' | string; // For question solves or note scope (mid, final, topicwise, full)
  ctNumber?: number; // 1, 2, 3, 4
  assignmentNumber?: number; // 1, 2, 3
  storageType: 'r2' | 'drive' | 'direct_url';
  fileUrl: string; // Cloudflare R2 URL or Google Drive URL
  hasSolution?: boolean;
  solutionUrl?: string;
  fileSize?: string;
  uploadDate: string;
  contributor?: Contributor;
}

export interface Course {
  id: string; // e.g. "cse-2118"
  code: string; // e.g. "CSE 2118"
  title: string; // e.g. "Advanced Object Oriented Programming"
  abbr?: string; // e.g. "AOOP"
  department: Department;
  trimester: number; // 1 to 12
  color: string; // hex code
  description?: string;
  credit?: number;
}

export interface NoteRequest {
  id: string;
  courseCode: string;
  courseTitle: string;
  resourceType: ResourceType;
  requestedBy: string;
  contactInfo?: string;
  notes?: string;
  createdAt: string;
  status: 'pending' | 'fulfilled';
}

export interface PendingContribution {
  id: string;
  contributorName: string;
  department: string;
  batch?: string;
  profileUrl?: string;
  socialType?: 'facebook' | 'linkedin' | 'github' | 'email';
  courseId?: string;
  courseCode: string;
  courseTitle: string;
  resourceType: ResourceType;
  trimesterCode?: string;
  term?: string;
  submissionType: 'link' | 'file';
  fileUrl: string; // Link or Supabase storage URL
  storagePath?: string; // Path in bucket for auto-deletion
  fileName?: string;
  fileSize?: number;
  notes?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CloudflareR2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain: string; // e.g. https://pub-xxx.r2.dev or custom domain
}

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
  securityPin: string; // 6-digit 2FA PIN
  lastLogin?: string;
  failedAttempts: number;
  lockUntil?: number; // timestamp in ms if locked
}

