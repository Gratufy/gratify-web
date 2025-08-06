import { createClient } from "@/utils/supabase/server";

import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return new Response("Unauthorized", { status: 401 });

    //check if profile already exists

    const [existing] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    // if not, create a new profile
    if (!existing) {
      const [created] = await db
        .insert(userProfiles)
        .values({
          userId: user.id,
          email: user.email!,
        })
        .returning();

      return Response.json(created);
    }
    //if profile exists, update last activity
    const [updated] = await db
      .update(userProfiles)
      .set({ lastActivity: new Date() })
      .where(eq(userProfiles.userId, user.id))
      .returning();

    return Response.json(updated);
  } catch (err) {
    console.error("Delete account error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
