---
theme: seriph
background: https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80
class: 'text-center'
highlighter: shiki
lineNumbers: false
info: |
  ## Cookie Catcher - Angular Connect 2025
  What happens when Angular meets Supabase? Multiplayer mayhem — in the best way.
drawings:
  persist: false
css: unocss
wakeLock: "build"
---

# Multiplayer mayhem with Angular + Supabase

## Katerina Skroumpelou

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Angular Connect 2025 <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 text-xl">
  <carbon-logo-angular class="text-red-500" />
  <span class="mx-2">+</span>
  <logos-supabase-icon />
</div>

<!--
Hi everyone! I'm excited to show you what happens when we combine Angular's reactive power with Supabase's real-time capabilities. We're going to build a multiplayer party game that handles unlimited players, live cursors, and real-time interactions. By the end of this talk, you'll know exactly how to build your own real-time multiplayer experiences.
-->

---
layout: center
class: text-center
---

# About Me

<div class="grid grid-cols-2 gap-12 items-center">
<div>

# Katerina Skroumpelou

- Software Engineer at **Supabase**
- Loves cats and chocolate 🐱🍫
- Loves to be on stage
- **GDE** for Angular & Maps

</div>
<div>
<img src="/images/katsup.jpg" class="rounded-full w-64 mx-auto shadow-lg">
</div>
</div>

<!--
Quick intro - I'm Katerina, a Software Engineer at Supabase. I love cats and chocolate, I love being on stage talking to all of you, and I'm a Google Developer Expert for Angular and Maps. Today I want to show you how Angular and Supabase create the perfect stack for real-time applications.
-->

---
layout: center
class: text-center
---

# What is Supabase?

## The Postgres development platform.

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🐘</div>
<h3 class="text-blue-600 font-bold">PostgreSQL Database</h3>
<p class="text-sm text-gray-600 mt-2">Full SQL database</p>
</div>

<div class="bg-green-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🚀</div>
<h3 class="text-green-600 font-bold">Auto-generated APIs</h3>
<p class="text-sm text-gray-600 mt-2">REST & GraphQL from your schema</p>
</div>

<div class="bg-purple-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🛠️</div>
<h3 class="text-purple-600 font-bold">Built for developers</h3>
<p class="text-sm text-gray-600 mt-2">Type-safe, modern tooling</p>
</div>

</div>

<!--
Before we dive into the multiplayer magic, let me quickly introduce Supabase. It's the open source Firebase alternative, but with some key differences. Instead of NoSQL, you get a full PostgreSQL database with all the SQL power you know and love. Your APIs are auto-generated from your database schema - no backend code required. And everything is built with modern developer experience in mind, including full TypeScript support.
-->

---
layout: center
class: text-center
---

# Supabase Core Services

## Everything You Need in One Platform

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🗄️</div>
<h3 class="text-blue-600 font-bold">Database</h3>
<p class="text-sm text-gray-600 mt-2">PostgreSQL + Vector embeddings</p>
</div>

<div class="bg-green-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🔐</div>
<h3 class="text-green-600 font-bold">Auth</h3>
<p class="text-sm text-gray-600 mt-2">Social, email, phone, magic links</p>
</div>

<div class="bg-purple-50 p-6 rounded-lg">
<div class="text-4xl mb-4">📁</div>
<h3 class="text-purple-600 font-bold">Storage</h3>
<p class="text-sm text-gray-600 mt-2">File storage + CDN + image transforms</p>
</div>

</div>

<!--
Supabase gives you everything you need to build modern applications. You get a PostgreSQL database that can even handle vector embeddings for AI features. Authentication is built-in with social logins, email, phone, magic links - whatever you need. And file storage comes with a global CDN and on-the-fly image transformations. It's like having an entire backend team in a single platform.
-->

---
layout: center
class: text-center
---

# Supabase Realtime & Edge

