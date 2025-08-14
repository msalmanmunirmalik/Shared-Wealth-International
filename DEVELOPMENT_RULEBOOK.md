# Shared Wealth International - Development Rulebook

## CORE PRINCIPLES

### 1. BUILD FULL CRUD FUNCTIONS OUT
- Always implement complete Create, Read, Update, Delete operations
- Never leave partial implementations
- Test all CRUD endpoints thoroughly
- Document all API endpoints and their usage
- Implement proper error handling for all database operations

### 2. SCHEMA AND DATABASE MANAGEMENT
- Update the local Supabase database schema as we develop
- Never use hardcoded mock data - always work with real database
- Create migrations for schema changes in `supabase/migrations/`
- Maintain data integrity at all times
- Use proper foreign key constraints and referential integrity
- Implement Row Level Security (RLS) policies for all tables

### 3. TESTING REQUIREMENTS
- Write tests for every feature as it's built
- Include unit tests, integration tests, and end-to-end tests
- Test all CRUD operations
- Test error handling and edge cases
- Test Supabase RLS policies and authentication
- Test responsive design across devices

### 4. ANALYSIS AND QUALITY ASSURANCE
- Analyze code performance and optimization opportunities
- Review security implications of each implementation
- Check for accessibility compliance (WCAG 2.1 AA)
- Validate responsive design across devices
- Monitor bundle size and optimize imports

### 5. FIX BEFORE MOVING ON
- Resolve all ESLint errors before proceeding
- Fix all failing tests before new features
- Address security vulnerabilities immediately
- Optimize performance issues before adding complexity
- Ensure TypeScript compilation passes without errors

## TECHNICAL STANDARDS

### Development Environment
- **Package Manager**: Use PNPM for all package management
- **Development Server**: Runs on port 8080 (as configured in vite.config.ts)
- **Database**: Local Supabase PostgreSQL database for development
- **Build Tool**: Vite with React SWC for fast development
- **UI Framework**: Shadcn/ui components with Tailwind CSS
- **State Management**: React Query for server state, Context for auth
- **Form Handling**: React Hook Form with Zod validation

### Code Quality
- **Language**: TypeScript with strict type safety
- **Linting**: ESLint with TypeScript and React Hooks rules
- **Formatting**: Prettier for consistent code formatting
- **Component Library**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Internationalization**: i18next for multi-language support

### Database Management
- **ORM**: Supabase client with TypeScript types
- **Migrations**: Use Supabase CLI for schema changes
- **Authentication**: Supabase Auth with JWT tokens
- **Real-time**: Supabase real-time subscriptions
- **Storage**: Supabase Storage for file uploads
- **Edge Functions**: Supabase Edge Functions for serverless logic

### Testing Strategy
- **Unit Testing**: Jest with React Testing Library
- **Component Testing**: React Testing Library for component tests
- **E2E Testing**: Cypress for end-to-end testing
- **API Testing**: Test Supabase endpoints with proper auth
- **Performance Testing**: Lighthouse CI for performance metrics

### Security Standards
- **JWT Security**: Comprehensive JWT validation with JWKS
- **CSRF Protection**: CSRF tokens for all form submissions
- **CORS Handling**: Strict CORS policies and validation
- **Security Headers**: Helmet-equivalent security headers (CSP, XSS protection, etc.)
- **Authentication**: JWT tokens via Supabase Auth with automatic refresh
- **Authorization**: Row Level Security (RLS) policies
- **Rate Limiting**: Per-user and per-endpoint rate limiting
- **Input Sanitization**: XSS prevention and input validation
- **Session Security**: Secure session management with timeouts
- **Environment Variables**: Use .env files for sensitive data
- **Input Validation**: Zod schemas for all form inputs
- **SQL Injection**: Use Supabase parameterized queries only

### Image and Media Optimization
- **Image Format**: Serve images as WebP with fallbacks
- **Compression**: Optimize all images before upload
- **Lazy Loading**: Implement lazy loading for images
- **Responsive Images**: Use srcset for different screen sizes
- **Video Optimization**: Compress videos and use appropriate formats

## PROJECT-SPECIFIC REQUIREMENTS

