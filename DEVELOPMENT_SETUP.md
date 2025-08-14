# Development Setup Guide

## Prerequisites

- Node.js 18+ 
- PNPM package manager
- Git
- Supabase CLI
- PostgreSQL (for local development)

## Initial Setup

### 1. Install Dependencies

```bash
# Install PNPM if you haven't already
npm install -g pnpm

# Install project dependencies
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development Configuration
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:8080

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### 3. Database Setup

```bash
# Start Supabase locally
supabase start

# Apply migrations
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

## Development Commands

### Development Server

```bash
# Start development server on port 8080
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Code Quality

```bash
# Lint code
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Type checking
pnpm type-check

# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check
```

### Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Open Cypress test runner
pnpm test:e2e:open
```

## Project Structure

```
wealth-pioneers-network/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── admin/          # Admin components
│   │   └── [feature]/      # Feature-specific components
│   ├── pages/              # Route components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utility functions
│   └── integrations/       # External integrations
├── supabase/               # Database configuration
├── cypress/                # E2E tests
├── public/                 # Static assets
└── tests/                  # Unit tests
```

## Database Development

### Creating Migrations

```bash
# Create a new migration
supabase migration new migration_name

# Apply migrations
supabase db reset

# Check migration status
supabase migration list
```

### Database Schema

Key tables in the system:

- `users` - User accounts and profiles
- `companies` - Company information
- `user_companies` - User-company relationships
- `forum_posts` - Forum discussions
- `events` - Event management
- `resources` - Resource library
- `meetings` - Meeting management
- `activity_logs` - User activity tracking

### Row Level Security (RLS)

All tables implement RLS policies:

```sql
-- Example RLS policy
CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
USING (auth.uid() = id);
```

## Testing Strategy

### Unit Tests

- **Location**: `src/**/__tests__/*.test.{ts,tsx}`
- **Framework**: Jest + React Testing Library
- **Coverage**: Minimum 80% for all metrics

### Integration Tests

- **Location**: `src/**/*.test.{ts,tsx}`
- **Focus**: Component interactions and API calls
- **Mocking**: Supabase client and external services

### E2E Tests

- **Location**: `cypress/e2e/*.cy.ts`
- **Framework**: Cypress
- **Coverage**: Critical user journeys

### Test Data

```bash
# Create test data
cy.createTestCompany('Test Company');

# Clean up after tests
cy.cleanupTestData();
```

## Code Standards

### TypeScript

- Strict mode enabled
- No implicit any
- Proper type definitions for all functions
- Interface-first approach

### React

- Functional components with hooks
- Proper prop typing
- Error boundaries for error handling
- Memoization for expensive operations

### Styling

- Tailwind CSS for styling
- Shadcn/ui for components
- CSS modules for complex styling
- Responsive design principles

## Security Guidelines

### Authentication

- JWT tokens via Supabase Auth
- Secure token storage
- Proper logout procedures
- Session management

### Authorization

- Row Level Security (RLS) policies
- Role-based access control
- Input validation with Zod
- SQL injection prevention

### Data Protection

- Environment variables for secrets
- HTTPS in production
- CORS configuration
- Rate limiting

## Performance Optimization

### Bundle Optimization

- Code splitting with React.lazy
- Tree shaking for unused code
- Image optimization (WebP format)
- Lazy loading for components

### Database Optimization

- Proper indexing on frequently queried columns
- Query optimization
- Connection pooling
- Caching strategies

### React Optimization

- React.memo for expensive components
- useMemo and useCallback hooks
- Virtual scrolling for large lists
- Debounced user inputs

## Deployment

### Production Build

```bash
# Build for production
pnpm build

# Test production build locally
pnpm preview
```

### Environment Variables

Ensure all production environment variables are set:

```bash
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_APP_ENV=production
```

### Monitoring

- Error tracking with Sentry
- Performance monitoring
- User analytics
- Database performance metrics

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change port in `vite.config.ts`
2. **Database connection**: Check Supabase status and credentials
3. **Build failures**: Clear `node_modules` and reinstall
4. **Type errors**: Run `pnpm type-check` for detailed errors

### Debug Mode

Enable debug mode in development:

```bash
VITE_ENABLE_DEBUG=true
```

### Logs

Check Supabase logs:

```bash
supabase logs
```

## Contributing

### Git Workflow

1. Create feature branch from `main`
2. Implement changes with tests
3. Run all tests and linting
4. Create pull request
5. Code review and approval
6. Merge to main

### Commit Messages

Use conventional commit format:

```
feat: add user authentication
fix: resolve login validation issue
docs: update API documentation
test: add authentication tests
```

## Support

### Documentation

- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)

### Team Resources

- Development rulebook: `DEVELOPMENT_RULEBOOK.md`
- API documentation: `API_DOCS.md`
- Component library: `COMPONENT_LIBRARY.md`

---

**Last Updated**: $(date)
**Maintainer**: Development Team
**Project**: Shared Wealth International
