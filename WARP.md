# WARP.md - Cookie Catcher Project Rules

This document contains project-specific rules and conventions for the Cookie Catcher game. These rules should be followed when working on this codebase.

## 🎯 Project Context

**Purpose**: Live multiplayer demo game for Angular Connect conference presentation
**Audience**: Conference attendees (developers) playing on their phones
**Display**: Projector showing main game screen, individual phones for gameplay
**Duration**: Single session during conference talk

## 🏗️ Technical Stack & Constraints

### Mandatory Technologies
- **Framework**: Angular 20 with standalone components and signals
- **Styling**: Tailwind CSS only (no custom CSS classes unless absolutely necessary)
- **Backend**: Supabase (PostgreSQL + Edge Functions + Realtime)
- **Region**: EU-West (for London conference)
- **Target**: Mobile-first, but should look decent on desktop

### TypeScript Best Practices
- Use strict type checking - already enabled
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- Use absolute paths from `@/` alias for app imports

### Angular Component Rules
- Always use standalone components (do NOT set `standalone: true` - it's the default)
- Use `input()` and `output()` functions instead of `@Input()` and `@Output()` decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in all components
- Prefer inline templates for small components (< 50 lines)
- Do NOT use `@HostBinding` and `@HostListener` - use `host` object in decorator instead
- Do NOT use `ngClass` - use `[class]` bindings instead
- Do NOT use `ngStyle` - use `[style]` bindings instead
- Use `NgOptimizedImage` for all static images (not for inline base64)

### State Management Rules
- Use Angular signals for all state management - no RxJS subjects for state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead
- Store signals in dedicated store files (e.g., `game.store.ts`)

### Template Rules
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables (only for non-signal streams)
- Prefer Reactive forms over Template-driven forms

### Service Rules
- Design services around a single responsibility
- Use `providedIn: 'root'` for singleton services
- Use the `inject()` function instead of constructor injection
- Keep services focused and small

## 📁 Project Structure

```
src/app/
├── core/          # Singleton services (use providedIn: 'root')
├── state/         # Signal-based stores with computed() values
├── pages/         # Route components (lazy loaded)
├── ui/            # Presentational components (OnPush strategy)
└── types/         # TypeScript interfaces/types

supabase/
├── migrations/    # Numbered migrations (001_*, 002_*, etc.)
└── functions/     # One folder per Edge Function
```

## 🔐 Security Rules

### Client-Side
- **Never** store service role key in client code
- **Never** allow direct writes to database from client
- All mutations must go through Edge Functions
- Device IDs stored in localStorage + cookie (for persistence)

### Server-Side (Edge Functions)
- **Always** validate input parameters
- **Always** enforce rate limiting (120ms between claims)
- **Always** use atomic operations for claims
- **Always** check room status before operations

## 🎮 Game Logic Rules

### Emoji Spawning
- Default spawn rate: 2-3 cookies per second
- Cat emoji probability: 5-10% of spawns
- X position: Random between 5-95% (leave margins)
- Fall duration: Variable based on speed (3-5 seconds typical)

### Scoring
- Cookie = 1 point (always)
- Cat = 3 points (always)
- No negative scores
- No bonus multipliers
- Scores persist across rounds (cumulative)

### Rounds
- Exactly 4 rounds, no more, no less
- Each round: 30 seconds gameplay
- Between rounds: 10 seconds intermission
- Round scores reset, total scores persist

### Rate Limiting
- Client: Throttle taps to ~100ms
- Server: Enforce 120ms minimum between successful claims per player
- Both limits are hard-coded, not configurable

## 🎨 UI/UX Rules

### Mobile Interaction
- Tap targets: Minimum 44x44px
- Emoji size: ~40-50px on mobile
- No drag gestures, only taps
- No haptic feedback (not all devices support)

### Visual Hierarchy
1. Game canvas (primary focus)
2. Score/Timer (always visible)
3. Leaderboard (drawer/modal)
4. Footer (minimal, social links only)

### Animation Performance
- Target 60fps, throttle to 30fps if needed
- Max 50 emojis on screen simultaneously
- Remove emoji immediately on claim (no fade)
- Simple linear falling motion (no physics)

## 🗄️ Database Conventions

### Naming
- Tables: snake_case, plural (e.g., `cookies`, `players`)
- Columns: snake_case (e.g., `device_id`, `spawned_at`)
- Indexes: `idx_{table}_{columns}` (e.g., `idx_cookies_owner`)
- Constraints: `{table}_{column}_fkey` for foreign keys

### Data Types
- IDs: UUID v4 (generated server-side)
- Timestamps: `timestamptz` (always with timezone)
- Scores: `integer` (no decimals)
- Percentages: `integer` 0-100 (not decimal 0-1)

### Nickname Pool
- Pre-populate exactly 300 nicknames
- No profanity or offensive terms
- Max length: 12 characters
- Examples: "BlueFox", "RedPanda", "GreenOwl", etc.

## 🚀 Performance Guidelines

### Client Optimization
- Use `ChangeDetectionStrategy.OnPush` for all components
- Implement lazy loading for feature routes
- Debounce realtime subscriptions
- Batch DOM updates using requestAnimationFrame
- Lazy load leaderboard data
- Cache device ID and nickname
- Use `computed()` for derived values to avoid recalculation
- Use `NgOptimizedImage` for static images

### Server Optimization
- Index on `cookies.owner` and `cookies.despawn_at`
- Clean up expired cookies periodically
- Limit leaderboard queries to top 10
- Use prepared statements in Edge Functions

### Realtime Channels
- Single room channel for all game events
- Separate presence channel for online count
- No per-player channels (too many connections)

## 🧪 Testing Approach

### Local Testing
- Use multiple incognito windows for different players
- Admin panel on main window
- Test with throttled network (3G) for mobile simulation
- Maximum local test: ~10 concurrent players

### Pre-Conference Testing
- Deploy to staging environment
- Test with real devices (various phones)
- Verify EU-West latency from London
- Load test with 200 simulated players

## 📝 Environment Variables

Required in `.env`:
```
SUPABASE_URL=        # Supabase project URL
SUPABASE_ANON_KEY=   # Anon/public key only
ADMIN_PASSCODE=      # Simple string, no special chars
```

Never commit `.env` file. Use `.env.example` for documentation.

## 🚫 What NOT to Do

### Feature Restrictions
1. **Don't** add PWA features (not needed for demo)
2. **Don't** implement user accounts (anonymous only)
3. **Don't** add sound effects (projector audio issues)
4. **Don't** store personally identifiable information
5. **Don't** implement chat or messaging
6. **Don't** add monetization or ads
7. **Don't** over-engineer for scale beyond 200 players
8. **Don't** add complex animations that hurt performance

### Angular Anti-patterns to Avoid
9. **Don't** use NgModules - only standalone components
10. **Don't** use `*ngIf`, `*ngFor`, `*ngSwitch` - use `@if`, `@for`, `@switch`
11. **Don't** use `@Input()` and `@Output()` decorators - use `input()` and `output()` functions
12. **Don't** use `@HostBinding` and `@HostListener` - use `host` object
13. **Don't** use `ngClass` and `ngStyle` - use `[class]` and `[style]` bindings
14. **Don't** use constructor injection - use `inject()` function
15. **Don't** use RxJS subjects for state - use signals
16. **Don't** use `mutate` on signals - use `update` or `set`
17. **Don't** set `standalone: true` explicitly - it's the default
18. **Don't** use the `any` type - use `unknown` or proper types

## ✅ Definition of Done

A feature is complete when:
1. Works on iPhone Safari and Android Chrome
2. Handles 200 concurrent players without lag
3. Updates reflect within 300ms across all clients
4. No TypeScript errors or warnings (strict mode)
5. Admin can control it from admin panel
6. Degrades gracefully on connection loss
7. Components use OnPush change detection
8. All components are standalone (no NgModules)
9. Uses native control flow (@if, @for, @switch)
10. Services use inject() function

## 🎯 Success Metrics

The demo is successful if:
- Setup takes < 5 minutes at conference
- Players can join with one tap
- Game runs smoothly for entire talk
- Audience stays engaged and has fun
- No crashes or major bugs during demo
- Leaderboard creates friendly competition

## 🔄 Update Protocol

When modifying this project:
1. Test changes with at least 3 devices
2. Verify admin panel still works
3. Check performance with DevTools
4. Ensure mobile-first responsive design
5. Update README if adding new features
6. Keep commits focused and atomic

---

**Remember**: This is a conference demo. It should be fun, engaging, and technically impressive, but doesn't need production-level polish in all areas. Focus on the core multiplayer experience and smooth gameplay.