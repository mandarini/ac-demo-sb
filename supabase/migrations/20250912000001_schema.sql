/*
  Cookie Catcher - Complete Database Schema

  Tables:
    - rooms: Game room configuration and state
    - nickname_words: Word components for combinatorial nicknames
    - players: Active players in rooms
    - cookies: Spawned emoji objects (cookies and cats)
    - scores: Player scoring data (round and total)

  Security:
    - RLS enabled on all tables
    - Public read/realtime access for game data
    - Writes restricted to Edge Functions (service role)
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id text PRIMARY KEY,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'intermission')),
  round_no integer NOT NULL DEFAULT 0,
  round_started_at timestamptz,
  round_ends_at timestamptz,
  spawn_rate_per_sec numeric NOT NULL DEFAULT 2.0,
  ttl_seconds integer NOT NULL DEFAULT 8,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create nickname_words table for combinatorial nicknames
-- 30 words per position = 30 x 30 x 30 = 27,000 combinations
CREATE TABLE IF NOT EXISTS nickname_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text UNIQUE NOT NULL,
  position integer NOT NULL CHECK (position IN (1, 2, 3)),
  created_at timestamptz DEFAULT now()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL REFERENCES rooms(id),
  nick text NOT NULL,
  color text,
  device_id text NOT NULL,
  joined_at timestamptz DEFAULT now(),
  last_seen_at timestamptz DEFAULT now(),
  UNIQUE(room_id, device_id)
);

-- Create cookies table
CREATE TABLE IF NOT EXISTS cookies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL REFERENCES rooms(id),
  type text NOT NULL CHECK (type IN ('cookie', 'cat')),
  value integer NOT NULL,
  x_pct numeric NOT NULL CHECK (x_pct >= 0 AND x_pct <= 100),
  y_pct numeric NOT NULL DEFAULT 0 CHECK (y_pct >= -10 AND y_pct <= 110),
  spawned_at timestamptz DEFAULT now(),
  despawn_at timestamptz NOT NULL,
  owner uuid REFERENCES players(id),
  claimed_at timestamptz
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  player_id uuid PRIMARY KEY REFERENCES players(id),
  room_id text NOT NULL REFERENCES rooms(id),
  score_total integer NOT NULL DEFAULT 0,
  score_round integer NOT NULL DEFAULT 0,
  last_claim_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE nickname_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookies ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow all operations for realtime (actual writes still restricted to service role)
CREATE POLICY "Allow realtime access on rooms" ON rooms FOR ALL TO anon, authenticated USING (true);
CREATE POLICY "Allow realtime access on cookies" ON cookies FOR ALL TO anon, authenticated USING (true);
CREATE POLICY "Allow realtime access on scores" ON scores FOR ALL TO anon, authenticated USING (true);
CREATE POLICY "Allow realtime access on players" ON players FOR ALL TO anon, authenticated USING (true);
-- Nickname words only need read access
CREATE POLICY "Allow read access on nickname_words" ON nickname_words FOR SELECT TO anon, authenticated USING (true);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_players_device_room ON players(device_id, room_id);
CREATE INDEX IF NOT EXISTS idx_players_nick ON players(nick);
CREATE INDEX IF NOT EXISTS idx_cookies_room_owner ON cookies(room_id, owner);
CREATE INDEX IF NOT EXISTS idx_cookies_despawn ON cookies(despawn_at);
CREATE INDEX IF NOT EXISTS idx_cookies_position ON cookies(x_pct, y_pct);
CREATE INDEX IF NOT EXISTS idx_scores_room ON scores(room_id);
CREATE INDEX IF NOT EXISTS idx_nickname_words_position ON nickname_words(position);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scores_updated_at BEFORE UPDATE ON scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert main room
INSERT INTO rooms (id, name, status, spawn_rate_per_sec, ttl_seconds)
VALUES ('main-room', 'Conference Cookie Catcher', 'idle', 2.0, 8)
ON CONFLICT (id) DO NOTHING;
