/*
  Cookie Catcher - Nickname Word Components

  30 words per position = 30 x 30 x 30 = 27,000 unique combinations
  Format: Word1 + Word2 + Word3 = "HappyCookieFriend"

  Theme: Friendly, food, fruits, flowers
*/

-- Position 1: Friendly Adjectives (30 words)
INSERT INTO nickname_words (word, position) VALUES
  ('Happy', 1), ('Sunny', 1), ('Sweet', 1), ('Lovely', 1), ('Cozy', 1),
  ('Fluffy', 1), ('Sparkly', 1), ('Cuddly', 1), ('Giggly', 1), ('Bubbly', 1),
  ('Cheerful', 1), ('Jolly', 1), ('Merry', 1), ('Gentle', 1), ('Soft', 1),
  ('Warm', 1), ('Bright', 1), ('Peachy', 1), ('Rosy', 1), ('Breezy', 1),
  ('Dreamy', 1), ('Snuggly', 1), ('Fancy', 1), ('Lucky', 1), ('Zippy', 1),
  ('Bouncy', 1), ('Twinkly', 1), ('Perky', 1), ('Chirpy', 1), ('Dainty', 1)
ON CONFLICT (word) DO NOTHING;

-- Position 2: Foods, Fruits & Flowers (30 words)
INSERT INTO nickname_words (word, position) VALUES
  ('Cookie', 2), ('Muffin', 2), ('Cupcake', 2), ('Waffle', 2), ('Pancake', 2),
  ('Donut', 2), ('Brownie', 2), ('Pudding', 2), ('Truffle', 2), ('Biscuit', 2),
  ('Cherry', 2), ('Peach', 2), ('Mango', 2), ('Berry', 2), ('Apple', 2),
  ('Lemon', 2), ('Melon', 2), ('Plum', 2), ('Fig', 2), ('Kiwi', 2),
  ('Rose', 2), ('Daisy', 2), ('Tulip', 2), ('Lily', 2), ('Poppy', 2),
  ('Violet', 2), ('Jasmine', 2), ('Clover', 2), ('Petal', 2), ('Maple', 2)
ON CONFLICT (word) DO NOTHING;

-- Position 3: Friendly Endings (30 words)
INSERT INTO nickname_words (word, position) VALUES
  ('Friend', 3), ('Buddy', 3), ('Pal', 3), ('Star', 3), ('Angel', 3),
  ('Charm', 3), ('Delight', 3), ('Wonder', 3), ('Joy', 3), ('Sparkle', 3),
  ('Treasure', 3), ('Darling', 3), ('Sweetie', 3), ('Blossom', 3), ('Sprout', 3),
  ('Puff', 3), ('Fluff', 3), ('Pop', 3), ('Twirl', 3), ('Swirl', 3),
  ('Doodle', 3), ('Wiggle', 3), ('Giggle', 3), ('Snuggle', 3), ('Cuddle', 3),
  ('Bubble', 3), ('Sprinkle', 3), ('Dash', 3), ('Pip', 3), ('Dot', 3)
ON CONFLICT (word) DO NOTHING;
