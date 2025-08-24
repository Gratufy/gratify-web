ALTER TABLE "business_locations" ALTER COLUMN "latitude" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "business_locations" ALTER COLUMN "longitude" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "business_locations" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "business_locations" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "is_online" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "businesses" DROP COLUMN "district";--> statement-breakpoint
ALTER TABLE "businesses" DROP COLUMN "address";