-- Create cohort_invites table for AI Cohort invite management
CREATE TABLE IF NOT EXISTS cohort_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted')),
  invite_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  sent_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_cohort_invites_email ON cohort_invites(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_cohort_invites_status ON cohort_invites(status);

-- Create index on invite_code for redemption
CREATE INDEX IF NOT EXISTS idx_cohort_invites_code ON cohort_invites(invite_code);

-- Add RLS (Row Level Security) policies
ALTER TABLE cohort_invites ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all invites (for admin dashboard)
CREATE POLICY "Allow authenticated users to read invites"
  ON cohort_invites
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to insert invites (for admin dashboard)
CREATE POLICY "Allow authenticated users to insert invites"
  ON cohort_invites
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to update invites (for admin dashboard)
CREATE POLICY "Allow authenticated users to update invites"
  ON cohort_invites
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to delete invites (for admin dashboard)
CREATE POLICY "Allow authenticated users to delete invites"
  ON cohort_invites
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cohort_invites_updated_at
  BEFORE UPDATE ON cohort_invites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
