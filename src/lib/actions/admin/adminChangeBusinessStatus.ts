'use server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { businesses } from '@/db/schema';
import { BusinessStatus } from '@/types/business';
import { eq } from 'drizzle-orm';

import { isAdmin } from '@/lib/helpers/isAdmin';

export async function adminChangeBusinessStatus(
  id: string,
  status: BusinessStatus
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser) {
      throw new Error('Forbidden: Only admins can change business status');
    }
    const existing = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);
    if (!existing.length) throw new Error('Business not found');
    await db
      .update(businesses)
      .set({ status, updatedAt: new Date() })
      .where(eq(businesses.id, id));
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
