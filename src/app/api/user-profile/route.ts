import { createClient } from '@/utils/supabase/server';

import { db } from '@/db';
import { userProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return new Response('Unauthorized', { status: 401 });

    //check if profile already exists

    const [existing] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    const fullName =
      user.user_metadata.full_name ?? user.user_metadata.name ?? null;
    const avatarUrl = user.user_metadata.avatar_url ?? null;
    // if not, create a new profile
    if (!existing) {
      const [created] = await db
        .insert(userProfiles)
        .values({
          userId: user.id,
          email: user.email!,
          name: fullName,
          avatarUrl,
        })
        .returning();

      return Response.json(created);
    }
    //if profile exists, update last activity and other fields if changed
    const needsUpdate =
      existing.name !== fullName || existing.avatarUrl !== avatarUrl;
    const [updated] = await db
      .update(userProfiles)
      .set({
        lastActivity: new Date(),
        ...(needsUpdate && { name: fullName, avatarUrl }),
      })
      .where(eq(userProfiles.userId, user.id))
      .returning();

    return Response.json(updated);
  } catch (err) {
    console.error('Delete account error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
