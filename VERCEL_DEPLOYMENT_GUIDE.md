# Complete Vercel Deployment Guide for Genius Trading Platform

This guide will help you deploy your Genius Trading Platform as a standalone website on Vercel without requiring Replit backend functionality.

## Prerequisites

- Vercel account (free tier available)
- GitHub account
- Node.js 18+ installed locally
- PostgreSQL database (we'll use Neon or Supabase)

## Step 1: Prepare Your Project for Deployment

### 1.1 Create a new directory and copy your files
```bash
mkdir genius-trading-platform
cd genius-trading-platform
```

### 1.2 Copy all project files from your Replit project
Copy these directories and files:
- `client/` (entire frontend directory)
- `server/` (entire backend directory) 
- `shared/` (shared schema directory)
- `package.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `postcss.config.js`
- `drizzle.config.ts`
- `tsconfig.json`

### 1.3 Update package.json for Vercel deployment
```json
{
  "name": "genius-trading-platform",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "tsc && vite build",
    "start": "node dist/server/index.js",
    "preview": "vite preview",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate"
  },
  "dependencies": {
    // Copy all dependencies from your current package.json
  },
  "devDependencies": {
    // Copy all devDependencies from your current package.json
  }
}
```

## Step 2: Set Up Database (Neon PostgreSQL)

### 2.1 Create a Neon account
1. Go to https://neon.tech
2. Sign up for a free account
3. Create a new project

### 2.2 Get your database connection string
1. In your Neon dashboard, go to "Connection Details"
2. Copy the connection string (it looks like: `postgresql://username:password@hostname/database?sslmode=require`)
3. Save this for later - you'll need it for environment variables

### 2.3 Initialize your database schema
```bash
# Install dependencies
npm install

# Set your DATABASE_URL temporarily
export DATABASE_URL="your_neon_connection_string_here"

# Push schema to database
npm run db:push
```

## Step 3: Configure for Vercel

### 3.1 Create vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**/*",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 3.2 Update vite.config.ts for production
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
```

### 3.3 Update server/index.ts for production
```typescript
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
await registerRoutes(app);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## Step 4: Deploy to Vercel

### 4.1 Initialize Git repository
```bash
git init
git add .
git commit -m "Initial commit"
```

### 4.2 Push to GitHub
1. Create a new repository on GitHub
2. Add the remote origin:
```bash
git remote add origin https://github.com/yourusername/genius-trading-platform.git
git push -u origin main
```

### 4.3 Deploy on Vercel
1. Go to https://vercel.com
2. Sign in and click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4.4 Set Environment Variables
In your Vercel project dashboard, go to Settings > Environment Variables and add:

```
DATABASE_URL=your_neon_connection_string_here
SESSION_SECRET=your_session_secret_here
NODE_ENV=production
```

## Step 5: Configure Domain and SSL

### 5.1 Custom Domain (Optional)
1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Update your DNS settings as instructed

### 5.2 SSL Certificate
Vercel automatically provides SSL certificates for all deployments.

## Step 6: Database Initialization

### 6.1 Add default data
You can either:
1. Use the admin panel to add deposit addresses manually, or
2. Create a seed script:

```typescript
// scripts/seed.ts
import { db } from "../server/db.js";
import { depositAddresses } from "../shared/schema.js";

async function seed() {
  await db.insert(depositAddresses).values([
    { method: "bitcoin", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
    { method: "ethereum", address: "0x742d35Cc6634C0532925a3b8D2d1234567890Ab" },
    { method: "usdt", address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oREaP2" },
    { method: "bank", address: "Contact support for bank details" }
  ]);
  console.log("Database seeded successfully");
}

seed().catch(console.error);
```

## Step 7: Testing and Monitoring

### 7.1 Test your deployment
1. Visit your Vercel URL
2. Test user registration and login
3. Test investment plans
4. Test deposit functionality
5. Test admin panel (create admin user first)

### 7.2 Create an admin user
1. Register a normal user through the website
2. Connect to your database and update the user's role:
```sql
UPDATE users SET role = 'admin' WHERE username = 'your_admin_username';
```

### 7.3 Monitor your application
- Use Vercel's built-in analytics
- Check function logs in Vercel dashboard
- Monitor database performance in Neon dashboard

## Step 8: Post-Deployment Configuration

### 8.1 Update deposit addresses
1. Log in as admin
2. Go to Admin Panel > Deposit Addresses
3. Update all cryptocurrency addresses to your real addresses

### 8.2 Configure email notifications (Optional)
Add email service for transaction notifications:
```bash
npm install nodemailer
```

### 8.3 Add rate limiting (Recommended)
```bash
npm install express-rate-limit
```

## Troubleshooting

### Common Issues:

1. **Build fails**: Check that all dependencies are in package.json
2. **Database connection fails**: Verify DATABASE_URL format and network access
3. **Static files not served**: Check build output directory configuration
4. **API routes not working**: Verify vercel.json routes configuration

### Environment Variables Not Working:
- Ensure all required environment variables are set in Vercel dashboard
- Restart deployment after adding new environment variables

### Database Issues:
- Check Neon dashboard for connection limits
- Verify SSL mode in connection string
- Run database migrations manually if needed

## Security Checklist

- ✅ Use HTTPS (automatically provided by Vercel)
- ✅ Set secure session secrets
- ✅ Validate all user inputs
- ✅ Use parameterized database queries
- ✅ Implement rate limiting
- ✅ Regular security updates

## Performance Optimization

1. Enable Vercel Edge Functions for better performance
2. Implement database connection pooling
3. Add caching for static content
4. Optimize images and assets
5. Monitor Core Web Vitals

Your Genius Trading Platform is now ready for production use! The platform includes:
- Complete user registration and authentication
- Investment plans with calculator
- Cryptocurrency deposit system with admin management
- KYC verification system
- Admin dashboard for user and transaction management
- Responsive design with animated UI
- Real-time balance tracking

Remember to regularly backup your database and keep your dependencies updated for security.