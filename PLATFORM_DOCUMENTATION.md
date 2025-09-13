# 🚀 **SHARED WEALTH INTERNATIONAL PLATFORM**
## **Complete Unified System Documentation**

---

## **📋 TABLE OF CONTENTS**

1. [Platform Overview](#platform-overview)
2. [Unified System Architecture](#unified-system-architecture)
3. [API Documentation](#api-documentation)
4. [Database Schema](#database-schema)
5. [Security & Authentication](#security--authentication)
6. [Performance & Optimization](#performance--optimization)
7. [Deployment Guide](#deployment-guide)
8. [Development Guide](#development-guide)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)

---

## **🎯 PLATFORM OVERVIEW**

The Shared Wealth International Platform is a comprehensive business networking and collaboration platform that has been completely unified and optimized for maximum performance, maintainability, and scalability.

### **Key Features:**
- **Unified Content System** - Centralized content management
- **Unified Social System** - Integrated social features
- **Unified Dashboard System** - Consolidated dashboard functionality
- **Unified File System** - Comprehensive file management
- **Unified User Management** - Complete user and authentication system

### **Technology Stack:**
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn/ui
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL with optimized queries
- **Authentication:** JWT with bcrypt password hashing
- **File Storage:** Local filesystem with cloud-ready architecture
- **Real-time:** WebSocket integration
- **Monitoring:** Winston logging, performance metrics

---

## **🏗️ UNIFIED SYSTEM ARCHITECTURE**

### **System Simplification Achieved:**

**Before (20+ Controllers):**
- `authController.ts`
- `userController.ts`
- `companyController.ts`
- `fileController.ts`
- `dashboardController.ts`
- `reactionsController.ts`
- `connectionsController.ts`
- `sharingController.ts`
- `companyNewsController.ts`
- `adminController.ts`
- And many more...

**After (5 Unified Controllers):**
- `UnifiedContentController.ts` - All content operations
- `UnifiedSocialController.ts` - All social features
- `UnifiedDashboardController.ts` - All dashboard functionality
- `UnifiedFileController.ts` - All file operations
- `UnifiedUserController.ts` - All user/auth operations

### **Architecture Benefits:**
- **75% Reduction** in controller complexity
- **Single Source of Truth** for each domain
- **Consistent API Patterns** across all endpoints
- **Unified Error Handling** and validation
- **Centralized Permission System**
- **Optimized Database Queries**

---

## **🔌 API DOCUMENTATION**

### **Unified Content API (`/api/content`)**

#### **Content Management**
```typescript
// Get all content
GET /api/content?type=news&limit=20&offset=0&search=term

// Get content by ID
GET /api/content/:id

// Create content
POST /api/content
{
  "title": "Content Title",
  "content": "Content body",
  "type": "news|update|announcement|collaboration|post|article|event",
  "company_id": "uuid",
  "tags": ["tag1", "tag2"],
  "media_urls": ["url1", "url2"],
  "is_published": true
}

// Update content
PUT /api/content/:id

// Delete content
DELETE /api/content/:id

// Toggle publish status
PATCH /api/content/:id/publish
```

#### **Content by Context**
```typescript
// Get content by company
GET /api/content/company/:companyId?type=news&limit=20

// Get content by user
GET /api/content/user/:userId?type=post&limit=20
```

### **Unified Social API (`/api/social`)**

#### **Reactions**
```typescript
// Add reaction
POST /api/social/reactions/:contentId
{
  "reaction_type": "like|dislike|love|laugh|wow|sad|angry",
  "content_type": "content|post|comment"
}

// Remove reaction
DELETE /api/social/reactions/:contentId

// Get reactions
GET /api/social/reactions/:contentId?content_type=content
```

#### **Connections**
```typescript
// Follow user
POST /api/social/follow/:targetUserId
{
  "connection_type": "follow|friend|colleague|mentor"
}

// Unfollow user
DELETE /api/social/follow/:targetUserId

// Get connections
GET /api/social/connections/:userId?type=followers&limit=20

// Get connection stats
GET /api/social/connections/:userId/stats
```

#### **Sharing**
```typescript
// Share content
POST /api/social/share/:contentId
{
  "share_type": "internal|linkedin|twitter|facebook|email",
  "platform": "linkedin",
  "message": "Custom message"
}

// Get shared content
GET /api/social/shares/:userId?platform=linkedin&limit=20
```

#### **Bookmarks**
```typescript
// Bookmark content
POST /api/social/bookmark/:contentId
{
  "content_type": "content|post|comment"
}

// Remove bookmark
DELETE /api/social/bookmark/:contentId

// Get bookmarks
GET /api/social/bookmarks/:userId?content_type=content&limit=20
```

### **Unified Dashboard API (`/api/dashboard`)**

#### **Dashboard Data**
```typescript
// Get unified dashboard
GET /api/dashboard?sections=overview,analytics,activity&period=30d

// Get user dashboard
GET /api/dashboard/user/:userId?period=7d

// Get company dashboard
GET /api/dashboard/company/:companyId?period=30d

// Get admin dashboard
GET /api/dashboard/admin?period=7d
```

#### **Analytics**
```typescript
// Get dashboard analytics
GET /api/dashboard/analytics?type=user&period=30d&entityId=uuid

// Get dashboard widgets
GET /api/dashboard/widgets?dashboardType=user

// Update dashboard widgets
PUT /api/dashboard/widgets
{
  "widgets": [
    {
      "id": "widget1",
      "type": "chart",
      "position": { "x": 0, "y": 0 },
      "config": { "chartType": "line" }
    }
  ]
}
```

#### **Notifications & Activity**
```typescript
// Get notifications
GET /api/dashboard/notifications?limit=20&offset=0&type=all

// Mark notification as read
PATCH /api/dashboard/notifications/:notificationId/read

// Get activity feed
GET /api/dashboard/activity?limit=20&offset=0&type=all
```

### **Unified File API (`/api/files`)**

#### **File Upload**
```typescript
// Upload single file
POST /api/files/upload
Content-Type: multipart/form-data
- file: File
- context: string
- contextId: string
- description: string
- tags: string (JSON array)

// Upload multiple files
POST /api/files/upload/multiple
Content-Type: multipart/form-data
- files: File[]
- context: string
- contextId: string
- description: string
- tags: string (JSON array)
```

#### **File Management**
```typescript
// Get file information
GET /api/files/:fileId

// Download file
GET /api/files/:fileId/download

// Update file metadata
PUT /api/files/:fileId
{
  "description": "Updated description",
  "tags": ["tag1", "tag2"],
  "isPublic": true
}

// Delete file
DELETE /api/files/:fileId
```

#### **File Organization**
```typescript
// Get files by context
GET /api/files/context/:context/:contextId?type=image&limit=20&search=term

// Get user's files
GET /api/files/user/:userId?type=document&limit=20&search=term
```

#### **File Sharing**
```typescript
// Share file
POST /api/files/:fileId/share
{
  "shareType": "public|private|restricted",
  "recipients": ["userId1", "userId2"],
  "message": "Share message",
  "expiresAt": "2024-12-31T23:59:59Z"
}

// Get file shares
GET /api/files/:fileId/shares
```

#### **File Analytics**
```typescript
// Get file analytics
GET /api/files/:fileId/analytics

// Get storage statistics
GET /api/files/storage/stats
```

### **Unified User API (`/api/users`)**

#### **Authentication**
```typescript
// Register user
POST /api/users/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}

// Login user
POST /api/users/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Logout user
POST /api/users/logout
```

#### **User Profile**
```typescript
// Get current user profile
GET /api/users/profile

// Update current user profile
PUT /api/users/profile
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "User bio",
  "avatar": "avatar_url",
  "preferences": { "theme": "dark" }
}

// Change password
POST /api/users/change-password
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

#### **User Management (Admin)**
```typescript
// Get user by ID
GET /api/users/:userId

// Get all users (admin only)
GET /api/users?limit=20&offset=0&search=term&role=user&status=active

// Update user (admin only)
PUT /api/users/:userId
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "role": "admin",
  "status": "active",
  "bio": "User bio",
  "avatar": "avatar_url"
}

// Delete user (admin only)
DELETE /api/users/:userId
```

#### **User Analytics**
```typescript
// Get user statistics
GET /api/users/:userId/stats

// Get user activity
GET /api/users/:userId/activity?limit=20&offset=0&type=all
```

#### **Password Management**
```typescript
// Request password reset
POST /api/users/request-password-reset
{
  "email": "user@example.com"
}

// Reset password
POST /api/users/reset-password/:token
{
  "newPassword": "new_password"
}

// Verify email
GET /api/users/verify-email/:token
```

---

## **🗄️ DATABASE SCHEMA**

### **Core Tables**

#### **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  status VARCHAR(20) DEFAULT 'active',
  bio TEXT,
  avatar VARCHAR(500),
  preferences JSONB,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  last_login TIMESTAMP,
  last_logout TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Companies Table**
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  website VARCHAR(255),
  logo VARCHAR(500),
  status company_status_type DEFAULT 'pending',
  founded_year INTEGER,
  employee_count INTEGER,
  revenue_range VARCHAR(50),
  location VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  social_links JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Unified Content Table**
```sql
CREATE TABLE unified_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  author_id UUID REFERENCES users(id),
  company_id UUID REFERENCES companies(id),
  tags TEXT[],
  media_urls TEXT[],
  metadata JSONB,
  reactions JSONB DEFAULT '{}',
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **File Uploads Table**
```sql
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_name VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  mimetype VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  context VARCHAR(50) DEFAULT 'general',
  context_id UUID,
  description TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Social Tables**

#### **User Connections Table**
```sql
CREATE TABLE user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id),
  following_id UUID REFERENCES users(id),
  connection_type VARCHAR(20) DEFAULT 'follow',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);
```

#### **Post Reactions Table**
```sql
CREATE TABLE post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  content_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  reaction_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, content_id, content_type)
);
```

#### **Content Shares Table**
```sql
CREATE TABLE content_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  content_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  share_type VARCHAR(20) NOT NULL,
  platform VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Bookmarks Table**
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  content_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, content_id, content_type)
);
```

### **Dashboard Tables**

#### **Activity Feed Table**
```sql
CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  activity_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Notifications Table**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## **🔐 SECURITY & AUTHENTICATION**

### **Authentication Flow**
1. **User Registration** - Email verification required
2. **Login** - JWT token generation with 7-day expiry
3. **Token Validation** - Middleware validates JWT on protected routes
4. **Password Security** - bcrypt hashing with salt rounds
5. **Session Management** - Secure logout and token invalidation

### **Permission System**
- **User Role** - Standard user permissions
- **Admin Role** - Full platform access
- **Context-based Access** - Users can access their own data
- **Public Content** - Published content visible to all users
- **File Access Control** - Public/private file settings

### **Security Features**
- **CORS Protection** - Configured for production domains
- **Rate Limiting** - API endpoint protection
- **Input Validation** - express-validator middleware
- **SQL Injection Prevention** - Parameterized queries only
- **XSS Protection** - Content sanitization
- **CSRF Protection** - Token-based validation

---

## **⚡ PERFORMANCE & OPTIMIZATION**

### **Caching Strategy**
- **API Response Caching** - 5-minute TTL for GET requests
- **Database Query Caching** - Optimized query results
- **User-specific Caching** - Personalized data caching
- **Company-specific Caching** - Company data caching
- **Global Data Caching** - Platform-wide data caching

### **Database Optimization**
- **Indexed Queries** - Optimized database indexes
- **Query Optimization** - Efficient SQL queries
- **Connection Pooling** - Database connection management
- **Query Monitoring** - Slow query detection and logging

### **Performance Monitoring**
- **API Response Times** - Request duration tracking
- **Database Query Times** - Query performance monitoring
- **Memory Usage** - System resource monitoring
- **Error Tracking** - Comprehensive error logging

### **Optimization Features**
- **Lazy Loading** - Component and route lazy loading
- **Code Splitting** - Optimized bundle sizes
- **Image Optimization** - Compressed and optimized images
- **CDN Ready** - Static asset optimization

---

## **🚀 DEPLOYMENT GUIDE**

### **Environment Setup**
```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Build the application
pnpm run build

# Start the server
node dist/server/server.js
```

### **Environment Variables**
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wealth_pioneers
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wealth_pioneers
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=3001
NODE_ENV=production

# Logging
LOG_LEVEL=info

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### **Production Deployment**
1. **Database Setup** - Create PostgreSQL database
2. **Environment Configuration** - Set production environment variables
3. **Build Application** - Run `pnpm run build`
4. **Start Server** - Run `node dist/server/server.js`
5. **Reverse Proxy** - Configure Nginx or Apache
6. **SSL Certificate** - Set up HTTPS
7. **Monitoring** - Set up log monitoring and alerts

---

## **👨‍💻 DEVELOPMENT GUIDE**

### **Project Structure**
```
wealth-pioneers-network/
├── src/
│   ├── components/          # React components
│   │   ├── content/        # Unified content components
│   │   ├── social/         # Unified social components
│   │   ├── dashboard/      # Unified dashboard components
│   │   ├── files/          # Unified file components
│   │   └── users/          # Unified user components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   └── integrations/       # Database and external services
├── server/
│   ├── controllers/        # Unified controllers
│   ├── services/           # Business logic services
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── types/              # TypeScript types
├── database/               # Database schemas and migrations
└── scripts/                # Build and deployment scripts
```

### **Development Commands**
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Run tests
pnpm run test

# Lint code
pnpm run lint

# Type check
pnpm run type-check
```

### **Code Standards**
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message standards
- **Component Structure** - Consistent component patterns

---

## **🔧 TROUBLESHOOTING**

### **Common Issues**

#### **Build Errors**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm run build
```

#### **Database Connection Issues**
```bash
# Check database connection
psql -h localhost -U username -d wealth_pioneers

# Verify environment variables
echo $DATABASE_URL
```

#### **API Errors**
- Check server logs in `logs/` directory
- Verify JWT token validity
- Check database connection
- Validate request parameters

#### **File Upload Issues**
- Check file size limits
- Verify upload directory permissions
- Check file type restrictions
- Validate multipart form data

### **Log Files**
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs
- `logs/performance.log` - Performance metrics
- `logs/security.log` - Security events
- `logs/database.log` - Database queries

---

## **🤝 CONTRIBUTING**

### **Development Workflow**
1. **Fork Repository** - Create your fork
2. **Create Branch** - `git checkout -b feature/new-feature`
3. **Make Changes** - Follow code standards
4. **Test Changes** - Run tests and linting
5. **Commit Changes** - Use conventional commits
6. **Push Branch** - `git push origin feature/new-feature`
7. **Create PR** - Submit pull request

### **Code Review Process**
- **Automated Checks** - CI/CD pipeline validation
- **Code Review** - Peer review required
- **Testing** - Comprehensive test coverage
- **Documentation** - Update relevant documentation

---

## **📊 PLATFORM STATISTICS**

### **Simplification Metrics**
- **Controllers Reduced:** 20+ → 5 (75% reduction)
- **API Endpoints:** 100+ → 50+ (unified and optimized)
- **Code Duplication:** Eliminated across all modules
- **Maintenance Complexity:** Significantly reduced
- **Performance:** Optimized with caching and monitoring

### **Feature Coverage**
- **Content Management:** ✅ Complete
- **Social Features:** ✅ Complete
- **Dashboard System:** ✅ Complete
- **File Management:** ✅ Complete
- **User Management:** ✅ Complete
- **Authentication:** ✅ Complete
- **Real-time Features:** ✅ Complete
- **Admin Panel:** ✅ Complete

---

## **🎉 CONCLUSION**

The Shared Wealth International Platform has been successfully transformed into a unified, optimized, and production-ready system. The platform now offers:

- **Unified Architecture** - 5 consolidated systems instead of 20+ separate controllers
- **Optimized Performance** - Caching, monitoring, and database optimization
- **Comprehensive Security** - JWT authentication, input validation, and access control
- **Production Ready** - Complete logging, monitoring, and deployment guides
- **Maintainable Code** - Consistent patterns, TypeScript, and documentation

The platform is now ready for production deployment and can scale efficiently to support thousands of users and companies.

---

**🚀 Ready for Production Deployment!**
