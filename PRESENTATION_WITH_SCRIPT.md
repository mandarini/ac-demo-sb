# 🍪 Cookie Catcher - Angular Connect 2025 Presentation Script

## Slide 1: Title Slide
**What happens when Angular meets Supabase? Multiplayer mayhem — in the best way.**

### Speaker Script:
"Hi everyone! I'm excited to show you what happens when we combine Angular's reactive power with Supabase's real-time capabilities. We're going to build a multiplayer party game that handles unlimited players, live cursors, and real-time interactions. By the end of this talk, you'll know exactly how to build your own real-time multiplayer experiences."

---

## Slide 2: About Me
**Katerina Skroumpelou**

### Speaker Script:
"Quick intro - I'm Katerina, a Software Engineer at Supabase. I love cats and chocolate, I love being on stage talking to all of you, and I'm a Google Developer Expert for Angular and Maps. Today I want to show you how Angular and Supabase create the perfect stack for real-time applications."

---

## Slide 3: What is Supabase?
**The Open Source Firebase Alternative**

### Speaker Script:
"Before we dive into the multiplayer magic, let me quickly introduce Supabase. It's the open source Firebase alternative, but with some key differences. Instead of NoSQL, you get a full PostgreSQL database with all the SQL power you know and love. Your APIs are auto-generated from your database schema - no backend code required. And everything is built with modern developer experience in mind, including full TypeScript support."

---

## Slide 4: Supabase Core Services
**Everything You Need in One Platform**

### Speaker Script:
"Supabase gives you everything you need to build modern applications. You get a PostgreSQL database that can even handle vector embeddings for AI features. Authentication is built-in with social logins, email, phone, magic links - whatever you need. And file storage comes with a global CDN and on-the-fly image transformations. It's like having an entire backend team in a single platform."

---

## Slide 5: Supabase Realtime & Edge
**What Makes It Special**

### Speaker Script:
"But here's what makes Supabase special for our use case. The Realtime engine can stream database changes, handle broadcast messages, and manage presence - all over a single WebSocket connection. Edge Functions give you globally distributed TypeScript functions for server-side logic. And Row Level Security is built right into the database, so your data is secure by default. This is why it's perfect for multiplayer applications."

---

## Slide 6: The Demo
**Live Cookie Catcher Game**

### Speaker Script:
"Let me show you what we're building. This is Cookie Catcher - a real-time multiplayer game where everyone in the room can join on their phones right now. You catch falling cookies and cats, compete on live leaderboards, and see each other's cursors moving in real-time. Go ahead, scan this QR code and join the game!"

*[Show live demo with audience participation]*

---

## Slide 7: The Challenge
**Building Real-time Multiplayer is Hard**

- Race conditions
- State synchronization
- Connection management
- Cross-platform compatibility
- Performance at scale

### Speaker Script:
"Building multiplayer games is notoriously difficult. You have race conditions when multiple players try to claim the same item, you need to keep everyone's state in sync, manage connections dropping and reconnecting, work across desktop and mobile, and do it all performantly. Traditional approaches require complex WebSocket servers, Redis for state management, and lots of custom infrastructure."

---

## Slide 8: The Solution
**Angular Signals + Supabase Realtime**

```typescript
// Reactive state with Angular Signals
export class GameStore {
  cookies = signal<Cookie[]>([]);
  scores = signal<Score[]>([]);
  
  // Computed leaderboard updates automatically
  leaderboard = computed(() => 
    this.scores().sort((a, b) => b.score - a.score)
  );
}
```

### Speaker Script:
"Enter Angular Signals and Supabase Realtime. Signals give us reactive state that automatically updates our UI when data changes. Supabase handles all the complex real-time infrastructure. This computed leaderboard automatically updates whenever scores change - no manual DOM manipulation needed."

---

## Slide 9: Real-time Database Changes
**Live Data Subscriptions**

```typescript
// Subscribe to database changes
subscribeToScores(callback: (payload: any) => void) {
  return this.supabase
    .channel('scores')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public',
      table: 'scores'
    }, callback)
    .subscribe();
}

// Update signals reactively
this.supabase.subscribeToScores((payload) => {
  if (payload.eventType === 'UPDATE') {
    this.scores.update(scores => 
      scores.map(s => s.id === payload.new.id ? payload.new : s)
    );
  }
});
```

### Speaker Script:
"Here's how we get live updates. Supabase listens to PostgreSQL changes through the Write-Ahead Log and sends them over WebSockets. When a score updates in the database, we immediately update our signal, which triggers all dependent computed values and UI updates automatically. No polling, no manual refresh needed."

---

## Slide 10: Presence Tracking
**Who's Online Right Now**

```typescript
export class PresenceService {
  onlineCount = signal(0);
  onlineUsers = signal<User[]>([]);

  joinPresence(roomId: string, userState: any) {
    this.channel = this.supabase.subscribeToPresence(roomId, {
      onJoin: (key, current, new_) => {
        this.updatePresenceState();
        this.showJoinNotification(new_[0].nick);
      },
      onLeave: (key, current, left) => {
        this.updatePresenceState();
      }
    });
    
    this.channel.track(userState);
  }
}
```

