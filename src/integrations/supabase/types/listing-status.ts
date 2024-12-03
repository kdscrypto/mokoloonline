export type ListingStatus = 'pending' | 'approved' | 'rejected';

export const isValidStatus = (status: string): status is ListingStatus => {
  return ['pending', 'approved', 'rejected'].includes(status);
};