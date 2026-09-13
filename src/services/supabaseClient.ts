import { createClient, SupabaseClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://zupoqrpdcptuxatmztuy.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cG9xcnBkY3B0dXhhdG16dHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMjIwMjYsImV4cCI6MjEwNDg5ODAyNn0.OLInjM1DzcgBpN-id_BUA-OxsxvbL4vfkUKM7vztnqk';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase'));
};

let client: SupabaseClient | null = null;

try {
  if (isSupabaseConfigured()) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (err) {
  console.warn('Supabase client initialization deferred:', err);
}

export const supabase = client;

export const checkSupabaseConnection = async (): Promise<{ connected: boolean; message: string }> => {
  if (!client) {
    return { connected: false, message: 'Supabase client is not configured' };
  }
  try {
    const { error } = await client.from('courses').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return { connected: false, message: 'Connected, but tables are not yet created in Supabase. Please run the SQL setup script.' };
      }
      return { connected: false, message: error.message };
    }
    return { connected: true, message: 'Successfully connected to Supabase cloud database.' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Connection failed' };
  }
};
