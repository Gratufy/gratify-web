"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";

// get all businesses
export async function getAllBusinesses() {
  try {
    const data = await db
      .select()
      .from(businesses)
      .orderBy(businesses.createdAt);
    return data;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw new Error("Failed to fetch businesses");
  }
}

// get business by ID
export async function getBusinessById(id: string) {
  try {
    const data = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching business:", error);
    throw new Error("Failed to fetch business");
  }
}

// create business
export async function createBusiness(values: typeof businesses.$inferInsert) {
  try {
    const inserted = await db.insert(businesses).values(values).returning();
    return inserted[0];
  } catch (error) {
    console.error("Error creating business:", error);
    throw new Error("Failed to create business");
  }
}

// update business
export async function updateBusiness(
  id: string,
  values: Partial<typeof businesses.$inferInsert>
) {
  try {
    const updated = await db
      .update(businesses)
      .set(values)
      .where(eq(businesses.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    console.error("Error updating business:", error);
    throw new Error("Failed to update business");
  }
}

// delete business
export async function deleteBusiness(id: string) {
  try {
    await db.delete(businesses).where(eq(businesses.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting business:", error);
    throw new Error("Failed to delete business");
  }
}