## What Makes It Special

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-yellow-50 p-6 rounded-lg">
<div class="text-4xl mb-4">⚡</div>
<h3 class="text-yellow-600 font-bold">Realtime</h3>
<p class="text-sm text-gray-600 mt-2">Database changes, Broadcast, Presence</p>
</div>

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🌍</div>
<h3 class="text-blue-600 font-bold">Edge Functions</h3>
<p class="text-sm text-gray-600 mt-2">Global TypeScript functions</p>
</div>

<div class="bg-red-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🔒</div>
<h3 class="text-red-600 font-bold">Security</h3>
<p class="text-sm text-gray-600 mt-2">Row Level Security built-in</p>
</div>

</div>

<!--
But here's what makes Supabase special for our use case. The Realtime engine can stream database changes, handle broadcast messages, and manage presence - all over a single WebSocket connection. Edge Functions give you globally distributed TypeScript functions for server-side logic. And Row Level Security is built right into the database, so your data is secure by default. This is why it's perfect for multiplayer applications.
-->

---
layout: center
class: text-center
---

# Supabase + AI Tools

## The Supabase MCP

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🤖</div>
<h3 class="text-blue-600 font-bold">AI Integration</h3>
<p class="text-sm text-gray-600 mt-2">Connect Supabase to AI tools</p>
</div>

<div class="bg-green-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🔧</div>
<h3 class="text-green-600 font-bold">Setup & Management</h3>
<p class="text-sm text-gray-600 mt-2">AI helps configure projects</p>
</div>

<div class="bg-purple-50 p-6 rounded-lg">
<div class="text-4xl mb-4">📊</div>
<h3 class="text-purple-600 font-bold">Query & Analyze</h3>
<p class="text-sm text-gray-600 mt-2">Natural language database queries</p>
</div>

</div>

<!--
[Speaker notes for AI Tools slide]
-->

---
layout: center
class: text-center
---

# AI Tools in Action

## Vibe coders love us

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">💻</div>
<h3 class="text-blue-600 font-bold">Cursor</h3>
<p class="text-sm text-gray-600 mt-2">AI pair programming with database context</p>
</div>

<div class="bg-green-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🤖</div>
<h3 class="text-green-600 font-bold">Claude</h3>
<p class="text-sm text-gray-600 mt-2">Chat with your database schema</p>
</div>

<div class="bg-purple-50 p-6 rounded-lg">
<div class="text-4xl mb-4">⚡</div>
<h3 class="text-purple-600 font-bold">Warp</h3>
<p class="text-sm text-gray-600 mt-2">Terminal AI with Supabase commands</p>
</div>

</div>

<div class="mt-8 text-gray-600">
<em>Video Demo: Setting up project with AI assistance</em>
</div>

<!--
[Speaker notes for AI Tools in Action slide]
-->

---
layout: center
class: text-center
---

# AI + No-Code Platforms

## Perfect for Bolt.new & Loveable

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🚀</div>
<h3 class="text-blue-600 font-bold">Rapid Prototyping</h3>
<p class="text-sm text-gray-600 mt-2">From idea to app in minutes</p>
</div>

<div class="bg-green-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🔗</div>
<h3 class="text-green-600 font-bold">Seamless Integration</h3>
<p class="text-sm text-gray-600 mt-2">AI understands Supabase patterns</p>
</div>

<div class="bg-purple-50 p-6 rounded-lg">
<div class="text-4xl mb-4">📱</div>
<h3 class="text-purple-600 font-bold">Full-Stack Apps</h3>
<p class="text-sm text-gray-600 mt-2">Database, auth, and UI generated together</p>
</div>

</div>

<div class="mt-8 text-gray-600">
<em>Video Demo: Building with Bolt.new</em>
</div>

<!--
[Speaker notes for AI + No-Code Platforms slide]
-->

---
layout: center
class: text-center
---

# The Challenge

## Building Real-time Multiplayer is Hard

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
<h3 class="text-red-600 font-bold mb-4">Race conditions</h3>
<div class="text-4xl mb-4">⚡</div>
</div>

<div class="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400">
<h3 class="text-orange-600 font-bold mb-4">State synchronization</h3>
<div class="text-4xl mb-4">🔄</div>
</div>

