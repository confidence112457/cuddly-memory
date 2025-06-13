import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcrypt";
import MongoStore from "connect-mongo";
import { storage } from "./mongodb-storage";
import { z } from "zod";

// Validation schemas for MongoDB
const insertUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  balance: z.number().default(0),
  role: z.string().default('user'),  
  kycStatus: z.string().default('pending')
});

const insertInvestmentSchema = z.object({
  userId: z.string(),
  planType: z.string(),
  amount: z.number(),
  dailyReturn: z.number(),
  duration: z.number(),
  status: z.string().default('active')
});

const insertTransactionSchema = z.object({
  userId: z.string(),
  type: z.string(),
  amount: z.number(),
  currency: z.string().default('USD'),
  status: z.string().default('pending'),
  paymentMethod: z.string().optional(),
  walletAddress: z.string().optional(),
  bankDetails: z.string().optional(),
  adminNotes: z.string().optional()
});

const insertKycSchema = z.object({
  userId: z.string(),
  documentType: z.string(),
  documentNumber: z.string(),
  fullName: z.string(),
  dateOfBirth: z.string(),
  nationality: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  status: z.string().default('pending'),
  rejectionReason: z.string().optional()
});

// Session middleware
function setupSession(app: Express) {
  const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI!,
    ttl: 7 * 24 * 60 * 60, // 1 week
    touchAfter: 24 * 3600, // Lazy session update
  });

  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset expiry on activity
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      sameSite: 'lax', // Help with cross-site requests
    },
  }));
}

// Extend session type
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Admin middleware
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
}

