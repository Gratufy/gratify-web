export const queryKeys = {
  businessCategories: ["businessCategories"] as const,
  businesses: ["businesses"] as const,
  userVote: (businessId: string, userId?: string) =>
    ["userVote", businessId, userId] as const,
  // vote: (businessId: string) => ["vote", businessId,] as const,
};
