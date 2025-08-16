"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { GetBusinessesParams, Business } from "@/types/business";
import { isAdmin } from "@/lib/helpers/isAdmin";
import { userProfiles } from "@/db/schema";

// get businesses with filters
export async function getBusinesses(
  params: GetBusinessesParams
): Promise<Business[]> {
  const {
    city = "__all__",
    categoryId = "__all__",
    sortBy = "newest",
    scope = "public",
  } = params ?? {};

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
  } else if (scope === "business_user") {
    if (!user) throw new Error("Not authenticated");
    conditions.push(eq(businesses.ownerId, user.id));
  } else if (scope === "admin") {
    if (!user) throw new Error("Not authenticated");

    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser) {
      throw new Error("Forbidden for non-admin users");
    }
  }

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
export async function getBusinessById(id: string): Promise<Business | null> {
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
type NewBusinessFormData = {
  name: string;
  description: string;
  website?: string | null;
  categoryId: string;
  city: string;
  district?: string | null;
  address: string;
};
export async function createBusiness(values: NewBusinessFormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");
    // check profile
    let [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    if (!profile) throw new Error("Profile not found");
    //------
    // change role
    if (profile.role === "USER") {
      const [updatedProfile] = await db
        .update(userProfiles)
        .set({ role: "BUSINESS", lastActivity: new Date() })
        .where(eq(userProfiles.userId, user.id))
        .returning();
      profile = updatedProfile;
    }
    //-------
    // ctreate new business
    const newBusiness = await db
      .insert(businesses)
      .values({
        ...values,
        ownerId: user.id, // insert ownerId
      })
      .returning();
    return {
      business: newBusiness[0],
      profile,
    };
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
      .set({
        ...filteredValues,
        updatedAt: new Date(),
      })
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
