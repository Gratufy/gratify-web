'use server';

import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { favorites } from '@/db/schema';
import { eq, desc, sql, and, SQL, inArray, or } from 'drizzle-orm';
import type { Favorite } from '@/types';

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
