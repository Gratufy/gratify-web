CREATE TYPE "public"."business_review_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."business_status" AS ENUM('pending', 'approved', 'hidden', 'archived');--> statement-breakpoint
CREATE TABLE "business_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"open_time" time NOT NULL,
	"close_time" time NOT NULL,
	CONSTRAINT "day_of_week_check" CHECK ("business_hours"."day_of_week" BETWEEN 0 AND 6)
);
--> statement-breakpoint
CREATE TABLE "business_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "business_review_status" DEFAULT 'pending',
	"text" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"city" text NOT NULL,
	"district" text,
	"address" text NOT NULL,
	"website" text,
	"karma" integer DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"status" "business_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_locations" ADD CONSTRAINT "business_locations_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_reviews" ADD CONSTRAINT "business_reviews_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_reviews" ADD CONSTRAINT "business_reviews_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_owner_id_user_profiles_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_category_id_business_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."business_categories"("category_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "business_day_unique" ON "business_hours" USING btree ("business_id","day_of_week");--> statement-breakpoint
ALTER TABLE "business_votes" ADD CONSTRAINT "business_votes_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_votes" ADD CONSTRAINT "business_votes_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;