### Shared Wealth Model Components
- **Core Pillars**: Implement all wealth creation pillars
- **Impact Analytics**: Real-time impact measurement
- **Collaboration Tools**: Meeting forms and analytics
- **Governance Simulator**: Interactive decision frameworks
- **Learning Paths**: Structured educational content

### User Management
- **Role-Based Access**: Admin, Director, Partner, User roles
- **Company Management**: Multi-company support with proper isolation
- **Profile Management**: Comprehensive user profiles
- **Activity Feed**: Real-time user activity tracking

### Collaboration Features
- **Forum System**: Threaded discussions with moderation
- **Event Management**: Calendar integration and RSVP
- **Resource Library**: Document and media sharing
- **Meeting Tools**: Scheduling and collaboration analytics

## WORKFLOW PROCESS

1. **Plan** - Understand requirements fully before coding
2. **Design** - Create schema and API design first
3. **Implement** - Build full CRUD functionality
4. **Test** - Comprehensive testing at all levels
5. **Analyze** - Code review and performance analysis
6. **Fix** - Address all issues before proceeding
7. **Document** - Update documentation and comments
8. **Deploy** - Only when all tests pass and code is optimized

## DEVELOPMENT COMMANDS

### Setup and Installation
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint

# Preview production build
pnpm preview
```

### Database Operations
```bash
# Start Supabase locally
supabase start

# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db reset

# Generate types
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Testing
```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Generate coverage report
pnpm test:coverage
```

## FILE ORGANIZATION

### Component Structure
```
src/
├── components/
│   ├── ui/           # Shadcn/ui components
│   ├── admin/        # Admin-specific components
│   └── [feature]/    # Feature-specific components
├── pages/            # Route components
├── contexts/         # React contexts
├── hooks/            # Custom hooks
├── lib/              # Utility functions
└── integrations/     # External service integrations
```

### Database Schema
```
supabase/
├── migrations/       # Database schema changes
├── config.toml      # Supabase configuration
└── types.ts         # Generated TypeScript types
```

## QUALITY CHECKLIST

### Before Committing
- [ ] All ESLint errors resolved
- [ ] TypeScript compilation passes
- [ ] All tests passing
- [ ] No console.log statements
- [ ] Proper error handling implemented
- [ ] Accessibility attributes added
- [ ] Responsive design verified
- [ ] Performance optimized

### Before Deploying
- [ ] All CRUD operations tested
- [ ] Security policies verified
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Build optimization completed
- [ ] Error monitoring setup
- [ ] Performance metrics acceptable

## NEVER COMPROMISE ON

- Security best practices and RLS policies
- Data integrity and referential constraints
- Test coverage and quality assurance
- Performance optimization and bundle size
- User experience quality and accessibility
- Code maintainability and documentation
- Image and video optimization (WebP, compression)
- Type safety and TypeScript best practices

## SUGGESTED IMPROVEMENTS

### Performance Optimizations
- Implement React.memo for expensive components
- Use React.lazy for code splitting
- Optimize Supabase queries with proper indexing
- Implement virtual scrolling for large lists
- Add service worker for offline capabilities

### Security Enhancements
- Implement rate limiting for API endpoints
- Add audit logging for sensitive operations
- Implement 2FA for admin accounts
- Regular security dependency updates
- Penetration testing for critical paths

### Developer Experience
- Add Storybook for component documentation
- Implement automated testing in CI/CD
- Add performance monitoring with Sentry
- Implement automated accessibility testing
- Add code quality gates in pull requests

### User Experience
- Implement progressive web app features
- Add keyboard navigation support
- Implement dark mode toggle
- Add loading states and skeleton screens
- Implement proper error boundaries

## EMERGENCY PROCEDURES

### Database Issues
1. Check Supabase status and logs
2. Verify connection strings and environment variables
3. Check RLS policies and permissions
4. Review recent migrations for conflicts

### Build Failures
1. Clear node_modules and reinstall dependencies
2. Check TypeScript configuration
3. Verify all imports and exports
4. Check for circular dependencies

### Performance Issues
1. Analyze bundle size with webpack-bundle-analyzer
2. Check for memory leaks in React components
3. Optimize database queries and indexing
4. Review image and media optimization

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Project**: Shared Wealth International
**Tech Stack**: React + TypeScript + Vite + Supabase + Tailwind CSS + Shadcn/ui
