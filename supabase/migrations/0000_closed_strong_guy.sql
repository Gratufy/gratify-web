CREATE TYPE "public"."role" AS ENUM('USER', 'BUSINESS', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'blocked');--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"role" "role" DEFAULT 'USER' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"last_activity" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_profiles_email_unique" UNIQUE("email")
);
