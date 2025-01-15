export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'sold';

export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  image_url?: string;
  status: ListingStatus;
  user_id?: string;
  created_at: string;
  updated_at: string;
  category: string;
  phone?: string;
  whatsapp?: string;
  is_vip: boolean;
  vip_until?: string;
}