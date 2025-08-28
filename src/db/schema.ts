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
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const ROLE_ENUM = pgEnum("role", ["USER", "BUSINESS", "ADMIN"]);
export const STATUS_ENUM = pgEnum("user_status", ["active", "blocked"]);
export const BUSINESS_REVIEW_STATUS_ENUM = pgEnum("business_review_status", [
  "pending",
  "approved",
  "rejected",
]);
export const businessStatusEnum = pgEnum("business_status", [
  "pending", // on moderation
  "approved", // approved and active
  "hidden", // hidden by admin
  "rejected", // rejected by admin
  // "deleted", // deleted/archived
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

//BUSINESS TABLE
// export const businesses = pgTable("businesses", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   ownerId: uuid("owner_id")
//     .notNull()
//     .references(() => userProfiles.userId, { onDelete: "cascade" }),
//   categoryId: uuid("category_id")
//     .default("11111111-1111-1111-1111-111111111111") // UUID  "Інше"
//     .notNull(),
//   name: text("name").notNull(),
//   description: text("description").notNull(),
//   city: text("city").notNull(),
//   district: text("district"),
//   address: text("address").notNull(),
//   website: text("website"),
//   karma: integer("karma").default(0).notNull(),
//   reviewCount: integer("review_count").default(0).notNull(),
//   status: businessStatusEnum("status").default("pending").notNull(),
//   createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
//   updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
// });

export const businesses = pgTable("businesses", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => userProfiles.userId, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .default("11111111-1111-1111-1111-111111111111") // "Інше"
    .notNull(),

  name: text("name").notNull(),
  description: text("description").notNull(),
  website: text("website"),

  // main flag
  isOnline: boolean("is_online").default(false).notNull(),

  karma: integer("karma").default(0).notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  status: businessStatusEnum("status").default("pending").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
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
export const businessVotes = pgTable(
  "business_votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userProfiles.userId, { onDelete: "cascade" }),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    vote: integer("vote").notNull(), // +1 or -1
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [uniqueIndex("business_user_vote_unique").on(t.userId, t.businessId)]
);

export const businessLocations = pgTable("business_locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),

  city: text("city").notNull(),
  // district: text("district"),
  address: text("address"), // can be  NULL, if only city is specified

  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
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
  status: BUSINESS_REVIEW_STATUS_ENUM("status").default("pending").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

//business open hours table

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

// OFFERS
export const specialOffers = pgTable("special_offers", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// business_special_offers.ts
export const businessSpecialOffers = pgTable(
  "business_special_offers",
  {
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    offerId: uuid("offer_id")
      .notNull()
      .references(() => specialOffers.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.businessId, t.offerId] })]
);
