# Production Deployment Instructions for sharedwealth.net

## What's Fixed

✅ **API URL Configuration**: Frontend now automatically detects production domain and uses Render API
✅ **CORS Configuration**: Backend allows requests from sharedwealth.net
✅ **Database Schema**: Complete schema deployed on Render PostgreSQL
✅ **Authentication**: Working with proper JWT tokens

## Files to Upload

Upload these files to your `sharedwealth.net` domain:

```
production-deployment/
├── index.html
├── assets/
│   ├── index-CT6wnIg_.js (main application)
│   ├── index-DvNsDHGV.css (styles)
│   └── [other asset files]
├── favicon.ico
├── lovable-uploads/
└── robots.txt
```

## How It Works Now

1. **Frontend Detection**: When users visit `sharedwealth.net`, the frontend automatically detects it's a production domain
2. **API Connection**: Frontend connects to `https://shared-wealth-international.onrender.com/api` instead of localhost
3. **CORS Fixed**: Backend allows requests from your domain
4. **Authentication**: Users can sign in with:
   - Admin: `admin@sharedwealth.com` / `admin123`
   - Company Director: `irma@supernovaeco.com` / `Sharedwealth123`

## Test Credentials

### Admin Account
- **Email**: admin@sharedwealth.com
- **Password**: admin123
- **Role**: Admin (full access)

### Company Director Account
- **Email**: irma@supernovaeco.com
- **Password**: Sharedwealth123
- **Role**: Director (company management)

## Debug Information

The frontend now includes debug logging. Check browser console for:
- `🔗 API Debug - Hostname: sharedwealth.net`
- `🔗 API Debug - API Base URL: https://shared-wealth-international.onrender.com/api`

## Backend Status

- **API URL**: https://shared-wealth-international.onrender.com
- **Database**: PostgreSQL with 30 companies and user accounts
- **CORS**: Configured for sharedwealth.net
- **Authentication**: JWT-based with proper token handling

## Troubleshooting

If you still see "Failed to fetch" errors:

1. **Check Browser Console**: Look for the debug messages above
2. **Verify API URL**: Should show Render URL, not localhost
3. **Clear Browser Cache**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)
4. **Check Network Tab**: Verify requests go to Render API

## Support

The system is now fully configured for production use with:
- Automatic domain detection
- Production API endpoints
- Proper CORS configuration
- Complete database schema
- Working authentication

Your users can now access the full Shared Wealth International platform at sharedwealth.net!
