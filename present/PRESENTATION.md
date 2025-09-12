# 🍪 Cookie Catcher - Angular Connect 2025 Presentation

## What happens when Angular meets Supabase? Multiplayer mayhem — in the best way.

A comprehensive guide to building real-time multiplayer party games with Angular and Supabase.

---

## 🎯 Project Overview

**Cookie Catcher** is a real-time multiplayer party game where players compete to catch falling cookies and cats on their mobile devices, with live leaderboards and multiplayer interactions.

### Key Features
- **Real-time Multiplayer**: Unlimited concurrent players in shared rooms
- **Live Cursor Tracking**: See other players' mouse movements and touch interactions
- **Presence Awareness**: Real-time online player count and join notifications
- **Live Leaderboards**: Both round-based and all-time scoring with instant updates
- **Anonymous Play**: Auto-assigned nicknames with persistent device identity
- **Admin Controls**: Game master panel for managing gameplay sessions

---

## 🏗️ Architecture Overview

### Frontend: Angular 20 with Signals
- **Standalone Components**: Modern Angular architecture
- **Signal-based State**: Reactive state management with Angular signals
- **OnPush Change Detection**: Optimized rendering performance
- **Tailwind CSS**: Mobile-first responsive design

### Backend: Supabase
- **PostgreSQL Database**: Game state, players, scores, and configuration
- **Realtime Engine**: WebSocket-based live updates
- **Edge Functions**: Secure server-side operations in Deno
- **Row Level Security**: Fine-grained data access control

---

## 🔄 Real-time Features Deep Dive

### 1. Database Change Subscriptions

**Setting up Realtime subscriptions for live data updates:**

```typescript
// supabase.service.ts
subscribeToRoom(roomId: string, callback: (payload: any) => void): RealtimeChannel {
  const channel = this.supabase
    .channel(`room_${roomId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public',
      table: 'rooms',
      filter: `id=eq.${roomId}`
    }, (payload) => {
      callback(payload);
    })
    .subscribe();
  
  return channel;
}

