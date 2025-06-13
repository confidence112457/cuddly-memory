import mongoose, { Schema, Document } from 'mongoose';

// User Schema
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  balance: number;
  role: string;
  kycStatus: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  balance: { type: Number, default: 0 },
  role: { type: String, default: 'user' },
  kycStatus: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);

// Investment Schema
export interface IInvestment extends Document {
  userId: mongoose.Types.ObjectId;
  planType: string;
  amount: number;
  dailyReturn: number;
  duration: number;
  status: string;
  createdAt: Date;
}

const investmentSchema = new Schema<IInvestment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planType: { type: String, required: true },
  amount: { type: Number, required: true },
  dailyReturn: { type: Number, required: true },
  duration: { type: Number, required: true },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

export const InvestmentModel = mongoose.model<IInvestment>('Investment', investmentSchema);

// Transaction Schema
export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  walletAddress?: string;
  bankDetails?: string;
  adminNotes?: string;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, default: 'pending' },
  paymentMethod: { type: String },
  walletAddress: { type: String },
  bankDetails: { type: String },
  adminNotes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const TransactionModel = mongoose.model<ITransaction>('Transaction', transactionSchema);

// KYC Schema
export interface IKyc extends Document {
  userId: mongoose.Types.ObjectId;
  documentType: string;
  documentNumber: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  phoneNumber: string;
  status: string;
  rejectionReason?: string;
  createdAt: Date;
}

const kycSchema = new Schema<IKyc>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  documentType: { type: String, required: true },
  documentNumber: { type: String, required: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  nationality: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  status: { type: String, default: 'pending' },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const KycModel = mongoose.model<IKyc>('Kyc', kycSchema);

// Testimonial Schema
export interface ITestimonial extends Document {
  name: string;
  location: string;
  message: string;
  rating: number;
  avatar?: string;
  createdAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const TestimonialModel = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);

// Deposit Address Schema
export interface IDepositAddress extends Document {
  method: string;
  address: string;
  createdAt: Date;
}

const depositAddressSchema = new Schema<IDepositAddress>({
  method: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const DepositAddressModel = mongoose.model<IDepositAddress>('DepositAddress', depositAddressSchema);

// Export types for frontend use
export type User = IUser;
export type Investment = IInvestment;
export type Transaction = ITransaction;
export type Kyc = IKyc;
export type Testimonial = ITestimonial;
export type DepositAddress = IDepositAddress;

// Insert types (without MongoDB-specific fields)
export interface InsertUser {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  balance?: number;
  role?: string;
  kycStatus?: string;
}

export interface InsertInvestment {
  userId: string;
  planType: string;
  amount: number;
  dailyReturn: number;
  duration: number;
  status?: string;
}

export interface InsertTransaction {
  userId: string;
  type: string;
  amount: number;
  currency: string;
  status?: string;
  paymentMethod?: string;
  walletAddress?: string;
  bankDetails?: string;
  adminNotes?: string;
}

export interface InsertKyc {
  userId: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  phoneNumber: string;
  status?: string;
  rejectionReason?: string;
}

export interface InsertTestimonial {
  name: string;
  location: string;
  message: string;
  rating: number;
  avatar?: string;
}

export interface InsertDepositAddress {
  method: string;
  address: string;
}