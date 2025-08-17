export const queryKeys = {
  businessCategories: ["businessCategories"] as const,
  businesses: ["businesses"] as const,
  userVote: (businessId: string) => ["userVote", businessId] as const,
};
