'use server';

import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { businesses, businessVotes } from '@/db/schema';

import { eq, and, sql } from 'drizzle-orm';

import { BusinessVote, NewBusinessVote } from '@/types/db';

export async function voteBusiness(
  businessId: string,
  vote: 1 | -1
): Promise<BusinessVote | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // check if there is vote already
  const existing = await db
    .select()
    .from(businessVotes)
    .where(
      and(
        eq(businessVotes.userId, user.id),
        eq(businessVotes.businessId, businessId)
      )
    );

  let result: BusinessVote | null = null;

  if (existing.length > 0) {
    const prevVote = existing[0].vote;

    if (prevVote === vote) {
      // again 0 as remove own vote
      await db
        .delete(businessVotes)
        .where(
          and(
            eq(businessVotes.userId, user.id),
            eq(businessVotes.businessId, businessId)
          )
        );

      await db
        .update(businesses)
        .set({ karma: sql`${businesses.karma} - ${prevVote}` })
        .where(eq(businesses.id, businessId));

      result = null; // vote deleted and karma updated
    } else {
      // change vote
      const [updated] = await db
        .update(businessVotes)
        .set({ vote })
        .where(
          and(
            eq(businessVotes.userId, user.id),
            eq(businessVotes.businessId, businessId)
          )
        )
        .returning();

      await db
        .update(businesses)
        .set({ karma: sql`${businesses.karma} + ${vote - prevVote}` })
        .where(eq(businesses.id, businessId));

      result = updated;
    }
  } else {
    // new vote
    const newVote: NewBusinessVote = {
      userId: user.id,
      businessId,
      vote,
    };

    const [inserted] = await db
      .insert(businessVotes)
      .values(newVote)
      .returning();

    await db
      .update(businesses)
      .set({ karma: sql`${businesses.karma} + ${vote}` })
      .where(eq(businesses.id, businessId));

    result = inserted;
  }

  return result;
}

export async function getUserVote(
  businessId: string
): Promise<BusinessVote | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const existing = await db
    .select()
    .from(businessVotes)
    .where(
      and(
        eq(businessVotes.userId, user.id),
        eq(businessVotes.businessId, businessId)
      )
    )
    .limit(1);

  return existing[0] ?? null;
}
