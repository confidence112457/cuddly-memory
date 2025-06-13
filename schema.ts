import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  balance: integer("balance").default(0), // User's current balance in cents
  isActive: boolean("is_active").default(true),
  role: text("role").default("user"), // "user", "admin"
  kycStatus: text("kyc_status").default("pending"), // "pending", "approved", "rejected"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  planType: text("plan_type").notNull(), // "beginner", "basic", "pro"
  amount: integer("amount").notNull(),
  dailyReturn: integer("daily_return").notNull(),
  duration: integer("duration").notNull(), // in months
  status: text("status").default("active"), // "active", "completed", "paused"
  createdAt: timestamp("created_at").defaultNow(),
});

export const kyc = pgTable("kyc", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  documentType: text("document_type").notNull(), // "passport", "id_card", "drivers_license"
  documentNumber: text("document_number").notNull(),
  fullName: text("full_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  nationality: text("nationality").notNull(),
  address: text("address").notNull(),
  phoneNumber: text("phone_number").notNull(),
  status: text("status").default("pending"), // "pending", "approved", "rejected"
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // "deposit", "withdrawal", "profit"
  amount: integer("amount").notNull(),
  currency: text("currency").default("USD"),
  status: text("status").default("pending"), // "pending", "completed", "failed", "approved"
  paymentMethod: text("payment_method"), // "bank_transfer", "crypto", "paypal"
  walletAddress: text("wallet_address"), // For crypto withdrawals
  bankDetails: text("bank_details"), // For bank transfers
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  message: text("message").notNull(),
  rating: integer("rating").notNull(),
  avatar: text("avatar"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const depositAddresses = pgTable("deposit_addresses", {
  id: serial("id").primaryKey(),
  method: text("method").notNull(), // "bitcoin", "ethereum", "usdt", "bank"
  address: text("address").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).pick({
  userId: true,
  planType: true,
  amount: true,
  dailyReturn: true,
  duration: true,
});

export const insertKycSchema = createInsertSchema(kyc).pick({
  userId: true,
  documentType: true,
  documentNumber: true,
  fullName: true,
  dateOfBirth: true,
  nationality: true,
  address: true,
  phoneNumber: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  amount: true,
  currency: true,
  paymentMethod: true,
  walletAddress: true,
  bankDetails: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  location: true,
  message: true,
  rating: true,
  avatar: true,
});

export const insertDepositAddressSchema = createInsertSchema(depositAddresses).pick({
  method: true,
  address: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertKyc = z.infer<typeof insertKycSchema>;
export type Kyc = typeof kyc.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertDepositAddress = z.infer<typeof insertDepositAddressSchema>;
export type DepositAddress = typeof depositAddresses.$inferSelect;