<div class="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
<h3 class="text-yellow-600 font-bold mb-4">Connection management</h3>
<div class="text-4xl mb-4">🔌</div>
</div>

</div>

<!--
Building multiplayer games is notoriously difficult. You have race conditions when multiple players try to claim the same item, you need to keep everyone's state in sync, manage connections dropping and reconnecting, work across desktop and mobile, and do it all performantly. Traditional approaches require complex WebSocket servers, Redis for state management, and lots of custom infrastructure.
-->

---
layout: center
class: text-center
---

# The Solution

## Angular Signals + Supabase Realtime

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">⚡</div>
<h3 class="text-blue-600 font-bold">Reactive state management</h3>
</div>

<div class="bg-green-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🚀</div>
<h3 class="text-green-600 font-bold">Real-time infrastructure</h3>
</div>

<div class="bg-purple-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🛡️</div>
<h3 class="text-purple-600 font-bold">Type-safe development</h3>
</div>

</div>

<!--
Enter Angular Signals and Supabase Realtime. Signals give us reactive state that automatically updates our UI when data changes. Supabase handles all the complex real-time infrastructure. This computed leaderboard automatically updates whenever scores change - no manual DOM manipulation needed.
-->

---
layout: center
class: text-center
---

# The Demo

## 🍪 Cookie Catcher Game

<div class="text-6xl mb-8">🎮</div>

<div class="bg-gray-800 text-white p-6 rounded-lg mt-8">

**Rules:**
- Catch cookies 🍪 = **1 point**
- Catch cats 🐱 = **3 points**
- Compete on **live leaderboard!**

</div>

<div class="mt-8 text-gray-600">
<em>Live link will be shared later</em>
</div>

<!--
[Speaker notes for The Demo slide]
-->

---
layout: two-cols
---

# Real-time Database Changes

```typescript
// Subscribe to real-time changes
this.supabase
  .from('game_sessions')
  .on('*', (payload) => {
    // Update Angular signals
    this.gameState.set(payload.new);
  })
  .subscribe();
```

::right::

<div class="pl-8">

## Live Data Subscriptions

- **PostgreSQL** change streams
- **WebSocket** delivery  
- **Automatic** UI updates

<div class="mt-8 text-center">
<div class="text-6xl">📊</div>
<p class="text-gray-600 mt-4">Live data, zero effort</p>
</div>

</div>

<!--
Here's how we get live updates. Supabase listens to PostgreSQL changes through the Write-Ahead Log and sends them over WebSockets. When a score updates in the database, we immediately update our signal, which triggers all dependent computed values and UI updates automatically. No polling, no manual refresh needed.
-->

---
layout: center
class: text-center
---

# Presence Tracking

## Who's Online Right Now

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-green-50 p-6 rounded-lg">
<div class="text-4xl mb-4">👥</div>
<h3 class="text-green-600 font-bold">Real-time user count</h3>
</div>

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">📢</div>
<h3 class="text-blue-600 font-bold">Join/leave notifications</h3>
</div>

<div class="bg-purple-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🧹</div>
<h3 class="text-purple-600 font-bold">Automatic cleanup on disconnect</h3>
</div>

</div>

<!--
Presence tracking shows who's online in real-time. When someone joins, everyone sees a notification. When they disconnect - even if their browser crashes - they're automatically removed from the presence state. This uses a CRDT under the hood to handle the distributed state synchronization.
-->

---
layout: two-cols
---

# Effects for Animation Logic

```typescript
// game.page.ts - Effects track signal changes
constructor() {
  effect(() => {
    const active = this.gameStore.activeCookies();
    
    // Find new cookies that haven't been processed yet
    const newCookies = active.filter(c => 
      !this.processedCookieIds.has(c.id)
    );
    
    // Add new cookies to animated list
    if (newCookies.length > 0) {
      newCookies.forEach(c => {
        this.processedCookieIds.add(c.id);
        // Calculate real-time position...
      });
    }
  });
}
```

::right::

<div class="pl-8">

