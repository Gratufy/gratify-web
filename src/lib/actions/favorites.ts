'use server';
import { db } from '@/db';
import { businessCategories, businesses, favorites } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import type { BusinessWithCategoryName, Favorite } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { getSpecialOffersForBusinesses } from '../helpers/getSpecialOffersForBusinesses';

export async function getUserFavorites(): Promise<Favorite[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

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

export async function getUserFavoriteBusinesses(
  categoryId = '__all__'
): Promise<BusinessWithCategoryName[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

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

  // Offers
  const ids = rows.map((b) => b.id);
  const offerRows = await getSpecialOffersForBusinesses(ids);

  // Mapping
  const businessMap = new Map<string, BusinessWithCategoryName>();
  for (const row of rows) {
    businessMap.set(row.id, {
      ...row,
      specialOffers: [],
      locations: [],
    });
  }

  // add offers to businesses
  for (const offer of offerRows) {
    const business = businessMap.get(offer.businessId);
    if (business) {
      business.specialOffers.push({
        businessId: offer.businessId,
        offerId: offer.offerId,
        title: offer.title,
      });
    }
  }

  return Array.from(businessMap.values());
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