subscribeToCookies(roomId: string, callback: (payload: any) => void): RealtimeChannel {
  return this.supabase
    .channel(`cookies_${roomId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public',
      table: 'cookies',
      filter: `room_id=eq.${roomId}`
    }, callback)
    .subscribe();
}
```

**Angular Signals integration for reactive updates:**

```typescript
// game.store.ts
export class GameStore {
  // Reactive signals
  room = signal<Room | null>(null);
  cookies = signal<Cookie[]>([]);
  scores = signal<Score[]>([]);
  
  // Computed derived state
  isGameActive = computed(() => this.room()?.status === 'running');
  activeCookies = computed(() => {
    const now = new Date().getTime();
    return this.cookies().filter(cookie => {
      const notClaimed = !cookie.owner;
      const notExpired = new Date(cookie.despawn_at).getTime() > now;
      return notClaimed && notExpired;
    });
  });

  private async startSubscriptions(): Promise<void> {
    // Subscribe to room changes
    const roomSub = this.supabase.subscribeToRoom(this.roomId, (payload) => {
      if (payload.eventType === 'UPDATE') {
        this.room.set(payload.new as Room); // Triggers reactive updates
      }
    });

    // Subscribe to cookie changes
    const cookiesSub = this.supabase.subscribeToCookies(this.roomId, (payload) => {
      if (payload.eventType === 'INSERT') {
        this.cookies.update(cookies => [...cookies, payload.new as Cookie]);
      } else if (payload.eventType === 'UPDATE') {
        this.cookies.update(cookies => 
          cookies.map(cookie => 
            cookie.id === payload.new.id ? payload.new as Cookie : cookie
          )
        );
      }
    });
  }
}
```

### 2. Presence Tracking for Online Users

**Real-time presence with join/leave notifications:**

```typescript
// presence.service.ts
export class PresenceService {
  onlineCount = signal(0);
  onlineUsers = signal<PresenceState[]>([]);

  joinPresence(roomId: string, userState: PresenceState): void {
    this.channel = this.supabase.subscribeToPresence(roomId, {
      onJoin: (key, current, new_) => {
        this.updatePresenceState();
        // Show join notifications for other users
        new_.forEach((presence: any) => {
          if (presence.device_id !== userState.device_id) {
            this.joinNotificationService.addJoinNotification(
              presence.nick,
              presence.color || '#3B82F6',
              presence.device_id
            );
          }
        });
      },
      onLeave: (key, current, left) => {
        this.updatePresenceState();
      },
      onSync: () => {
        this.updatePresenceState();
      }
    });

    // Track this user's presence
    this.channel.track(userState);
  }

  private updatePresenceState(): void {
    if (!this.channel) return;
    
    const presenceState = this.channel.presenceState();
    const users: PresenceState[] = [];
    
    Object.keys(presenceState).forEach(key => {
      if (presenceState[key]?.[0]) {
        users.push(presenceState[key][0] as PresenceState);
      }
    });

    this.onlineCount.set(users.length);
    this.onlineUsers.set(users.sort((a, b) => a.nick.localeCompare(b.nick)));
  }
}
```

### 3. Real-time Cursor Tracking

**Cross-device cursor sharing with broadcast:**

```typescript
// cursor.service.ts
export class CursorService {
  cursors = signal<UserCursor[]>([]);
  touchRipples = signal<TouchRipple[]>([]);
  isMobileDevice = signal(false);

  joinCursorSharing(roomId: string, user: { userId: string; nick: string; color: string }): void {
    // Create broadcast channel for cursor positions
    this.channel = this.supabase.client
      .channel(`cursors_${roomId}`, {
        config: { broadcast: { self: false } }
      })
      .on('broadcast', { event: 'cursor_move' }, (payload) => {
        this.handleCursorUpdate(payload['payload'] as UserCursor);
      })
      .on('broadcast', { event: 'touch_ripple' }, (payload) => {
        this.handleTouchRipple(payload['payload'] as TouchRipple);
      })
      .subscribe();
  }

  // Throttled cursor updates (50ms max frequency)
  updateCursorPosition(x: number, y: number): void {
    if (!this.channel || this.isMobileDevice()) return;

    if (this.throttleTimeout) return;

    this.throttleTimeout = setTimeout(() => {
      this.channel.send({
        type: 'broadcast',
        event: 'cursor_move',
        payload: {
          userId: this.currentUser.userId,
          nick: this.currentUser.nick,
          color: this.currentUser.color,
          position: { x, y, timestamp: Date.now() }
        }
      });
      this.throttleTimeout = null;
    }, 50);
  }

  // Mobile touch ripples
  sendTouchRipple(x: number, y: number, type: 'tap' | 'drag' | 'release' = 'tap'): void {
    if (!this.channel) return;

    this.channel.send({
      type: 'broadcast',
      event: 'touch_ripple',
      payload: {
        id: `${this.currentUser.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: this.currentUser.userId,
        nick: this.currentUser.nick,
        color: this.currentUser.color,
        position: { x, y, timestamp: Date.now() },
        type
      }
    });
  }
}
```

### 4. Live Leaderboard Updates

**Reactive leaderboards with computed signals:**

```typescript
// game.store.ts
export class GameStore {
  // Computed leaderboards that automatically update when scores change
  roundLeaderboard = computed(() => {
    return this.scores()
      .filter(s => s.score_round > 0)
      .sort((a, b) => {
        if (b.score_round !== a.score_round) {
          return b.score_round - a.score_round;
        }
        return a.players.nick.localeCompare(b.players.nick);
      })
      .slice(0, 10);
  });
  
