# Shared Wealth International - Technical Project Summary
## For Developer Team Review

### Project Overview
**Shared Wealth International** is a B2B collaboration platform connecting companies for equitable wealth distribution through partnerships, networking, and resource sharing. The platform enables companies to showcase profiles, connect with partners, share content, manage funding opportunities, and collaborate on growth initiatives.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Shadcn UI
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL 16 (30+ tables)
- **Authentication**: JWT with secure session management
- **Real-time**: WebSocket service for live updates
- **File Storage**: Multer for uploads
- **Deployment**: Render (static site + web service)
- **Testing**: Puppeteer E2E, comprehensive test suites

### Current Status

#### ✅ What's Working Locally
- **Frontend (http://localhost:8081)**
  - Modern, responsive UI with Shadcn components
  - User authentication and signup with profile creation
  - User Dashboard showing "My Companies" and "My Network"
  - Company Management and Company Dashboard
  - Network page with "My Network" and "Companies Directory" tabs
  - News & Updates content management
  - Events management
  - Forum discussions
  - Messaging system
  - Collaboration meetings tracker
  - Admin dashboard with monitoring
  - Profile management with social links
  - File upload functionality (profile pictures, documents)
  
- **Backend (http://localhost:8080)**
  - RESTful API with 70+ endpoints
  - Layered architecture (Routes → Controllers → Services → Database)
  - JWT authentication with middleware
  - Role-based access control (user, admin, superadmin)
  - Comprehensive logging with Winston
  - Error handling middleware
  - Rate limiting and security (Helmet, CORS)
  - WebSocket service for real-time features
  - File upload handling
  - Email service integration (SMTP configured)
  
- **Database (PostgreSQL)**
  - 30+ fully normalized tables
  - Schema: users, companies, user_companies, network_connections, unified_content, company_news, events, forums, messages, reactions, shares, funding_opportunities, etc.
  - Foreign key relationships and constraints
  - UUID primary keys throughout
  - Timestamps on all tables
  - Sample data for testing

- **Features Fully Implemented**
  - User registration with complete profile (bio, location, social links)
  - Company creation or joining existing companies
  - Network management (add/remove companies to personal network)
  - Content creation and sharing
  - Social features (reactions, comments, shares)
  - Company news updates
  - Event management
  - Forum discussions
  - Direct messaging
  - Admin monitoring dashboard
  - Real-time notifications via WebSocket

#### ❌ Production Deployment Issues

**Render Deployment (srv-d3nnamje5dus73ef4rm0)**
1. **Only Static Site Deployed**: Frontend-only at https://shared-wealth-international.onrender.com
2. **No Backend Server**: Missing Node.js web service for API endpoints
3. **No Database**: PostgreSQL database not created (free tier limit: 1/1 used by another project)
4. **Environment Variables**: Missing production configs
5. **API Calls Failing**: Frontend trying to call non-existent https://sharedwealth.net/api

**What's Needed for Production**:
- PostgreSQL database (Starter plan $7/month or upgrade existing)
- Web service for backend API (Free or Starter $7/month)
- Environment variable configuration (DATABASE_URL, JWT secrets, etc.)
- Database migrations (run comprehensive_schema.sql + production-database-fix.sql)
- CORS configuration for production domains
- SSL certificate setup (handled by Render)

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                        │
│              (React SPA + TypeScript)                    │
└───────────────────┬─────────────────────────────────────┘
                    │ HTTPS
                    │ JWT Bearer Token
                    ▼
┌─────────────────────────────────────────────────────────┐
│                   RENDER STATIC SITE                     │
│           (Frontend - Currently Deployed ✅)             │
│      https://shared-wealth-international.onrender.com    │
└───────────────────┬─────────────────────────────────────┘
                    │ API Calls
                    │ /api/*
                    ▼
┌─────────────────────────────────────────────────────────┐
│              RENDER WEB SERVICE (MISSING ❌)             │
│                   Node.js + Express                      │
│              Backend API Server (Port 10000)             │
│                                                          │
│  Routes → Controllers → Services → Database              │
│                                                          │
│  • Authentication (JWT)                                  │
│  • Authorization (RBAC)                                  │
│  • Business Logic                                        │
│  • Real-time WebSocket                                   │
│  • File Uploads                                          │
│  • Email Service                                         │
└───────────────────┬─────────────────────────────────────┘
                    │ SQL Queries
                    │ pg Pool
                    ▼
┌─────────────────────────────────────────────────────────┐
│          RENDER POSTGRESQL DATABASE (MISSING ❌)         │
│                    PostgreSQL 16                         │
│                                                          │
│  30+ Tables:                                             │
│  • users, companies, user_companies                      │
│  • network_connections, unified_content                  │
│  • company_news, events, forums, messages                │
│  • reactions, shares, funding_opportunities              │
│  • admin_monitoring, collaborations, etc.                │
└─────────────────────────────────────────────────────────┘
```

### Database Schema Overview

**Core Tables (30+)**:
1. **users** - User accounts, authentication, profiles
2. **companies** - Company profiles and information
3. **user_companies** - Many-to-many: users belong to companies
4. **network_connections** - User's company network
5. **unified_content** - Posts, articles, announcements
6. **company_news** - Company-specific news updates
7. **events** - Event management
8. **forums** - Discussion forums
9. **forum_topics** - Forum topics
10. **forum_posts** - Forum discussions
11. **messages** - Direct messaging
12. **message_threads** - Message organization
13. **reactions** - Likes, loves, etc. on content
14. **shares** - Content sharing tracking
15. **comments** - Comments on content
16. **funding_opportunities** - Investment/funding listings
17. **admin_logs** - Admin activity tracking
18. **admin_monitoring** - System monitoring
19. **collaborations** - Company collaboration tracking
20. **growth_metrics** - Company growth data
21. **notifications** - User notifications
22. **files** - File upload metadata
23. And more...

**Relationships**:
- Users ←→ Companies (many-to-many via user_companies)
- Users ←→ Network Connections (many-to-many via network_connections)
- Users → Content (one-to-many)
- Content → Reactions/Comments/Shares (one-to-many)
- Companies → News/Events (one-to-many)

### API Endpoints (70+)

**Authentication** (`/api/auth`)
- POST /signin - User login
- POST /signup - User registration
- POST /signout - User logout
- POST /reset-password - Password reset

**Users** (`/api/users`)
- GET / - List users (admin)
- GET /:id - Get user by ID
- PUT /:id - Update user
- DELETE /:id - Delete user
- GET /profile - Current user profile
- PUT /profile - Update profile

**Companies** (`/api/companies`)
- GET / - List all companies
- GET /:id - Get company details
- POST / - Create company
- PUT /:id - Update company
- DELETE /:id - Delete company
- GET /user - Get user's companies

**Networks** (`/api/networks`)
- GET /available - Companies not in network
- GET /user - User's network
- POST /add - Add company to network
- DELETE /remove - Remove from network

**Content** (`/api/content`)
- GET / - List content (with filters)
- GET /:id - Get content by ID
- POST / - Create content
- PUT /:id - Update content
- DELETE /:id - Delete content

**Social** (`/api/social`)
- POST /reactions - Add reaction
- DELETE /reactions/:id - Remove reaction
- POST /comments - Add comment
- POST /shares - Share content

**Admin** (`/api/admin`)
- GET /users - User management
- GET /monitoring - System metrics
- POST /content - Content moderation
- GET /funding - Funding management

**Files** (`/api/files`)
- POST /upload - Upload file
- GET /:id - Download file

**Real-time** (WebSocket)
- Notifications
- Live updates
- Chat messages

### Security Features
- **JWT Authentication**: Secure token-based auth with issuer/audience validation
- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Secure session handling
- **CSRF Protection**: CSRF tokens on sensitive operations
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet**: Security headers
- **CORS**: Configured for allowed origins
- **Input Validation**: Sanitized database queries
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization

### Testing

**E2E Tests Available**:
- `test-full-network-functionality.js` - Network features test
- `comprehensive-e2e-testing.js` - Full platform test
- `test-signup-comprehensive.js` - Signup flow test
- Tests cover: Authentication, network management, company operations, content creation

**Test Coverage Includes**:
- User authentication flows
- Company creation and management
- Network connection operations
- Content CRUD operations
- Admin dashboard functionality
- File upload handling

**Testing Framework**: Puppeteer for browser automation

### Development Environment Setup

**Prerequisites**:
- Node.js v18+
- PostgreSQL 16
- pnpm package manager

**Local Setup**:
```bash
# Install dependencies
pnpm install

# Start PostgreSQL (ensure running on localhost:5432)
# Create database: shared_wealth_international

# Run database migrations
psql -U postgres -d shared_wealth_international -f database/comprehensive_schema.sql
psql -U postgres -d shared_wealth_international -f production-database-fix.sql

# Configure .env file (see below)

# Start backend server
pnpm run server:dev    # Port 8080

# Start frontend (separate terminal)
pnpm run dev           # Port 8081

# Run tests
node test-full-network-functionality.js
```

**Environment Variables Required**:
```env
# Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=shared_wealth_international
DB_PASSWORD=your_password
DB_PORT=5432

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_AUDIENCE=wealth-pioneers-users
JWT_ISSUER=shared-wealth-international

# Session
SESSION_SECRET=session-secret
CSRF_SECRET=csrf-secret

# API
VITE_API_URL=http://localhost:8080/api
NODE_ENV=development
PORT=8080

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@sharedwealth.com
```

### Production Deployment Requirements

**Infrastructure Needed**:

1. **PostgreSQL Database**
   - Plan: Starter ($7/month minimum)
   - Region: Oregon (or nearest to users)
   - Version: 16
   - Storage: 10GB minimum
   - SSL: Required

2. **Web Service (Backend API)**
   - Runtime: Node.js 18+
   - Build Command: `pnpm install && pnpm run server:build`
   - Start Command: `node dist/server/server.js`
   - Port: 10000 (Render default)
   - Plan: Starter ($7/month) or Free (with sleep)
   - Environment: All variables from above + production values

3. **Static Site (Frontend)** - Already Deployed ✅
   - Build Command: `pnpm install && pnpm run build`
   - Publish Directory: `dist`
   - Environment: `VITE_API_URL=https://[backend-url]/api`

**Deployment Steps**:

1. **Create PostgreSQL Database on Render**
   - Save internal/external URLs
   - Note credentials (auto-generated)

2. **Run Database Migrations**
   - Connect via psql command provided by Render
   - Execute: `database/comprehensive_schema.sql`
   - Execute: `production-database-fix.sql`
   - Verify: Check tables exist

3. **Create Web Service on Render**
   - Connect GitHub repository
   - Configure build/start commands
   - Add all environment variables
   - Set DATABASE_URL from step 1
   - Deploy

4. **Update Static Site**
   - Add environment variable: `VITE_API_URL=[backend-url]/api`
   - Trigger manual deploy

5. **Verify**
   - Test health endpoint: `GET /health`
   - Test auth: `POST /api/auth/signin`
   - Test database: `GET /api/companies`
   - Test frontend: Open in browser

### Known Issues & Solutions

#### Issue 1: Duplicate React Packages (RESOLVED ✅)
- **Problem**: `node_modules` had duplicate React causing hooks to fail
- **Solution**: `rm -rf node_modules && pnpm install`
- **Status**: Fixed locally

#### Issue 2: Missing Database Columns in Production
- **Problem**: Production DB missing columns (type, position, etc.)
- **Solution**: Run `production-database-fix.sql` migration script
- **Status**: Script ready, needs production database

#### Issue 3: JWT Verification Failures
- **Problem**: Issuer/audience mismatch between local and production
- **Solution**: Ensure consistent JWT_AUDIENCE and JWT_ISSUER across environments
- **Status**: Handled with fallback in auth middleware

#### Issue 4: File Upload Button Not Working (RESOLVED ✅)
- **Problem**: Button wrapped in Label tag preventing clicks
- **Solution**: Direct onClick handler to trigger file input
- **Status**: Fixed

#### Issue 5: Network Tab Showing All Companies
- **Problem**: "My Network" showed all companies instead of user's network
- **Solution**: Separate API calls for getUserCompanies() vs getCompanies()
- **Status**: Fixed locally

#### Issue 6: User Banner on Auth Page (RESOLVED ✅)
- **Problem**: Confusing UX showing user info on login page
- **Solution**: Removed banner, added direct redirect to dashboard after login
- **Status**: Fixed

### Performance Considerations

**Backend**:
- Connection pooling for database (10-20 connections)
- Response caching where appropriate
- Lazy loading for large datasets
- Pagination on list endpoints

**Frontend**:
- Code splitting with React lazy loading
- Image optimization
- Bundle size optimization with Vite
- CDN for static assets (via Render)

**Database**:
- Indexes on frequently queried columns (id, email, created_at)
- Foreign key constraints for data integrity
- Efficient query design (avoid N+1 queries)

### Monitoring & Logging

**Current Logging**:
- Winston logger with multiple transports
- Log levels: error, warn, info, debug
- Separate files: error.log, combined.log
- Console output in development

**Monitoring Endpoints**:
- GET /health - Basic health check
- GET /health/db - Database connection check
- GET /api/admin/monitoring - System metrics (admin only)

**Recommended Additions**:
- Application Performance Monitoring (APM) tool
- Error tracking (Sentry, Rollbar)
- Uptime monitoring
- Database query performance tracking

### Scalability Path

**Immediate (Current)**:
- Handles 100-500 concurrent users
- Single server architecture
- Shared database pool

**Short-term (Next 6 months)**:
- Upgrade to Pro plan ($25/month)
- Increase database connections
- Add Redis for session management
- Implement API caching

**Long-term (1+ year)**:
- Horizontal scaling with load balancer
- Read replicas for database
- Microservices architecture
- CDN for global distribution
- Message queue for async operations

### Documentation Status

**Available Docs**:
- ✅ DATABASE_DESIGN.md - Database schema documentation
- ✅ RENDER_PRODUCTION_SETUP.md - Production deployment guide
- ✅ COMPANY_ACCOUNTS_SUMMARY.md - Company account structure
- ✅ DIRECTADMIN_DEPLOYMENT.md - Alternative deployment guide
- ✅ comprehensive-test-report.md - Test results
- ✅ API endpoint documentation (inline in route files)

**Needed Docs**:
- ❌ API Reference (OpenAPI/Swagger)
- ❌ User Guide
- ❌ Admin Manual
- ❌ Contributing Guidelines
- ❌ Security Policy

### Cost Analysis

**Current (Development)**:
- Local hosting: $0
- Developer time: Included

**Production (Minimum)**:
- Static Site (Frontend): $0
- Web Service (Free tier): $0
- PostgreSQL (Free tier): $0 (but limit reached)
- **Total**: $0/month (not viable - needs paid database)

**Production (Recommended)**:
- Static Site: $0
- Web Service Starter: $7/month
- PostgreSQL Starter: $7/month
- **Total**: $14/month

**Production (Growth)**:
- Static Site: $0
- Web Service Pro: $25/month
- PostgreSQL Pro: $25/month
- **Total**: $50/month (for 1000+ users)

### Migration Scripts Available

**Database Migrations** (in `/database/`):
1. `comprehensive_schema.sql` - Full schema (30+ tables)
2. `production-database-fix.sql` - Production fixes
3. `sample_data_final.sql` - Test data
4. `unified_content_table.sql` - Content management
5. `social_features_sample_data.sql` - Social features
6. `company_news_table.sql` - News features
7. `missing_tables.sql` - Additional tables

**Execution Order**:
1. comprehensive_schema.sql (base schema)
2. production-database-fix.sql (fixes and updates)
3. sample_data_final.sql (optional test data)

### Git Repository Structure

```
Shared-Wealth-International/
├── src/                          # Frontend React code
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Page components
│   ├── contexts/                # React contexts (Auth, etc.)
│   ├── services/                # API service layer
│   ├── hooks/                   # Custom React hooks
│   └── integrations/            # External integrations
│       └── postgresql/          # Database types
├── server/                       # Backend Node.js code
│   ├── routes/                  # API route definitions
│   ├── controllers/             # Request handlers
│   ├── services/                # Business logic
│   ├── middleware/              # Auth, validation, etc.
│   └── server.ts                # Entry point
├── database/                     # SQL migration scripts
├── tests/                        # Test files
├── dist/                         # Build output
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
└── README.md                     # Project README
```

### Dependencies Overview

**Frontend Key Dependencies**:
- react: ^18.3.1
- react-router-dom: ^7.1.1
- @tanstack/react-query: ^5.62.11
- tailwindcss: ^3.4.17
- @radix-ui components (via Shadcn)
- lucide-react: ^0.468.0 (icons)

**Backend Key Dependencies**:
- express: ^5.1.0
- pg: ^8.13.1 (PostgreSQL)
- bcrypt: ^5.1.1
- jsonwebtoken: ^9.0.2
- winston: ^3.17.0 (logging)
- helmet: ^8.0.0 (security)
- multer: ^1.4.5-lts.1 (file uploads)
- ws: ^8.18.0 (WebSocket)

**Dev Dependencies**:
- typescript: ^5.9.2
- vite: ^5.4.19
- puppeteer: ^24.22.3
- nodemon: ^3.1.10
- eslint: ^9.26.0

### Team Requirements & Expertise Needed

**To Complete Production Deployment**:

1. **DevOps Engineer (4-8 hours)**
   - Set up Render PostgreSQL database
   - Create and configure web service
   - Set up environment variables
   - Run database migrations
   - Configure SSL and domain
   - Set up monitoring

2. **Backend Developer (2-4 hours)**
   - Verify API endpoints work in production
   - Test database connections
   - Configure CORS for production domain
   - Optimize database queries if needed
   - Set up error tracking

3. **Frontend Developer (1-2 hours)**
   - Update environment variables
   - Test all pages in production
   - Fix any production-specific UI issues
   - Verify file uploads work

4. **QA Engineer (4-6 hours)**
   - Run full E2E test suite
   - Manual testing of all features
   - Cross-browser testing
   - Performance testing
   - Security testing

**Estimated Total Effort**: 12-20 hours

### Critical Path to Production

**Phase 1: Infrastructure (Day 1)**
- [ ] Create Render PostgreSQL database
- [ ] Create Render web service for backend
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Verify health endpoints

**Phase 2: Integration (Day 1-2)**
- [ ] Update frontend API URL
- [ ] Test authentication flow
- [ ] Test company and network features
- [ ] Test content creation
- [ ] Verify file uploads

**Phase 3: Testing (Day 2-3)**
- [ ] Run automated E2E tests
- [ ] Manual feature testing
- [ ] Performance testing
- [ ] Security audit
- [ ] Browser compatibility

**Phase 4: Launch (Day 3)**
- [ ] Final smoke tests
- [ ] Monitor logs for errors
- [ ] Set up uptime monitoring
- [ ] Document any issues
- [ ] Go live!

### Support & Maintenance Plan

**Daily**:
- Monitor error logs
- Check uptime status
- Review user feedback

**Weekly**:
- Database backup verification
- Performance metrics review
- Security updates check

**Monthly**:
- Dependency updates
- Security audit
- Performance optimization
- User analytics review

### Contact & Resources

**Repository**: https://github.com/msalmanmunirmalik/Shared-Wealth-International

**Render Service ID**: srv-d3nnamje5dus73ef4rm0

**Current Deployment**: https://shared-wealth-international.onrender.com (frontend only)

**Documentation**:
- Full deployment guide: `RENDER_PRODUCTION_SETUP.md`
- Database design: `DATABASE_DESIGN.md`
- Test reports: `comprehensive-test-report.md`

### 150-Word Executive Summary for Developers

**Shared Wealth International** is a production-ready B2B networking platform built with React + TypeScript (frontend), Node.js + Express (backend), and PostgreSQL (30+ tables). The application is **fully functional locally** with 70+ API endpoints, JWT authentication, real-time WebSocket features, and comprehensive user/company/network management.

**Current Challenge**: Only the frontend static site is deployed to Render (srv-d3nnamje5dus73ef4rm0). **Missing in production**: (1) Backend Node.js web service for API endpoints, (2) PostgreSQL database (free tier limit reached). The app cannot function without these components.

**Required Actions**: Create Render PostgreSQL database ($7/month Starter plan), deploy Node.js backend web service, run database migrations (comprehensive_schema.sql + production-database-fix.sql), configure 15+ environment variables (DATABASE_URL, JWT secrets, etc.), and connect frontend to backend API.

**Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, Node.js, Express, PostgreSQL 16, JWT auth, WebSocket, Puppeteer E2E testing. **Effort Estimate**: 12-20 hours for DevOps + backend + QA to complete production deployment. All code, migrations, and documentation ready.

---

**Document Version**: 1.0  
**Last Updated**: October 16, 2025  
**Status**: Ready for Developer Team Review  
**Estimated Deployment Time**: 1-3 days  
**Estimated Cost**: $14/month minimum

