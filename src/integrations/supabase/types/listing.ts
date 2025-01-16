import type { Tables } from './database';

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'sold';

export type Listing = Tables<'listings'>;

export type ListingInsert = {
  title: string;
  description?: string | null;
  price: number;
  location: string;
  image_url?: string | null;
  status?: ListingStatus;
  user_id?: string | null;
  category: string;
  phone?: string | null;
  whatsapp?: string | null;
  is_vip?: boolean;
  vip_until?: string | null;
};

export type ListingUpdate = Partial<ListingInsert>;