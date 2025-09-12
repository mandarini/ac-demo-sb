/*
  # Cookie Catcher Database Schema

  1. New Tables
    - `rooms` - Game room configuration and state
    - `nickname_pool` - Pre-defined safe nicknames for players
    - `players` - Active players in rooms
    - `cookies` - Spawned emoji objects (cookies and cats)
    - `scores` - Player scoring data (round and total)

  2. Security
    - Enable RLS on all tables
    - Public read access for game data
    - Function-only writes for security

  3. Sample Data
    - Create main room
    - Populate nickname pool with safe names
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

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE nickname_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookies ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON rooms FOR SELECT TO anon USING (true);
CREATE POLICY "Public read access" ON nickname_pool FOR SELECT TO anon USING (true);
CREATE POLICY "Public read access" ON players FOR SELECT TO anon USING (true);
CREATE POLICY "Public read access" ON cookies FOR SELECT TO anon USING (true);
CREATE POLICY "Public read access" ON scores FOR SELECT TO anon USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_players_device_room ON players(device_id, room_id);
CREATE INDEX IF NOT EXISTS idx_cookies_room_owner ON cookies(room_id, owner);
CREATE INDEX IF NOT EXISTS idx_cookies_despawn ON cookies(despawn_at);
CREATE INDEX IF NOT EXISTS idx_scores_room ON scores(room_id);
CREATE INDEX IF NOT EXISTS idx_nickname_pool_reserved ON nickname_pool(is_reserved, reserved_by_device_id);

-- Insert main room
INSERT INTO rooms (id, name, status, spawn_rate_per_sec, ttl_seconds)
VALUES ('main-room', 'Conference Cookie Catcher', 'idle', 2.0, 8)
ON CONFLICT (id) DO NOTHING;

-- Populate nickname pool with safe, fun names
INSERT INTO nickname_pool (nick) VALUES
  ('CookieMonster'), ('SweetTooth'), ('ChocolateChip'), ('SugarRush'), ('CandyCrush'),
  ('BiscuitBoss'), ('TreatHunter'), ('SnackAttack'), ('CrumbCatcher'), ('DoughDelight'),
  ('FrostingFan'), ('GingerbreadGuru'), ('MacaroonMaster'), ('PastryPro'), ('WaffleLover'),
  ('CupcakeCraze'), ('BrownieBuddy'), ('MuffinMania'), ('DonutDynamo'), ('CakeCaptain'),
  ('PiePlayer'), ('TartTamer'), ('PuddingPal'), ('JellyJumper'), ('CaramelKing'),
  ('VanillaVibes'), ('StrawberryStorm'), ('BlueberryBlast'), ('RaspberryRush'), ('PeachPower'),
  ('AppleAce'), ('BananaBlitz'), ('OrangeOrbit'), ('GrapeGuru'), ('CherryChamp'),
  ('LemonLegend'), ('LimeLight'), ('CoconutCraze'), ('PineapplePro'), ('MangoMaster'),
  ('KiwiKnight'), ('MelonMagic'), ('WatermelonWin'), ('PumpkinPal'), ('CarrotCrush'),
  ('BeetBoss'), ('CornChamp'), ('TomatoTitan'), ('PotatoPower'), ('OnionOracle'),
  ('GarlicGuru'), ('PepperPro'), ('SpiceSpirit'), ('HerbHero'), ('MintMaster'),
  ('BasilBuddy'), ('ThymeThief'), ('RosemaryRush'), ('SageSeeker'), ('DillDelight'),
  ('ParleyPal'), ('CilantroChamp'), ('ChiveChief'), ('ScallionStar'), ('LeekLegend'),
  ('CelerySeeker'), ('LettuceLord'), ('SpinachStar'), ('KaleKing'), ('CabbageChamp'),
  ('BroccoliBoss'), ('CauliflowerCap'), ('AsparagusAce'), ('ArtichokeArcher'), ('AvocadoAdept'),
  ('OliveOracle'), ('PicklePro'), ('CucumberCool'), ('ZucchiniZoom'), ('SquashStar'),
  ('EggplantElite'), ('PepperPioneer'), ('ChiliChamp'), ('JalapenoJet'), ('HabaneroHero'),
  ('SerranoStar'), ('PoblanoPro'), ('AnchoPal'), ('ChipotleChief'), ('CayenneKing'),
  ('PaprikaPro'), ('TurmericTitan'), ('CuminChamp'), ('CorianderCool'), ('FennelFan'),
  ('AniseedAce'), ('CardamomKing'), ('CinnamonStar'), ('NutmegNinja'), ('CloveChief'),
  ('AllspiceAce'), ('BayLeafBoss'), ('JuniperJet'), ('VanillaStar'), ('AlmondAce'),
  ('WalnutWin'), ('PecanPro'), ('HazelnutHero'), ('CashewChamp'), ('PistachioStar'),
  ('MacadamiaMaster'), ('BrazilNutBoss'), ('PineNutPro'), ('SunflowerSeed'), ('PumpkinSeed'),
  ('SesameSeeker'), ('FlaxFan'), ('ChiaStar'), ('QuinoaQueen'), ('RiceRuler'),
  ('WheatWin'), ('OatOracle'), ('BarleyBoss'), ('RyeRuler'), ('CornKing'),
  ('MilletMaster'), ('SorghumStar'), ('BuckwheatBoss'), ('AmaranthAce'), ('TeffTitan')
ON CONFLICT (nick) DO NOTHING;

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