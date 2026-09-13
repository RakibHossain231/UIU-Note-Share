import { Contributor, ResourceItem } from '../types';

export const INITIAL_CONTRIBUTORS: Contributor[] = [
  {
    id: 'rakib-231',
    name: 'Rakib Hossain',
    department: 'CSE',
    batch: 'Batch 231',
    avatarUrl: 'https://github.com/RakibHossain231.png',
    socialUrl: 'https://github.com/RakibHossain231',
    socialType: 'github',
    contributionsCount: 0
  }
];

// Clean state: Zero dummy or fake resources. Ready for real Google Drive and Supabase uploads!
export const INITIAL_RESOURCES: ResourceItem[] = [];
