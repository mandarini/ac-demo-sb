/*
  Admin Allowlist Table

  Stores email addresses of users allowed to access admin features.
  Used with Supabase Auth (GitHub OAuth) to control admin access.
*/

-- Create admin_allowlist table
CREATE TABLE IF NOT EXISTS admin_allowlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by text  -- Optional: track who added this admin
);

-- Enable RLS
ALTER TABLE admin_allowlist ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read the allowlist (for checking their own access)
-- Service role can do everything (for Edge Functions)
CREATE POLICY "Authenticated users can check allowlist"
  ON admin_allowlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_admin_allowlist_email ON admin_allowlist(email);

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_allowlist WHERE email = user_email
  );
END;
$$;

-- Insert initial admin (replace with your GitHub email)
-- You can add more admins via Supabase Dashboard or by inserting into this table
INSERT INTO admin_allowlist (email, created_by)
VALUES ('your-github-email@example.com', 'initial_setup')
ON CONFLICT (email) DO NOTHING;
