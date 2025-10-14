# 🍪 Cookie Catcher

A real-time multiplayer cookie-catching game built with Angular and Supabase for the Angular Connect conference. Players join on their mobile devices to catch falling cookies and cats that rain down from the sky, competing for the highest score on shared leaderboards.

## 🎮 Game Overview

- **Real-time Multiplayer**: Unlimited concurrent players in a single shared room
- **Simple Gameplay**: Tap falling emojis to claim them before they disappear
- **Two Collectibles**: Cookies (🍪) worth 1 point, Cats (🐱) worth 3 points (15% spawn rate)
- **Dual Leaderboards**: "This Round" and "All-time" scoring with live updates
asdfasdf- **Real-time Cursors**: See other players' mouse movements and interactions
- **Admin Controls**: Game master panel for starting/stopping rounds and managing gameplay

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase project
- Angular CLI (`npm install -g @angular/cli`)

### Development Setup

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd ac-demo-sb
   npm install
   ```

2. **Configure Supabase**:
   - Update `src/environments/environment.ts` with your Supabase URL and anon key
   - Deploy the database schema: `supabase db push`
   - Deploy Edge Functions: `supabase functions deploy`

3. **Run locally**:
   ```bash
   ng serve
   ```

4. **Access the app**:
   - Game: `http://localhost:4200`
   - Admin: `http://localhost:4200/admin`
   - Leaderboard: `http://localhost:4200/leaderboard`
   - **Live Demo**: `https://ngdemo-sb.netlify.app`

## 📱 How It Works

### Player Experience
1. **Join**: Visit the URL → auto-assigned nickname → "Start Playing" button
2. **Play**: Tap falling cookies/cats as they rain down the screen
3. **Score**: Real-time score updates, compete on live leaderboards
4. **Persist**: Your nickname and scores persist across browser sessions via device ID

### Privacy & Device ID
The game generates a random identifier (like `device_abc123`) stored in both your browser's localStorage and as a cookie to remember your nickname and scores between sessions. No personal information, device details, or tracking data is collected - it's just a game identifier that lets you keep the same nickname if you refresh the page or come back later. The cookie has a 1-year expiration for persistence across browser sessions.

### Game Mechanics
- **Spawning**: Cookies spawn automatically at configurable rates (default: 2/second)
- **Falling Animation**: 8-second fall time from top to bottom of screen
- **First-tap Wins**: Atomic claiming prevents duplicate scores
- **Rate Limiting**: 120ms cooldown between claims per player
- **Auto Cleanup**: Expired cookies automatically removed from database

## 🏗️ Technical Architecture

### Frontend (Angular)
- **Standalone Components**: Modern Angular architecture with signals
- **Real-time State**: `GameStore` with Supabase Realtime subscriptions
- **Smooth Animation**: 60fps cookie falling with position interpolation
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Real-time Cursors**: Multiplayer cursor tracking via Supabase Presence

### Backend (Supabase)
- **PostgreSQL**: Game state, players, scores, and configuration
- **Edge Functions (Deno)**: Secure server-side operations
  - `assign_nickname`: Device-based nickname reservation
  - `claim_cookie`: Atomic cookie claiming with rate limiting
  - `spawn_cookies`: Automated cookie generation
  - `admin_actions`: Game control operations
  - `admin-auth`: Admin authentication
- **Realtime**: Live updates for cookies, scores, and presence
- **RLS Policies**: Public read access, function-only writes

### Database Schema

```sql
-- Game room configuration
rooms (
  id: 'main-room',
  status: 'idle' | 'running' | 'intermission',
  spawn_rate_per_sec: 2.0,
  ttl_seconds: 8
)

-- Player nickname pool (100+ pre-loaded)
nickname_pool (
  nick: 'CookieMonster', 'SwiftCatcher', etc.
  is_reserved: boolean,
  reserved_by_device_id: uuid
)

-- Active players
players (
  nick: assigned nickname,
  device_id: persistent browser UUID,
  color: auto-generated hex color
)

-- Falling objects
cookies (
  type: 'cookie' | 'cat',
  value: 1 | 3,
  x_pct: horizontal position (0-100),
  spawned_at: timestamp,
  despawn_at: timestamp,
  owner: null until claimed
)

-- Player scores
scores (
  score_total: cumulative all-time score,
  score_round: current round score,
  last_claim_at: for rate limiting
)
```

## 🔐 Admin Panel

Access `/admin` with admin passcode authentication.

### Game Controls
- **Start Game**: Begin cookie spawning and scoring
- **Stop Game**: End current session, clear active cookies
- **Spawn Rate**: Adjust cookies per second (0.5-10)
- **Manual Spawn**: Instantly create 100 cookies for testing

### Score Management
- **Reset Round Scores**: Clear current round, keep all-time totals
- **Reset All Scores**: Complete score wipe (with confirmation)

### Real-time Status
- **Game State**: Current status (idle/running/intermission)
- **Player Count**: Live online player counter
- **Admin Cursors**: See other admins' mouse movements

## 🎯 Key Features

