import { GetBusinessesParams, UseAdminBusinessesParams } from '@/types';
import { BusinessReviewStatus, ScopeReview } from '@/types/enums';

export const queryKeys = {
  businessCategories: ['businessCategories'] as const,

  // businesses: ["businesses"] as const,
  businessList: (filters: GetBusinessesParams) =>
    ['businesses', filters] as const,

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
  // old
  adminBusinessesByReviewStatusRoot: ['adminBusinessesByReviewStatus'] as const,
  //new
  adminBusinesses: (params: UseAdminBusinessesParams) =>
    ['adminBusinesses', params] as const,

  adminBusinessesByReviewStatus: (
    status?: BusinessReviewStatus,
    categoryId?: string | null
  ) => ['adminBusinessesByReviewStatus', { status, categoryId }] as const,

  // ...businessLocation
  businessLocation: (businessId: string) =>
    ['businessLocation', businessId] as const,

  // if i need it
  // checkAddress: (city: string, address: string) =>
  //   ["checkAddress", { city, address }] as const,
  // Special Offers
  specialOffers: ['specialOffers'] as const,
  businessSpecialOffers: (businessId: string) =>
    ['businessSpecialOffers', businessId] as const,
  // Favorites
  // favorites: (userId: string) => ['favorites', userId] as const,
  favorites: ['favorites'] as const,
  favoriteBusinesses: ['favoriteBusinesses'],
  // userFavorites: (userId: string) => ['favorites', 'user', userId] as const,
};
