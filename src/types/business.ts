import { BUSINESS_STATUS } from '@/const/business';
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

//Business
export type Business = typeof businesses.$inferSelect;

// +
export type BusinessWithCategoryName = Business & {
  categoryName: string | null;
  locations: {
    city: string;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }[];

  allOffersRows: allOffersRows;
  coverImageUrl?: string | null;
};
// export type AdminBusinessRow = Business & {
//   filteredReviewCount: number; // dynamic count based on selected status
// };

// for one card details- NEW!!!! +
export type BusinessWithDetails = Business & {
  categoryName: string;
  locations: {
    city: string;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }[];
  specialOffers: (BusinessSpecialOffer & {
    title: string | null;
  })[];
  ownOffers: ownOffersForCard;
  images: BusinessImages;
};

//export type NewBusiness = typeof businesses.$inferInsert;

//+
export type BusinessFormValues = {
  name: string;
  description: string;
  website?: string | null;
  isOnline: boolean;
  category: string;
  specialOffers: string[];
  locations: LocationFormData[];
  ownOffers: string[];
};
//FORM +
export type NewBusinessFormData = {
  name: string;
  description: string;
  website?: string | null;
  categoryId: string;
  isOnline: boolean;
  specialOffers: NewBusinessSpecialOffer['offerId'][];
  //ownOffers?: BusinessOwnSpecialOffer['title'][];
  locations: LocationFormData[];
  ownOffers?: string[];
};
//+
export type BusinessUpdate = Partial<
  Omit<
    Business,
    'id' | 'karma' | 'reviewCount' | 'createdAt' | 'updatedAt' | 'ownerId'
  >
> & {
  locations?: LocationFormData[];
  specialOffers?: string[];
  ownOffers?: string[];
};
//+~
export interface GetBusinessesParams {
  city?: string;
  categoryId?: string;
  sortBy?: SortBy;
  scope?: Scope;
  showOnlineStatus?: OnlineFilter;
  search?: string;
}
//+
export type GetBusinessesWithPagination = GetBusinessesParams & {
  limit?: number;
  offset?: number;
};

// export type BusinessesResponse = {
//   businesses: BusinessWithCategoryName[];
//   total: number;
// };

//images
//+~
export type BusinessImage = {
  url: string;
  isCover: boolean;
};
//+
export type BusinessImages = BusinessImage[];
//Sort
export type SortBy = 'newest' | 'mostKarma' | 'hot';
export type Scope = 'public' | 'business_user' | 'admin';
export type OnlineFilter = 'all' | 'online' | 'offline';
export type BusinessStatus = 'pending' | 'approved' | 'hidden' | 'rejected';
//export type BusinessStatus = (typeof BUSINESS_STATUS)[number];

//Review
export type BusinessReview = typeof businessReviews.$inferSelect;
export type NewBusinessReview = typeof businessReviews.$inferInsert;
export type BusinessReviewStatus = 'pending' | 'approved' | 'rejected';
export type ScopeReview = 'public' | 'admin';
export type BusinessReviewWithUser = BusinessReview & {
  user: {
    name: string | null;
    avatarUrl: string | null;
  } | null;
};

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

// //Business Hours
// export type BusinessHour = typeof businessHours.$inferSelect;
// export type NewBusinessHour = typeof businessHours.$inferInsert;

//OFFERS
export type SpecialOffer = typeof specialOffers.$inferSelect;
export type NewSpecialOffer = typeof specialOffers.$inferInsert;

export type BusinessSpecialOffer = typeof businessSpecialOffers.$inferSelect;
export type NewBusinessSpecialOffer = typeof businessSpecialOffers.$inferInsert;

//own offers
export type BusinessOwnSpecialOffer =
  typeof businessOwnSpecialOffers.$inferSelect;
export type ownOfferForCard = {
  offerId: string;
  businessId: string;
  title: string;
};
export type ownOffersForCard = ownOfferForCard[];
export type allOffersRows = {
  offerId: string;
  businessId: string;
  title: string | null;
}[];
//FAVORITES
export type Favorite = typeof favorites.$inferSelect;
export type BusinessFavorite = Business & {
  categoryName: string;
  specialOffers: (BusinessSpecialOffer & {
    title: string | null;
  })[];
};

//////////////
//old one
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

//new one
export type AdminBusinessRowType = {
  id: string;
  name: string;
  isOnline: boolean | null;
  categoryId: string;
  categoryName: string | null;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  ownerId: string;
  reviewCount: number;
  filteredReviewCount: number;
};

export interface UseAdminBusinessesParams {
  reviewStatus?: BusinessReviewStatus; // для фильтра по отзывам
  businessStatus?: BusinessStatus;
  categoryId?: string;
  city?: string;
  showOnlineStatus?: OnlineFilter;
  sortBy?: 'newest' | 'oldest';
}
