# 🚀 Database Setup Instructions for Estate Hive

## ⚡ Quick Setup (Required to Fix Current Issues)

The authentication and wishlist features require database tables to be created in Supabase. Follow these steps:

### Step 1: Login to Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Login with your credentials
3. Select the project: **nepstrbszgqczpphhknv**

### Step 2: Run Database Setup Script
1. Click on **SQL Editor** in the left sidebar
2. Click **+ New query**
3. Copy the entire contents of `run-database-setup.sql` file
4. Paste it into the SQL editor
5. Click **Run** button

### Step 3: Verify Setup
After running the script, you should see:
- ✅ Success message: "Database setup completed successfully!"
- The following tables will be created:
  - `users` - User profiles
  - `saved_properties` - Wishlist/saved properties
  - `property_views` - Track property views
  - `property_inquiries` - User inquiries
  - `user_settings` - User preferences

## 🔧 What This Fixes

Running this database setup will fix:
1. ✅ **Infinite loading loop** - Profile can now be created/fetched
2. ✅ **Logout functionality** - Auth state properly managed
3. ✅ **Database data fetching** - Tables now exist for queries
4. ✅ **Wishlist saving** - saved_properties table enables wishlist feature
5. ✅ **User profiles** - Proper user data storage

## 🎯 Features Enabled

After setup, users can:
- Create and edit profiles
- Save properties to wishlist
- View saved properties count
- Track property views
- Send property inquiries
- Manage notification preferences

## ⚠️ Important Notes

1. **Run Once**: This script only needs to be run once per database
2. **Safe to Re-run**: The script uses `IF NOT EXISTS` clauses, so it's safe to run multiple times
3. **RLS Enabled**: Row Level Security ensures users can only access their own data
4. **Auto Profile**: New user profiles are automatically created on signup

## 🧪 Testing After Setup

1. **Test Login**:
   - Go to http://localhost:5176/#/auth
   - Login with existing credentials or sign up
   - Should redirect to home without loading loop

2. **Test Profile**:
   - Click profile icon (top right)
   - Select "My Profile"
   - Profile should load without infinite loading

3. **Test Wishlist**:
   - Browse properties
   - Click heart icon on any property
   - Should save to wishlist
   - Check saved properties in profile dropdown

4. **Test Logout**:
   - Click profile icon
   - Select "Sign Out"
   - Should logout and redirect to home

## 📝 Manual Table Creation (Alternative)

If you prefer to create tables manually:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Saved Properties Table
```sql
CREATE TABLE saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  property_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);
```

### Enable RLS
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own saved properties" ON saved_properties
  FOR SELECT USING (auth.uid() = user_id);
```

## ✅ Success Indicators

You'll know the setup worked when:
- No more infinite loading on login
- Profile page loads properly
- Wishlist hearts work on properties
- Logout works instantly
- No console errors about missing tables

## 🆘 Troubleshooting

If issues persist after running the setup:

1. **Clear browser cache**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Check Supabase logs**: Dashboard → Logs → Recent queries
3. **Verify tables exist**: Dashboard → Table Editor → Check for new tables
4. **Test with incognito**: Try in a private/incognito browser window

## 📧 Support

If you continue experiencing issues:
1. Check browser console for specific error messages
2. Verify the Supabase project ID matches: `nepstrbszgqczpphhknv`
3. Ensure you're using the correct API keys in `.env`

---

**Note**: This setup is essential for the application to function properly. Without these database tables, authentication and user features will not work.