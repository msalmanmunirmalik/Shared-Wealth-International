# Private Credentials - DO NOT COMMIT TO GIT

## Working Authentication Credentials

### Admin Account
- **Email**: `admin@sharedwealth.com`
- **Password**: `password`
- **Role**: `superadmin`

### Regular User Account
- **Email**: `user@sharedwealth.com`
- **Password**: `password`
- **Role**: `user`

### Your Personal Account
- **Email**: `msalmanmunirmalik@outlook.com`
- **Password**: `password`
- **Role**: `user`

## Server Information
- **Frontend**: http://localhost:8081
- **Backend**: http://localhost:8080
- **Database**: PostgreSQL on localhost:5432
- **Database Name**: wealth_pioneers

## Quick Commands
```bash
# Start both servers
pnpm run dev          # Frontend on port 8081
pnpm run server:dev   # Backend on port 8080

# Test authentication
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sharedwealth.com","password":"password"}'
```

## Security Notes
- These are development credentials only
- Change passwords in production
- This file should be in .gitignore
- Never commit real passwords to version control
