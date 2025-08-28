"use server";
import { db } from "@/db";
import { specialOffers } from "@/db/schema";
import { SpecialOffer } from "@/types";

export async function getAllSpecialOffers(): Promise<SpecialOffer[]> {
  try {
    const offers = await db
      .select()
      .from(specialOffers)
      .orderBy(specialOffers.createdAt);
    return offers;
  } catch (error) {
    console.error("Failed to fetch special offers:", error);
    throw new Error("Failed to fetch special offers");
  }
}
