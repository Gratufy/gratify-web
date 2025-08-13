import { db } from "@/db";
import { eq } from "drizzle-orm";
import { userProfiles } from "@/db/schema";

export async function isAdmin(userId: string) {
  const profile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1)
    .then((rows) => rows[0]);

  return profile?.role === "ADMIN";
}
