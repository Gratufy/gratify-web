ALTER TABLE "business_reviews" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "karma" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "review_count" SET NOT NULL;