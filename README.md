# 🍪 Cookie Catcher

A real-time multiplayer cookie-catching game built with Angular and Supabase for the Angular Connect conference. Players join on their mobile devices to catch falling cookies and cats that rain down from the sky, competing for the highest score on shared leaderboards.

**Live Demo**: https://ngdemo-sb.netlify.app

## 🎮 Game Overview

- **Real-time Multiplayer**: Unlimited concurrent players in a single shared room
- **Simple Gameplay**: Tap falling emojis to claim them before they disappear
- **Two Collectibles**: Cookies (🍪) worth 1 point, Cats (🐱) worth 3 points (15% spawn rate)
- **Dual Leaderboards**: "This Round" and "All-time" scoring with live updates
- **Anonymous Play**: Auto-assigned nicknames from 27,000+ combinatorial possibilities
- **Real-time Cursors**: See other players' mouse movements and interactions
- **Admin Controls**: Game master panel with GitHub OAuth authentication

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase project with GitHub OAuth configured
- Angular CLI (`npm install -g @angular/cli`)

### Development Setup

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd ac-demo-sb
   npm install
   ```

2. **Configure Supabase**:
   ```bash
   # Update src/environments/environment.ts with your Supabase URL and anon key
   supabase db push      # Deploy database schema & pg_cron jobs
   supabase functions deploy  # Deploy Edge Functions
   ```

3. **Configure GitHub OAuth** (see [Admin Authentication](#-admin-authentication) section)

4. **Run locally**:
   ```bash
   ng serve
   ```

5. **Access the app**:
   - Game: `http://localhost:4200`
   - Admin: `http://localhost:4200/admin` (requires GitHub login)
   - Leaderboard: `http://localhost:4200/leaderboard`

## 📱 How It Works

### Player Experience
1. **Join**: Visit the URL → auto-assigned nickname → "Start Playing" button
2. **Play**: Tap falling cookies/cats as they rain down the screen
3. **Score**: Real-time score updates, compete on live leaderboards
4. **Persist**: Your nickname and scores persist across browser sessions via device ID

### Privacy & Device ID
The game generates a random identifier stored in localStorage and as a cookie to remember your nickname and scores between sessions. No personal information is collected - just a game identifier for session persistence.

### Game Mechanics
- **Spawning**: Server-side spawning via `pg_cron` (prevents client abuse)
- **Falling Animation**: 8-second fall time from top to bottom of screen
- **First-tap Wins**: Atomic claiming prevents duplicate scores
- **Rate Limiting**: 120ms cooldown between claims per player
- **Auto Cleanup**: Expired cookies automatically removed from database

## 🏗️ Technical Architecture

### Frontend (Angular 20)
- **Standalone Components**: Modern Angular architecture with signals
- **Real-time State**: `GameStore` with Supabase Realtime subscriptions
- **Smooth Animation**: 60fps cookie falling with position interpolation
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Real-time Cursors**: Multiplayer cursor tracking via Supabase Presence

### Backend (Supabase)
- **PostgreSQL**: Game state, players, scores, and configuration
- **Edge Functions (Deno)**:
  - `assign_nickname`: Device-based nickname reservation (IP rate limited)
  - `claim_cookie`: Atomic cookie claiming with 120ms rate limiting
  - `admin_actions`: Game control operations (JWT authenticated)
- **pg_cron**: Server-side cookie spawning every minute with staggered timing
- **Realtime**: Live updates for cookies, scores, and presence
- **RLS Policies**: Public read access, function-only writes

### Security Features
- **Server-side Spawning**: Cookies spawned by `pg_cron`, not clients (prevents flooding)
- **Rate Limiting**: IP-based rate limiting on player creation (10/minute)
- **Room Capacity**: Maximum 1000 players per room
- **JWT Authentication**: Admin actions require valid Supabase Auth token
- **Email Allowlist**: Only allowlisted GitHub emails can access admin panel

### Database Schema

```sql
-- Game room configuration
rooms (
  id, status, spawn_rate_per_sec, ttl_seconds, max_players
)

-- Word components for combinatorial nicknames (27,000 combinations)
nickname_words (
  word, position  -- 3 positions = word1 + word2 + word3
)

-- Active players
players (
  nick, device_id, color, room_id
)

-- Falling objects
cookies (
  type, value, x_pct, spawned_at, despawn_at, owner
)

-- Player scores
scores (
  score_total, score_round, last_claim_at
)

-- Rate limiting (prevents abuse)
rate_limits (
  ip_address, action, request_count, window_start
)

-- Admin access control
admin_allowlist (
  email  -- GitHub emails allowed to access admin panel
)
```

## 🔐 Admin Authentication

The admin panel uses **GitHub OAuth** with an email allowlist for access control.

### Setup GitHub OAuth

1. **Create GitHub OAuth App**:
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Set Homepage URL: `https://your-app.netlify.app`
   - Set Callback URL: `https://<project-ref>.supabase.co/auth/v1/callback`

2. **Configure Supabase**:
   - Go to Supabase Dashboard → Authentication → Providers → GitHub
   - Enable GitHub provider
   - Add Client ID and Client Secret from GitHub

