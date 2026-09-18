import { supabase, isSupabaseConfigured } from './supabaseClient';
import { StorageService } from './storageService';
import { Course, ResourceItem, Contributor, NoteRequest, PendingContribution } from '../types';

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
  },

  // VISITOR TRACKING (Cloud-Synced in Supabase)
  async getVisitorCount(): Promise<number> {
    const local = StorageService.getVisitorCount();
    if (!supabase || !isSupabaseConfigured()) return local;

    try {
      // 1. Check creator_profile table (guaranteed active cloud storage)
      const { data: profileData, error: profileErr } = await supabase
        .from('creator_profile')
        .select('bio')
        .eq('id', 'site_stats')
        .maybeSingle();

      if (!profileErr && profileData?.bio) {
        const parsed = parseInt(profileData.bio, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          StorageService.setVisitorCount(parsed);
          return parsed;
        }
      }

      // 2. Try dedicated site_stats table if created
      const { data, error } = await supabase
        .from('site_stats')
        .select('value')
        .eq('key', 'total_visitors')
        .maybeSingle();

      if (!error && data && !isNaN(Number(data.value)) && Number(data.value) >= 0) {
        const count = Number(data.value);
        StorageService.setVisitorCount(count);
        return count;
      }

      return local;
    } catch {
      return local;
    }
  },

  async recordVisitor(): Promise<number> {
    try {
      // Fetch latest live count from Supabase
      const currentCount = await this.getVisitorCount();
      const nextCount = currentCount + 1;

      // Update local storage immediately
      StorageService.setVisitorCount(nextCount);

      if (supabase && isSupabaseConfigured()) {
        // 1. Cloud save to creator_profile table (id = 'site_stats')
        await supabase
          .from('creator_profile')
          .upsert({
            id: 'site_stats',
            name: 'Site Stats',
            department: 'System',
            batch: 'v1',
            bio: nextCount.toString(),
            updated_at: new Date().toISOString()
          });

        // 2. Also try site_stats table if created
        try {
          await supabase
            .from('site_stats')
            .upsert({
              key: 'total_visitors',
              value: nextCount,
              updated_at: new Date().toISOString()
            });
        } catch {}
      }

      return nextCount;
    } catch (err) {
      console.warn('Visitor record error:', err);
      return StorageService.incrementVisitorCount();
    }
  },

  // COURSE ACCESS ANALYTICS (Cloud-Synced)
  async getCourseViews(): Promise<Record<string, number>> {
    const local = StorageService.getCourseViews();
    if (!supabase || !isSupabaseConfigured()) return local;

    try {
      const { data, error } = await supabase
        .from('creator_profile')
        .select('bio')
        .eq('id', 'course_stats')
        .maybeSingle();

      if (!error && data?.bio) {
        try {
          const parsed = JSON.parse(data.bio);
          if (parsed && typeof parsed === 'object') {
            StorageService.setCourseViews(parsed);
            return parsed;
          }
        } catch {}
      }

      return local;
    } catch {
      return local;
    }
  },

  async recordCourseView(courseId: string): Promise<Record<string, number>> {
    try {
      const views = await this.getCourseViews();
      views[courseId] = (views[courseId] || 0) + 1;
      StorageService.setCourseViews(views);

      if (supabase && isSupabaseConfigured()) {
        await supabase
          .from('creator_profile')
          .upsert({
            id: 'course_stats',
            name: 'Course Stats',
            department: 'System',
            batch: 'v1',
            bio: JSON.stringify(views),
            updated_at: new Date().toISOString()
          });
      }

      return views;
    } catch (err) {
      console.warn('Course view record error:', err);
      return StorageService.incrementCourseView(courseId);
    }
  },

  // PENDING CONTRIBUTIONS (Cloud Sync & File Management)
  async getPendingContributions(): Promise<PendingContribution[]> {
    const local = StorageService.getPendingContributions();
    if (!supabase || !isSupabaseConfigured()) return local;

    try {
      const { data, error } = await supabase
        .from('creator_profile')
        .select('bio')
        .eq('id', 'pending_contributions')
        .maybeSingle();

      if (!error && data?.bio) {
        try {
          const parsed = JSON.parse(data.bio);
          if (Array.isArray(parsed)) {
            StorageService.savePendingContributions(parsed);
            return parsed;
          }
        } catch {}
      }

      return local;
    } catch {
      return local;
    }
  },

  async submitPendingContribution(contribution: PendingContribution): Promise<boolean> {
    try {
      StorageService.addPendingContribution(contribution);
      const all = StorageService.getPendingContributions();

      if (supabase && isSupabaseConfigured()) {
        await supabase
          .from('creator_profile')
          .upsert({
            id: 'pending_contributions',
            name: 'Pending Contributions',
            department: 'System',
            batch: 'v1',
            bio: JSON.stringify(all),
            updated_at: new Date().toISOString()
          });
      }

      return true;
    } catch (err) {
      console.error('Submit contribution error:', err);
      return false;
    }
  },

  async deletePendingContribution(id: string, storagePath?: string): Promise<boolean> {
    try {
      // 1. If there's an attached file in Supabase storage, delete it immediately to free up quota!
      if (storagePath) {
        await this.deleteStorageFile(storagePath);
      }

      // 2. Remove from local storage
      StorageService.removePendingContribution(id);
      const remaining = StorageService.getPendingContributions();

      // 3. Sync to Supabase cloud
      if (supabase && isSupabaseConfigured()) {
        await supabase
          .from('creator_profile')
          .upsert({
            id: 'pending_contributions',
            name: 'Pending Contributions',
            department: 'System',
            batch: 'v1',
            bio: JSON.stringify(remaining),
            updated_at: new Date().toISOString()
          });
      }

      return true;
    } catch (err) {
      console.error('Delete contribution error:', err);
      return false;
    }
  },

  // Direct File Upload to Supabase Storage Bucket
  async uploadContributionFile(file: File): Promise<{ publicUrl: string; storagePath: string } | null> {
    if (!supabase || !isSupabaseConfigured()) {
      // Fallback: create an object URL for local testing
      const objectUrl = URL.createObjectURL(file);
      return { publicUrl: objectUrl, storagePath: '' };
    }

    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniquePath = `${Date.now()}_${cleanName}`;

      // Try 'contributions' bucket first
      let bucket = 'contributions';
      let { error: uploadErr } = await supabase.storage.from(bucket).upload(uniquePath, file, {
        cacheControl: '3600',
        upsert: true
      });

      // If 'contributions' bucket not found, fallback to 'notes' or try creating
      if (uploadErr) {
        console.warn(`Bucket '${bucket}' upload failed (${uploadErr.message}), trying 'notes'...`);
        bucket = 'notes';
        const notesRes = await supabase.storage.from(bucket).upload(uniquePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        if (notesRes.error) {
          console.error('Supabase storage upload failed:', notesRes.error);
          return null;
        }
      }

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(uniquePath);
      return {
        publicUrl,
        storagePath: `${bucket}/${uniquePath}`
      };
    } catch (err) {
      console.error('Error uploading file to storage:', err);
      return null;
    }
  },

  // Delete file from Supabase Storage (Keeps 1GB Quota 100% Free!)
  async deleteStorageFile(storagePath: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured() || !storagePath) return false;

    try {
      const parts = storagePath.split('/');
      const bucket = parts[0] || 'contributions';
      const fileName = parts.slice(1).join('/');

      if (!fileName) return false;

      const { error } = await supabase.storage.from(bucket).remove([fileName]);
      if (error) {
        console.warn(`Could not delete storage file ${fileName} from ${bucket}:`, error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Error deleting storage file:', err);
      return false;
    }
  }
};
