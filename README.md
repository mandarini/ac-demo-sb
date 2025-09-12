# 🍪 Cookie Catcher

A real-time multiplayer mini-game built with Angular 20 and Supabase for Angular Connect conference. Players compete to catch falling cookies and rare cats on their mobile devices while the game is displayed on a projector.

## 🎮 Game Overview

- **Multiplayer**: Up to 200 concurrent players
- **Rounds**: 4 rounds of 30 seconds each with 10-second intermissions
- **Scoring**: Regular cookies (🍪) = 1 point, Rare cats (🐱) = 3 points
- **Leaderboards**: Real-time "This Round" and "All-time" scoreboards
- **Anonymous Play**: Automatic nickname assignment from a curated pool

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Angular CLI (`npm install -g @angular/cli`)

### Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the root:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ADMIN_PASSCODE=your_secret_admin_passcode
   ```

4. Set up Supabase:
   - Create a new project in EU-West region
   - Run migrations from `supabase/migrations/`
   - Deploy Edge Functions from `supabase/functions/`
   - Populate nickname pool (seed script provided)

### Development

```bash
ng serve
```

Navigate to `http://localhost:4200`

### Production Build

```bash
ng build
```

## 📱 How to Play

1. **Join**: Players navigate to the game URL on their phones
   - Automatic nickname assignment
   - Persistent identity via device ID

2. **Game**: Tap falling emojis to claim them
   - First tap wins the points
   - Rate limited to prevent spam (120ms between claims)
   - Live leaderboard updates

3. **Scoring**:
   - 🍪 Cookie = 1 point
   - 🐱 Cat = 3 points (rare, ~5-10% spawn rate)
   - Scores accumulate across all rounds

## 🏗️ Architecture

### Frontend (Angular 20)
- **Standalone components** with signals for state management
- **Tailwind CSS** for styling
- **Canvas-based** emoji rain renderer
- **Real-time subscriptions** via Supabase Realtime

### Backend (Supabase)
- **PostgreSQL**: Authoritative game state
- **Edge Functions**: Secure write operations
  - `assign_nickname`: Reserve nicknames for devices
  - `claim_cookie`: Atomic cookie claiming with rate limiting
  - `spawn_cookies`: Generate falling emojis
  - `round_lifecycle`: Manage game rounds
- **Realtime**: Live updates for cookies, scores, and presence
- **RLS**: Public reads, function-only writes

### Data Model

```
rooms (single shared room)
├── status: idle | running | intermission
├── round_no: current round (1-4)
└── spawn_rate_per_sec: configurable

nickname_pool (300 pre-loaded nicknames)
├── nick: unique nickname
├── is_reserved: boolean
└── reserved_by_device_id: device UUID

players (active participants)
├── nick: assigned nickname
├── device_id: persistent UUID
└── last_seen_at: for presence

cookies (falling emojis)
├── type: cookie | cat
├── value: 1 or 3
├── x_pct: horizontal position (0-100)
├── owner: null until claimed
└── claimed_at: timestamp

scores (cumulative scoring)
├── score_total: all-time score
├── score_round: current round score
└── last_claim_at: rate limiting
```

## 🔐 Admin Panel

Access at `/admin` with passcode authentication.

**Controls:**
- Start/Stop rounds
- Adjust spawn rate
- Clear active cookies
- Reset scores (round or all-time)

**Diagnostics:**
- Current game status
- Online player count
- Round timer
- Claim rate monitoring

## 🎯 Performance Targets

- **Concurrency**: 200+ simultaneous players
- **Latency**: <300ms for claim → leaderboard update
- **Animation**: 60fps emoji rain (throttled if needed)
- **Rate Limiting**: Server-enforced 120ms between claims per player

## 🛠️ Development

### Key Files

```
src/app/
├── core/               # Services (Supabase, device, presence)
├── state/              # Game store with signals
├── pages/              # Join, Game, Admin routes
└── ui/                 # Playfield, Leaderboard, HUD components

supabase/
├── migrations/         # Database schema
└── functions/          # Edge Functions
```

### Testing Multiplayer Locally

1. Open multiple browser tabs/windows
2. Use incognito mode for different device IDs
3. Admin panel to control game flow

## 📊 Leaderboard Rules

- **This Round**: Sorted by `score_round`, ties broken alphabetically
- **All-time**: Sorted by `score_total`, ties broken alphabetically
- Shows top 10 + your rank

## 🚢 Deployment

1. Deploy Supabase functions:
   ```bash
   supabase functions deploy
   ```

2. Build Angular app:
   ```bash
   ng build
   ```

3. Deploy to your hosting provider (Vercel, Netlify, etc.)

## 🎨 Customization

- **Spawn Rate**: Adjust in admin panel or `rooms.spawn_rate_per_sec`
- **Emoji Types**: Modify spawn logic in `spawn_cookies` function
- **Round Duration**: Update `ROUND_DURATION` and `INTERMISSION_DURATION` constants
- **Nickname Pool**: Add more nicknames to database

## 📝 License

MIT

## 🔗 Links

- [GitHub](https://github.com/your-username)
- [Twitter](https://twitter.com/your-handle)

---

Built with ❤️ for Angular Connect