## Reactive Animation Updates

- **Effects** run when signals change
- **Automatic** cookie animation sync
- **File:** `src/app/pages/game/game.page.ts`

<div class="mt-8 text-center">
<div class="text-6xl">🎬</div>
<p class="text-gray-600 mt-4">Animations react to data</p>
</div>

</div>

<!--
We see how Angular's signals and effects create reactive animations. The effect automatically runs whenever the activeCookies signal changes - when new cookies are spawned by the admin or claimed by players. 

We track which cookies have been processed to avoid re-animating the same ones. Each new cookie gets added to our animated list with real-time position calculations. This creates smooth, responsive animations that automatically sync with the database state.

The beauty here is that the animation logic is declarative - we describe what should happen when data changes, and Angular's reactivity system handles the when and how. No manual event listeners or complex state management needed.
-->

---
layout: two-cols
---

# Live Cursor Tracking

```typescript
// realtime-cursors.component.ts
@HostListener('document:mousemove', ['$event'])
onMouseMove(event: MouseEvent) {
  if (this.cursorService.isActive() && 
      !this.cursorService.isMobileDevice()) {
    const position = this.cursorService.getRelativePosition(event);
    this.cursorService.updateCursorPosition(position.x, position.y);
  }
}

// cursor.service.ts - Throttled broadcast
updateCursorPosition(x: number, y: number): void {
  this.throttleTimeout = setTimeout(() => {
    this.channel.send({
      type: 'broadcast',
      event: 'cursor_move',
      payload: { userId: this.userId, position: { x, y } }
    });
  }, 50); // 50ms throttling
}
```

::right::

<div class="pl-8">

## See Everyone's Interactions

- **Desktop:** Mouse cursors with trails
- **Mobile:** Touch ripples 
- **50ms** throttling for performance
- **Files:** `realtime-cursors.component.ts`, `cursor.service.ts`

<div class="mt-8 text-center">
<div class="text-6xl">👆</div>
<p class="text-gray-600 mt-4">Every move is shared</p>
</div>

</div>

<!--
For live cursors, we use @HostListener to capture mouse movements and Supabase Broadcast to send rapid, ephemeral messages. Every cursor movement is throttled to 50ms and broadcast to all connected clients. On mobile, we detect touch events and send ripples instead of cursor positions. It's like having everyone's mouse pointer visible on your screen.
-->

---
layout: center
class: text-center
---

# Atomic Operations

## Solving Race Conditions

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-red-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🔐</div>
<h3 class="text-red-600 font-bold">Edge Functions for security</h3>
</div>

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">💎</div>
<h3 class="text-blue-600 font-bold">Database-level atomicity</h3>
</div>

<div class="bg-green-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🏆</div>
<h3 class="text-green-600 font-bold">First-tap-wins logic</h3>
</div>

</div>

<!--
Race conditions are the biggest challenge in multiplayer games - imagine 50 people tapping the same cookie simultaneously. Without proper handling, you'd get duplicate points and frustrated players.

We solve this with a three-layer approach. Edge Functions provide security by running server-side - players can't manipulate the claiming logic. Database-level atomicity is our secret weapon - PostgreSQL treats our conditional update as a single, indivisible operation. The cookie can only be claimed if it's still unclaimed AND not expired, and this check-and-update happens atomically. Finally, our first-tap-wins logic is simple - whoever's request reaches the database first gets the cookie.

The beauty is we don't need complex locking mechanisms. PostgreSQL's ACID properties handle all the concurrency for us. When the atomic operation fails, we return "already claimed" - no duplicate points, no data corruption. This scales beautifully and keeps gameplay fair even under extreme load.
-->

---
layout: center
class: text-center
---

# Let's Play Together!

## 🍪 Cookie Catcher - Live Demo

<div class="text-6xl mb-8">🎮</div>

<div class="flex items-center justify-center gap-12">
  <img src="/images/game-qr.png" class="w-64 h-64" alt="QR Code">
  <h2 class="text-4xl font-bold">https://ngdemo-sb.netlify.app</h2>
