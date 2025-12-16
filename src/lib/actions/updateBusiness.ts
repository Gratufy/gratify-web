'use server';

import { db } from '@/db';
import { eq } from 'drizzle-orm';

import { createClient } from '@/utils/supabase/server';
import {
  businesses,
  businessOwnSpecialOffers,
  businessSpecialOffers,
} from '@/db/schema';
import { BusinessStatus, NewBusinessFormData } from '@/types/business';

import { saveBusinessLocations } from '@/lib/actions/businessLocation';
import { isAdmin } from '@/lib/helpers/isAdmin';

import { getBusinessById } from './getBusinessById';
import {
  BUSINESS_STATUS_FOR_FORM,
  BUSINESS_STATUS_OWNER,
} from '@/const/business';

// update business
export async function updateBusiness(
  id: string,
  // values: Partial<NewBusinessFormData>
  values: Partial<NewBusinessFormData>,
  status: BusinessStatus
) {
  console.log('status', status);
  if (!BUSINESS_STATUS_FOR_FORM.includes(status)) {
    throw new Error(
      'After changing Owner can only set status pending or draft'
    );
  }
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const existing = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);
    if (!existing.length) throw new Error('Business not found');

    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser && existing[0].ownerId !== user.id) {
      throw new Error('Forbidden for non-admin or not owner');
    }
    const allowedFieldsForOwner: (keyof typeof businesses.$inferInsert)[] = [
      'categoryId',
      'name',
      'description',
      'website',
      'isOnline',
    ];
    //we do not it any more because of changeBusinessStatus function
    const allowedFieldsForAdmin = [...allowedFieldsForOwner, 'status'];

    const allowedFields = isAdminUser
      ? allowedFieldsForAdmin
      : allowedFieldsForOwner;
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key]) =>
        allowedFields.includes(key as keyof typeof businesses.$inferInsert)
      )
    );
    if (Object.keys(filteredValues).length === 0 && !values.locations) {
      throw new Error('No valid fields to update');
    }

    if (Object.keys(filteredValues).length > 0) {
      await db
        .update(businesses)
        .set({
          ...filteredValues,
          status: status,
          updatedAt: new Date(),
        })
        .where(eq(businesses.id, id))
        .returning();
      // updatedBusiness = updated;
    }

    // update locations: delete old and insert new
    if (values.locations) {
      await saveBusinessLocations(id, values.locations, true);
    }

    // --- update special offers ---
    if (values.specialOffers) {
      // remove old offers
      await db
        .delete(businessSpecialOffers)
        .where(eq(businessSpecialOffers.businessId, id));

      // insert new offers
      const newOffers = values.specialOffers.map((offerId) => ({
        businessId: id,
        offerId,
      }));

      if (newOffers.length > 0) {
        await db.insert(businessSpecialOffers).values(newOffers);
      }
    }

    // --- update own offers ---
    if (values.ownOffers) {
      // Удалить старые
      await db
        .delete(businessOwnSpecialOffers)
        .where(eq(businessOwnSpecialOffers.businessId, id));

      // Вставить новые
      const newOwnOffers = values.ownOffers.map((title) => ({
        businessId: id,
        title,
      }));

      if (newOwnOffers.length > 0) {
        await db.insert(businessOwnSpecialOffers).values(newOwnOffers);
      }
    }
    // return updatedBusiness;
    const fullBusiness = await getBusinessById(id);
    if (!fullBusiness) throw new Error('Failed to fetch updated business');

    return fullBusiness;
  } catch (error) {
    console.error('Error updating business:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to update business');
  }
}
