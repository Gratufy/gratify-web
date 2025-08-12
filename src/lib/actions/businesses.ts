"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { SortBy } from "@/types/business";

interface GetBusinessesParams {
  city?: string;
  categoryId?: string;
  sortBy?: SortBy;
}

// get all businesses
// export async function getAllBusinesses() {
//   try {
//     const orderBy = desc(businesses.createdAt);
//     const data = await db.select().from(businesses).orderBy(orderBy);
//     return data;
//   } catch (error) {
//     console.error("Error fetching businesses:", error);
//     throw new Error("Failed to fetch businesses");
//   }
// }
// get businesses with filters
export async function getBusinesses(params: GetBusinessesParams = {}) {
  const { city, categoryId, sortBy = "newest" } = params;

  const filters = [];

  if (city && city !== "__all__") {
    filters.push(eq(businesses.city, city));
  }

  if (categoryId && categoryId !== "__all__")
    filters.push(eq(businesses.categoryId, categoryId));

  const whereClause = filters.length > 0 ? and(...filters) : sql`TRUE`;
  let orderBy;
  switch (sortBy) {
    case "mostKarma":
      orderBy = sql`${desc(businesses.karma)} NULLS LAST`;
      break;
    case "newest":
    default:
      orderBy = desc(businesses.createdAt);
  }

  try {
    const results = await db
      .select()
      .from(businesses)
      .where(whereClause)
      .orderBy(orderBy);

    return results;
  } catch (error) {
    console.error("Error fetching businesses with filters:", error);
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
