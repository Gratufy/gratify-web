export type BusinessStatus =
  | 'pending'
  | 'approved'
  | 'hidden'
  | 'rejected'
  | 'draft';

export type SortBy = 'newest' | 'mostKarma' | 'hot';
export type Scope = 'public' | 'business_user' | 'admin';
export type OnlineFilter = 'all' | 'online' | 'offline';
export type BusinessReviewStatus = 'pending' | 'approved' | 'rejected';
export type ScopeReview = 'public' | 'admin';

export type AdminSort = 'newest' | 'oldest';
