import { 
  UserModel, 
  InvestmentModel, 
  TransactionModel, 
  KycModel, 
  TestimonialModel, 
  DepositAddressModel,
  IUser,
  IInvestment,
  ITransaction,
  IKyc,
  ITestimonial,
  IDepositAddress,
  InsertUser,
  InsertInvestment,
  InsertTransaction,
  InsertKyc,
  InsertTestimonial,
  InsertDepositAddress,
  User,
  Investment,
  Transaction,
  Kyc,
  Testimonial,
  DepositAddress
} from '@shared/mongodb-schema';
import bcrypt from 'bcrypt';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: string, balance: number): Promise<void>;
  updateUserKycStatus(userId: string, status: string): Promise<void>;
  updateUserRole(userId: string, role: string): Promise<void>;
  
  // Investment operations
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  getUserInvestments(userId: string): Promise<Investment[]>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionById(transactionId: string): Promise<Transaction | undefined>;
  updateTransactionStatus(transactionId: string, status: string, adminNotes?: string): Promise<void>;
  
  // KYC operations
  createKyc(kyc: InsertKyc): Promise<Kyc>;
  getUserKyc(userId: string): Promise<Kyc | undefined>;
  getKycById(kycId: string): Promise<Kyc | undefined>;
  getAllPendingKyc(): Promise<Kyc[]>;
  updateKycStatus(kycId: string, status: string, rejectionReason?: string): Promise<void>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  
  // Testimonial operations
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Deposit address operations
  getAllDepositAddresses(): Promise<DepositAddress[]>;
  getDepositAddressByMethod(method: string): Promise<DepositAddress | undefined>;
  createDepositAddress(address: InsertDepositAddress): Promise<DepositAddress>;
  updateDepositAddress(id: string, address: string): Promise<void>;
}

export class MongoDBStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id);
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username });
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ email });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user = new UserModel({
      ...insertUser,
      password: hashedPassword
    });
    return await user.save();
  }

  async updateUserBalance(userId: string, balance: number): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { balance });
  }

  async updateUserKycStatus(userId: string, status: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { kycStatus: status });
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { role });
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const newInvestment = new InvestmentModel(investment);
    return await newInvestment.save();
  }

  async getUserInvestments(userId: string): Promise<Investment[]> {
    return await InvestmentModel.find({ userId }).sort({ createdAt: -1 });
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const newTransaction = new TransactionModel(transaction);
    return await newTransaction.save();
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return await TransactionModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await TransactionModel.find().populate('userId', 'username email').sort({ createdAt: -1 });
  }

  async getTransactionById(transactionId: string): Promise<Transaction | undefined> {
    const transaction = await TransactionModel.findById(transactionId);
    return transaction || undefined;
  }

  async updateTransactionStatus(transactionId: string, status: string, adminNotes?: string): Promise<void> {
    const updateData: any = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    await TransactionModel.findByIdAndUpdate(transactionId, updateData);
  }

  async createKyc(insertKyc: InsertKyc): Promise<Kyc> {
    const kyc = new KycModel(insertKyc);
    return await kyc.save();
  }

  async getUserKyc(userId: string): Promise<Kyc | undefined> {
    const kyc = await KycModel.findOne({ userId });
    return kyc || undefined;
  }

  async getKycById(kycId: string): Promise<Kyc | undefined> {
    const kyc = await KycModel.findById(kycId);
    return kyc || undefined;
  }

  async getAllPendingKyc(): Promise<Kyc[]> {
    return await KycModel.find({ status: 'pending' }).populate('userId', 'username email').sort({ createdAt: -1 });
  }

  async updateKycStatus(kycId: string, status: string, rejectionReason?: string): Promise<void> {
    const updateData: any = { status };
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    await KycModel.findByIdAndUpdate(kycId, updateData);
  }

  async getAllUsers(): Promise<User[]> {
    return await UserModel.find().sort({ createdAt: -1 });
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await TestimonialModel.find().sort({ createdAt: -1 });
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const testimonial = new TestimonialModel(insertTestimonial);
    return await testimonial.save();
  }

  async getAllDepositAddresses(): Promise<DepositAddress[]> {
    return await DepositAddressModel.find().sort({ createdAt: -1 });
  }

  async getDepositAddressByMethod(method: string): Promise<DepositAddress | undefined> {
    const address = await DepositAddressModel.findOne({ method });
    return address || undefined;
  }

  async createDepositAddress(insertAddress: InsertDepositAddress): Promise<DepositAddress> {
    const address = new DepositAddressModel(insertAddress);
    return await address.save();
  }

  async updateDepositAddress(id: string, address: string): Promise<void> {
    await DepositAddressModel.findByIdAndUpdate(id, { address });
  }
}

export const storage = new MongoDBStorage();