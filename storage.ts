import { users, investments, transactions, kyc, testimonials, depositAddresses, type User, type InsertUser, type Investment, type Transaction, type InsertInvestment, type InsertTransaction, type Kyc, type InsertKyc, type Testimonial, type InsertTestimonial, type DepositAddress, type InsertDepositAddress } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, balance: number): Promise<void>;
  updateUserKycStatus(userId: number, status: string): Promise<void>;
  
  // Investment operations
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  getUserInvestments(userId: number): Promise<Investment[]>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  getAllTransactions(): Promise<Transaction[]>;
  updateTransactionStatus(transactionId: number, status: string, adminNotes?: string): Promise<void>;
  
  // KYC operations
  createKyc(kyc: InsertKyc): Promise<Kyc>;
  getUserKyc(userId: number): Promise<Kyc | undefined>;
  getKycById(kycId: number): Promise<Kyc | undefined>;
  getAllPendingKyc(): Promise<Kyc[]>;
  updateKycStatus(kycId: number, status: string, rejectionReason?: string): Promise<void>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  
  // Testimonial operations
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Deposit address operations
  getAllDepositAddresses(): Promise<DepositAddress[]>;
  getDepositAddressByMethod(method: string): Promise<DepositAddress | undefined>;
  createDepositAddress(address: InsertDepositAddress): Promise<DepositAddress>;
  updateDepositAddress(id: number, address: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserBalance(userId: number, balance: number): Promise<void> {
    await db
      .update(users)
      .set({ balance, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const [newInvestment] = await db
      .insert(investments)
      .values(investment)
      .returning();
    return newInvestment;
  }

  async getUserInvestments(userId: number): Promise<Investment[]> {
    return await db.select().from(investments).where(eq(investments.userId, userId));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions);
  }

  async updateTransactionStatus(transactionId: number, status: string, adminNotes?: string): Promise<void> {
    await db
      .update(transactions)
      .set({ status, adminNotes })
      .where(eq(transactions.id, transactionId));
  }

  async updateUserKycStatus(userId: number, status: string): Promise<void> {
    await db
      .update(users)
      .set({ kycStatus: status, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async createKyc(insertKyc: InsertKyc): Promise<Kyc> {
    const [newKyc] = await db
      .insert(kyc)
      .values(insertKyc)
      .returning();
    return newKyc;
  }

  async getUserKyc(userId: number): Promise<Kyc | undefined> {
    const [userKyc] = await db.select().from(kyc).where(eq(kyc.userId, userId));
    return userKyc || undefined;
  }

  async getKycById(kycId: number): Promise<Kyc | undefined> {
    const [kycRecord] = await db.select().from(kyc).where(eq(kyc.id, kycId));
    return kycRecord || undefined;
  }

  async getAllPendingKyc(): Promise<Kyc[]> {
    return await db.select().from(kyc).where(eq(kyc.status, "pending"));
  }

  async updateKycStatus(kycId: number, status: string, rejectionReason?: string): Promise<void> {
    await db
      .update(kyc)
      .set({ status, rejectionReason, updatedAt: new Date() })
      .where(eq(kyc.id, kycId));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.isActive, true));
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  async getAllDepositAddresses(): Promise<DepositAddress[]> {
    return await db.select().from(depositAddresses).where(eq(depositAddresses.isActive, true));
  }

  async getDepositAddressByMethod(method: string): Promise<DepositAddress | undefined> {
    const [address] = await db
      .select()
      .from(depositAddresses)
      .where(and(eq(depositAddresses.method, method), eq(depositAddresses.isActive, true)));
    return address || undefined;
  }

  async createDepositAddress(insertAddress: InsertDepositAddress): Promise<DepositAddress> {
    const [address] = await db
      .insert(depositAddresses)
      .values(insertAddress)
      .returning();
    return address;
  }

  async updateDepositAddress(id: number, address: string): Promise<void> {
    await db
      .update(depositAddresses)
      .set({ address, updatedAt: new Date() })
      .where(eq(depositAddresses.id, id));
  }
}

export const storage = new DatabaseStorage();