### Speaker Script:
"Presence tracking shows who's online in real-time. When someone joins, everyone sees a notification. When they disconnect - even if their browser crashes - they're automatically removed from the presence state. This uses a CRDT under the hood to handle the distributed state synchronization."

---

## Slide 11: Live Cursor Tracking
**See Everyone's Mouse Movements**

```typescript
export class CursorService {
  cursors = signal<UserCursor[]>([]);

  updateCursorPosition(x: number, y: number) {
    // Throttled to 50ms for performance
    this.channel.send({
      type: 'broadcast',
      event: 'cursor_move',
      payload: { 
        userId: this.userId,
        position: { x, y, timestamp: Date.now() }
      }
    });
  }
}
```

### Speaker Script:
"For the live cursors, we use Supabase Broadcast to send rapid, ephemeral messages. Every cursor movement is throttled to 50ms and broadcast to all connected clients. On mobile, we send touch ripples instead of cursor positions. It's like having everyone's mouse pointer visible on your screen."

---

## Slide 12: Atomic Operations
**Solving Race Conditions**

```typescript
// Edge Function: claim_cookie/index.ts
export default serve(async (req) => {
  const { cookieId, deviceId } = await req.json();
  
  // Atomic update - only succeeds if unclaimed
  const { data: cookie } = await supabaseClient
    .from('cookies')
    .update({ owner: playerId, claimed_at: new Date() })
    .eq('id', cookieId)
    .is('owner', null) // Must be unclaimed
    .gt('despawn_at', new Date()) // Must not be expired
    .single();

  if (!cookie) {
    return Response.json({ ok: false, reason: 'Already claimed' });
  }
  
  // Update score
  await updatePlayerScore(playerId, cookie.value);
  return Response.json({ ok: true });
});
```

### Speaker Script:
"Race conditions are solved with atomic database operations in Edge Functions. When two players tap the same cookie simultaneously, only one can claim it. The database update only succeeds if the cookie is still unclaimed and not expired. This prevents duplicate scoring and ensures fair gameplay."

---

## Slide 13: Performance at Scale
**60fps with 250,000+ Concurrent Users**

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (cookie of activeCookies(); track cookie.id) {
      <div class="cookie" [style.top]="cookie.position">
        {{ cookie.emoji }}
      </div>
    }
  `
})
export class GamePage {
  // Only update when signals change
  activeCookies = computed(() => 
    this.cookies().filter(c => !c.claimed && !c.expired)
  );
}
```

### Speaker Script:
"Performance is critical for real-time games. We use OnPush change detection so Angular only updates when our signals change. The computed activeCookies automatically filters out claimed and expired cookies. Our smooth 60fps animations run independently of the Angular change detection cycle."

---

## Slide 14: Database Security
**Row Level Security Made Simple**

```sql
-- Enable RLS
ALTER TABLE cookies ENABLE ROW LEVEL SECURITY;

-- Allow realtime subscriptions
CREATE POLICY "Allow realtime access" ON cookies 
  FOR ALL TO anon, authenticated USING (true);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE cookies;
```

### Speaker Script:
"Security is built-in with Row Level Security policies. We enable RLS on all tables and create policies that allow real-time subscriptions. The 'FOR ALL' policy is needed for WebSocket subscriptions to work, but actual writes are protected through Edge Functions using the service role key."

---

## Slide 15: Mobile-First Design
**Cross-Platform Real-time**

```typescript
export class CursorService {
  isMobileDevice = signal(false);

  constructor() {
    this.isMobileDevice.set(
      /Android|iPhone|iPad/i.test(navigator.userAgent) ||
      'ontouchstart' in window
    );
  }

  handleInteraction(x: number, y: number) {
    if (this.isMobileDevice()) {
      this.sendTouchRipple(x, y, 'tap');
    } else {
      this.updateCursorPosition(x, y);
    }
  }
}
```

### Speaker Script:
"The game works seamlessly across devices. We detect mobile devices and adapt the interaction model - desktop shows cursor trails, mobile shows touch ripples. The same real-time infrastructure handles both interaction types, creating a unified multiplayer experience regardless of device."

---

## Slide 16: Developer Experience
**Type-Safe Real-time Development**

```typescript
// Generated types from database schema
export interface Database {
  public: {
    Tables: {
      cookies: {
        Row: {
          id: string;
          type: 'cookie' | 'cat';
          value: number;
          x_pct: number;
          owner: string | null;
        }
      }
    }
  }
}

const supabase = createClient<Database>(url, key);
// Full TypeScript support for all operations
```

### Speaker Script:
"The developer experience is fantastic. Supabase generates TypeScript types from your database schema, giving you full type safety. Your IDE knows about every table, column, and relationship. Real-time subscriptions, database queries, and Edge Functions all have complete type support."

