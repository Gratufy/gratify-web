import {
  businessCategories,
  businesses,
  businessHours,
  businessLocations,
  businessReviews,
  businessSpecialOffers,
  businessVotes,
  specialOffers,
} from "@/db/schema";

//Business
export type Business = typeof businesses.$inferSelect;

export type BusinessWithCategoryName = Business & {
  categoryName: string | null;
  locations: {
    city: string;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }[];
  specialOffers: (BusinessSpecialOffer & {
    title: string | null;
  })[];
};
// export type AdminBusinessRow = Business & {
//   filteredReviewCount: number; // dynamic count based on selected status
// };
export type AdminBusinessRow = {
  id: string;
  name: string;
  isOnline: boolean | null;
  categoryId: string;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  ownerId: string;
  reviewCount: number;
  filteredReviewCount: number;
};
export type NewBusiness = typeof businesses.$inferInsert;
// export type BusinessUpdate = Partial<Omit<Business, "id">>;
export type BusinessUpdate = Partial<
  Omit<
    Business,
    "id" | "karma" | "reviewCount" | "createdAt" | "updatedAt" | "ownerId"
  >
> & {
  locations?: LocationFormData[];
  specialOffers?: string[];
};

export interface GetBusinessesParams {
  city?: string;
  categoryId?: string;
  sortBy?: SortBy;
  scope?: Scope;
  showOnlineStatus?: OnlineFilter;
}

export type GetBusinessesWithPagination = GetBusinessesParams & {
  limit?: number;
  offset?: number;
};
export type BusinessesResponse = {
  businesses: BusinessWithCategoryName[];
  total: number;
};

//FORM
export type NewBusinessFormData = {
  name: string;
  description: string;
  website?: string | null;
  categoryId: string;
  isOnline: boolean;
  locations: LocationFormData[];
  specialOffers: NewBusinessSpecialOffer["offerId"][];
};

//Sort
export type SortBy = "newest" | "mostKarma";
export type Scope = "public" | "business_user" | "admin";
export type OnlineFilter = "all" | "online" | "offline";
export type BusinessStatus = "pending" | "approved" | "hidden" | "rejected";

//Review
export type BusinessReview = typeof businessReviews.$inferSelect;
export type NewBusinessReview = typeof businessReviews.$inferInsert;
export type BusinessReviewStatus = "pending" | "approved" | "rejected";
export type ScopeReview = "public" | "admin";

// Category
export type BusinessCategory = typeof businessCategories.$inferSelect;
export type NewBusinessCategory = typeof businessCategories.$inferInsert;
export type RenameCategoryInput = {
  id: string;
  name: string;
};

//Vote
export type BusinessVote = typeof businessVotes.$inferSelect;
export type NewBusinessVote = typeof businessVotes.$inferInsert;

//Location
export type BusinessLocation = typeof businessLocations.$inferSelect;
export type NewBusinessLocation = typeof businessLocations.$inferInsert;
export type LocationFormData = {
  city?: string | null;
  district?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

//Business Hours
export type BusinessHour = typeof businessHours.$inferSelect;
export type NewBusinessHour = typeof businessHours.$inferInsert;

//OFFERS
export type SpecialOffer = typeof specialOffers.$inferSelect;
export type NewSpecialOffer = typeof specialOffers.$inferInsert;

export type BusinessSpecialOffer = typeof businessSpecialOffers.$inferSelect;
export type NewBusinessSpecialOffer = typeof businessSpecialOffers.$inferInsert;
