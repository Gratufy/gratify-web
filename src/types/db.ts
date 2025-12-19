import {
  businessCategories,
  businesses,
  // businessHours,
  businessLocations,
  businessOwnSpecialOffers,
  businessReviews,
  businessSpecialOffers,
  businessVotes,
  favorites,
  specialOffers,
} from '@/db/schema';

export type Business = typeof businesses.$inferSelect;
export type NewBusinessReview = typeof businessReviews.$inferInsert;

export type BusinessCategory = typeof businessCategories.$inferSelect;
export type NewBusinessCategory = typeof businessCategories.$inferInsert;

export type BusinessLocation = typeof businessLocations.$inferSelect;
export type BusinessReview = typeof businessReviews.$inferSelect;

export type BusinessVote = typeof businessVotes.$inferSelect;
export type NewBusinessVote = typeof businessVotes.$inferInsert;

export type BusinessSpecialOffer = typeof businessSpecialOffers.$inferSelect;
export type SpecialOffer = typeof specialOffers.$inferSelect;
export type BusinessOwnSpecialOffer =
  typeof businessOwnSpecialOffers.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
