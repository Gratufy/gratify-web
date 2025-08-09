import { sql } from "drizzle-orm";
ALTER TABLE "businesses" DROP CONSTRAINT "businesses_category_id_business_categories_category_id_fk";
--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "category_id" SET DEFAULT '11111111-1111-1111-1111-111111111111';