# WOXA Wealth Tracker MVP

A full-stack Portfolio Tracker web application that allows users to record their own assets, view profit/loss, and see investment allocation percentages with an SEO-optimized Landing Page.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Authentication | JWT (JSON Web Tokens) |
| Charts | Chart.js with react-chartjs-2 |
| State Management | Zustand |
| Form Handling | React Hook Form + Zod |

## Project Structure

```
woxa-wealth-tracker/
├── backend/                    # NestJS Backend API
│   ├── prisma/                 # Database schema and migrations
│   │   ├── schema.prisma       # Prisma schema definition
│   │   └── seed.ts             # Database seeding script
│   ├── src/
│   │   ├── auth/               # Authentication module
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── guards/         # Auth guards (JWT, Local)
│   │   │   ├── strategies/     # Passport strategies
│   │   │   ├── decorators/     # Custom decorators
│   │   │   └── interfaces/     # TypeScript interfaces
│   │   ├── users/              # Users module
│   │   ├── portfolio/          # Portfolio management module
│   │   ├── assets/             # External assets data module
│   │   ├── prisma/             # Prisma service module
│   │   ├── app.module.ts       # Root application module
│   │   └── main.ts             # Application entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── page.tsx        # Landing page (SSG/SEO)
│   │   │   ├── auth/           # Authentication pages
│   │   │   └── (dashboard)/    # Protected dashboard pages
│   │   ├── components/         # React components
│   │   │   ├── ui/             # UI components
│   │   │   ├── charts/         # Chart components
│   │   │   └── portfolio/      # Portfolio components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions
│   │   ├── services/           # API service functions
│   │   ├── types/              # TypeScript type definitions
│   │   └── styles/             # Global styles
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml          # Docker Compose configuration
└── README.md                   # This file
```

## Features

### Feature A: Authentication System
- User registration with username and password
- JWT-based authentication
- Protected routes for Dashboard and Portfolio pages

### Feature B: Portfolio Management
- CRUD operations for portfolio assets
- Asset search with autocomplete from external API
- Purchase price and quantity tracking

### Feature C: Dashboard & Visualization
- Portfolio summary cards (Total Balance, Profit/Loss, Active Assets)
- Asset allocation pie/doughnut chart
- Portfolio table with edit/delete actions

### Feature D: Public Page & SEO
- SEO-optimized landing page
- Server-Side Rendering (SSR) / Static Site Generation (SSG)
- Meta tags for Open Graph and Twitter Cards

## Installation Guide

### Prerequisites
- Node.js 18+ 
- PostgreSQL 15+ (or Docker)
- npm or pnpm

### Option 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd woxa-wealth-tracker
```

2. Start all services with Docker Compose:
```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - API Documentation: http://localhost:3001/api/docs

### Option 2: Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/woxa_wealth_tracker?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3001
```

5. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

6. (Optional) Seed the database:
```bash
npm run prisma:seed
```

7. Start the development server:
```bash
npm run start:dev
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

5. Start the development server:
```bash
npm run dev
```

## Architecture Overview

### Backend Architecture

The backend follows NestJS modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        Controllers                          │
│  (Handle HTTP requests, validate input, return responses)   │
├─────────────────────────────────────────────────────────────┤
│                         Services                            │
│    (Business logic, data processing, external API calls)    │
├─────────────────────────────────────────────────────────────┤
│                      Prisma Service                         │
│           (Database operations, ORM layer)                  │
├─────────────────────────────────────────────────────────────┤
│                       PostgreSQL                            │
│                    (Data persistence)                       │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

The frontend uses Next.js App Router with component-based architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                         Pages                               │
│        (Route handlers, data fetching, layouts)             │
├─────────────────────────────────────────────────────────────┤
│                       Components                            │
│      (Reusable UI components, charts, forms, modals)        │
├─────────────────────────────────────────────────────────────┤
│                    Hooks & Services                         │
│     (State management, API calls, business logic)           │
├─────────────────────────────────────────────────────────────┤
│                      API Client                             │
│        (Axios instance, interceptors, error handling)       │
└─────────────────────────────────────────────────────────────┘
```

## Profit/Loss Calculation Formula

The profit/loss calculation is performed as follows:

```
Total Cost = Purchase Price × Quantity
Current Value = Current Price × Quantity
Profit/Loss = Current Value - Total Cost
Profit/Loss Percentage = (Profit/Loss / Total Cost) × 100
```

**Example:**
- Purchase Price: $100
- Quantity: 10 units
- Current Price: $150

```
Total Cost = $100 × 10 = $1,000
Current Value = $150 × 10 = $1,500
Profit/Loss = $1,500 - $1,000 = $500 (Profit)
Profit/Loss Percentage = ($500 / $1,000) × 100 = 50%
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/profile` | Get current user profile |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Get all portfolio items |
| GET | `/api/portfolio/summary` | Get portfolio summary |
| GET | `/api/portfolio/:id` | Get specific portfolio item |
| POST | `/api/portfolio` | Add new portfolio item |
| PATCH | `/api/portfolio/:id` | Update portfolio item |
| DELETE | `/api/portfolio/:id` | Delete portfolio item |

### Assets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | Get all available assets |
| GET | `/api/assets/search?q=` | Search assets |
| GET | `/api/assets/symbol/:symbol` | Get asset by symbol |
| GET | `/api/assets/type/:type` | Get assets by type |

## External API

The application uses the following test API for stock data:

- **Base URL**: `https://woxa-stocks-test-data.yuttanar.workers.dev`
- **Get All Stocks**: `GET /`
- **Get by Symbol**: `GET /symbol/:symbol`
- **Get by Type**: `GET /type/:type`

> **Note**: This API is for testing purposes only. Prices shown are not real market prices.

## Demo Credentials

After running the seed script, you can use these credentials:

- **Username**: `demo`
- **Password**: `demo123`

## Development

### Running Tests

Backend:
```bash
cd backend
npm run test
npm run test:cov  # with coverage
```

### Linting

```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

### API Documentation

Swagger documentation is available at:
```
http://localhost:3001/api/docs
```

## License

MIT License
