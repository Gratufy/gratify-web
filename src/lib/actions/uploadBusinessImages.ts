'use server';

import { db } from '@/db';
import { businessImages, userProfiles } from '@/db/schema';
import { BusinessImages } from '@/types';

import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';

export async function uploadBusinessImages(
  businessId: string,
  images: BusinessImages,
  ownerId: string
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('AUTH_REQUIRED');
    // check profile
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    if (!profile) throw new Error('PROFILE_NOT_FOUND');
    for (const img of images) {
      await db.insert(businessImages).values({
        businessId: businessId,
        ownerId,
        url: img.url,
        isCover: img.isCover,
      });
    }
  } catch (error) {
    console.error('Error uploading business images:', error);
    throw new Error('UPLOAD_FAILED');
  }
}
