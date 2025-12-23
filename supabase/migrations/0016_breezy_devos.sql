ALTER TABLE "business_reviews" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "business_reviews" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."business_review_status";--> statement-breakpoint
CREATE TYPE "public"."business_review_status" AS ENUM('pending', 'approved', 'hidden');--> statement-breakpoint
ALTER TABLE "business_reviews" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."business_review_status";--> statement-breakpoint
ALTER TABLE "business_reviews" ALTER COLUMN "status" SET DATA TYPE "public"."business_review_status" USING "status"::"public"."business_review_status";