  alltimeLeaderboard = computed(() => {
    return this.scores()
      .filter(s => s.score_total > 0)
      .sort((a, b) => {
        if (b.score_total !== a.score_total) {
          return b.score_total - a.score_total;
        }
        return a.players.nick.localeCompare(b.players.nick);
      })
      .slice(0, 10);
  });

  // Real-time score subscription with player data
  private subscribeToScores(): void {
    const scoresSub = this.supabase.subscribeToScores(this.roomId, async (payload) => {
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        // Fetch complete score data with player info
        const { data: scoreWithPlayer } = await this.supabase.client
          .from('scores')
          .select(`
            *,
            players!inner (
              nick,
              color
            )
          `)
          .eq('player_id', payload.new.player_id)
          .single();
          
        this.scores.update(scores => {
          const existing = scores.findIndex(s => s.player_id === payload.new.player_id);
          if (existing >= 0) {
            return scores.map(score => 
              score.player_id === payload.new.player_id ? scoreWithPlayer : score
            );
          } else {
            return [...scores, scoreWithPlayer];
          }
        });
      }
    });
  }
}
```

---

## 🎮 Game Mechanics Implementation

### 1. Atomic Cookie Claiming

**Race condition-free cookie claiming with Edge Functions:**

```typescript
// claim_cookie/index.ts (Edge Function)
export default serve(async (req) => {
  const { cookieId, deviceId } = await req.json();
  
  // Get player by device ID
  const { data: player } = await supabaseClient
    .from('players')
    .select('*')
    .eq('device_id', deviceId)
    .single();

  // Check rate limiting (120ms cooldown)
  const { data: currentScores } = await supabaseClient
    .from('scores')
    .select('last_claim_at')
    .eq('player_id', player.id)
    .single();

  if (currentScores?.last_claim_at) {
    const timeDiff = Date.now() - new Date(currentScores.last_claim_at).getTime();
    if (timeDiff < 120) {
      return new Response(JSON.stringify({ ok: false, reason: 'Rate limited' }));
    }
  }

  // Atomic cookie claiming - only succeeds if cookie is unclaimed and not expired
  const { data: cookie, error } = await supabaseClient
    .from('cookies')
    .update({
      owner: player.id,
      claimed_at: new Date().toISOString()
    })
    .eq('id', cookieId)
    .is('owner', null) // Must be unclaimed
    .gt('despawn_at', new Date().toISOString()) // Must not be expired
    .select()
    .single();

  if (error || !cookie) {
    return new Response(
      JSON.stringify({ ok: false, reason: 'Cookie already claimed or expired' })
    );
  }

  // Update scores
  await supabaseClient
    .from('scores')
    .upsert({
      player_id: player.id,
      score_total: (currentScores?.score_total || 0) + cookie.value,
      score_round: (currentScores?.score_round || 0) + cookie.value,
      last_claim_at: new Date().toISOString()
    });

  return new Response(JSON.stringify({ ok: true, value: cookie.value }));
});
```

### 2. Smooth Cookie Animation

**60fps falling animation with real-time position calculation:**

```typescript
// game.page.ts
export class GamePage {
  animatedCookies: Array<{
    id: string;
    emoji: string;
    style: { left: string; top: string };
  }> = [];

  constructor() {
    // React to new cookies with real-time position calculation
    effect(() => {
      const active = this.gameStore.activeCookies();
      
      const newCookies = active.filter(c => !this.processedCookieIds.has(c.id));
      
      if (newCookies.length > 0) {
        newCookies.forEach(c => {
          this.processedCookieIds.add(c.id);
          
          // Calculate real-time Y position based on elapsed time
          const spawnTime = new Date(c.spawned_at).getTime();
          const despawnTime = new Date(c.despawn_at).getTime();
          const now = Date.now();
          const totalFallTime = (despawnTime - spawnTime) / 1000;
          const elapsedTime = (now - spawnTime) / 1000;
          
          // Calculate current Y position (falling from -10% to 110%)
          const startY = -10;
          const endY = 110;
          const progress = Math.min(elapsedTime / totalFallTime, 1);
          const currentY = startY + (progress * (endY - startY));
          
          this.animatedCookies.push({
            id: c.id,
            emoji: c.type === 'cat' ? '🐱' : '🍪',
            style: {
              left: c.x_pct + '%', // Database-synced X position
              top: currentY + '%', // Real-time calculated Y position
            }
          });
        });
      }
    });
  }

