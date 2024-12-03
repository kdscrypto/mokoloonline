export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'sold';

export const isValidStatus = (status: string): status is ListingStatus => {
  return ['pending', 'approved', 'rejected', 'sold'].includes(status);
};