3. **Add Admin Emails**:
   - Edit `supabase/migrations/20250912000005_github_auth.sql`
   - Or add emails directly in Supabase Dashboard → Table Editor → `admin_allowlist`

### Admin Features
- **Game Controls**: Start/Stop game, clear cookies
- **Spawn Rate**: Adjust cookies per second (0.5-10)
- **Manual Spawn**: Instantly create 100 cookies for testing
- **Score Management**: Reset round scores or all scores
- **Real-time Status**: See game state, player count, other admin cursors

## 🛠️ Development

### Project Structure
```
src/app/
├── core/                    # Services
│   ├── supabase.service.ts       # Auth, database & Edge Functions
│   ├── device.service.ts         # Persistent device ID
│   ├── presence.service.ts       # Real-time presence
│   ├── cursor.service.ts         # Multiplayer cursors
│   └── auth.guard.ts             # Admin route protection
├── state/
│   └── game.store.ts        # Central game state with signals
├── pages/
│   ├── join/               # Landing page
│   ├── game/               # Main gameplay
│   ├── admin/              # Admin panel (GitHub OAuth)
│   └── leaderboard/        # Standalone leaderboard
└── ui/                     # Reusable components

supabase/
├── migrations/
│   ├── 20250912000001_base_schema.sql        # Core tables & RLS
│   ├── 20250912000002_seed_nicknames.sql     # Nickname word pool
│   ├── 20250912000003_server_side_spawning.sql  # pg_cron spawner
│   ├── 20250912000004_rate_limiting.sql      # Abuse prevention
│   └── 20250912000005_github_auth.sql        # Admin allowlist
└── functions/
    ├── assign_nickname/    # Player registration
    ├── claim_cookie/       # Score updates
    └── admin_actions/      # Game control (JWT auth)
```

### Local Development
1. **Multiple Players**: Open multiple browser tabs or incognito windows
2. **Admin Testing**: Use `/admin` with your GitHub account
3. **Real-time Debug**: Check browser DevTools for WebSocket messages
4. **Database Inspection**: Use Supabase dashboard to view live data

## 🚀 Deployment

### Supabase Setup
```bash
# 1. Link to your project
supabase link --project-ref <your-project-ref>

# 2. Deploy database (includes pg_cron jobs)
supabase db push

# 3. Deploy Edge Functions
supabase functions deploy assign_nickname
supabase functions deploy claim_cookie
supabase functions deploy admin_actions
```

### Frontend Deployment (Netlify)
```bash
ng build
# Deploy dist/ac-demo-sb/browser/ to Netlify
```

Add `_redirects` file for Angular routing:
```
/*    /index.html   200
```

### Environment Checklist
- [ ] Supabase URL and anon key in `environment.ts`
- [ ] GitHub OAuth configured in Supabase Dashboard
- [ ] Your email added to `admin_allowlist` table
- [ ] Edge Functions deployed
- [ ] `pg_cron` extension enabled (automatic on Supabase)

## 🎨 Customization

### Game Tuning
- **Spawn Rate**: Modify `rooms.spawn_rate_per_sec` (default: 2.0)
- **Fall Speed**: Adjust `rooms.ttl_seconds` (default: 8)
- **Cat Rarity**: Change probability in `server_side_spawning.sql` (default: 15%)
- **Rate Limit**: Modify claim cooldown in `claim_cookie` (default: 120ms)
- **Room Capacity**: Adjust `rooms.max_players` (default: 1000)

### Adding Admin Users
```sql
INSERT INTO admin_allowlist (email) VALUES ('new-admin@example.com');
```

## 📊 Conference Demo Tips

### Pre-Event Setup
1. **Test OAuth**: Verify GitHub login works with your email
2. **Add Co-admins**: Add other organizers to `admin_allowlist`
3. **Load Test**: Verify performance with expected player count
4. **Network**: Ensure stable internet for real-time features

### During Event
1. **Start Slow**: Begin with lower spawn rates, increase gradually
2. **Monitor Performance**: Watch for lag, adjust spawn rate accordingly
3. **Engage Audience**: Use admin panel to create exciting moments
4. **Reset Between Sessions**: Clear scores between different groups

### Troubleshooting
- **Cookies Not Spawning**: Check `pg_cron` job in Supabase Dashboard → Database → Extensions
- **Can't Access Admin**: Verify your GitHub email is in `admin_allowlist`
- **Players Can't Join**: Check rate limiting in `rate_limits` table
- **Scores Not Updating**: Verify Edge Functions are deployed

## 📝 License

MIT License - Feel free to use for your own conferences and events!

## 🔗 Links

- **Live Demo**: [ngdemo-sb.netlify.app](https://ngdemo-sb.netlify.app)
- **Creator**: [Katerina Skroumpelou](https://github.com/mandarini)
- **Twitter**: [@psybercity](https://x.com/psybercity)
- **Website**: [psyber.city](https://psyber.city)
- **Source Code**: [GitHub Repository](https://github.com/mandarini/ac-demo-sb)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

**Built with ❤️ for Angular Connect 2025**
*Showcasing the power of Angular + Supabase for real-time multiplayer experiences*
