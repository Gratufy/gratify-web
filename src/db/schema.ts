import { pgEnum, pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const ROLE_ENUM = pgEnum("role", ["USER", "BUSINESS", "ADMIN"]);
export const STATUS_ENUM = pgEnum("user_status", ["active", "blocked"]);

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
