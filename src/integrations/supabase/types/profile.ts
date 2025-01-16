import type { Tables } from './database';

export type Profile = Tables<'profiles'>;

export type ProfileInsert = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  phone?: string | null;
  city?: string | null;
  avatar_url?: string | null;
};

export type ProfileUpdate = Partial<ProfileInsert>;