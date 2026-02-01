'use server';
import { db } from '@/db';
import { businessImages } from '@/db/schema';
import { ServerImagePayload } from '@/types/images';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';

export async function updateBusinessImagesOnServer(
  businessId: string,
  payload: ServerImagePayload[],
  ownerId: string
) {
  const supabase = await createClient();
  // 0. auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('AUTH_REQUIRED');
  }
  // 1. all existing images for the business from db
  let existingImages;
  try {
    existingImages = await db
      .select()
      .from(businessImages)
      .where(eq(businessImages.businessId, businessId));
  } catch {
    throw new Error('DB_READ_FAILED');
  }

  // 2. check which images are removed in the payload
  const payloadUrls = payload.map((img) => img.url).filter(Boolean) as string[];
  const imagesToDelete = existingImages.filter(
    (img) => !payloadUrls.includes(img.url)
  );

  // 3. delete from Supabase Storage

  for (const img of imagesToDelete) {
    const path = extractPath(img.url);
    const { error } = await supabase.storage
      .from('business-images')
      .remove([path]);
    if (error) {
      console.error('Storage delete failed:', error);
      throw new Error('STORAGE_DELETE_FAILED');
    }
  }
  // 4. delete from database
  try {
    await db
      .delete(businessImages)
      .where(eq(businessImages.businessId, businessId));
  } catch (error) {
    console.error('DB delete failed:', error);
    throw new Error('DB_DELETE_FAILED');
  }

  // 5. Save all photos again (new + remaining old) on db
  try { for (const img of payload) {
    if (!img.url) continue;

    await db.insert(businessImages).values({
      businessId,
      ownerId,
      url: img.url,
      isCover: img.isCover,
    });
  }
  } catch (error) {
    console.error('DB insert failed:', error);
    throw new Error('DB_INSERT_FAILED');
  }
 
}

function extractPath(fullUrl: string): string {
  const part = fullUrl.split('/business-images/')[1];
  return part; // "businessId/filename.jpg"
}