// Helper function to convert MongoDB document to API response
function toApiUser(user: any) {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    balance: user.balance || 0,
    role: user.role,
    kycStatus: user.kycStatus,
    createdAt: user.createdAt
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupSession(app);

  // Register endpoint
  app.post('/api/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        balance: userData.balance || 0,
        role: userData.role || 'user',
        kycStatus: userData.kycStatus || 'pending'
      });

      // Set session
      req.session.userId = user._id.toString();
      
      res.json({ 
        message: "Registration successful", 
        user: toApiUser(user)
      });
    } catch (error) {
      console.error("Registration error:", error);
      const message = error instanceof Error ? error.message : "Registration failed";
      res.status(400).json({ message: "Registration failed", error: message });
    }
  });

  // Login endpoint
  app.post('/api/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user._id.toString();

      res.json({ 
        message: "Login successful", 
        user: toApiUser(user)
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout endpoint
  app.post('/api/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Get current user
  app.get('/api/user', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(toApiUser(user));
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Create investment
  app.post('/api/investments', requireAuth, async (req: Request, res: Response) => {
    try {
      const investmentData = insertInvestmentSchema.parse({
        ...req.body,
        userId: req.session.userId!
      });

      const investment = await storage.createInvestment(investmentData);
      res.json({
        id: investment._id.toString(),
        userId: investment.userId.toString(),
        planType: investment.planType,
        amount: investment.amount,
        dailyReturn: investment.dailyReturn,
        duration: investment.duration,
        status: investment.status,
        createdAt: investment.createdAt
      });
    } catch (error) {
      console.error("Create investment error:", error);
      res.status(400).json({ message: "Failed to create investment" });
    }
  });

  // Get user investments
  app.get('/api/investments', requireAuth, async (req: Request, res: Response) => {
    try {
      const investments = await storage.getUserInvestments(req.session.userId!);
      res.json(investments.map(investment => ({
        id: investment._id.toString(),
        userId: investment.userId.toString(),
        planType: investment.planType,
        amount: investment.amount,
        dailyReturn: investment.dailyReturn,
        duration: investment.duration,
        status: investment.status,
        createdAt: investment.createdAt
      })));
    } catch (error) {
      console.error("Get investments error:", error);
      res.status(500).json({ message: "Failed to get investments" });
    }
  });

  // Create transaction
  app.post('/api/transactions', requireAuth, async (req: Request, res: Response) => {
    try {
      const transactionData = insertTransactionSchema.parse({
        ...req.body,
        userId: req.session.userId!
      });

      const transaction = await storage.createTransaction(transactionData);
      res.json({
        id: transaction._id.toString(),
        userId: transaction.userId.toString(),
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        walletAddress: transaction.walletAddress,
        bankDetails: transaction.bankDetails,
        adminNotes: transaction.adminNotes,
        createdAt: transaction.createdAt
      });
    } catch (error) {
      console.error("Create transaction error:", error);
      res.status(400).json({ message: "Failed to create transaction" });
    }
  });

  // Get user transactions
  app.get('/api/transactions', requireAuth, async (req: Request, res: Response) => {
    try {
      const transactions = await storage.getUserTransactions(req.session.userId!);
      res.json(transactions.map(transaction => ({
        id: transaction._id.toString(),
        userId: transaction.userId.toString(),
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        walletAddress: transaction.walletAddress,
        bankDetails: transaction.bankDetails,
        adminNotes: transaction.adminNotes,
        createdAt: transaction.createdAt
      })));
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  // Create KYC
  app.post('/api/kyc', requireAuth, async (req: Request, res: Response) => {
    try {
      const kycData = insertKycSchema.parse({
        ...req.body,
        userId: req.session.userId!
      });

      const kyc = await storage.createKyc(kycData);
      res.json({
        id: kyc._id.toString(),
        userId: kyc.userId.toString(),
        documentType: kyc.documentType,
        documentNumber: kyc.documentNumber,
        fullName: kyc.fullName,
        dateOfBirth: kyc.dateOfBirth,
        nationality: kyc.nationality,
        address: kyc.address,
        phoneNumber: kyc.phoneNumber,
        status: kyc.status,
        rejectionReason: kyc.rejectionReason,
        createdAt: kyc.createdAt
      });
    } catch (error) {
      console.error("Create KYC error:", error);
      res.status(400).json({ message: "Failed to create KYC" });
    }
  });

  // Get user KYC
  app.get('/api/kyc', requireAuth, async (req: Request, res: Response) => {
    try {
      const kyc = await storage.getUserKyc(req.session.userId!);
      if (!kyc) {
        return res.json(null);
      }
      
      res.json({
        id: kyc._id.toString(),
        userId: kyc.userId.toString(),
        documentType: kyc.documentType,
        documentNumber: kyc.documentNumber,
        fullName: kyc.fullName,
        dateOfBirth: kyc.dateOfBirth,
        nationality: kyc.nationality,
        address: kyc.address,
        phoneNumber: kyc.phoneNumber,
        status: kyc.status,
        rejectionReason: kyc.rejectionReason,
        createdAt: kyc.createdAt
      });
    } catch (error) {
      console.error("Get KYC error:", error);
      res.status(500).json({ message: "Failed to get KYC" });
    }
  });

  // Admin: Get all users
  app.get('/api/admin/users', requireAdmin, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(user => toApiUser(user)));
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  // Admin: Get all transactions
  app.get('/api/admin/transactions', requireAdmin, async (req: Request, res: Response) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions.map(transaction => ({
        id: transaction._id.toString(),
        userId: transaction.userId.toString(),
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        walletAddress: transaction.walletAddress,
        bankDetails: transaction.bankDetails,
        adminNotes: transaction.adminNotes,
        createdAt: transaction.createdAt
      })));
    } catch (error) {
      console.error("Get all transactions error:", error);
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  // Admin: Update transaction status
  app.put('/api/admin/transactions/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      // Get the transaction first to check if it's a deposit
      const transaction = await storage.getTransactionById(id);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      // If approving a deposit transaction, add funds to user's balance
      if (status === 'approved' && transaction.type === 'deposit' && transaction.status !== 'approved') {
        const user = await storage.getUser(transaction.userId);
        if (user) {
          const newBalance = (user.balance || 0) + transaction.amount;
          await storage.updateUserBalance(transaction.userId, newBalance);
        }
      }

      // If rejecting a previously approved deposit, subtract funds from user's balance
      if (status === 'rejected' && transaction.type === 'deposit' && transaction.status === 'approved') {
        const user = await storage.getUser(transaction.userId);
        if (user) {
          const newBalance = Math.max(0, (user.balance || 0) - transaction.amount);
          await storage.updateUserBalance(transaction.userId, newBalance);
        }
      }

      await storage.updateTransactionStatus(id, status, adminNotes);
      res.json({ message: "Transaction updated successfully" });
    } catch (error) {
      console.error("Update transaction error:", error);
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });

  // Admin: Get all pending KYC
  app.get('/api/admin/kyc', requireAdmin, async (req: Request, res: Response) => {
    try {
      const kycRecords = await storage.getAllPendingKyc();
      res.json(kycRecords.map(kyc => ({
        id: kyc._id.toString(),
        userId: kyc.userId.toString(),
        documentType: kyc.documentType,
        documentNumber: kyc.documentNumber,
        fullName: kyc.fullName,
        dateOfBirth: kyc.dateOfBirth,
        nationality: kyc.nationality,
        address: kyc.address,
        phoneNumber: kyc.phoneNumber,
        status: kyc.status,
        rejectionReason: kyc.rejectionReason,
        createdAt: kyc.createdAt
      })));
    } catch (error) {
      console.error("Get pending KYC error:", error);
      res.status(500).json({ message: "Failed to get KYC records" });
    }
  });

  // Admin: Update KYC status
  app.put('/api/admin/kyc/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, rejectionReason } = req.body;

      await storage.updateKycStatus(id, status, rejectionReason);
      
      // Update user's KYC status
      const kyc = await storage.getKycById(id);
      if (kyc) {
        await storage.updateUserKycStatus(kyc.userId.toString(), status);
      }

      res.json({ message: "KYC status updated successfully" });
    } catch (error) {
      console.error("Update KYC error:", error);
      res.status(500).json({ message: "Failed to update KYC" });
    }
  });

  // Get testimonials
  app.get('/api/testimonials', async (req: Request, res: Response) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials.map(testimonial => ({
        id: testimonial._id.toString(),
        name: testimonial.name,
        location: testimonial.location,
        message: testimonial.message,
        rating: testimonial.rating,
        avatar: testimonial.avatar,
        createdAt: testimonial.createdAt
      })));
    } catch (error) {
      console.error("Get testimonials error:", error);
      res.status(500).json({ message: "Failed to get testimonials" });
    }
  });

  // Admin: Create testimonial
  app.post('/api/testimonials', requireAdmin, async (req: Request, res: Response) => {
    try {
      const testimonialData = {
        name: req.body.name,
        location: req.body.location,
        message: req.body.message,
        rating: req.body.rating,
        avatar: req.body.avatar
      };

      const testimonial = await storage.createTestimonial(testimonialData);
      res.json({
        id: testimonial._id.toString(),
        name: testimonial.name,
        location: testimonial.location,
        message: testimonial.message,
        rating: testimonial.rating,
        avatar: testimonial.avatar,
        createdAt: testimonial.createdAt
      });
    } catch (error) {
      console.error("Create testimonial error:", error);
      res.status(400).json({ message: "Failed to create testimonial" });
    }
  });

  // Get deposit addresses
  app.get('/api/deposit-addresses', async (req: Request, res: Response) => {
    try {
      const addresses = await storage.getAllDepositAddresses();
      res.json(addresses.map(address => ({
        id: address._id.toString(),
        method: address.method,
        address: address.address,
        createdAt: address.createdAt
      })));
    } catch (error) {
      console.error("Get deposit addresses error:", error);
      res.status(500).json({ message: "Failed to get deposit addresses" });
    }
  });

  // Admin: Create deposit address
  app.post('/api/admin/deposit-addresses', requireAdmin, async (req: Request, res: Response) => {
    try {
      const addressData = {
        method: req.body.method,
        address: req.body.address
      };

      const depositAddress = await storage.createDepositAddress(addressData);
      res.json({
        id: depositAddress._id.toString(),
        method: depositAddress.method,
        address: depositAddress.address,
        createdAt: depositAddress.createdAt
      });
    } catch (error) {
      console.error("Create deposit address error:", error);
      res.status(400).json({ message: "Failed to create deposit address" });
    }
  });

  // Admin: Update deposit address
  app.put('/api/admin/deposit-addresses/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { address } = req.body;

      await storage.updateDepositAddress(id, address);
      res.json({ message: "Deposit address updated successfully" });
    } catch (error) {
      console.error("Update deposit address error:", error);
      res.status(500).json({ message: "Failed to update deposit address" });
    }
  });

  // Admin: Create new admin user
  app.post('/api/admin/create-admin', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
      }

      // Check if user already exists
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        firstName: firstName || 'Admin',
        lastName: lastName || 'User',
        balance: 0,
        role: 'admin',
        kycStatus: 'verified'
      });

      res.json({
        message: "Admin user created successfully",
        user: toApiUser(newAdmin)
      });
    } catch (error) {
      console.error("Create admin error:", error);
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });

  // Admin: Update user role (promote user to admin or demote admin to user)
  app.put('/api/admin/users/:id/role', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Role must be either 'user' or 'admin'" });
      }

      // Get the user to update
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user role using the new method
      await storage.updateUserRole(id, role);

      res.json({ message: `User role updated to ${role} successfully` });
    } catch (error) {
      console.error("Update user role error:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Admin: Update user KYC status
  app.put('/api/admin/users/:id/kyc', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { kycStatus } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(kycStatus)) {
        return res.status(400).json({ message: "KYC status must be 'pending', 'approved', or 'rejected'" });
      }

      await storage.updateUserKycStatus(id, kycStatus);
      res.json({ message: `User KYC status updated to ${kycStatus} successfully` });
    } catch (error) {
      console.error("Update user KYC status error:", error);
      res.status(500).json({ message: "Failed to update user KYC status" });
    }
  });

  // Admin: Update user balance
  app.put('/api/admin/users/:id/balance', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { balance } = req.body;

      if (typeof balance !== 'number' || balance < 0) {
        return res.status(400).json({ message: "Balance must be a positive number" });
      }

      await storage.updateUserBalance(id, balance);
      res.json({ message: `User balance updated to $${balance/100} successfully` });
    } catch (error) {
      console.error("Update user balance error:", error);
      res.status(500).json({ message: "Failed to update user balance" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}