### Real-time Synchronization
- **Sub-second Updates**: Cookie spawns and claims propagate instantly
- **Optimistic UI**: Immediate local updates with server reconciliation
- **Presence Tracking**: Live online player count
- **Cursor Sharing**: See other players' mouse movements

### Performance Optimizations
- **Efficient Queries**: Indexed database queries for fast leaderboards
- **Smart Cleanup**: Automatic removal of expired cookies
- **Rate Limiting**: Prevents spam and ensures fair play
- **Change Detection**: OnPush strategy with signals for optimal rendering

### Mobile-First Design
- **Touch Optimized**: Large tap targets for mobile gameplay
- **Responsive Layout**: Adapts to all screen sizes
- **Fast Animations**: Hardware-accelerated CSS transforms
- **Low Latency**: Direct WebSocket connections to Supabase

## 🛠️ Development

### Project Structure
```
src/app/
├── core/                    # Services
│   ├── supabase.service.ts  # Database client & Edge Functions
│   ├── device.service.ts    # Persistent device ID generation
│   ├── presence.service.ts  # Real-time presence tracking
│   └── cursor.service.ts    # Multiplayer cursor tracking
├── state/
│   └── game.store.ts        # Central game state with signals
├── pages/
│   ├── join/               # Landing page with nickname assignment
│   ├── game/               # Main gameplay screen
│   ├── admin/              # Admin control panel
│   └── leaderboard/        # Standalone leaderboard view
└── ui/                     # Reusable components
    ├── realtime-cursors.component.ts
    ├── join-notification.component.ts
    └── footer.component.ts

supabase/
├── migrations/             # Database schema evolution
│   └── *.sql              # Table definitions, indexes, RLS policies
└── functions/             # Edge Functions (Deno)
    ├── assign_nickname/   # Player registration
    ├── claim_cookie/      # Score atomic updates
    ├── spawn_cookies/     # Cookie generation
    ├── admin_actions/     # Game control
    └── admin-auth/        # Admin authentication
```

### Local Development
1. **Multiple Players**: Open multiple browser tabs or incognito windows
2. **Admin Testing**: Use `/admin` to control game flow
3. **Real-time Debug**: Check browser DevTools for WebSocket messages
4. **Database Inspection**: Use Supabase dashboard to view live data

## 🚀 Deployment

### Supabase Setup
1. **Create Project**: New Supabase project (any region)
2. **Run Migrations**: `supabase db push` to create schema
3. **Deploy Functions**: `supabase functions deploy --no-verify-jwt`
4. **Set Admin Password**: Configure `ADMIN_PASSCODE` in Edge Function secrets

### Frontend Deployment
1. **Build**: `ng build` generates optimized static files
2. **Deploy**: Upload `dist/ac-demo-sb/browser/` to any static host
3. **Configure**: Ensure `_redirects` file handles Angular routing

### Recommended Hosts
- **Netlify**: Automatic Angular routing support
- **Vercel**: Zero-config deployment
- **GitHub Pages**: Free hosting with custom domains

## 🎨 Customization

### Game Tuning
- **Spawn Rate**: Modify `rooms.spawn_rate_per_sec` (default: 2.0)
- **Fall Speed**: Adjust `rooms.ttl_seconds` (default: 8)
- **Cat Rarity**: Change probability in `spawn_cookies` function (default: 15%)
- **Rate Limit**: Modify claim cooldown in `claim_cookie` (default: 120ms)

### Visual Customization
- **Emojis**: Update cookie types in spawn functions
- **Colors**: Modify player color palette in `assign_nickname`
- **Nicknames**: Add more names to `nickname_pool` table
- **Styling**: Customize Tailwind classes throughout components

## 📊 Conference Demo Tips

### Pre-Event Setup
1. **Load Test**: Verify performance with expected player count
2. **Admin Training**: Brief operators on game controls
3. **Backup Plan**: Have admin passcode and reset procedures ready
4. **Network**: Ensure stable internet for real-time features

### During Event
1. **Start Slow**: Begin with lower spawn rates, increase gradually
2. **Monitor Performance**: Watch for lag, adjust spawn rate accordingly
3. **Engage Audience**: Use admin panel to create exciting moments
4. **Reset Between Sessions**: Clear scores between different groups

### Troubleshooting
- **Slow Performance**: Reduce spawn rate or clear active cookies
- **Players Can't Join**: Check Supabase connection and nickname pool
- **Scores Not Updating**: Verify Edge Functions are deployed
- **Admin Issues**: Confirm admin passcode and authentication

## 📝 License

MIT License - Feel free to use for your own conferences and events!

## 🔗 Links

- **Creator**: [Katerina Skroumpelou](https://github.com/mandarini)
- **Twitter**: [@psybercity](https://x.com/psybercity)
- **Website**: [psyber.city](https://psyber.city)
- **Source Code**: [GitHub Repository](https://github.com/mandarini/ac-demo-sb)
- **Supabase Docs**: [supabase.com](https://supabase.com/)

---

**Built with ❤️ for Angular Connect 2025**  
*Showcasing the power of Angular + Supabase for real-time multiplayer experiences*
