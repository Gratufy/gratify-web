import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return new Response("Unauthorized", { status: 401 });

    // Delete user profile from the database
    await db
      .delete(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .execute();

    // Delete user account from Supabase Auth

    // ATTENTION: for delene I need process.env.SUPABASE_SERVICE_ROLE_KEY!
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    //soft delete user unactive
    //const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id, true);
    if (error) throw error;
    return new Response("User account deleted", { status: 200 });
  } catch (err) {
    console.error("Delete account error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// import { createClient } from "@supabase/supabase-js";

// export const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY! // Не публиковать на клиент!
// );

//-------------
// where SUPABASE_SERVICE_ROLE_KEY?
// in panel Supabase → ⚙️ Project Settings → API

// in Service Role Key

// Добавь его в .env.server или .env.local:

// SUPABASE_SERVICE_ROLE_KEY=your_super_secret_key
//----------------
