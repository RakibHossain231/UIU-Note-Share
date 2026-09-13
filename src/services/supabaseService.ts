import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Course, ResourceItem, Contributor, NoteRequest } from '../types';

export interface CreatorProfile {
  name: string;
  department: string;
  batch: string;
  avatarUrl: string;
  bio?: string;
  githubUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  email: string;
}

export const SupabaseService = {
  // COURSES
  async getCourses(): Promise<Course[] | null> {
    if (!supabase || !isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('trimester', { ascending: true })
        .order('code', { ascending: true });

      if (error || !data) return null;
      return data.map((row: any) => ({
        id: row.id,
        code: row.code,
        title: row.title,
        abbr: row.abbr || undefined,
        department: row.department,
        trimester: Number(row.trimester),
        color: row.color || '#FF6600',
        description: row.description || undefined,
        credit: Number(row.credit || 3)
      }));
    } catch {
      return null;
    }
  },

  async upsertCourse(course: Course): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('courses').upsert({
        id: course.id,
        code: course.code,
        title: course.title,
        abbr: course.abbr,
        department: course.department,
        trimester: course.trimester,
        color: course.color,
        description: course.description,
        credit: course.credit
      });
      return !error;
    } catch {
      return false;
    }
  },

  async bulkUpsertCourses(courses: Course[]): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured()) return false;
    try {
      const rows = courses.map(c => ({
        id: c.id,
        code: c.code,
        title: c.title,
        abbr: c.abbr,
        department: c.department,
        trimester: c.trimester,
        color: c.color,
        description: c.description,
        credit: c.credit
      }));
      const { error } = await supabase.from('courses').upsert(rows);
      return !error;
    } catch {
      return false;
    }
  },

  async deleteCourse(id: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // CONTRIBUTORS
  async getContributors(): Promise<Contributor[] | null> {
    if (!supabase || !isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('contributors')
        .select('*')
        .order('contributions_count', { ascending: false });

      if (error || !data) return null;
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        department: row.department,
        batch: row.batch || undefined,
        avatarUrl: row.avatar_url || undefined,
        socialUrl: row.social_url || undefined,
        socialType: row.social_type || 'facebook',
        contributionsCount: Number(row.contributions_count || 0)
      }));
    } catch {
      return null;
    }
  },

  async upsertContributor(contrib: Contributor): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('contributors').upsert({
        id: contrib.id,
        name: contrib.name,
        department: contrib.department,
        batch: contrib.batch,
        avatar_url: contrib.avatarUrl,
        social_url: contrib.socialUrl,
        social_type: contrib.socialType,
        contributions_count: contrib.contributionsCount || 0
      });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteContributor(id: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('contributors').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // RESOURCES
  async getResources(): Promise<ResourceItem[] | null> {
    if (!supabase || !isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*, contributor:contributors(*)')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map((row: any) => {
        let contrib: Contributor | undefined = undefined;
        if (row.contributor) {
          contrib = {
            id: row.contributor.id,
            name: row.contributor.name,
            department: row.contributor.department,
            batch: row.contributor.batch,
            avatarUrl: row.contributor.avatar_url,
            socialUrl: row.contributor.social_url,
            socialType: row.contributor.social_type,
            contributionsCount: row.contributor.contributions_count
          };
        }
        return {
          id: row.id,
          courseId: row.course_id,
          department: row.department,
          type: row.type,
          title: row.title,
          description: row.description || undefined,
          trimesterCode: row.trimester_code || undefined,
          term: row.term || undefined,
          ctNumber: row.ct_number ? Number(row.ct_number) : undefined,
          assignmentNumber: row.assignment_number ? Number(row.assignment_number) : undefined,
          storageType: row.storage_type || 'drive',
          fileUrl: row.file_url,
          hasSolution: Boolean(row.has_solution),
          solutionUrl: row.solution_url || undefined,
          fileSize: row.file_size || undefined,
          uploadDate: row.upload_date || new Date().toISOString().split('T')[0],
          contributor: contrib
        };
      });
    } catch {
      return null;
    }
  },

  async insertResource(res: ResourceItem): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('resources').upsert({
        id: res.id,
        course_id: res.courseId,
        department: res.department,
        type: res.type,
        title: res.title,
        description: res.description,
        trimester_code: res.trimesterCode,
        term: res.term,
        ct_number: res.ctNumber,
        assignment_number: res.assignmentNumber,
        storage_type: res.storageType,
        file_url: res.fileUrl,
        has_solution: res.hasSolution,
        solution_url: res.solutionUrl,
        file_size: res.fileSize,
        upload_date: res.uploadDate,
        contributor_id: res.contributor?.id || null
      });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteResource(id: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // NOTE REQUESTS
  async getNoteRequests(): Promise<NoteRequest[] | null> {
    if (!supabase || !isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('note_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map((row: any) => ({
        id: row.id,
        courseCode: row.course_code,
        courseTitle: row.course_title,
        resourceType: row.resource_type,
        requestedBy: row.requested_by,
        contactInfo: row.contact_info || undefined,
        notes: row.notes || undefined,
        status: row.status || 'pending',
        createdAt: row.created_at
      }));
    } catch {
      return null;
    }
  },

  async insertNoteRequest(req: NoteRequest): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('note_requests').insert({
        id: req.id,
        course_code: req.courseCode,
        course_title: req.courseTitle,
        resource_type: req.resourceType,
        requested_by: req.requestedBy,
        contact_info: req.contactInfo,
        notes: req.notes,
        status: req.status
      });
      return !error;
    } catch {
      return false;
    }
  },

  // CREATOR PROFILE
  async getCreatorProfile(): Promise<CreatorProfile | null> {
    if (!supabase || !isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('creator_profile')
        .select('*')
        .eq('id', 'creator')
        .maybeSingle();

      if (error || !data) return null;
      return {
        name: data.name,
        department: data.department,
        batch: data.batch,
        avatarUrl: data.avatar_url,
        bio: data.bio || undefined,
        githubUrl: data.github_url,
        linkedinUrl: data.linkedin_url,
        facebookUrl: data.facebook_url,
        email: data.email
      };
    } catch {
      return null;
    }
  },

  async updateCreatorProfile(profile: CreatorProfile): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase.from('creator_profile').upsert({
        id: 'creator',
        name: profile.name,
        department: profile.department,
        batch: profile.batch,
        avatar_url: profile.avatarUrl,
        bio: profile.bio,
        github_url: profile.githubUrl,
        linkedin_url: profile.linkedinUrl,
        facebook_url: profile.facebookUrl,
        email: profile.email,
        updated_at: new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  }
};
