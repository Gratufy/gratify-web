'use server';
import { db } from '@/db';
import { businessCategories, businesses, favorites } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import type { BusinessWithCategoryName, Favorite } from '@/types';
import { createClient } from '@/utils/supabase/server';
import {
  getOwnOffersForBusinesses,
  getSpecialOffersForBusinesses,
} from '../helpers/getSpecialOffersForBusinesses';
import { getCoverImagesForBusinesses } from '../helpers/getCoverImagesForBusinesses';

//for provider of user favorites. Simplz arraz of favorite business IDs
export async function getUserFavorites(): Promise<Favorite[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if (!user) throw new Error('Not authenticated');
  if (!user) {
    return []; // или null
  }

  try {
    const userFavorites = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, user.id));

    return userFavorites;
  } catch (err) {
    console.error('Failed to fetch favorites', err);
    throw new Error('Failed to fetch favorites');
  }
}

// for fetching favorite businesses on page favorites with all details
export async function getUserFavoriteBusinesses(
  categoryId = '__all__'
): Promise<BusinessWithCategoryName[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if (!user) throw new Error('Not authenticated');
  if (!user) {
    return []; // или null
  }

  //
  const conditions = [eq(favorites.userId, user.id)];
  if (categoryId !== '__all__') {
    conditions.push(eq(businesses.categoryId, categoryId));
  }
  //
  const rows = await db
    .select({
      id: businesses.id,
      ownerId: businesses.ownerId,
      categoryId: businesses.categoryId,
      name: businesses.name,
      description: businesses.description,
      website: businesses.website,
      isOnline: businesses.isOnline,
      karma: businesses.karma,
      reviewCount: businesses.reviewCount,
      status: businesses.status,
      createdAt: businesses.createdAt,
      updatedAt: businesses.updatedAt,
      categoryName: businessCategories.name,
    })
    .from(favorites)
    .innerJoin(businesses, eq(favorites.businessId, businesses.id))
    .leftJoin(
      businessCategories,
      eq(businesses.categoryId, businessCategories.categoryId)
    )
    .where(and(...conditions));

  if (rows.length === 0) return [];

  // Mapping
  const businessMap = new Map<string, BusinessWithCategoryName>();
  for (const row of rows) {
    businessMap.set(row.id, {
      ...row,
      allOffersRows: [],
      locations: [],
    });
  }
  // Offers
  const ids = rows.map((b) => b.id);
  const offerRows = await getSpecialOffersForBusinesses(ids);
  const ownOfferRows = await getOwnOffersForBusinesses(ids);
  const allOffersRows = [...ownOfferRows, ...offerRows];

  // add offers to businesses
  for (const offer of allOffersRows) {
    const business = businessMap.get(offer.businessId);

    if (business) {
      if (business.allOffersRows.length < 3) {
        // limit to 3 offers for card shot
        business.allOffersRows.push({
          businessId: offer.businessId,
          offerId: offer.offerId,
          title: offer.title,
        });
      }
    }
  }

  const coverRows = await getCoverImagesForBusinesses(ids);
  for (const row of coverRows) {
    const business = businessMap.get(row.businessId);
    if (business) {
      // добавляем одно поле coverImage
      (business as BusinessWithCategoryName).coverImageUrl = row.url;
    }
  }

  const results = Array.from(businessMap.values());
  // console.log('Favorite businesses fetched:', results);
  return results;
}

// add favorite
export async function addUserFavorite(businessId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  try {
    const inserted = await db.insert(favorites).values({
      userId: user.id,
      businessId,
    });
    return inserted[0];
  } catch (err) {
    console.error('Failed to add favorite', err);
    throw new Error('Failed to add favorite');
  }
}

// delete favorite
export async function removeUserFavorite(businessId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  try {
    await db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, user.id), eq(favorites.businessId, businessId))
      );
    return { success: true };
  } catch (err) {
    console.error('Failed to remove favorite', err);
    throw new Error('Failed to remove favorite');
  }
}
