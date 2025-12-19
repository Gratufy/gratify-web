// I DO NOT USE IT
import { AllOffersRows } from './business';

export interface WithCategoryName {
  categoryName: string | null;
}

export interface WithLocations {
  locations: {
    city: string;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }[];
}

export interface WithImages {
  images: {
    url: string;
    isCover: boolean;
  }[];
}

export interface WithAllOffersRows {
  allOffersRows: AllOffersRows;
}
