# Genius Trading Platform

A modern cryptocurrency investment platform with animated UI, real-time data, and comprehensive admin dashboard.

## Features

- **Investment Plans**: Multiple investment tiers with daily returns
- **User Dashboard**: Track investments, transactions, and KYC status
- **Admin Dashboard**: Manage users, approve transactions, and handle KYC verification
- **Real-time Charts**: Interactive trading charts and price tickers
- **Secure Authentication**: Session-based authentication with role management
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with bcrypt password hashing
- **Deployment**: Vercel-ready configuration

## Quick Start

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (copy `.env.example` to `.env.local`)
4. Push database schema: `npm run db:push`
5. Start development server: `npm run dev`

### Admin Access

Default admin credentials:
- Username: `admin`
- Password: `password`
- Access: `/admin` (after login)

### Deployment to Vercel

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: Random secure string for sessions
3. Deploy automatically or manually trigger deployment

## Environment Variables

Required for production:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secure random string for session encryption
- `NODE_ENV`: Set to "production"

## Investment Plans

- **Beginner**: 0.5% daily return, $1,000-$4,999, 2 months
- **Basic**: 0.5% daily return, $5,000-$9,999, 3 months  
- **Pro**: 1.0% daily return, $10,000-$19,999, 4 months

## Admin Features

- User management and balance updates
- Transaction approval and processing
- KYC document verification
- System analytics and reporting

## API Routes

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### User Operations
- `POST /api/investments` - Create investment
- `GET /api/investments` - Get user investments
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get user transactions
- `POST /api/kyc` - Submit KYC documents
- `GET /api/kyc` - Get KYC status

### Admin Operations
- `GET /api/admin/users` - Get all users
- `GET /api/admin/transactions` - Get all transactions
- `PUT /api/admin/transactions/:id` - Update transaction status
- `GET /api/admin/kyc` - Get pending KYC submissions
- `PUT /api/admin/kyc/:id` - Update KYC status

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Role-based access control
- SQL injection protection with parameterized queries
- CSRF protection through session validation

## Support

For issues or questions, contact the development team or check the documentation.