'use server';
import { db } from '@/db';
import { businessImages, userProfiles } from '@/db/schema';
import { ImageClientPayload, ServerImagePayload } from '@/types/images';
import { createClient } from '@/utils/supabase/server';
import { eq, inArray } from 'drizzle-orm';

export async function updateBusinessImagesOnServer(
  businessId: string,
  payload: ServerImagePayload[],
  ownerId: string
) {
  const supabase = await createClient();

  // 1. Получаем все существующие фото из базы
  const existingImages = await db
    .select()
    .from(businessImages)
    .where(eq(businessImages.businessId, businessId));

  // 2. Определяем, какие фото удалены
  const payloadUrls = payload.map((img) => img.url).filter(Boolean) as string[];
  const imagesToDelete = existingImages.filter(
    (img) => !payloadUrls.includes(img.url)
  );

  // 3. Удаляем их из Storage

  for (const img of imagesToDelete) {
    const path = extractPath(img.url);
    await supabase.storage.from('business-images').remove([path]);
  }
  // 4. Удаляем из базы
  await db.delete(businessImages).where(
    eq(businessImages.businessId, businessId)
    // можно добавить inArray(businessImages.url, imagesToDelete.map(i => i.url)) для точной фильтрации
  );

  // 5. Сохраняем все фото заново (новые + оставшиеся старые)
  for (const img of payload) {
    // не нужно file, мы уже загрузили его в Storage
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
