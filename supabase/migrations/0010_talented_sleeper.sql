CREATE TABLE "business_special_offers" (
	"business_id" uuid NOT NULL,
	"offer_id" uuid NOT NULL,
	CONSTRAINT "business_special_offers_business_id_offer_id_pk" PRIMARY KEY("business_id","offer_id")
);
--> statement-breakpoint
CREATE TABLE "special_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "business_special_offers" ADD CONSTRAINT "business_special_offers_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_special_offers" ADD CONSTRAINT "business_special_offers_offer_id_special_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."special_offers"("id") ON DELETE cascade ON UPDATE no action;