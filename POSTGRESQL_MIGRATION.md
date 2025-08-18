# PostgreSQL Migration Guide

## 🚀 **Migration from Supabase to PostgreSQL**

This document outlines the complete migration from Supabase to a direct PostgreSQL database setup for the Shared Wealth International platform.

## 📋 **What Was Removed**

### Supabase Dependencies
- `@supabase/supabase-js`
- `@supabase/auth-helpers-react`
- All Supabase configuration files
- Supabase CLI scripts and setup files

### Supabase Files
- `src/integrations/supabase/` directory
- `supabase/` directory (migrations, config)
- `fix_database.js`
- `run_sql_fix.js`
- `database-check.html`
- `setup-admin.js`
- `scripts/setup-admin.js`
- `scripts/quick-admin-setup.sh`

## 🆕 **What Was Added**

### New Dependencies
- `pg` - PostgreSQL client for Node.js
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin resource sharing
- `express` - Web server framework
- `nodemon` - Development server with auto-reload

### New Architecture
- **Direct PostgreSQL Connection** - No more Supabase abstraction layer
- **Custom Authentication System** - JWT-based auth with bcrypt password hashing
- **Express.js Backend Server** - RESTful API endpoints
- **Database Service Layer** - Generic CRUD operations
- **Local Session Management** - localStorage-based session storage

## 🗄️ **Database Schema**

The new PostgreSQL schema includes:

### Core Tables
- `users` - User accounts and authentication
- `admin_users` - Admin user management
- `companies` - Company profiles and information
- `user_companies` - User-company relationships
- `network_companies` - Network membership
- `company_applications` - Company application process

### Business Tables
- `funding_opportunities` - Available funding options
- `funding_applications` - User funding applications
- `social_license_agreements` - Business agreements
- `activity_feed` - Platform activity tracking

### Community Tables
- `forum_categories` - Discussion categories
- `forum_topics` - Forum discussions
- `forum_replies` - Forum responses
- `content_sections` - Dynamic content management

### Admin Tables
- `admin_activity_log` - Admin action logging

## 🔧 **Setup Instructions**

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
Copy `env.example` to `.env` and update:
```bash
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shared_wealth_international
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

### 3. Setup PostgreSQL Database
```bash
# Run the database setup script
pnpm run db:setup
```

This will:
- Create the database if it doesn't exist
- Execute the complete schema
- Create initial admin user (admin@sharedwealth.com / admin123)
- Insert sample data

### 4. Start the Backend Server
```bash
# Development mode with auto-reload
pnpm run server:dev

# Production mode
pnpm run server
```

### 5. Start the Frontend
```bash
pnpm run dev
```

## 🔐 **Authentication Changes**

### Before (Supabase)
```typescript
import { supabase } from '@/integrations/supabase/client';

const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

### After (PostgreSQL)
```typescript
import { AuthService } from '@/integrations/postgresql/auth';

const session = await AuthService.signIn(email, password);
```

### Session Management
- **Supabase**: Automatic session management with real-time subscriptions
- **PostgreSQL**: Manual session storage in localStorage with JWT tokens

## 📡 **API Endpoints**

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `POST /api/auth/reset-password` - Password reset

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Companies
- `GET /api/companies` - List companies
- `GET /api/companies/:id` - Get company details
- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company

### Funding
- `GET /api/funding-opportunities` - List funding opportunities
- `GET /api/funding-opportunities/:id` - Get funding details

### Forum
- `GET /api/forum/categories` - List forum categories
- `GET /api/forum/topics` - List forum topics

### Admin
- `GET /api/admin/users` - List all users (admin only)

## 🔄 **Migration Benefits**

### Advantages
1. **Full Control** - Direct database access and control
2. **No Vendor Lock-in** - PostgreSQL is open-source and portable
3. **Custom Authentication** - Tailored to specific business needs
4. **Cost Effective** - No Supabase subscription costs
5. **Performance** - Direct database queries without abstraction layer
6. **Flexibility** - Custom business logic and workflows

### Considerations
1. **Maintenance** - Need to manage database backups and updates
2. **Security** - Must implement proper security measures
3. **Scaling** - Need to handle database scaling manually
4. **Development** - More setup required for development environment

## 🛠️ **Development Workflow**

### Database Changes
1. Modify `src/integrations/postgresql/schema.sql`
2. Run `pnpm run db:reset` to apply changes
3. Update TypeScript interfaces if needed

### API Changes
1. Modify `server/index.ts` to add new endpoints
2. Update frontend components to use new API calls
3. Test with `pnpm run server:dev`

### Frontend Changes
1. Update components to use new authentication system
2. Replace Supabase calls with API calls
3. Update session management logic

## 🚨 **Important Notes**

### Security
- Change default admin password in production
- Use strong JWT secrets
- Implement proper CORS policies
- Add rate limiting for production

### Production
- Use environment variables for all sensitive data
- Implement proper logging and monitoring
- Set up database backups
- Use connection pooling for production loads

### Testing
- Test all authentication flows
- Verify admin functionality
- Test database operations
- Validate API endpoints

## 📚 **Additional Resources**

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js pg Documentation](https://node-postgres.com/)
- [Express.js Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/) - JWT token debugging

## 🆘 **Troubleshooting**

### Common Issues
1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify connection credentials
   - Check firewall settings

2. **Authentication Errors**
   - Verify JWT secret is set
   - Check password hashing
   - Validate user permissions

3. **API Endpoints Not Working**
   - Ensure server is running on correct port
   - Check CORS configuration
   - Verify route definitions

### Getting Help
- Check server logs for error messages
- Verify database schema is correct
- Test individual API endpoints
- Review authentication flow step by step
