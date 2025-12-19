// to check user authentication status
import 'server-only';
// import { cookies } from 'next/headers';
import { userProfiles } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export async function verifySession() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Берём роль  таблицы user_profiles
  const [profile] = await db
    .select({
      userId: userProfiles.userId,
      role: userProfiles.role,
    })
    .from(userProfiles)
    .where(eq(userProfiles.userId, user.id))
    .limit(1);

  if (!profile) return null;

  return {
    userId: profile.userId,

    role: profile.role, // "USER" | "BUSINESS" | "ADMIN"
  };
}
