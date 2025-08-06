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

    const updated = await db
      .update(userProfiles)
      .set({ role: "BUSINESS" }) // Assuming the role is being changed to "BUSINESS"
      .where(eq(userProfiles.userId, user.id))
      .returning();

    return Response.json(updated[0]);
  } catch (err) {
    console.error("Change role error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