---

## Slide 17: Architecture Overview
**Simple but Powerful**

```
┌─────────────────┐    WebSocket    ┌──────────────────┐
│   Angular App   │ ◄──────────────► │  Supabase        │
│   - Signals     │                  │  - PostgreSQL    │
│   - Components  │                  │  - Realtime      │
│   - Services    │                  │  - Edge Functions│
└─────────────────┘                  └──────────────────┘
```

### Speaker Script:
"The architecture is beautifully simple. Angular handles the reactive UI with signals and components. Supabase provides the database, real-time engine, and serverless functions. One WebSocket connection handles all real-time features - database changes, presence, and broadcast messages."

---

## Slide 18: Real-World Results
**Production-Ready Performance**

- ✅ **250,000+ concurrent users** in benchmarks
- ✅ **Sub-50ms latency** for real-time updates  
- ✅ **Automatic scaling** with global edge network
- ✅ **Zero infrastructure management**
- ✅ **Built-in monitoring** and analytics

### Speaker Script:
"This isn't just a demo - it's production-ready. Supabase Realtime has been benchmarked with over 250,000 concurrent users. Updates have sub-50ms latency thanks to the global edge network. Everything scales automatically, and you get built-in monitoring. No DevOps team required."

---

## Slide 19: Key Takeaways
**Why Angular + Supabase Works**

1. **Reactive by Default**: Signals + Realtime = Automatic UI updates
2. **Type-Safe**: Full TypeScript support across the stack  
3. **Scalable**: Handles massive concurrent users out of the box
4. **Secure**: RLS policies protect your data automatically
5. **Simple**: One connection, multiple real-time features

### Speaker Script:
"Here's why this combination works so well. Angular Signals are reactive by default, perfect for real-time data. Everything is type-safe from database to UI. It scales to massive user counts without configuration. Security is built-in with RLS policies. And it's simple - one WebSocket connection handles all your real-time needs."

---

## Slide 20: What You Can Build
**Beyond Games**

- 🎮 **Multiplayer Games** - Real-time gameplay
- 💬 **Chat Applications** - Live messaging  
- 📊 **Collaborative Dashboards** - Shared analytics
- ✏️ **Document Editing** - Google Docs-style collaboration
- 📍 **Live Tracking** - Real-time location updates
- 🎯 **Live Polls** - Interactive presentations

### Speaker Script:
"This isn't just for games. You can build chat applications with typing indicators, collaborative dashboards where everyone sees live data updates, document editors like Google Docs, live tracking applications, interactive polls for presentations like this one. Any app that needs real-time collaboration can use these patterns."

---

## Slide 21: Getting Started
**Try It Yourself**

```bash
# Clone the demo
git clone https://github.com/mandarini/ac-demo-sb
cd ac-demo-sb

# Install dependencies  
npm install

# Set up Supabase
supabase start
supabase db push
supabase functions deploy

# Run the app
ng serve
```

**Resources:**
- 🎮 **Live Demo**: [ac-demo-sb.netlify.app](https://ac-demo-sb.netlify.app)
- 📚 **Supabase Docs**: [supabase.com/docs/guides/realtime](https://supabase.com/docs/guides/realtime)
- 🅰️ **Angular Signals**: [angular.dev/guide/signals](https://angular.dev/guide/signals)

### Speaker Script:
"Want to try this yourself? Clone the repository, run these commands, and you'll have a full multiplayer game running locally in minutes. The demo is live at this URL, and I've included links to the key documentation. Everything we've shown today is open source and ready for you to explore."

---

## Slide 22: Thank You
**Questions?**

**Connect with me:**
- 🐦 **Twitter**: [@psybercity](https://x.com/psybercity)  
- 🌐 **Website**: [psyber.city](https://psyber.city)
- 💼 **GitHub**: [github.com/mandarini](https://github.com/mandarini)

### Speaker Script:
"That's how we build real-time multiplayer experiences with Angular and Supabase. The combination of reactive signals and real-time infrastructure makes complex multiplayer features surprisingly simple to implement. Thank you for your attention - I'd love to answer any questions you have!"

---

## 🎯 Presentation Tips

### Timing (20 minutes total):
- **Slides 1-6**: Intro, Supabase Overview & Demo (6 minutes)
- **Slides 7-12**: Problem, Solution & Core Features (8 minutes)  
- **Slides 13-18**: Technical Deep Dive (4 minutes)
- **Slides 19-22**: Wrap-up & Q&A (2 minutes)

### Interactive Elements:
- **Live Demo**: Have audience join the game on their phones
- **Code Walkthroughs**: Show actual implementation files
- **Performance Metrics**: Display real-time connection counts

### Key Messages:
1. **Real-time multiplayer doesn't have to be complex**
2. **Angular Signals + Supabase = Perfect match for reactive apps**
3. **Production-ready performance and scaling out of the box**
4. **Great developer experience with full type safety**

---

*Ready for Angular Connect 2025! 🚀*
