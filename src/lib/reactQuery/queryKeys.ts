import { BusinessReviewStatus, Scope, ScopeReview } from "@/types";

export const queryKeys = {
  businessCategories: ["businessCategories"] as const,
  businesses: ["businesses"] as const,

  businessList: (filters: {
    city: string;
    categoryId: string;
    sortBy: string;
    scope: Scope;
  }) => ["businesses", filters] as const,

  businessById: (id: string) => ["businesses", "byId", id] as const,
  // karma
  userVote: (businessId: string, userId?: string) =>
    ["userVote", businessId, userId] as const,
  // --- Reviews ---

  businessReviewsRoot: (businessId: string) =>
    ["businessReviews", businessId] as const,

  businessReviews: (
    businessId: string,
    scope: ScopeReview,
    status?: BusinessReviewStatus
  ) => ["businessReviews", businessId, scope, status] as const,

  userReview: (businessId: string, userId: string) =>
    ["userReview", businessId, userId] as const,

  adminBusinessesByReviewStatusRoot: ["adminBusinessesByReviewStatus"] as const,

  adminBusinessesByReviewStatus: (
    status?: BusinessReviewStatus,
    categoryId?: string | null
  ) => ["adminBusinessesByReviewStatus", { status, categoryId }] as const,

  // ...businessLocation
  businessLocation: (businessId: string) =>
    ["businessLocation", businessId] as const,

  // if i need it
  // checkAddress: (city: string, address: string) =>
  //   ["checkAddress", { city, address }] as const,
};
