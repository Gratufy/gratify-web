'use server';

import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';

import { businesses } from '@/db/schema';
import { BusinessStatus } from '@/types/business';

import { isAdmin } from '@/lib/helpers/isAdmin';
import {
  BUSINESS_STATUS,
  BUSINESS_STATUS_ALL,
  BUSINESS_STATUS_OWNER,
  OWNER_ALLOWED_TRANSITIONS,
} from '@/const/business';

export async function changeBusinessStatus(
  id: string,
  nextStatus: BusinessStatus
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const supabase = await createClient();
    // get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    //check if business exists and get ownerId
    const [business] = await db
      .select({ ownerId: businesses.ownerId, status: businesses.status })
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);

    if (!business) throw new Error('Business not found');
    const currentStatus = business.status;

    // check if user is admin or owner
    const isAdminUser = await isAdmin(user.id);
    const isOwner = business.ownerId === user.id;
    if (!isAdminUser && !isOwner) {
      throw new Error('Forbidden: Only admins can change business status');
    }

    // Admin can change to any status
    if (isAdminUser) {
      if (!BUSINESS_STATUS_ALL.includes(nextStatus)) {
        return { success: false, error: 'Invalid status' };
      }
      await db
        .update(businesses)
        .set({ status: nextStatus, updatedAt: new Date() })
        .where(eq(businesses.id, id));
      return { success: true };
    }

    // Owner can change only to 'approved' or 'draft'
    if (isOwner) {
      const allowedNext = OWNER_ALLOWED_TRANSITIONS[currentStatus] ?? [];
      if (!allowedNext.includes(nextStatus)) {
        return {
          success: false,
          error: `Owner cannot change status from ${currentStatus} to ${nextStatus}`,
        };
      }

      await db
        .update(businesses)
        .set({ status: nextStatus, updatedAt: new Date() })
        .where(eq(businesses.id, id));
      return { success: true };
    }
    return { success: false, error: 'Forbidden' };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
