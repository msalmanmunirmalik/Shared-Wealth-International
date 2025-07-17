# Authentication System - Simplified Structure

## Overview

The authentication system has been refactored to provide a clean, unified experience for users. This document outlines the simplified structure and how to use it.

## Components

### 1. AuthContext (`src/contexts/AuthContext.tsx`)

**Simplified Features:**
- User authentication state management
- Sign in, sign up, and sign out functionality
- Password reset capability
- Loading states and error handling
- Toast notifications for user feedback

**Key Methods:**
- `signIn(email, password)` - Authenticate existing users
- `signUp(email, password)` - Create new user accounts
- `signOut()` - Log out current user
- `resetPassword(email)` - Send password reset email

**Removed Features:**
- Complex admin role checking
- Onboarding flow management
- Company user associations
- Email confirmation status tracking

### 2. Auth Page (`src/pages/Auth.tsx`)

**Unified Interface:**
- Single page handling sign in, sign up, and password reset
- Tabbed interface for easy navigation
- Form validation with real-time feedback
- Password visibility toggles
- Success/error message display
- Loading states during operations

**Features:**
- Email validation
- Password strength requirements (minimum 6 characters)
- Password confirmation for sign up
- Automatic redirect after successful authentication
- Responsive design for mobile and desktop

### 3. Header Component (`src/components/Header.tsx`)

**Simplified Navigation:**
- User email display when signed in
- Working logout button with loading state
- Removed admin panel access
- Clean mobile menu

### 4. Dashboard (`src/components/Dashboard.tsx`)

**User-Friendly Dashboard:**
- Personalized welcome message
- Network overview and metrics
- Access to assessment tools
- Recent activity feed
- Simplified navigation

## Usage

### For Users

1. **Sign Up:**
   - Navigate to `/auth`
   - Click "Sign Up" tab
   - Enter email and password
   - Confirm password
   - Submit form
   - Check email for confirmation link

2. **Sign In:**
   - Navigate to `/auth`
   - Enter email and password
   - Click "Sign In"
   - Redirected to dashboard on success

3. **Password Reset:**
   - Navigate to `/auth`
   - Click "Reset" tab
   - Enter email address
   - Check email for reset instructions

4. **Sign Out:**
   - Click "Sign Out" button in header
   - Confirmation toast will appear
   - Redirected to home page

### For Developers

**Adding Authentication to Components:**
```tsx
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, signOut, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
};
```

**Protected Routes:**
```tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};
```

## Error Handling

The system includes comprehensive error handling:

- **Form Validation:** Real-time validation with clear error messages
- **Network Errors:** Graceful handling of connection issues
- **Authentication Errors:** User-friendly error messages from Supabase
- **Loading States:** Visual feedback during operations
- **Toast Notifications:** Success and error feedback

## Security Features

- Password minimum length requirement (6 characters)
- Email validation
- Secure password reset flow
- Session management through Supabase
- Automatic logout on session expiry

## Future Enhancements

The simplified structure makes it easy to add features:

- Two-factor authentication
- Social login providers
- User profile management
- Role-based access control
- Advanced password policies

## Troubleshooting

**Common Issues:**

1. **Logout not working:** Ensure you're using the `handleSignOut` function from the Header component
2. **Form validation errors:** Check that email format is valid and password meets minimum requirements
3. **Loading states:** The system shows loading indicators during authentication operations
4. **Toast notifications:** Ensure the Toaster component is included in your app

**Debug Information:**
- Check browser console for detailed error messages
- Verify Supabase configuration in `src/integrations/supabase/client.ts`
- Ensure all required UI components are available 