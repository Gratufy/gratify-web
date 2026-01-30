import { AdminBusinessesParams, GetBusinessesParams } from '@/types';
import { BusinessReviewStatus, ScopeReview } from '@/types/enums';

// businesses: ["businesses"] as const,
// businessList: (filters: GetBusinessesParams) =>
//   ['businesses', filters] as const,

export const queryKeys = {
  businessCategories: ['businessCategories'] as const,

  businessList: (params: GetBusinessesParams) =>
    [
      'businesses',
      params.scope ?? 'public',
      params.city ?? '__all__',
      params.categoryId ?? '__all__',
      params.sortBy ?? 'newest',
      params.showOnlineStatus ?? 'all',
    ] as const,
  businessInfiniteList: (params: GetBusinessesParams) =>
    [
      'businesses',
      'infinite',
      params.scope ?? 'public',
      params.city ?? '__all__',
      params.categoryId ?? '__all__',
      params.sortBy ?? 'newest',
      params.showOnlineStatus ?? 'all',
    ] as const,
  businessById: (id: string) => ['businesses', 'byId', id] as const,

  // karma
  userVote: (businessId: string, userId?: string) =>
    ['userVote', businessId, userId] as const,
  // --- Reviews ---

  businessReviewsRoot: (businessId: string) =>
    ['businessReviews', businessId] as const,

  businessReviews: (
    businessId: string,
    scope: ScopeReview,
    status?: BusinessReviewStatus
  ) => ['businessReviews', businessId, scope, status] as const,

  //old?
  userReview: (businessId: string, userId: string) =>
    ['userReview', businessId, userId] as const,

  //new
  // adminBusinesses: (params: AdminBusinessesParams) =>
  //   ['adminBusinesses', params] as const,
  adminBusinesses: (params: AdminBusinessesParams) =>
    [
      'adminBusinesses',
      params.reviewStatus ?? null,
      params.businessStatus ?? null,
      params.categoryId ?? '__all__',
      params.city ?? '__all__',
      params.showOnlineStatus ?? 'all',
      params.sortBy ?? 'newest',
    ] as const,

  // ...businessLocation
  businessLocation: (businessId: string) =>
    ['businessLocation', businessId] as const,

  // Special Offers
  specialOffers: ['specialOffers'] as const,
  businessSpecialOffers: (businessId: string) =>
    ['businessSpecialOffers', businessId] as const,
  // Favorites

  favorites: ['favorites'] as const,
  favoriteBusinesses: ['favoriteBusinesses'],
};