</div>


<!--
Let me show you what we're building. This is Cookie Catcher - a real-time multiplayer game where everyone in the room can join on their phones right now. You catch falling cookies and cats, compete on live leaderboards, and see each other's cursors moving in real-time. Go ahead, scan this QR code and join the game!

[Show live demo with audience participation]
-->

---
layout: center
class: text-center
---

# Performance at Scale

## 60fps with 250,000+ Users

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-orange-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🎯</div>
<h3 class="text-orange-600 font-bold">OnPush change detection</h3>
</div>

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">⚡</div>
<h3 class="text-blue-600 font-bold">Computed signals</h3>
</div>

<div class="bg-green-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🚀</div>
<h3 class="text-green-600 font-bold">Optimistic UI updates</h3>
</div>

</div>

<!--
Performance is critical for real-time games. We use OnPush change detection so Angular only updates when our signals change. The computed activeCookies automatically filters out claimed and expired cookies. Our smooth 60fps animations run independently of the Angular change detection cycle.
-->

---
layout: two-cols
---

# Database Security

```sql
-- Enable RLS on tables
ALTER TABLE game_sessions 
ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own sessions"
  ON game_sessions FOR SELECT
  USING (user_id = auth.uid());
```

::right::

<div class="pl-8">

## Row Level Security Made Simple

- **Enable** RLS policies
- **Realtime** subscriptions
- **Protected** Edge Functions

<div class="mt-8 text-center">
<div class="text-6xl">🔒</div>
<p class="text-gray-600 mt-4">Security by default</p>
</div>

</div>

<!--
Security is built-in with Row Level Security policies. We enable RLS on all tables and create policies that allow real-time subscriptions. The 'FOR ALL' policy is needed for WebSocket subscriptions to work, but actual writes are protected through Edge Functions using the service role key.
-->

---
layout: center
class: text-center
---

# Cross-Platform Magic

## Mobile-First Design

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">📱</div>
<h3 class="text-blue-600 font-bold">Device detection</h3>
</div>

<div class="bg-green-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🎮</div>
<h3 class="text-green-600 font-bold">Adaptive interactions</h3>
</div>

<div class="bg-purple-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🌍</div>
<h3 class="text-purple-600 font-bold">Unified multiplayer experience</h3>
</div>

</div>

<!--
The game works seamlessly across devices. We detect mobile devices and adapt the interaction model - desktop shows cursor trails, mobile shows touch ripples. The same real-time infrastructure handles both interaction types, creating a unified multiplayer experience regardless of device.
-->

---
layout: two-cols
---

# Developer Experience

```typescript
// Generated types from database schema
interface GameSession {
  id: string;
  user_id: string;
  score: number;
  created_at: string;
}

const { data } = await supabase
  .from('game_sessions')
  .select<'*', GameSession>('*');
```

::right::

<div class="pl-8">

## Type-Safe Real-time Development

- **Generated** TypeScript types
- **Full** IDE support
- **End-to-end** type safety

<div class="mt-8 text-center">
<div class="text-6xl">🛠️</div>
<p class="text-gray-600 mt-4">Types all the way down</p>
</div>

</div>

<!--
The developer experience is fantastic. Supabase generates TypeScript types from your database schema, giving you full type safety. Your IDE knows about every table, column, and relationship. Real-time subscriptions, database queries, and Edge Functions all have complete type support.
-->

---
layout: center
class: text-center
---

# Architecture

## Simple but Powerful

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-red-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🅰️</div>
<h3 class="text-red-600 font-bold">Angular: Reactive UI</h3>
</div>

<div class="bg-green-50 p-6 rounded-lg">
<div class="text-4xl mb-4">⚡</div>
<h3 class="text-green-600 font-bold">Supabase: Real-time backend</h3>
</div>

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">🔌</div>
<h3 class="text-blue-600 font-bold">One WebSocket connection</h3>
</div>

</div>

<!--
The architecture is beautifully simple. Angular handles the reactive UI with signals and components. Supabase provides the database, real-time engine, and serverless functions. One WebSocket connection handles all real-time features - database changes, presence, and broadcast messages.
-->

