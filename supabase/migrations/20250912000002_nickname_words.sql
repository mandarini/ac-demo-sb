/*
  Cookie Catcher - Nickname Word Components

  30 words per position = 30 x 30 x 30 = 27,000 unique combinations
  Format: Word1 + Word2 + Word3 = "SwiftCookieMaster"
*/

-- Position 1: Adjectives (30 words)
INSERT INTO nickname_words (word, position) VALUES
  ('Swift', 1), ('Cosmic', 1), ('Turbo', 1), ('Mighty', 1), ('Epic', 1),
  ('Brave', 1), ('Clever', 1), ('Fierce', 1), ('Silent', 1), ('Rapid', 1),
  ('Stellar', 1), ('Bold', 1), ('Quantum', 1), ('Cyber', 1), ('Hyper', 1),
  ('Ultra', 1), ('Super', 1), ('Mega', 1), ('Blazing', 1), ('Frozen', 1),
  ('Shadow', 1), ('Golden', 1), ('Silver', 1), ('Crystal', 1), ('Thunder', 1),
  ('Lightning', 1), ('Mystic', 1), ('Phantom', 1), ('Nova', 1), ('Arctic', 1)
ON CONFLICT (word) DO NOTHING;

-- Position 2: Nouns (30 words)
INSERT INTO nickname_words (word, position) VALUES
  ('Cookie', 2), ('Pixel', 2), ('Code', 2), ('Cloud', 2), ('Star', 2),
  ('Byte', 2), ('Data', 2), ('Node', 2), ('Wave', 2), ('Storm', 2),
  ('Dragon', 2), ('Phoenix', 2), ('Tiger', 2), ('Wolf', 2), ('Eagle', 2),
  ('Falcon', 2), ('Ninja', 2), ('Samurai', 2), ('Knight', 2), ('Spark', 2),
  ('Comet', 2), ('Nebula', 2), ('Orbit', 2), ('Pulse', 2), ('Beam', 2),
  ('Flash', 2), ('Blaze', 2), ('Frost', 2), ('Vortex', 2), ('Rift', 2)
ON CONFLICT (word) DO NOTHING;

-- Position 3: Titles (30 words)
INSERT INTO nickname_words (word, position) VALUES
  ('Master', 3), ('Ninja', 3), ('Ranger', 3), ('Hunter', 3), ('Pro', 3),
  ('Hero', 3), ('Legend', 3), ('Wizard', 3), ('Sage', 3), ('Chief', 3),
  ('King', 3), ('Queen', 3), ('Lord', 3), ('Boss', 3), ('Ace', 3),
  ('Champion', 3), ('Guardian', 3), ('Warrior', 3), ('Seeker', 3), ('Slayer', 3),
  ('Rider', 3), ('Runner', 3), ('Crusher', 3), ('Catcher', 3), ('Breaker', 3),
  ('Maker', 3), ('Walker', 3), ('Jumper', 3), ('Dasher', 3), ('Striker', 3)
ON CONFLICT (word) DO NOTHING;
