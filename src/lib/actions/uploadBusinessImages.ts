'use server';

import { db } from '@/db';
import { businessImages, userProfiles } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';

type UploadImage = {
  businessId: string;
  url: string;
  isCover: boolean;
};

export async function uploadBusinessImages(
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
        businessId: img.businessId,
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
