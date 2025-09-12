/*
  # Cookie Catcher Initial Schema

  1. New Tables
    - `rooms` - Game room configuration and state
    - `nickname_pool` - Pre-defined safe nicknames for players
    - `players` - Active players in rooms
    - `cookies` - Spawned emoji cookies/cats 
    - `scores` - Player scoring data (round + total)

  2. Security
    - Enable RLS on all tables
    - Public read access for demo
    - Writes via Edge Functions only (service role)

  3. Indexes
    - Performance indexes for common queries
    - Foreign key constraints

  4. Sample Data
    - Create main room
    - Populate nickname pool
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Create nickname pool table
CREATE TABLE IF NOT EXISTS nickname_pool (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nick text UNIQUE NOT NULL,
  is_reserved boolean NOT NULL DEFAULT false,
  reserved_by_device_id text,
  reserved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
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
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('cookie', 'cat')),
  value integer NOT NULL DEFAULT 1,
  x_pct numeric NOT NULL CHECK (x_pct >= 0 AND x_pct <= 100),
  spawned_at timestamptz DEFAULT now(),
  despawn_at timestamptz NOT NULL,
  owner uuid REFERENCES players(id),
  claimed_at timestamptz
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  player_id uuid PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  score_total integer NOT NULL DEFAULT 0,
  score_round integer NOT NULL DEFAULT 0,
  last_claim_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE nickname_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookies ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public read for demo)
CREATE POLICY "Allow public read on rooms" ON rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read on nickname_pool" ON nickname_pool FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read on players" ON players FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read on cookies" ON cookies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read on scores" ON scores FOR SELECT TO anon, authenticated USING (true);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_cookies_room_active ON cookies(room_id, despawn_at) WHERE owner IS NULL;
CREATE INDEX IF NOT EXISTS idx_cookies_owner ON cookies(owner) WHERE owner IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_players_room_device ON players(room_id, device_id);
CREATE INDEX IF NOT EXISTS idx_players_last_seen ON players(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_scores_room_total ON scores(room_id, score_total DESC);
CREATE INDEX IF NOT EXISTS idx_scores_room_round ON scores(room_id, score_round DESC);
CREATE INDEX IF NOT EXISTS idx_nickname_reserved ON nickname_pool(is_reserved, reserved_by_device_id);

-- Create main room
INSERT INTO rooms (id, name, status, spawn_rate_per_sec, ttl_seconds)
VALUES ('main-room'::uuid, 'Conference Main Room', 'idle', 2.0, 8)
ON CONFLICT (id) DO NOTHING;

-- Populate nickname pool with safe, fun nicknames
INSERT INTO nickname_pool (nick) VALUES
  ('CookieMonster'), ('SwiftCatcher'), ('NinjaNibbler'), ('EpicEater'),
  ('TurboTaster'), ('MegaMuncher'), ('SuperSnacker'), ('QuickBite'),
  ('FastFeast'), ('SpeedySpoon'), ('RocketRacer'), ('ZoomZapper'),
  ('BlazeBiter'), ('ThunderThief'), ('LightningLicker'), ('FlashFeast'),
  ('CosmicCruncher'), ('StarSnatcher'), ('GalaxyGobbler'), ('NebulaNoม'),
  ('OrbitOmnivore'), ('PlanetPicker'), ('MeteorMuncher'), ('AstroAppetite'),
  ('QuantumQuaffer'), ('DigitalDiner'), ('PixelPicker'), ('ByteBiter'),
  ('CodeCruncher'), ('DataDevourer'), ('AlgoAppetite'), ('BinaryBiter'),
  ('HexHunter'), ('ScriptSnacker'), ('BugBuster'), ('LoopLicker'),
  ('ArrayAce'), ('FuncFeaster'), ('ClassCatcher'), ('ObjectOmnivore'),
  ('MethodMuncher'), ('VarVampire'), ('StringSlurper'), ('IntIntaker'),
  ('BoolBiter'), ('FloatFeaster'), ('CharChaser'), ('ListLicker'),
  ('DictDevourer'), ('SetSnatcher'), ('TupleThief'), ('MapMuncher'),
  ('VectorVampire'), ('MatrixMuncher'), ('GraphGobbler'), ('TreeTaster'),
  ('NodeNibbler'), ('EdgeEater'), ('PathPicker'), ('LoopLover'),
  ('BranchBiter'), ('RootRacer'), ('LeafLicker'), ('StemSnatcher'),
  ('FlowerFeaster'), ('PetalPicker'), ('BloomBiter'), ('GardenGobbler'),
  ('NatureNomad'), ('ForestFeaster'), ('JungleJumper'), ('DesertDasher'),
  ('OceanOmnivore'), ('RiverRacer'), ('MountainMover'), ('ValleyVoyager'),
  ('HillHopper'), ('PlainsPioneer'), ('CanyonCrawler'), ('CliffClimber'),
  ('CaveExplorer'), ('TunnelTraveler'), ('BridgeBouncer'), ('TowerTrekker'),
  ('CastleCatcher'), ('FortressFinder'), ('PalacePicker'), ('ManorMover'),
  ('VillaVisitor'), ('CottageCreeper'), ('CabinCatcher'), ('HutHunter'),
  ('TentTrekker'), ('IglooInvestigator'), ('TeepeeTracker'), ('YurtYeager'),
  ('BungalowBouncer'), ('StudioStalker'), ('LoftLurker'), ('AtticAdventurer'),
  ('BasementBrawler'), ('GarageGuardian'), ('ShedSeeker'), ('BarnBouncer'),
  ('StableStrider'), ('PenProwler'), ('CoopCrawler'), ('NestNavigator'),
  ('HiveHunter'), ('ColonyCollector'), ('SwarmSeeker'), ('FlockFollower'),
  ('PackPursuer'), ('PrideProwler'), ('TroopTracker'), ('BandBouncer'),
  ('CrewCatcher'), ('GangGatherer'), ('TeamTrekker'), ('SquadSeeker'),
  ('UnitUndertaker'), ('ForceFollower'), ('ArmyAdventurer'), ('LegionLeader'),
  ('CorpsCommander'), ('DivisionDasher'), ('BrigadeBouncer'), ('RegimentRacer'),
  ('BattleBrawler'), ('WarWanderer'), ('ConflictCrawler'), ('SkirmishSeeker')
ON CONFLICT (nick) DO NOTHING;

-- Update function for timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_scores_updated_at BEFORE UPDATE ON scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();