  // 60fps position updates
  private startPositionUpdates() {
    this.positionUpdateTimer = setInterval(() => {
      this.updateCookiePositions();
    }, 16); // ~60fps
  }
}
```

---

## 🔐 Database Setup & Security

### 1. Row Level Security Policies

**Enabling RLS with public read access for demo:**

```sql
-- Enable RLS on all tables
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookies ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow realtime access (required for WebSocket subscriptions)
CREATE POLICY "Allow realtime access on rooms" 
  ON rooms FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow realtime access on cookies" 
  ON cookies FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow realtime access on scores" 
  ON scores FOR ALL TO anon, authenticated USING (true);
```

### 2. Realtime Publication Setup

**Enable tables for real-time subscriptions:**

```sql
-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE cookies;
ALTER PUBLICATION supabase_realtime ADD TABLE scores;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
```

### 3. Database Schema Design

```sql
-- Game room configuration
CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'intermission')),
  spawn_rate_per_sec numeric NOT NULL DEFAULT 2.0,
  ttl_seconds integer NOT NULL DEFAULT 8,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Falling game objects
CREATE TABLE cookies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id),
  type text NOT NULL CHECK (type IN ('cookie', 'cat')),
  value integer NOT NULL DEFAULT 1,
  x_pct numeric NOT NULL CHECK (x_pct >= 0 AND x_pct <= 100),
  y_pct numeric NOT NULL CHECK (y_pct >= 0 AND y_pct <= 100),
  spawned_at timestamptz DEFAULT now(),
  despawn_at timestamptz NOT NULL,
  owner uuid REFERENCES players(id),
  claimed_at timestamptz
);

-- Performance indexes for realtime queries
CREATE INDEX idx_cookies_room_active ON cookies(room_id, despawn_at) WHERE owner IS NULL;
CREATE INDEX idx_scores_room_total ON scores(room_id, score_total DESC);
```

---

## 🎛️ Admin Controls & Game Management

### 1. Admin Authentication

```typescript
// admin.page.ts
export class AdminPage {
  authenticated = signal(false);

  async authenticate() {
    const result = await this.supabase.authenticateAdmin(this.passcode);
    
    if (result.authenticated) {
      this.authenticated.set(true);
      sessionStorage.setItem('admin_authenticated', 'true');
    }
  }

  async adminAction(action: string, params: any = {}) {
    const result = await this.supabase.adminAction(action, params);
    // Actions: 'start_round', 'stop_round', 'update_spawn_rate', 'reset_scores'
  }
}
```

### 2. Admin Edge Functions

```typescript
// admin_actions/index.ts
export default serve(async (req) => {
  const { action, ...params } = await req.json();

  switch (action) {
    case 'start_round':
      await supabaseClient
        .from('rooms')
        .update({
          status: 'running',
          round_started_at: new Date().toISOString()
        })
        .eq('id', 'main-room');
      break;

    case 'spawn_cookies':
      // Spawn multiple cookies at once
      const cookies = Array.from({ length: params.count || 10 }, () => ({
        room_id: 'main-room',
        type: Math.random() < 0.15 ? 'cat' : 'cookie',
        value: Math.random() < 0.15 ? 3 : 1,
        x_pct: Math.random() * 100,
        y_pct: Math.random() * 20,
        despawn_at: new Date(Date.now() + 8000).toISOString()
      }));
      
      await supabaseClient.from('cookies').insert(cookies);
      break;
  }
});
```

---

## 🚀 Performance Optimizations

### 1. Efficient Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush, // Only update when signals change
  template: `
    @for (cookie of animatedCookies; track cookie.id) {
      <div 
        class="cookie"
        [style.left]="cookie.style.left"
        [style.top]="cookie.style.top"
        (click)="claimCookie(cookie.id)"
      >
        {{ cookie.emoji }}
      </div>
    }
  `
})
export class GamePage {
  constructor(private cdr: ChangeDetectorRef) {}

  private updateCookiePositions() {
    let needsUpdate = false;

    this.animatedCookies.forEach(cookie => {
      const newTop = this.calculatePosition(cookie);
      if (cookie.style.top !== newTop) {
        cookie.style.top = newTop;
        needsUpdate = true;
      }
    });

    // Only trigger change detection if positions actually changed
    if (needsUpdate) {
      this.cdr.markForCheck();
    }
  }
}
```

