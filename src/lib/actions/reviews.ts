"use server";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { businesses, businessReviews } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { isAdmin } from "../helpers/isAdmin";
import { BusinessReviewStatus, ScopeReview } from "@/types";

export async function createReview({
  businessId,
  text,
}: {
  businessId: string;
  text: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const [review] = await db
    .insert(businessReviews)
    .values({ businessId, userId: user.id, text })
    .returning();

  return review;
}

export async function updateReviewText({
  reviewId,
  text,
}: {
  reviewId: string;
  text: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  //check if review belongs to user
  const [review] = await db
    .update(businessReviews)
    .set({ text, updatedAt: new Date() })
    .where(
      and(eq(businessReviews.id, reviewId), eq(businessReviews.userId, user.id))
    )
    .returning();

  if (!review) throw new Error("Forbidden");

  return review;
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // find existing review
  const [existing] = await db
    .select()
    .from(businessReviews)
    .where(eq(businessReviews.id, reviewId));

  if (!existing) throw new Error("Not found");
  // check if user is admin
  const isAdminUser = await isAdmin(user.id);
  if (existing.userId !== user.id && !isAdminUser) throw new Error("Forbidden");

  await db.delete(businessReviews).where(eq(businessReviews.id, reviewId));
  // delete review with status "approved"
  if (existing.status === "approved") {
    await db
      .update(businesses)
      .set({ reviewCount: sql`GREATEST(${businesses.reviewCount} - 1, 0)` })
      .where(eq(businesses.id, existing.businessId));
  }

  return { success: true };
}

export async function updateReviewStatus({
  reviewId,
  status,
}: {
  reviewId: string;
  status: BusinessReviewStatus;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const isAdminUser = await isAdmin(user.id);
  if (!isAdminUser) throw new Error("Forbidden");
  // find current review
  const [existing] = await db
    .select()
    .from(businessReviews)
    .where(eq(businessReviews.id, reviewId));

  if (!existing) throw new Error("Not found");

  const [review] = await db
    .update(businessReviews)
    .set({ status, updatedAt: new Date() })
    .where(eq(businessReviews.id, reviewId))
    .returning();
  if (!review) throw new Error("Update failed");

  // change review count only when status changes to approved
  if (existing.status !== status) {
    if (existing.status !== "approved" && status === "approved") {
      // new approved → +1
      await db
        .update(businesses)
        .set({ reviewCount: sql`${businesses.reviewCount} + 1` })
        .where(eq(businesses.id, review.businessId));
    } else if (existing.status === "approved" && status !== "approved") {
      // change when was approved but not any more → -1 (with protection against negative)
      await db
        .update(businesses)
        .set({ reviewCount: sql`GREATEST(${businesses.reviewCount} - 1, 0)` })
        .where(eq(businesses.id, review.businessId));
    }
  }
  return review;
}

export async function getBusinessReviews(
  businessId: string,
  scope: ScopeReview,
  status?: BusinessReviewStatus
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (scope === "public") {
    return await db
      .select()
      .from(businessReviews)
      .where(
        and(
          eq(businessReviews.businessId, businessId),
          eq(businessReviews.status, "approved")
        )
      )
      .orderBy(desc(businessReviews.createdAt));
  } else {
    if (!user) throw new Error("Unauthorized");
    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser) throw new Error("Forbidden");

    const conditions = [eq(businessReviews.businessId, businessId)];

    if (status) {
      conditions.push(eq(businessReviews.status, status));
    }

    return await db
      .select()
      .from(businessReviews)
      .where(and(...conditions))
      .orderBy(desc(businessReviews.createdAt));
  }
}
