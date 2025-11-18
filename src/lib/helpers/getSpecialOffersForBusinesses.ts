'use server';

import { db } from '@/db';
import { eq, inArray } from 'drizzle-orm';
import {
  businessOwnSpecialOffers,
  businessSpecialOffers,
  specialOffers,
} from '@/db/schema';

export async function getSpecialOffersForBusinesses(ids: string[]) {
  return db
    .select({
      businessId: businessSpecialOffers.businessId,
      offerId: businessSpecialOffers.offerId,
      title: specialOffers.title,
    })
    .from(businessSpecialOffers)
    .leftJoin(
      specialOffers,
      eq(businessSpecialOffers.offerId, specialOffers.id)
    )
    .where(inArray(businessSpecialOffers.businessId, ids));
}

export async function getOwnOffersForBusinesses(ids: string[]) {
  return db
    .select({
      offerId: businessOwnSpecialOffers.id,
      businessId: businessOwnSpecialOffers.businessId,
      title: businessOwnSpecialOffers.title,
    })
    .from(businessOwnSpecialOffers)
    .where(inArray(businessOwnSpecialOffers.businessId, ids));
}
