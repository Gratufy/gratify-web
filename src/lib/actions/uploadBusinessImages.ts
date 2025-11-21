'use server';

import { db } from '@/db';
import { businessImages, userProfiles } from '@/db/schema';
import { ServerImagePayload, UploadImage } from '@/types/images';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';

export async function uploadBusinessImages(
  businessId: string,
  images: UploadImage[],
  ownerId: string
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    // check profile
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    if (!profile) throw new Error('Profile not found');
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
    throw new Error('Failed to upload business images');
  }
}
