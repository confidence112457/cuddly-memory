// Quick script to update admin user for testing
import mongoose from 'mongoose';
import { UserModel } from './shared/mongodb-schema.js';

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

async function updateAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Update admin user
    const result = await UserModel.findOneAndUpdate(
      { username: 'admin' },
      { 
        kycStatus: 'approved',
        balance: 1000000 // $10,000
      },
      { new: true }
    );
    
    console.log('Admin user updated:', result);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateAdmin();