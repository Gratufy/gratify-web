import {
  businessCategories,
  businesses,
  businessHours,
  businessLocations,
  businessReviews,
  businessVotes,
} from "@/db/schema";

// export type Businesses = {
//   id: string;
//   ownerId: string;
//   categoryId: string;
//   name: string;
//   description: string;
//   city: string;
//   district: string | null;
//   address: string;
//   website: string | null;
//   karma: number | null;
//   reviewCount: number | null;
//   status: "pending" | "approved" | "rejected" | "hidden";
//   createdAt: Date;
//   updatedAt: Date;
// };
// Partial<...> makes all properties optional except for "id"
//export type BusinessUpdate = Partial<Omit<Businesses, "id">>;

//NEW
export type Business = typeof businesses.$inferSelect;
export type BusinessWithCategoryName = Business & {
  categoryName: string | null;
};
export type AdminBusinessRow = Business & {
  filteredReviewCount: number; // dynamic count based on selected status
};
export type NewBusiness = typeof businesses.$inferInsert;
export type BusinessUpdate = Partial<Omit<Business, "id">>;

//-------------------------------------------------------
// export type BusinessCategory = {
//   categoryId: string; // uuid
//   name: string; // уникальное название категории
//   createdAt: Date;
//   updatedAt: Date;
// };
export type BusinessCategory = typeof businessCategories.$inferSelect;
export type NewBusinessCategory = typeof businessCategories.$inferInsert;
// export type BusinessVote = {
//   id: string;
//   userId: string;
//   businessId: string;
//   vote: number; // +1 или -1
//   createdAt: Date;
//   updatedAt: Date;
// };
export type BusinessVote = typeof businessVotes.$inferSelect;
export type NewBusinessVote = typeof businessVotes.$inferInsert;
// export type BusinessLocation = {
//   id: string;
//   businessId: string;
//   latitude: number;
//   longitude: number;
// };
export type BusinessLocation = typeof businessLocations.$inferSelect;
export type NewBusinessLocation = typeof businessLocations.$inferInsert;
// export type BusinessReview = {
//   id: string;
//   businessId: string;
//   userId: string;
//   status: "pending" | "approved" | "hidden" | "rejected"; //  BUSINESS_REVIEW_STATUS_ENUM
//   text: string;
//   createdAt: Date;
//   updatedAt: Date;
// };
export type BusinessReview = typeof businessReviews.$inferSelect;
export type NewBusinessReview = typeof businessReviews.$inferInsert;
// export type BusinessHour = {
//   id: string;
//   businessId: string;
//   dayOfWeek: number; // 0 (sunday) - 6 (saturday)
//   openTime: string; // format "09:00:00"
//   closeTime: string; // format "18:00:00"
// };
export type BusinessHour = typeof businessHours.$inferSelect;
export type NewBusinessHour = typeof businessHours.$inferInsert;

export type RenameCategoryInput = {
  id: string;
  name: string;
};

export type SortBy = "newest" | "mostKarma";
export type Scope = "public" | "business_user" | "admin";
export interface GetBusinessesParams {
  city?: string;
  categoryId?: string;
  sortBy?: SortBy;
  scope?: Scope;
}
export type BusinessStatus = "pending" | "approved" | "hidden" | "rejected";

export type ScopeReview = "public" | "admin";
export type BusinessReviewStatus = "pending" | "approved" | "rejected";

export type LocationFormData = {
  city?: string | null;
  district?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type NewBusinessFormData = {
  name: string;
  description: string;
  website?: string | null;
  categoryId: string;
  isOnline: boolean;
  locations: LocationFormData[];
};
