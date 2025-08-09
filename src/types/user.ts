export type Role = "USER" | "BUSINESS" | "ADMIN";
export type UserProfile = {
  userId: string;
  email: string;
  role: Role;
  status: string;
  createdAt: string;
  lastActivity: string;
};
