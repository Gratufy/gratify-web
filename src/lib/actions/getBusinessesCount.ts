'use server';

import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';

import { businesses } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function getBusinessesCount(): Promise<number> {
  const result = await db
    .select({ count: sql<string>`count(*)` })
    .from(businesses);

  return Number(result[0].count);
}
