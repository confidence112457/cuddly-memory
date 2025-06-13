# Deploy to Vercel - Simple Guide

## Quick Start

Your cryptocurrency investment platform is ready for Vercel deployment with these pre-configured files:
- `vercel.json` - Deployment configuration
- `api/index.ts` - Serverless API handler
- `build-vercel.js` - Build optimization script

## Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   - Create a new repository on GitHub
   - Push your entire project code

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com) and sign up/login
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects the configuration

3. **Set Environment Variables**
   - In your Vercel project dashboard, go to Settings → Environment Variables
   - Add these required variables:
     ```
     DATABASE_URL=your_mongodb_connection_string
     SESSION_SECRET=your_secure_random_string
     NODE_ENV=production
     ```

4. **Deploy**
   - Click "Deploy" - Vercel handles everything automatically
   - Your site will be live at `https://your-project.vercel.app`

## Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel
   ```

3. **Follow prompts to configure project settings**

## Environment Variables Setup

### Required Variables (Critical)
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
SESSION_SECRET=your-super-secret-key-here
NODE_ENV=production
```

### How to Add Variables
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Click "Add New"
4. Enter variable name and value
5. Select "Production" environment
6. Click "Add"

## MongoDB Atlas Configuration

Ensure your MongoDB Atlas cluster allows Vercel connections:
1. In MongoDB Atlas, go to Network Access
2. Add IP Address: `0.0.0.0/0` (allows all IPs)
3. Or add Vercel's specific IP ranges if you prefer restricted access

## Post-Deployment Steps

1. **Test Your Live Site**
   - Visit your Vercel URL
   - Test user registration/login
   - Verify all API endpoints work
   - Check chat widget functionality

2. **Custom Domain (Optional)**
   - In Vercel dashboard: Settings → Domains
   - Add your domain and configure DNS

3. **Performance Monitoring**
   - Enable Vercel Analytics in project settings
   - Monitor function execution times
   - Watch for any timeout issues

## Common Issues & Solutions

**Build Fails:**
- Check all dependencies are properly installed
- Verify TypeScript compilation passes
- Review build logs in Vercel dashboard

**API Not Working:**
- Confirm DATABASE_URL is correctly set
- Check MongoDB Atlas network access
- Verify all environment variables are saved

**Slow Performance:**
- MongoDB connection might be slow on cold starts
- Consider upgrading Vercel plan for better performance
- Optimize database queries

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] All environment variables configured
- [ ] MongoDB Atlas network access configured
- [ ] Live site tested and working
- [ ] Custom domain added (if needed)
- [ ] SSL certificate active
- [ ] Chat widget functional

Your live site will be available at: `https://your-project-name.vercel.app`

**Required Variables:**
- `DATABASE_URL` - Your MongoDB connection string
- `NODE_ENV` - Set to "production"
- `SESSION_SECRET` - A secure random string for sessions

**Optional Variables:**
- `SENDGRID_API_KEY` - If using email functionality
- Any other API keys your application uses

### Setting Environment Variables:

1. Go to your project in Vercel Dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add each variable with name and value
5. Click "Save"

## Step 4: Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Important Notes

- **Database**: Make sure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Vercel's IP ranges
- **Build Time**: First deployment may take longer as Vercel builds your application
- **Function Limits**: Vercel has a 10-second timeout for serverless functions by default (increased to 30s in config)
- **File Size**: Keep your bundle size optimized for faster cold starts

## Troubleshooting

**Build Fails:**
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in package.json
- Verify TypeScript compilation

**Database Connection Issues:**
- Verify DATABASE_URL is correct
- Check MongoDB Atlas network access settings
- Ensure connection string includes username/password

**API Routes Not Working:**
- Check vercel.json routing configuration
- Verify API endpoints start with `/api/`

## Production Checklist

- [ ] All environment variables set
- [ ] Database connection tested
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active
- [ ] Performance monitoring enabled
- [ ] Error tracking configured

Your application will be available at: `https://your-project-name.vercel.app`