"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { SortBy } from "@/types/business";
import { isAdmin } from "@/lib/helpers/isAdmin";

type Scope = "public" | "user" | "admin";
interface GetBusinessesParams {
  city?: string;
  categoryId?: string;
  sortBy?: SortBy;
  scope?: Scope;
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
// export async function getAllBusinesses(params: GetBusinessesParams = {}) {
//   const { city, categoryId, sortBy = "newest" } = params;

//   const filters = [];

//   if (city && city !== "__all__") {
//     filters.push(eq(businesses.city, city));
//   }

//   if (categoryId && categoryId !== "__all__")
//     filters.push(eq(businesses.categoryId, categoryId));

//   const whereClause = filters.length > 0 ? and(...filters) : sql`TRUE`;
//   let orderBy;
//   switch (sortBy) {
//     case "mostKarma":
//       orderBy = sql`${desc(businesses.karma)} NULLS LAST`;
//       break;
//     case "newest":
//     default:
//       orderBy = desc(businesses.createdAt);
//   }

//   try {
//     const results = await db
//       .select()
//       .from(businesses)
//       .where(whereClause)
//       .orderBy(orderBy);

//     return results;
//   } catch (error) {
//     console.error("Error fetching businesses with filters:", error);
//     throw new Error("Failed to fetch businesses");
//   }
// }
// get businesses with filters
export async function getBusinesses(params: GetBusinessesParams) {
  console.log("🔍 RAW CALL", params);
  const {
    city = "__all__",
    categoryId = "__all__",
    sortBy = "newest",
    scope = "public",
  } = params ?? {};
  console.log("📌 Final parsed params", { city, categoryId, sortBy, scope });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const conditions = [];

  if (city && city !== "__all__") {
    conditions.push(eq(businesses.city, city));
  }

  if (categoryId && categoryId !== "__all__")
    conditions.push(eq(businesses.categoryId, categoryId));

  if (scope === "public") {
    conditions.push(eq(businesses.status, "approved"));
  } else if (scope === "user") {
    if (!user) throw new Error("Not authenticated");
    conditions.push(eq(businesses.ownerId, user.id));
  } else if (scope === "admin") {
    if (!user) throw new Error("Not authenticated");
    if (!(await isAdmin(user.id))) {
      throw new Error("Forbidden for non-admin users");
    }
  }
  console.log("scope:", scope, "user:", user?.id);
  const whereClause = conditions.length > 0 ? and(...conditions) : sql`TRUE`;
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const business = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);
    if (!business.length) throw new Error("Business not found");
    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser && business[0].ownerId !== user.id) {
      throw new Error("Forbidden for non-admin or not owner");
    }
    const allowedFieldsForOwner: (keyof typeof businesses.$inferInsert)[] = [
      "categoryId",
      "name",
      "description",
      "city",
      "district",
      "address",
      "website",
    ];
    const allowedFieldsForAdmin = [...allowedFieldsForOwner, "status"];
    const allowedFields = isAdminUser
      ? allowedFieldsForAdmin
      : allowedFieldsForOwner;
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key]) =>
        allowedFields.includes(key as keyof typeof businesses.$inferInsert)
      )
    );
    if (Object.keys(filteredValues).length === 0) {
      throw new Error("No valid fields to update");
    }
    const updated = await db
      .update(businesses)
      .set(filteredValues)
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const business = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);
    if (!business.length) throw new Error("Business not found");
    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser && business[0].ownerId !== user.id) {
      throw new Error("Forbidden for non-admin or not owner");
    }
    await db.delete(businesses).where(eq(businesses.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting business:", error);
    throw new Error("Failed to delete business");
  }
}
