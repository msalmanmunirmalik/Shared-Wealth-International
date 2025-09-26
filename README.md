# Shared Wealth International Platform

A comprehensive platform for building sustainable businesses through shared wealth principles, featuring company management, funding opportunities, and collaborative networking.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (package manager)
- **PostgreSQL** (v12 or higher)
- **Redis** (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shared-wealth-international
   ```

2. **Run the deployment script**
   ```bash
   ./scripts/deploy.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:3001
   - API Documentation: http://localhost:3001/api-docs
   - Health Check: http://localhost:3001/api/health

## 📋 Manual Setup

### 1. Environment Configuration

Copy the environment template and configure your settings:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shared_wealth_international
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Secret (generate a secure key)
JWT_SECRET=your-super-secret-jwt-key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Optional: Sentry for monitoring
SENTRY_DSN=your-sentry-dsn
```

### 2. Database Setup

```bash
# Install dependencies
pnpm install

# Setup database schema and sample data
pnpm run db:setup
```

### 3. Start Services

```bash
# Start Redis (if not running)
redis-server

# Build and start the application
pnpm run build
pnpm run server:start
```

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **UI Components**: Shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **Build Tool**: Vite

### Backend (Node.js + Express)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for session management and caching
- **Authentication**: JWT with role-based access control
- **File Upload**: Multer with Sharp for image processing
- **Monitoring**: Sentry for error tracking and performance monitoring
- **Logging**: Winston for structured logging

### Database Schema

The platform uses PostgreSQL with the following main entities:

- **Users**: Authentication and user management
- **Companies**: Company profiles and applications
- **Funding Opportunities**: Investment and grant opportunities
- **Funding Applications**: Applications for funding
- **News Articles**: Content management
- **Events**: Event management
- **Messages**: Internal messaging system
- **Forum**: Discussion forums
- **File Uploads**: File management system

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm run dev                    # Start development server
pnpm run server:dev            # Start backend in development mode

# Building
pnpm run build                 # Build frontend
pnpm run server:build          # Build backend
pnpm run server:start          # Start production server

# Database
pnpm run db:setup              # Setup database schema
pnpm run db:reset              # Reset database

# Testing
pnpm run test                  # Run frontend tests
pnpm run test:backend          # Run backend tests
pnpm run test:coverage         # Run tests with coverage

# Code Quality
pnpm run lint                  # Run ESLint
pnpm run lint:fix              # Fix ESLint issues
pnpm run format                # Format code with Prettier
pnpm run type-check            # Run TypeScript type checking
```

### Project Structure

```
shared-wealth-international/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   ├── pages/                   # Page components
│   ├── contexts/                # React contexts
│   ├── services/                # API services
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utility libraries
│   └── integrations/            # External integrations
├── server/                      # Backend source code
│   ├── routes/                  # API routes
│   ├── controllers/             # Route controllers
│   ├── middleware/              # Express middleware
│   ├── services/                # Business logic services
│   └── types/                   # TypeScript types
├── database/                    # Database files
│   └── schema.sql              # Database schema
├── scripts/                     # Utility scripts
│   ├── deploy.sh               # Deployment script
│   └── setup-database.js       # Database setup
├── uploads/                     # File uploads directory
├── logs/                        # Application logs
└── dist/                        # Built application
```

## 🔐 Authentication & Security

### User Roles

- **User**: Standard platform user
- **Admin**: Administrative privileges
- **Super Admin**: Full system access

### Security Features

- JWT-based authentication
- Role-based access control
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Helmet security headers
- File upload validation
- Session management with Redis

## 📁 File Management

### Supported File Types

- **Images**: JPEG, PNG, GIF, WebP
- **Documents**: PDF, TXT, DOC, DOCX

### File Processing

- Automatic image resizing and optimization
- Logo processing with multiple sizes
- File validation and security checks
- Organized storage structure

## 📊 Monitoring & Logging

### Application Monitoring

- **Sentry**: Error tracking and performance monitoring
- **Winston**: Structured logging with multiple transports
- **Health Checks**: System health monitoring endpoints
- **Performance Metrics**: API response time tracking

### Log Levels

- **Error**: System errors and exceptions
- **Warn**: Warnings and slow operations
- **Info**: General information and API requests
- **Debug**: Detailed debugging information

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export DB_PASSWORD=your-secure-password
   export JWT_SECRET=your-secure-jwt-secret
   ```

2. **Build Application**
   ```bash
   pnpm run build
   pnpm run server:build
   ```

3. **Start Production Server**
   ```bash
   pnpm run server:start
   ```

### Docker Deployment (Optional)

```dockerfile
# Dockerfile example
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm run build && pnpm run server:build

EXPOSE 3001
CMD ["pnpm", "run", "server:start"]
```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `development` |
| `PORT` | Server port | No | `3001` |
| `DB_HOST` | Database host | Yes | `localhost` |
| `DB_NAME` | Database name | Yes | `shared_wealth_international` |
| `DB_USER` | Database user | Yes | `postgres` |
| `DB_PASSWORD` | Database password | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `REDIS_HOST` | Redis host | No | `localhost` |
| `REDIS_PORT` | Redis port | No | `6379` |
| `SENTRY_DSN` | Sentry DSN for monitoring | No | - |

## 🔧 Configuration

### Database Configuration

The application uses PostgreSQL with connection pooling:

```typescript
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '2000'),
});
```

### Redis Configuration

Redis is used for caching and session management:

```typescript
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
});
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm run test

# Run backend tests only
pnpm run test:backend

# Run tests with coverage
pnpm run test:coverage

# Run tests in watch mode
pnpm run test:watch
```

### Test Structure

- **Unit Tests**: Individual component and function tests
- **Integration Tests**: API endpoint tests
- **E2E Tests**: End-to-end user workflow tests

## 📚 API Documentation

The API documentation is automatically generated using Swagger/OpenAPI and is available at:

- **Development**: http://localhost:3001/api-docs
- **Production**: https://your-domain.com/api-docs

### API Endpoints

#### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User sign up
- `POST /api/auth/signout` - User sign out
- `POST /api/auth/reset-password` - Password reset

#### Companies
- `GET /api/companies` - List companies
- `POST /api/companies` - Create company
- `GET /api/companies/:id` - Get company details
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

#### Admin
- `GET /api/admin/stats` - Admin statistics
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id/role` - Update user role

#### Files
- `POST /api/files/logo/:companyId` - Upload company logo
- `POST /api/files/document` - Upload document
- `GET /api/files/:id` - Get file information
- `DELETE /api/files/:id` - Delete file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure code passes linting and formatting checks
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and API docs
- **Issues**: Create an issue on GitHub
- **Email**: support@sharedwealth.com

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete company management system
- User authentication and authorization
- File upload and management
- Admin dashboard and analytics
- Funding opportunity management
- News and event management
- Forum system
- Comprehensive API documentation
- Production-ready deployment setup

---

**Built with ❤️ for sustainable business development**