import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { connectToMongoDB } from "../server/mongodb";

const app = express();

// CORS and security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(status).json({ message });
});

let isConnected = false;

export default async function handler(req: any, res: any) {
  // Connect to MongoDB only once
  if (!isConnected) {
    try {
      await connectToMongoDB();
      isConnected = true;
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      return res.status(500).json({ message: 'Database connection failed' });
    }
  }

  // Register routes
  await registerRoutes(app);
  
  // Handle the request
  return app(req, res);
}