### 2. Optimistic UI Updates

```typescript
// Immediate UI feedback, server reconciliation
async claimCookie(cookieId: string) {
  // Remove immediately from UI - don't wait for server
  this.animatedCookies = this.animatedCookies.filter(c => c.id !== cookieId);
  
  // Then process on server
  const result = await this.gameStore.claimCookie(cookieId);
  
  if (!result.success) {
    // Could add error handling/rollback here if needed
    console.log('Claim failed:', result.message);
  }
}
```

---

## 📱 Mobile-First Design

### 1. Touch-Optimized Interactions

```css
.cookie {
  font-size: 40px;
  cursor: pointer;
  pointer-events: auto;
  user-select: none;
  /* Large touch targets for mobile */
  min-width: 60px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cookie:hover {
  transform: scale(1.2);
}
```

### 2. Device Detection & Adaptive UI

```typescript
// Device-specific cursor behavior
export class CursorService {
  isMobileDevice = signal(false);

  constructor() {
    this.isMobileDevice.set(this.detectMobileDevice());
  }

  private detectMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || window.innerWidth <= 768
      || 'ontouchstart' in window;
  }

  // Desktop: cursor tracking, Mobile: touch ripples
  updateCursorPosition(x: number, y: number): void {
    if (!this.isMobileDevice()) {
      // Send cursor position updates
    }
  }

  sendTouchRipple(x: number, y: number, type: 'tap' | 'drag'): void {
    if (this.isMobileDevice()) {
      // Send touch interaction
    }
  }
}
```

---

## 🎯 Key Takeaways for Angular Connect

### 1. **Angular Signals + Supabase Realtime = Perfect Match**
- Signals provide reactive state updates
- Supabase handles the complex realtime infrastructure
- Clean separation of concerns

### 2. **Performance at Scale**
- OnPush change detection with signals
- Throttled cursor updates (50ms)
- Optimistic UI updates
- Efficient database indexes

### 3. **Real-world Multiplayer Challenges Solved**
- Race conditions (atomic operations in Edge Functions)
- Rate limiting (120ms cooldown)
- Connection management (presence tracking)
- Cross-platform compatibility (desktop cursors + mobile touch)

### 4. **Developer Experience**
- Type-safe database interactions
- Real-time subscriptions with simple API
- Edge Functions for secure server-side logic
- Built-in authentication and authorization

### 5. **Production Ready**
- Row Level Security policies
- Error handling and fallbacks
- Performance monitoring
- Scalable architecture

---

## 🔗 Resources

- **Live Demo**: [Cookie Catcher Game](https://ac-demo-sb.netlify.app/)
- **Source Code**: [GitHub Repository](https://github.com/mandarini/ac-demo-sb)
- **Supabase Docs**: [Real-time Features](https://supabase.com/docs/guides/realtime)
- **Angular Signals**: [Angular.dev Signals Guide](https://angular.dev/guide/signals)

---

*Built with ❤️ for Angular Connect 2025*  
*Showcasing the power of Angular + Supabase for real-time multiplayer experiences*
