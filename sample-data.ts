import { TestimonialModel, DepositAddressModel, UserModel } from "@shared/mongodb-schema";
import bcrypt from "bcrypt";

export async function createSampleData() {
  try {
    // Create default admin user
    const adminCount = await UserModel.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await UserModel.create({
        username: "admin",
        email: "admin@geniustrading.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        balance: 0,
        role: "admin",
        kycStatus: "approved"
      });
      console.log("Default admin user created - Username: admin, Password: admin123");
    }
    // Create sample testimonials
    const testimonialCount = await TestimonialModel.countDocuments();
    if (testimonialCount === 0) {
      await TestimonialModel.insertMany([
        {
          name: "Sarah Johnson",
          location: "New York, USA", 
          message: "Genius Trading has transformed my investment portfolio. The returns are consistently above my expectations!",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        },
        {
          name: "Michael Chen",
          location: "Singapore",
          message: "Professional platform with excellent customer support. I've been investing for 2 years now.",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        {
          name: "Emma Rodriguez",
          location: "Madrid, Spain",
          message: "The daily returns are amazing and the withdrawal process is very smooth. Highly recommended!",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        },
        {
          name: "David Kim",
          location: "Seoul, South Korea",
          message: "I started with a small investment and now I'm making substantial profits every month.",
          rating: 5,
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        }
      ]);
      console.log("Sample testimonials created");
    }

    // Create sample deposit addresses
    const addressCount = await DepositAddressModel.countDocuments();
    if (addressCount === 0) {
      await DepositAddressModel.insertMany([
        {
          method: "bitcoin",
          address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
        },
        {
          method: "ethereum", 
          address: "0x742a4c4F44B98c86BC3d8F7A5F67E2E15b8B9B8B"
        },
        {
          method: "usdt",
          address: "TYASr3WzWWvMjPHChsj3YdYWkj3NwJN9hD"
        },
        {
          method: "bank_transfer",
          address: "Account: 1234567890, Bank: Genius Bank, Swift: GBNKUS33"
        }
      ]);
      console.log("Sample deposit addresses created");
    }
  } catch (error) {
    console.error("Error creating sample data:", error);
  }
}