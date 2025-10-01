-- Add profile fields to users table
-- This script adds the missing profile fields to the existing users table

-- Add bio field
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add location field
ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200);

-- Add website field
ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(500);

-- Add linkedin field
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(500);

-- Add twitter field
ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter VARCHAR(500);

-- Add profile_image field
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);

-- Update the updated_at trigger to include these new fields
-- (The existing trigger should already handle this automatically)
