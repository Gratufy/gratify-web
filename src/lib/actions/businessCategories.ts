"use server";

import { createClient } from "@/utils/supabase/server";

import { db } from "@/db";
import { businessCategories } from "@/db/schema";
import { eq } from "drizzle-orm";

const PROTECTED_CATEGORY_ID = "11111111-1111-1111-1111-111111111111";

export async function getAllBusinessCategories() {
  return db.select().from(businessCategories).orderBy(businessCategories.name);
}

export async function addBusinessCategory(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.role !== "ADMIN") throw new Error("Forbidden");

  await db.insert(businessCategories).values({ name });
}

export async function renameBusinessCategory(id: string, newName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.role !== "ADMIN") throw new Error("Forbidden");

  await db
    .update(businessCategories)
    .set({ name: newName })
    .where(eq(businessCategories.categoryId, id));
}

export async function deleteBusinessCategory(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.role !== "ADMIN") throw new Error("Forbidden");
  if (id === PROTECTED_CATEGORY_ID)
    throw new Error("Cannot delete protected category");

  await db
    .delete(businessCategories)
    .where(eq(businessCategories.categoryId, id));
}
