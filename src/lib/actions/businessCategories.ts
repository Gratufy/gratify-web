"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { businessCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/helpers/isAdmin";
import {
  BusinessCategory,
  NewBusinessCategory,
  RenameCategoryInput,
} from "@/types";

const PROTECTED_CATEGORY_ID = "11111111-1111-1111-1111-111111111111";

// async function isAdmin(userId: string) {
//   const profile = await db
//     .select()
//     .from(userProfiles)
//     .where(eq(userProfiles.userId, userId))
//     .limit(1)
//     .then((rows) => rows[0]);

//   return profile?.role === "ADMIN";
// }

export async function getAllBusinessCategories(): Promise<BusinessCategory[]> {
  return db.select().from(businessCategories).orderBy(businessCategories.name);
}

export async function addBusinessCategory(category: NewBusinessCategory) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  if (!(await isAdmin(user.id)))
    throw new Error("Forbidden for non-admin users");

  await db.insert(businessCategories).values(category);
}

export async function renameBusinessCategory({
  id,
  name,
}: RenameCategoryInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  if (!(await isAdmin(user.id)))
    throw new Error("Forbidden for non-admin users");

  await db
    .update(businessCategories)
    .set({ name, updatedAt: new Date() })
    .where(eq(businessCategories.categoryId, id));
}

export async function deleteBusinessCategory(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  if (!(await isAdmin(user.id)))
    throw new Error("Forbidden for non-admin users");
  if (id === PROTECTED_CATEGORY_ID)
    throw new Error("Cannot delete protected category");

  await db
    .delete(businessCategories)
    .where(eq(businessCategories.categoryId, id));
}
