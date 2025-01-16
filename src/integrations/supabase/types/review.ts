import type { Tables } from './database';

export type Review = Tables<'reviews'>;

export type ReviewInsert = {
  seller_id: string;
  reviewer_id: string;
  listing_id?: string | null;
  rating: number;
  comment?: string | null;
};

export type ReviewUpdate = Partial<ReviewInsert>;