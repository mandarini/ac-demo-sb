# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cookie Catcher is a real-time multiplayer cookie-catching game built with Angular 20 and Supabase for conference demos. Players join on mobile devices to catch falling cookies/cats with live leaderboards.

## Common Commands

```bash
# Development
npm start              # Start dev server (localhost:4200)
ng serve               # Same as above
npm run build          # Production build

# Testing
npm test               # Run Karma tests
ng test                # Same as above
ng test --include='**/game.store.spec.ts'  # Run single test file

# Supabase
supabase db push                           # Deploy database migrations
supabase functions deploy                  # Deploy all Edge Functions
supabase functions deploy claim_cookie     # Deploy single function
supabase functions serve                   # Local function development
```

## Architecture

### Frontend (Angular)

```
src/app/
├── core/           # Singleton services
│   ├── supabase.service.ts   # Supabase client, auth, Edge Functions, realtime
│   ├── device.service.ts     # Persistent device ID (localStorage + cookie)
│   ├── presence.service.ts   # Real-time presence tracking
│   ├── cursor.service.ts     # Multiplayer cursor synchronization
│   └── auth.guard.ts         # Admin route protection (GitHub OAuth)
├── state/
│   └── game.store.ts         # Central state with signals, realtime subscriptions, game logic
├── pages/          # Route components (lazy-loaded)
│   ├── join/       # Landing page, nickname assignment
│   ├── game/       # Main gameplay
│   ├── admin/      # Admin controls (GitHub OAuth protected)
│   └── leaderboard/
├── ui/             # Shared presentational components
└── types/
    └── database.types.ts     # Supabase-generated types
```

**State Flow**: `SupabaseService` handles all Supabase communication. `GameStore` manages game state using Angular signals and subscribes to realtime channels. Components inject `GameStore` and use computed signals for reactive UI.

### Backend (Supabase Edge Functions)

```
supabase/functions/
├── assign_nickname/   # POST: deviceId → creates player with random nickname (IP rate limited)
├── claim_cookie/      # POST: cookieId, deviceId → atomic claim with rate limiting (120ms)
└── admin_actions/     # POST: action + JWT → game control (requires GitHub OAuth)
```

All functions use `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS. Client writes go through functions; direct DB writes are blocked.

**Cookie Spawning**: Handled server-side by `pg_cron` (runs every minute, spawns staggered cookies). This prevents client-side abuse.

**Admin Auth**: Uses GitHub OAuth via Supabase Auth. JWT token passed in Authorization header, user email checked against `admin_allowlist` table.

### Database Schema

Seven tables with RLS enabled (read-only for clients):
- `rooms`: Single room ('main-room') with status (idle/running), spawn_rate, ttl_seconds, max_players
- `players`: nick, device_id, color; unique constraint on (room_id, device_id)
- `cookies`: type (cookie/cat), value (1/3), x_pct position, despawn_at, owner
- `scores`: score_total, score_round, last_claim_at (for rate limiting)
- `nickname_words`: Word pool for generating combinatorial nicknames
- `rate_limits`: IP-based rate limiting for abuse prevention
- `admin_allowlist`: Email addresses allowed to access admin panel

Realtime enabled on rooms, players, cookies, scores tables.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
