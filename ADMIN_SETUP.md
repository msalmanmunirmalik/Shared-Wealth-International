# 🚀 Shared Wealth International - Admin System Setup

This guide will help you set up the complete admin system for the Shared Wealth International platform, including superadmin and admin accounts.

## 📋 Prerequisites

Before setting up the admin system, ensure you have:

1. ✅ **Supabase project running** (local or cloud)
2. ✅ **Database migrations applied** (including admin system migration)
3. ✅ **User accounts created** through the platform
4. ✅ **Supabase CLI installed** (for local development)

## 🗄️ Database Setup

### 1. Apply Admin System Migration

First, apply the admin system migration to create all necessary tables:

```bash
# Navigate to your Supabase directory
cd supabase

# Apply the admin system migration
supabase db reset
# OR if you want to apply just the admin migration:
supabase migration up
```

### 2. Verify Tables Created

The migration will create these tables:

- `admin_users` - Admin user accounts and roles
- `admin_permissions` - Permission definitions
- `admin_activity_log` - Admin activity tracking
- `admin_dashboard_settings` - Admin dashboard preferences

## 👑 Creating Superadmin Account

### Option 1: Using the Setup Script (Recommended)

1. **Install dependencies** (if not already installed):
   ```bash
   cd wealth-pioneers-network
   pnpm install
   ```

2. **Run the admin setup script**:
   ```bash
   node scripts/setup-admin.js
   ```

3. **Follow the interactive prompts**:
   - Choose option 1: "Setup initial superadmin"
   - Enter the email of the user you want to make superadmin
   - The script will automatically create the superadmin account

### Option 2: Manual Database Insert

If you prefer to create the superadmin manually:

1. **Get your user ID** from the `auth.users` table
2. **Insert admin record**:

```sql
INSERT INTO public.admin_users (
  user_id,
  role,
  permissions,
  is_active,
  created_by
) VALUES (
  'YOUR_USER_UUID_HERE',
  'superadmin',
  '{
    "users.view": true,
    "users.edit": true,
    "users.delete": true,
    "companies.view": true,
    "companies.approve": true,
    "companies.reject": true,
    "content.view": true,
    "content.create": true,
    "content.edit": true,
    "content.delete": true,
    "admin.view": true,
    "admin.create": true,
    "admin.edit": true,
    "admin.delete": true
  }',
  true,
  'YOUR_USER_UUID_HERE'
);
```

## 👥 Creating Additional Admin Accounts

### Using the Setup Script

1. **Run the setup script again**:
   ```bash
   node scripts/setup-admin.js
   ```

2. **Choose option 2**: "Create additional admin account"

3. **Follow the prompts** to create admin, moderator, or support accounts

### Available Admin Roles

| Role | Permissions | Description |
|------|-------------|-------------|
| **Superadmin** | All permissions | Full platform control, can manage other admins |
| **Admin** | Platform management | Can manage users, companies, content, funding |
| **Moderator** | Content moderation | Can moderate forums, edit content, manage users |
| **Support** | Basic support | Can view users and companies, provide support |

## 🔐 Accessing Admin Dashboard

### 1. **Sign in** to the platform with your admin account

### 2. **Navigate to admin dashboard**:
   - URL: `/admin` (you'll need to add this route)
   - Or access through the platform navigation

### 3. **Admin Dashboard Features**:
   - **Overview**: Platform statistics and quick actions
   - **Companies**: Review and approve company applications
   - **Users**: Manage platform users
   - **Admins**: Manage admin accounts (superadmin only)

## 🛠️ Configuration

### Environment Variables

Set these environment variables for the setup script:

```bash
# .env.local
SUPABASE_URL=http://localhost:54321  # or your cloud URL
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Supabase Configuration

Ensure your `supabase/config.toml` has the correct settings:

```toml
[api]
enabled = true
port = 54321
schemas = ["public", "storage", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[auth]
enabled = true
port = 54322
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://localhost:3000"]
jwt_expiry = 3600
enable_refresh_token_rotation = true
refresh_token_reuse_interval = 10
```

## 🔍 Troubleshooting

### Common Issues

#### 1. **"Database not ready" Error**
- Ensure you've run the admin migration
- Check that Supabase is running
- Verify database connection

#### 2. **"User not found" Error**
- Create the user account first through the platform
- Ensure the email is correct
- Check if the user exists in `auth.users`

#### 3. **Permission Denied Errors**
- Verify RLS policies are correctly applied
- Check admin user permissions
- Ensure user has admin role

#### 4. **Setup Script Fails**
- Check Node.js version (requires 16+)
- Verify all dependencies are installed
- Check environment variables

### Debug Commands

```bash
# Check Supabase status
supabase status

# View database logs
supabase logs

# Reset database (WARNING: deletes all data)
supabase db reset

# Check migration status
supabase migration list
```

## 📱 Testing the Admin System

### 1. **Create Test Users**
   - Sign up through the platform
   - Create multiple user accounts for testing

### 2. **Test Company Applications**
   - Submit company applications as regular users
   - Approve/reject as admin

### 3. **Test Admin Permissions**
   - Try accessing different admin features
   - Verify role-based access control

### 4. **Test Activity Logging**
   - Perform admin actions
   - Check activity logs in database

## 🚀 Next Steps

After setting up the admin system:

1. **Configure platform settings** through admin dashboard
2. **Set up email notifications** for admin actions
3. **Create admin workflows** for common tasks
4. **Set up monitoring and alerts**
5. **Train team members** on admin procedures

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting section** above
2. **Review Supabase logs** for errors
3. **Verify database schema** matches migrations
4. **Check browser console** for frontend errors

## 🔒 Security Notes

- **Never share admin credentials**
- **Use strong passwords** for admin accounts
- **Regularly review admin permissions**
- **Monitor admin activity logs**
- **Backup admin configurations**

---

**🎉 Congratulations!** You now have a fully functional admin system for Shared Wealth International.

**Next**: Access your admin dashboard and start managing the platform!
