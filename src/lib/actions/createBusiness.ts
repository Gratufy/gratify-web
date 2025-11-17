'use server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';

import {
  businesses,
  businessOwnSpecialOffers,
  businessSpecialOffers,
} from '@/db/schema';
import { eq, desc, sql, and, SQL, inArray, or } from 'drizzle-orm';
import { NewBusinessFormData } from '@/types/business';
import { isAdmin } from '@/lib/helpers/isAdmin';
import { userProfiles } from '@/db/schema';

import { saveBusinessLocations } from '@/lib/actions/businessLocation';

// create business

export async function createBusiness(values: NewBusinessFormData) {
  console.log('Creating business with values:', values);
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');
    // check profile
    let [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    if (!profile) throw new Error('Profile not found');
    //------
    // change role
    if (profile.role === 'USER') {
      const [updatedProfile] = await db
        .update(userProfiles)
        .set({ role: 'BUSINESS', lastActivity: new Date() })
        .where(eq(userProfiles.userId, user.id))
        .returning();
      profile = updatedProfile;
    }
    //-------
    // create new business
    const [newBusiness] = await db
      .insert(businesses)
      .values({
        name: values.name,
        description: values.description,
        isOnline: values.isOnline,
        website: values.website ?? null,
        categoryId: values.categoryId,
        ownerId: user.id, // insert ownerId
      })
      .returning();

    // add all locations
    await saveBusinessLocations(newBusiness.id, values.locations ?? []);

    // save Special offers
    if (values.specialOffers?.length) {
      await db.insert(businessSpecialOffers).values(
        values.specialOffers.map((offerId) => ({
          businessId: newBusiness.id,
          offerId,
        }))
      );
    }
    // OWN Special offers (новые названия)
    if (values.ownOffers?.length) {
      await db.insert(businessOwnSpecialOffers).values(
        values.ownOffers.map((title) => ({
          businessId: newBusiness.id,
          title, // ➕ сохраняем текст
        }))
      );
    }
    return {
      business: newBusiness,
      // check if we need profile??????!
      profile,
    };
  } catch (error) {
    console.error('Error creating business:', error);
    throw new Error('Failed to create business');
  }
}

// 🖼️ Загружаем изображения в Supabase Storage
// if (values.images?.length) {
//   console.log('Uploading images:', values.images.length);
//   for (const { file, isCover } of values.images) {
//     const filePath = `${newBusiness.id}/${Date.now()}_${file.name}`;
//     const { error: uploadError } = await supabase.storage
//       .from('business-images')
//       .upload(filePath, file);

//     if (uploadError) {
//       console.error('Upload error:', uploadError);
//       continue;
//     }

//     const {
//       data: { publicUrl },
//     } = supabase.storage.from('business-images').getPublicUrl(filePath);
//     console.log('Uploaded image URL:', publicUrl);
//     // добавляем URL в таблицу
//     await db.insert(businessImages).values({
//       businessId: newBusiness.id,
//       ownerId: user.id,
//       url: publicUrl,
//       isCover,
//     });
//   }
// }
