/*
  Rate Limiting Table

  Tracks request counts per IP address to prevent abuse.
  Used by Edge Functions for rate limiting player creation.
*/

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  action text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(ip_address, action)
);

-- Enable RLS (no public access - only service role)
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_action ON rate_limits(ip_address, action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- Function to check and update rate limit
-- Returns true if request is allowed, false if rate limited
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_ip_address text,
  p_action text,
  p_max_requests integer DEFAULT 10,
  p_window_seconds integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_record RECORD;
  v_window_start timestamptz;
BEGIN
  v_window_start := now() - (p_window_seconds * INTERVAL '1 second');

  -- Try to get existing rate limit record
  SELECT * INTO v_record
  FROM rate_limits
  WHERE ip_address = p_ip_address AND action = p_action;

  IF v_record IS NULL THEN
    -- First request from this IP for this action
    INSERT INTO rate_limits (ip_address, action, request_count, window_start)
    VALUES (p_ip_address, p_action, 1, now());
    RETURN true;
  END IF;

  -- Check if window has expired
  IF v_record.window_start < v_window_start THEN
    -- Reset window
    UPDATE rate_limits
    SET request_count = 1, window_start = now()
    WHERE ip_address = p_ip_address AND action = p_action;
    RETURN true;
  END IF;

  -- Check if under limit
  IF v_record.request_count < p_max_requests THEN
    -- Increment counter
    UPDATE rate_limits
    SET request_count = request_count + 1
    WHERE ip_address = p_ip_address AND action = p_action;
    RETURN true;
  END IF;

  -- Rate limited
  RETURN false;
END;
$$;

-- Cleanup old rate limit records (run periodically)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < now() - INTERVAL '1 hour';
END;
$$;

-- Schedule cleanup every hour
SELECT cron.schedule(
  'cleanup-rate-limits-job',
  '0 * * * *',  -- every hour
  'SELECT cleanup_rate_limits()'
);

-- Also add a cap on total players per room to prevent unlimited growth
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS max_players integer DEFAULT 1000;

-- Update the main room with a reasonable limit
UPDATE rooms SET max_players = 1000 WHERE id = 'main-room';
