export type Businesses = {
  id: string;
  ownerId: string;
  categoryId: string;
  name: string;
  description: string;
  city: string;
  district: string | null;
  address: string;
  website: string | null;
  karma: number | null;
  reviewCount: number | null;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
};
// Partial<...> makes all properties optional except for "id"
export type BusinessUpdate = Partial<Omit<Businesses, "id">>;
export type BusinessCategory = {
  categoryId: string; // uuid
  name: string; // уникальное название категории
  createdAt: Date;
  updatedAt: Date;
};

export type BusinessVote = {
  id: string;
  userId: string;
  businessId: string;
  vote: number; // +1 или -1
  createdAt: Date;
  updatedAt: Date;
};

export type BusinessLocation = {
  id: string;
  businessId: string;
  latitude: number;
  longitude: number;
};

export type BusinessReview = {
  id: string;
  businessId: string;
  userId: string;
  status: "pending" | "approved" | "hidden" | "rejected" | "deleted"; //  BUSINESS_REVIEW_STATUS_ENUM
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BusinessHour = {
  id: string;
  businessId: string;
  dayOfWeek: number; // 0 (sunday) - 6 (saturday)
  openTime: string; // format "09:00:00"
  closeTime: string; // format "18:00:00"
};

export type SortBy = "newest" | "mostKarma";
