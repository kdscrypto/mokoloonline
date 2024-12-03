export interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  image_url: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  user_id: string | null;
  created_at: string;
  updated_at: string;
  category: string;
  phone: string | null;
  whatsapp: string | null;
}