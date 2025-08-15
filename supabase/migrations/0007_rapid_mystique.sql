ALTER TABLE "businesses" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."business_status";--> statement-breakpoint
CREATE TYPE "public"."business_status" AS ENUM('pending', 'approved', 'hidden', 'rejected');--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."business_status";--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "status" SET DATA TYPE "public"."business_status" USING "status"::"public"."business_status";--> statement-breakpoint
ALTER TABLE "business_reviews" ALTER COLUMN "text" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "description" SET NOT NULL;

--Change function to prevent deletion of category "Інше"
CREATE OR REPLACE FUNCTION prevent_delete_inche()
RETURNS trigger AS $$
BEGIN
  IF OLD.category_id = '11111111-1111-1111-1111-111111111111' THEN
    RAISE EXCEPTION 'DELETE_NOT_ALLOWED: Category Інше cannot be deleted';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;