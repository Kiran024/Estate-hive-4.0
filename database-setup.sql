-- Estate Hive Database Setup Script
-- Run these commands in your Supabase SQL Editor

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  location TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  occupation TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Saved Properties Table (Wishlist)
CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- 3. Create User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  newsletter_subscription BOOLEAN DEFAULT true,
  profile_public BOOLEAN DEFAULT false,
  show_contact_info BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Property Views Table (for tracking user activity)
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Property Inquiries Table
CREATE TABLE IF NOT EXISTS property_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  message TEXT,
  contact_phone TEXT,
  inquiry_type TEXT DEFAULT 'general',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_properties_user_id ON saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_property_id ON saved_properties(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_user_id ON property_views(user_id);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_user_id ON property_inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;

-- 8. Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own saved properties" ON saved_properties;
DROP POLICY IF EXISTS "Users can insert own saved properties" ON saved_properties;
DROP POLICY IF EXISTS "Users can delete own saved properties" ON saved_properties;
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can view own property views" ON property_views;
DROP POLICY IF EXISTS "Users can insert own property views" ON property_views;
DROP POLICY IF EXISTS "Users can view own inquiries" ON property_inquiries;
DROP POLICY IF EXISTS "Users can insert own inquiries" ON property_inquiries;

-- Create RLS Policies

-- Users can only see and modify their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can manage their own saved properties
CREATE POLICY "Users can view own saved properties" ON saved_properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved properties" ON saved_properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved properties" ON saved_properties
  FOR DELETE USING (auth.uid() = user_id);

-- Users can manage their own settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their own activity
CREATE POLICY "Users can view own property views" ON property_views
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own property views" ON property_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can manage their own inquiries
CREATE POLICY "Users can view own inquiries" ON property_inquiries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inquiries" ON property_inquiries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Create Storage Bucket for Avatars (if not exists)
-- Note: This needs to be run separately in Supabase dashboard or via API
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('avatars', 'avatars', true);

-- 12. Create Storage Policy for Avatars
-- CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
--   FOR SELECT USING (bucket_id = 'avatars');

-- CREATE POLICY "Users can upload their own avatar" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'avatars' 
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Users can update their own avatar" ON storage.objects
--   FOR UPDATE USING (
--     bucket_id = 'avatars' 
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- 13. Create helpful views for statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.full_name,
  u.email,
  COALESCE(saved_count.count, 0) AS properties_saved,
  COALESCE(view_count.count, 0) AS properties_viewed,
  COALESCE(inquiry_count.count, 0) AS inquiries_sent,
  u.created_at as member_since
FROM users u
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM saved_properties 
  GROUP BY user_id
) saved_count ON u.id = saved_count.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM property_views 
  GROUP BY user_id
) view_count ON u.id = view_count.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM property_inquiries 
  GROUP BY user_id
) inquiry_count ON u.id = inquiry_count.user_id;

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON saved_properties TO authenticated;
GRANT ALL ON user_settings TO authenticated;
GRANT ALL ON property_views TO authenticated;
GRANT ALL ON property_inquiries TO authenticated;
GRANT SELECT ON user_stats TO authenticated;