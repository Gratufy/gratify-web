export const queryKeys = {
  businessCategories: ["businessCategories"] as const,
  businesses: ["businesses"] as const,
  // karma
  userVote: (businessId: string, userId?: string) =>
    ["userVote", businessId, userId] as const,
  // --- Reviews ---
  businessReviews: (businessId: string) =>
    ["businessReviews", businessId] as const,
  userReview: (businessId: string, userId: string) =>
    ["userReview", businessId, userId] as const,
};
