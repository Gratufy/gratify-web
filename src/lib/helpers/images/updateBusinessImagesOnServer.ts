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

  // 1. all existing images for the business from db
  const existingImages = await db
    .select()
    .from(businessImages)
    .where(eq(businessImages.businessId, businessId));

  // 2. check which images are removed in the payload
  const payloadUrls = payload.map((img) => img.url).filter(Boolean) as string[];
  const imagesToDelete = existingImages.filter(
    (img) => !payloadUrls.includes(img.url)
  );

  // 3. delete from Supabase Storage

  for (const img of imagesToDelete) {
    const path = extractPath(img.url);
    await supabase.storage.from('business-images').remove([path]);
  }
  // 4. delete from database
  await db.delete(businessImages).where(
    eq(businessImages.businessId, businessId)
    // can add inArray(businessImages.url, imagesToDelete.map(i => i.url)) for precise filtering
  );

  // 5. Save all photos again (new + remaining old) on db
  for (const img of payload) {
    // no need for file, we already uploaded it to Storage
    if (!img.url) continue; // safety check
    await db.insert(businessImages).values({
      businessId,
      ownerId,
      url: img.url,
      isCover: img.isCover,
    });
  }
}

function extractPath(fullUrl: string): string {
  const part = fullUrl.split('/business-images/')[1];
  return part; // "businessId/filename.jpg"
}
