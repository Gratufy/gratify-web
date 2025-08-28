"use server";

import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { businessSpecialOffers, specialOffers } from "@/db/schema";

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
