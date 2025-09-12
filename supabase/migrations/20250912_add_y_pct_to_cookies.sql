-- Add y_pct field to cookies table for synchronized vertical positioning
-- This allows all clients to see cookies at the same screen positions

ALTER TABLE cookies ADD COLUMN IF NOT EXISTS y_pct numeric NOT NULL DEFAULT 0 CHECK (y_pct >= -10 AND y_pct <= 110);

-- Add index for performance on position queries
CREATE INDEX IF NOT EXISTS idx_cookies_position ON cookies(x_pct, y_pct);

-- Update existing cookies to have a starting y position (top of screen)
UPDATE cookies SET y_pct = -10 WHERE y_pct = 0;
