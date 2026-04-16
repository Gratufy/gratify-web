import { Business, BusinessReview, BusinessSpecialOffer } from './db';
import {
  AdminSort,
  BusinessReviewStatus,
  BusinessStatus,
  OnlineFilter,
  Scope,
  SortBy,
} from './enums';

//Location
//more for form update.
export type LocationFormData = {
  city?: string | null;
  // district?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};
//more for get
export type BusinessLocationDTO = {
  city: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

//OFFERS own offers for card
export type OwnOfferForCard = {
  offerId: string;
  businessId: string;
  title: string;
};
export type OfferRow = {
  offerId: string;
  businessId: string;
  title: string | null;
};
export type OwnOffersForCard = OwnOfferForCard[];
//OFFERS own offers for card
export type AllOffersRows = OfferRow[];

//Business

// +
export type BusinessWithCategoryName = Business & {
  categoryName: string | null;
  locations: BusinessLocationDTO[];
  allOffersRows: AllOffersRows;
  coverImageUrl?: string | null;
};

// for one card details- NEW!!!! +
export type BusinessWithDetails = Business & {
  categoryName: string;
  locations: BusinessLocationDTO[];
  specialOffers: AllOffersRows;
  ownOffers: OwnOffersForCard;
  images: BusinessImages;
};

//+ for form / UI
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
//FORM + for API / create/update
export type NewBusinessFormData = {
  name: string;

  description: string;
  website?: string | null;
  isOnline: boolean;
  categoryId: string;
  specialOffers: BusinessSpecialOffer['offerId'][];
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

//images
//+~
export type BusinessImage = {
  url: string;
  isCover: boolean;
};
//+
export type BusinessImages = BusinessImage[];

//Review

export type BusinessReviewWithUser = BusinessReview & {
  user: {
    name: string | null;
    avatarUrl: string | null;
  } | null;
};

// Category

export type RenameCategoryInput = {
  id: string;
  name: string;
};

//FAVORITES

export type BusinessFavorite = Business & {
  categoryName: string;
  specialOffers: (BusinessSpecialOffer & {
    title: string | null;
  })[];
};

//ADMIN
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
  status: BusinessStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
  ownerId: string;
  reviewCount: number;
  filteredReviewCount: number;
  cities: string[];
};

export interface AdminBusinessesParams {
  reviewStatus?: BusinessReviewStatus; // для фильтра по отзывам
  businessStatus?: BusinessStatus;
  categoryId?: string;
  city?: string;
  showOnlineStatus?: OnlineFilter;
  sortBy?: AdminSort;
}
///
export type LatLng = {
  lat: number;
  lng: number;
};

export type GetSimilarBusinessesParams = {
  businessId: string;
  categoryId: string;
  city?: string | null;
  isOnline: boolean;
  limit?: number;
};
