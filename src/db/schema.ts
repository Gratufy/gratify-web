import {
  pgEnum,
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
  integer,
  doublePrecision,
  check,
  time,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const ROLE_ENUM = pgEnum("role", ["USER", "BUSINESS", "ADMIN"]);
export const STATUS_ENUM = pgEnum("user_status", ["active", "blocked"]);
export const BUSINESS_REVIEW_STATUS_ENUM = pgEnum("business_review_status", [
  "pending",
  "approved",
  "rejected",
]);

//User profiles table
export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id").primaryKey(), // refers to auth.users.id manually (not FK)
  email: text("email").notNull().unique(),
  role: ROLE_ENUM("role").default("USER").notNull(),
  status: STATUS_ENUM("status").default("active").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  lastActivity: timestamp("last_activity", {
    withTimezone: true,
  }).defaultNow(),
});

// business categories table
export const businessCategories = pgTable("business_categories", {
  categoryId: uuid("category_id").defaultRandom().primaryKey(),
  name: text("category_name").notNull().unique(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
});

//for voting
// export const votes = pgTable("votes", {
//   voteId: uuid("vote_id").defaultRandom().primaryKey(),
//   userId: uuid("user_id").notNull(),
//   businessId: uuid("business_id").notNull(),
//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//   }).defaultNow(),
// });
export const businessVotes = pgTable(
  "business_votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    businessId: uuid("business_id").notNull(),
    vote: integer("vote").notNull(), // +1 or -1
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [uniqueIndex("business_user_vote_unique").on(t.userId, t.businessId)]
);
// business locations table
export const businessLocations = pgTable("business_locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, {
      onDelete: "cascade",
    }), //if deleted business, delete locations
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
});
//business reviews table

export const businessReviews = pgTable("business_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => userProfiles.userId, { onDelete: "cascade" }),
  status: BUSINESS_REVIEW_STATUS_ENUM("status").default("pending"),
  text: text("text"),
  // rating: integer("rating")
  //   .notNull()
  //   .check(sql`rating BETWEEN 1 AND 5`),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
//business open hours table
export const businessOpenHours = pgTable("business_open_hours", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 6 = Saturday
  openTime: text("open_time").notNull(), // e.g. "09:00"
  closeTime: text("close_time").notNull(), // e.g. "17:00"
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
export const businessHours = pgTable(
  "business_hours",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(),
    openTime: time("open_time").notNull(),
    closeTime: time("close_time").notNull(),
  },
  (t) => [
    // Check day of week is valid (0-6)
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    check("day_of_week_check", sql`${t.dayOfWeek} BETWEEN 0 AND 6`),

    // unique constraint for business and day of week to prevent duplicates
    uniqueIndex("business_day_unique").on(t.businessId, t.dayOfWeek),
  ]
);
//BUSINESS TABLE
export const businesses = pgTable("businesses", {
  id: uuid("id").defaultRandom().primaryKey(),
});