---
layout: center
class: text-center
---

# Real-World Results

## Production-Ready Performance

<div class="grid grid-cols-2 gap-8 mt-12">

<div class="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
<h3 class="text-green-600 font-bold mb-2">✅ 250,000+ concurrent users</h3>
</div>

<div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
<h3 class="text-blue-600 font-bold mb-2">✅ Sub-50ms latency</h3>
</div>

<div class="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
<h3 class="text-purple-600 font-bold mb-2">✅ Automatic scaling</h3>
</div>

<div class="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400">
<h3 class="text-orange-600 font-bold mb-2">✅ Zero infrastructure management</h3>
</div>

</div>

<!--
This isn't just a demo - it's production-ready. Supabase Realtime has been benchmarked with over 250,000 concurrent users. Updates have sub-50ms latency thanks to the global edge network. Everything scales automatically, and you get built-in monitoring. No DevOps team required.
-->

---
layout: center
class: text-center
---

# Key Takeaways

## Why Angular + Supabase Works

<div class="grid grid-cols-3 gap-8 mt-12">

<div class="bg-blue-50 p-8 rounded-lg">
<div class="text-5xl mb-4">⚡</div>
<h3 class="text-blue-600 font-bold">Reactive by default</h3>
</div>

<div class="bg-green-50 p-8 rounded-lg">
<div class="text-5xl mb-4">🛡️</div>
<h3 class="text-green-600 font-bold">Type-safe across the stack</h3>
</div>

<div class="bg-purple-50 p-8 rounded-lg">
<div class="text-5xl mb-4">📈</div>
<h3 class="text-purple-600 font-bold">Scalable out of the box</h3>
</div>

</div>

<!--
Here's why this combination works so well. Angular Signals are reactive by default, perfect for real-time data. Everything is type-safe from database to UI. It scales to massive user counts without configuration. Security is built-in with RLS policies. And it's simple - one WebSocket connection handles all your real-time needs.
-->

---
layout: center
class: text-center
---

# What You Can Build

## Beyond Games

<div class="grid grid-cols-2 gap-8 mt-12">

<div class="bg-blue-50 p-6 rounded-lg">
<div class="text-4xl mb-4">💬</div>
<h3 class="text-blue-600 font-bold">Chat applications</h3>
</div>

<div class="bg-green-50 p-6 rounded-lg">
<div class="text-4xl mb-4">📊</div>
<h3 class="text-green-600 font-bold">Collaborative dashboards</h3>
</div>

<div class="bg-yellow-50 p-6 rounded-lg">
<div class="text-4xl mb-4">✏️</div>
<h3 class="text-yellow-600 font-bold">Document editing</h3>
</div>

<div class="bg-purple-50 p-6 rounded-lg">
<div class="text-4xl mb-4">📍</div>
<h3 class="text-purple-600 font-bold">Live tracking</h3>
</div>

</div>

<!--
This isn't just for games. You can build chat applications with typing indicators, collaborative dashboards where everyone sees live data updates, document editors like Google Docs, live tracking applications, interactive polls for presentations like this one. Any app that needs real-time collaboration can use these patterns.
-->

---
layout: center
class: text-center
---

# Thank You!

## Questions?

<div class="text-6xl mb-8">🍪</div>

<div class="text-xl space-y-4">

**🎮 Demo:** https://ngdemo-sb.netlify.app

**📚 Source Code:** https://github.com/mandarini/ac-demo-sb

</div>

<div class="mt-12 text-lg">

**Connect with me:**
- 🐦 [@psybercity](https://x.com/psybercity)
- 🌐 [psyber.city](https://psyber.city)  
- 💼 [github.com/mandarini](https://github.com/mandarini)

</div>

<!--
That's how we build real-time multiplayer experiences with Angular and Supabase. The combination of reactive signals and real-time infrastructure makes complex multiplayer features surprisingly simple to implement. Thank you for your attention - I'd love to answer any questions you have!
-->

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>