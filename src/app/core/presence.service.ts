import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface PresenceState {
  nick: string;
  color?: string;
  device_id: string;
  last_seen: string;
}

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private channel: RealtimeChannel | null = null;
  
  // Signals for reactive state
  onlineCount = signal(0);
  onlineUsers = signal<PresenceState[]>([]);

  constructor(private supabase: SupabaseService) {}

  joinPresence(roomId: string, userState: PresenceState): void {
    this.leavePresence(); // Clean up any existing presence

    this.channel = this.supabase.subscribeToPresence(roomId, {
      onJoin: (key, current, new_) => {
        console.log('User joined:', new_);
        this.updatePresenceState();
      },
      onLeave: (key, current, left) => {
        console.log('User left:', left);
        this.updatePresenceState();
      },
      onSync: () => {
        console.log('Presence synced');
        this.updatePresenceState();
      }
    });

    // Track this user's presence
    this.channel.track(userState);
  }

  leavePresence(): void {
    if (this.channel) {
      this.channel.untrack();
      this.channel.unsubscribe();
      this.channel = null;
    }
    this.onlineCount.set(0);
    this.onlineUsers.set([]);
  }

  private updatePresenceState(): void {
    if (!this.channel) return;

    const presenceState = this.channel.presenceState();
    const users: PresenceState[] = [];
    
    Object.keys(presenceState).forEach(key => {
      const user = presenceState[key][0] as PresenceState;
      if (user) {
        users.push(user);
      }
    });

    this.onlineCount.set(users.length);
    this.onlineUsers.set(users.sort((a, b) => a.nick.localeCompare(b.nick)));
  }

  updatePresence(updates: Partial<PresenceState>): void {
    if (this.channel) {
      const currentState = this.channel.presenceState();
      const myKey = Object.keys(currentState)[0];
      if (myKey && currentState[myKey]?.[0]) {
        const updatedState = { ...currentState[myKey][0], ...updates };
        this.channel.track(updatedState);
      }
    }
  }
}