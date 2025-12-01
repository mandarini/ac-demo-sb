/*
  Server-side Cookie Spawning with pg_cron

  This migration sets up automatic cookie spawning using PostgreSQL's pg_cron extension.
  Since pg_cron has a minimum 1-minute granularity, we spawn a batch of cookies
  with staggered spawn times to simulate continuous spawning.

  Security: Removes the need for client-side spawn calls, preventing abuse.
*/

-- Enable pg_cron extension (requires superuser, enabled by default on Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres role (required for Supabase)
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Function to spawn a batch of cookies for the next minute
CREATE OR REPLACE FUNCTION spawn_cookies_batch()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  room_record RECORD;
  spawn_count INTEGER;
  i INTEGER;
  spawn_time TIMESTAMPTZ;
  despawn_time TIMESTAMPTZ;
  is_cat BOOLEAN;
  cookie_value INTEGER;
  spawn_interval_ms INTEGER;
BEGIN
  -- Get room configuration
  SELECT * INTO room_record
  FROM rooms
  WHERE id = 'main-room';

  -- Only spawn if game is running
  IF room_record IS NULL OR room_record.status != 'running' THEN
    RETURN;
  END IF;

  -- Calculate total cookies to spawn in this minute
  -- spawn_rate_per_sec * 60 seconds = cookies per minute
  spawn_count := GREATEST(1, ROUND(room_record.spawn_rate_per_sec * 60));

  -- Cap at 300 cookies per minute to prevent abuse
  spawn_count := LEAST(spawn_count, 300);

  -- Calculate interval between spawns in milliseconds
  spawn_interval_ms := FLOOR(60000.0 / spawn_count);

  -- Spawn cookies with staggered times
  FOR i IN 0..(spawn_count - 1) LOOP
    -- Calculate spawn time (staggered throughout the minute)
    spawn_time := NOW() + (i * spawn_interval_ms * INTERVAL '1 millisecond');

    -- Calculate despawn time based on room TTL
    despawn_time := spawn_time + (room_record.ttl_seconds * INTERVAL '1 second');

    -- 15% chance for cat
    is_cat := random() < 0.15;
    cookie_value := CASE WHEN is_cat THEN 3 ELSE 1 END;

    -- Insert cookie
    INSERT INTO cookies (room_id, type, value, x_pct, y_pct, spawned_at, despawn_at)
    VALUES (
      'main-room',
      CASE WHEN is_cat THEN 'cat' ELSE 'cookie' END,
      cookie_value,
      random() * 90 + 5,  -- 5% to 95% horizontal position
      -10,                 -- Start above viewport
      spawn_time,
      despawn_time
    );
  END LOOP;

  -- Clean up old expired cookies (older than 1 minute past despawn)
  DELETE FROM cookies
  WHERE room_id = 'main-room'
    AND despawn_at < NOW() - INTERVAL '1 minute';

END;
$$;

-- Schedule the spawner to run every minute
SELECT cron.schedule(
  'spawn-cookies-job',           -- unique job name
  '* * * * *',                   -- every minute
  'SELECT spawn_cookies_batch()'
);

-- Create a function to manually trigger spawning (for testing)
CREATE OR REPLACE FUNCTION trigger_spawn()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM spawn_cookies_batch();
  RETURN 'Spawned cookies batch';
END;
$$;
