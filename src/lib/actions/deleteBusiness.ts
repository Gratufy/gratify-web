'use server';

import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';

import { businesses } from '@/db/schema';

import { eq } from 'drizzle-orm';

import { isAdmin } from '@/lib/helpers/isAdmin';

// delete business
export async function deleteBusiness(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const business = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);
    if (!business.length) throw new Error('Business not found');
    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser && business[0].ownerId !== user.id) {
      throw new Error('Forbidden for non-admin or not owner');
    }
    await db.delete(businesses).where(eq(businesses.id, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting business:', error);
    throw new Error('Failed to delete business');
  }
}
