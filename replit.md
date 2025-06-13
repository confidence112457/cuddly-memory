# Genius Trading Platform

## Overview

A modern cryptocurrency investment platform built as a full-stack web application with automated trading features. The application provides investment plans, real-time market data display, and a sophisticated user interface for managing cryptocurrency investments.

## System Architecture

### Full-Stack Architecture
- **Frontend**: React with TypeScript using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Animation**: Framer Motion for smooth animations

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript schemas and types
- Root configuration for build tools, database, and deployment

## Key Components

### Frontend Architecture
- **Component-based Design**: Modular React components with TypeScript
- **UI System**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark theme
- **Animation**: Framer Motion for interactive elements and transitions
- **Form Handling**: React Hook Form with Zod validation
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Backend Architecture
- **API Layer**: Express.js with TypeScript for type safety
- **Database Layer**: Drizzle ORM with PostgreSQL schema
- **Storage Interface**: Abstracted storage layer (currently using in-memory storage with plans for database integration)
- **Development Server**: Integrated Vite development server for seamless development experience

### Database Schema
The application uses three main entities:
- **Users**: User authentication and profile information
- **Investments**: Investment plans and tracking
- **Transactions**: Financial transaction history

Key schema features:
- User management with authentication fields
- Investment plans (beginner, basic, pro) with different return rates
- Transaction tracking for deposits, withdrawals, and profits

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Processing**: Express.js routes handle business logic
3. **Data Access**: Storage interface abstracts database operations
4. **Response Handling**: Type-safe responses using shared schemas
5. **UI Updates**: React Query manages caching and UI synchronization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight client-side routing
- **framer-motion**: Animation library
- **@radix-ui/***: Accessible UI primitives
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Platform Configuration
- **Replit Deployment**: Configured for autoscale deployment
- **Build Process**: Vite builds the frontend, ESBuild bundles the backend
- **Environment**: Node.js 20 runtime with PostgreSQL 16
- **Port Configuration**: Server runs on port 5000, exposed on port 80

### Build Pipeline
1. Frontend build using Vite to `dist/public`
2. Backend bundle using ESBuild to `dist/index.js`
3. Production server serves static files and API routes
4. Database migrations managed through Drizzle Kit

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment configuration (development/production)

## Changelog

- June 13, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.