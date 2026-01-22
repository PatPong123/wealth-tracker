# WOXA Wealth Tracker MVP - Requirements Summary

## Project Overview
A Portfolio Tracker web application that allows users to:
- Record their own assets
- View profit/loss
- See investment allocation percentages
- SEO-optimized Landing Page

## Tech Stack (Required)
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: NestJS (recommended) or Express JS or Next.js API, TypeScript
- **Database**: PostgreSQL or MySQL

## Features Required

### Feature A: Authentication System
- **Register**: User registration with Username and Password
- **Login**: Login and receive JWT Token for Authentication
- **Protection**: Dashboard and Portfolio pages accessible only to logged-in users

### Feature B: Portfolio Management
Users can CRUD (Create, Read, Update, Delete) assets in portfolio with:
1. **Symbol/Name**: e.g., AAPL - input as selection field (searchable from API)
2. **Purchase Price**: Cost per unit
3. **Quantity**: Number of units held

### Feature C: Dashboard & Visualization
After login, Dashboard must display:
1. **Portfolio Summary Cards**:
   - Total Balance: Current total portfolio value
   - Total Profit/Loss: Show profit/loss (green for positive, red for negative) as amount and percentage
2. **Asset Allocation Chart**: Pie/Doughnut chart showing asset value proportion by asset name
3. **List of Assets**: Table showing all assets with Edit/Delete buttons

**Note**: Asset prices fetched from API Endpoints

### Feature D: Public Page & SEO (Home Page)
- Create Home/Landing Page (accessible without login)
- Basic SEO Optimization required:
  - Use Semantic HTML
  - Server-Side Rendering (SSR) or Static Site Generation (SSG) where appropriate
  - Meta Tags (Title, Description, Open Graph) for good Search/Share results

## Deliverables
1. **Source Code**: Upload to GitHub or GitLab
2. **README.md**:
   - Installation Guide
   - Architecture explanation
   - (Optional) Profit/Loss calculation formula explanation
3. **Database Dump/Seed**: Or Docker Compose file for easy team testing

## API Endpoints for Testing
1. **GET All Stocks**: `GET https://woxa-stocks-test-data.yuttanar.workers.dev/`
   - Response: `{ "success": true, "count": 100, "data": [...] }`

2. **GET by Symbol**: `GET https://woxa-stocks-test-data.yuttanar.workers.dev/symbol/:symbol`
   - Example: `GET https://woxa-stocks-test-data.yuttanar.workers.dev/symbol/AAPL`
   - Response: `{ "success": true, "data": [...] }`

3. **GET by Type**: `GET https://woxa-stocks-test-data.yuttanar.workers.dev/type/:type`
   - Example: `GET https://woxa-stocks-test-data.yuttanar.workers.dev/type/Technology`
   - Response: `{ "success": true, "count": 15, "data": [...] }`

**Notes**:
- Can use other public APIs for asset prices
- Can create own API Endpoint
- API Endpoint is for testing only, prices shown are not real prices

## Scoring Criteria (100 points total)

### 1. Architecture & Code Quality (30 points)
- Backend Structure (NestJS): Clear Module, Controller, Service separation with Dependency Injection
- Code Cleanliness: Good variable naming, Logic separated from Controller
- Type Safety: Use TypeScript Interface/DTO correctly, no `any`
- Validation: Validate input data (e.g., no negative prices)

### 2. Frontend & User Experience (25 points)
- React/Next.js Best Practices: Use Hooks, Components with clear separation
- Responsiveness: Display well on Desktop and Mobile
- Visualization: Charts display data correctly, easy to understand (Chart.js, Recharts)
- UX Flow: Smooth usage with Loading State or Error Handling

### 3. SEO & Performance (15 points)
- SSR/SSG Usage: Choose appropriate rendering for Landing Page
- Metadata: Configure next/head or Next.js Metadata API correctly
- Semantics: Correct HTML structure (H1, H2, alt text)

### 4. Bonus / Advanced Skills (30 points) - Optional
- Docker: Dockerfile/docker-compose that runs both App and DB together
- Database: Use ORM, migrations, seeding
- Unit Testing: Basic tests (e.g., calculation formulas or main components)
- UI, API Documentation
- CI/CD
- Live Deployment Readiness: Can deploy and provide URL for review (Live Demo)
- Beautiful, easy-to-use UI with modern design and good UX
- Feature Innovation: Creative features beyond requirements (e.g., historical price charts, Dark Mode)
