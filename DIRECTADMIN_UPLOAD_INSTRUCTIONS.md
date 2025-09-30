# DirectAdmin Upload Instructions

## Files to Upload to Your Server

1. **shared-wealth-directadmin.tar.gz** - Main application package
2. **directadmin-setup.sh** - Server setup script

## Upload Process

### Method 1: DirectAdmin File Manager
1. Login to DirectAdmin
2. Go to "File Manager"
3. Navigate to your domain directory (e.g., `/home/username/domains/yourdomain.com/public_html/`)
4. Upload `shared-wealth-directadmin.tar.gz`
5. Extract the archive
6. Set permissions: `chmod +x directadmin-setup.sh`

### Method 2: SCP/SFTP
```bash
# Upload files to your server
scp shared-wealth-directadmin.tar.gz username@your-server:/home/username/domains/yourdomain.com/public_html/
scp directadmin-setup.sh username@your-server:/home/username/

# SSH to your server
ssh username@your-server

# Extract and setup
cd /home/username/domains/yourdomain.com/public_html/
tar -xzf shared-wealth-directadmin.tar.gz
chmod +x directadmin-setup.sh
```

## Server Setup
1. Run the setup script: `sudo ./directadmin-setup.sh`
2. Configure your domain and database
3. Start the application with PM2

## Domain Configuration
- **Frontend:** `https://yourdomain.com`
- **API:** `https://api.yourdomain.com` or `https://yourdomain.com/api`
