export type BusinessStatus =
  | 'pending'
  | 'approved'
  | 'hidden'
  | 'rejected'
  | 'draft';

export type SortBy = 'newest' | 'mostKarma' | 'hot';
export type Scope = 'public' | 'business_user' | 'admin';
export type OnlineFilter = 'all' | 'online' | 'offline';
export type BusinessReviewStatus = 'pending' | 'approved' | 'hidden';
export type ScopeReview = 'public' | 'admin';
export type VoteValue = -1 | 0 | 1;
export type DbVote = {
  vote: 1 | -1;
};
export type AdminSort = 'newest' | 'oldest';
