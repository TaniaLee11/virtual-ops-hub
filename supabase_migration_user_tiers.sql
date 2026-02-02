-- Add user tier and expiration tracking to profiles/users table
-- This assumes you have a users or profiles table in Supabase

-- If using Supabase auth.users metadata (recommended approach)
-- User tier will be stored in user_metadata

-- Create a profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_tier TEXT NOT NULL DEFAULT 'AI Free' CHECK (user_tier IN (
    'AI Free',
    'AI Assistant', 
    'AI Operations',
    'AI Enterprise',
    'AI Advisory',
    'Tax Client',
    'AI Cohort'
  )),
  tier_expires_at TIMESTAMP WITH TIME ZONE,
  cohort_enrolled_at TIMESTAMP WITH TIME ZONE,
  previous_tier TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_tier for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_tier ON user_profiles(user_tier);

-- Create index on tier_expires_at for expiration checks
CREATE INDEX IF NOT EXISTS idx_user_profiles_expires ON user_profiles(tier_expires_at);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Users can update their own profile (for tier upgrades)
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Allow service role to manage all profiles (for admin/automated tasks)
CREATE POLICY "Service role can manage all profiles"
  ON user_profiles
  FOR ALL
  TO service_role
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically downgrade expired AI Cohort users
CREATE OR REPLACE FUNCTION downgrade_expired_cohort_users()
RETURNS INTEGER AS $$
DECLARE
  downgraded_count INTEGER;
BEGIN
  -- Update expired AI Cohort users to AI Free
  WITH downgraded AS (
    UPDATE user_profiles
    SET 
      previous_tier = user_tier,
      user_tier = 'AI Free',
      tier_expires_at = NULL
    WHERE 
      user_tier = 'AI Cohort'
      AND tier_expires_at IS NOT NULL
      AND tier_expires_at <= NOW()
    RETURNING id
  )
  SELECT COUNT(*) INTO downgraded_count FROM downgraded;
  
  RETURN downgraded_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to enroll user in AI Cohort (called when they accept invite)
CREATE OR REPLACE FUNCTION enroll_user_in_cohort(user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_profiles (id, user_tier, cohort_enrolled_at, tier_expires_at)
  VALUES (
    user_id,
    'AI Cohort',
    NOW(),
    NOW() + INTERVAL '60 days'
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    user_tier = 'AI Cohort',
    cohort_enrolled_at = NOW(),
    tier_expires_at = NOW() + INTERVAL '60 days',
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a cron job to run the downgrade function daily
-- Note: This requires pg_cron extension (available in Supabase)
-- If pg_cron is not enabled, you'll need to call this function via an API endpoint

-- Enable pg_cron extension (run as superuser/admin)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily check at midnight UTC
-- SELECT cron.schedule(
--   'downgrade-expired-cohort-users',
--   '0 0 * * *',
--   'SELECT downgrade_expired_cohort_users();'
-- );

-- Alternative: Create a webhook-callable function for Vercel cron
CREATE OR REPLACE FUNCTION api_downgrade_expired_cohort_users()
RETURNS JSON AS $$
DECLARE
  result INTEGER;
BEGIN
  SELECT downgrade_expired_cohort_users() INTO result;
  RETURN json_build_object(
    'success', true,
    'downgraded_count', result,
    'timestamp', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
