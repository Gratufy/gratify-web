'use server';

import { db } from '@/db';

import { businessCategories, businesses, businessLocations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { BusinessWithDetails } from '@/types/business';

import {
  getOwnOffersForBusinesses,
  getSpecialOffersForBusinesses,
} from '../helpers/getSpecialOffersForBusinesses';
import { getBusinessImages } from '../helpers/images/getBusinessImages';
import { slug } from 'valibot';

const businessSelectFields = {
  id: businesses.id,
  slug: businesses.slug,
  name: businesses.name,
  categoryId: businesses.categoryId,
  isOnline: businesses.isOnline,
  description: businesses.description,
  website: businesses.website,
  karma: businesses.karma,
  status: businesses.status,
  createdAt: businesses.createdAt,
  updatedAt: businesses.updatedAt,
  ownerId: businesses.ownerId,
  reviewCount: businesses.reviewCount,
  //join
  categoryName: businessCategories.name,
  city: businessLocations.city,
  address: businessLocations.address,
  latitude: businessLocations.latitude,
  longitude: businessLocations.longitude,
  //----
};
// get business by ID
export async function getBusinessById(
  id: string
): Promise<BusinessWithDetails | null> {
  try {
    // if (!uuidValidate(id)) notFound();
    const rows = await db
      .select(businessSelectFields)
      .from(businesses)
      .leftJoin(
        businessCategories,
        eq(businesses.categoryId, businessCategories.categoryId)
      )
      .leftJoin(
        businessLocations,
        eq(businesses.id, businessLocations.businessId)
      )
      .where(eq(businesses.id, id));

    if (!rows.length) return null;
    const businessData = {
      ...rows[0],
      locations: [],
      specialOffers: [],
      images: [],
      ownOffers: [],
    } as BusinessWithDetails;

    // Locations
    for (const row of rows) {
      if (row.city) {
        businessData.locations.push({
          city: row.city,
          address: row.address ?? null,
          latitude: row.latitude ?? null,
          longitude: row.longitude ?? null,
        });
      }
    }

    // Special Offers
    const offerRows = await getSpecialOffersForBusinesses([id]);

    for (const offer of offerRows) {
      businessData.specialOffers.push({
        businessId: offer.businessId,
        offerId: offer.offerId,
        title: offer.title,
      });
    }
    // own offers
    const ownOfferRows = await getOwnOffersForBusinesses([id]);
    for (const offer of ownOfferRows) {
      businessData.ownOffers.push({
        offerId: offer.offerId,
        businessId: offer.businessId,
        title: offer.title,
      });
    }
    // Images
    const imageRows = await getBusinessImages(id);

    businessData.images = imageRows;

    return businessData;
  } catch (error) {
    console.error('Error fetching business:', error);
    throw new Error('Failed to fetch business');
  }
}
