import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface CursorPosition {
  x: number;
  y: number;
  timestamp: number;
}

export interface UserCursor {
  userId: string;
  nick: string;
  color: string;
  position: CursorPosition;
}

export interface TouchRipple {
  id: string;
  userId: string;
  nick: string;
  color: string;
  position: CursorPosition;
  type: 'tap' | 'drag' | 'release';
}

@Injectable({
  providedIn: 'root'
})
export class CursorService {
  private channel: RealtimeChannel | null = null;
  private currentRoomId: string | null = null;
  private currentUser: { userId: string; nick: string; color: string } | null = null;
  private throttleTimeout: any = null;
  
  // Signals for reactive state
  cursors = signal<UserCursor[]>([]);
  touchRipples = signal<TouchRipple[]>([]);
  isActive = signal(false);
  isMobileDevice = signal(false);

  constructor(private supabase: SupabaseService) {
    // Detect if this is a mobile device
    this.isMobileDevice.set(this.detectMobileDevice());
  }

  /**
   * Join cursor sharing for a specific room
   */
  joinCursorSharing(roomId: string, user: { userId: string; nick: string; color: string }): void {
    this.leaveCursorSharing(); // Clean up any existing connection
    
    this.currentRoomId = roomId;
    this.currentUser = user;
    
    // Create a broadcast channel for cursor positions
    this.channel = this.supabase.client
      .channel(`cursors_${roomId}`, {
        config: { broadcast: { self: false } } // Don't receive our own broadcasts
      })
      .on('broadcast', { event: 'cursor_move' }, (payload) => {
        this.handleCursorUpdate(payload['payload'] as UserCursor);
      })
      .on('broadcast', { event: 'touch_ripple' }, (payload) => {
        this.handleTouchRipple(payload['payload'] as TouchRipple);
      })
      .on('broadcast', { event: 'cursor_leave' }, (payload) => {
        this.handleCursorLeave(payload['payload'].userId);
      })
      .subscribe((status) => {
        console.log('🖱️ Cursor channel status:', status);
        if (status === 'SUBSCRIBED') {
          this.isActive.set(true);
        }
      });
  }

  /**
   * Leave cursor sharing and clean up
   */
  leaveCursorSharing(): void {
    if (this.channel && this.currentUser && this.currentRoomId) {
      // Broadcast that we're leaving
      this.channel.send({
        type: 'broadcast',
        event: 'cursor_leave',
        payload: { userId: this.currentUser.userId }
      });
      
      this.channel.unsubscribe();
      this.channel = null;
    }
    
    this.currentRoomId = null;
    this.currentUser = null;
    this.cursors.set([]);
    this.touchRipples.set([]);
    this.isActive.set(false);
    
    // Clear any pending throttle
    if (this.throttleTimeout) {
      clearTimeout(this.throttleTimeout);
      this.throttleTimeout = null;
    }
  }

  /**
   * Update cursor position (throttled for performance) - Desktop only
   */
  updateCursorPosition(x: number, y: number): void {
    if (!this.channel || !this.currentUser || !this.isActive() || this.isMobileDevice()) {
      return;
    }

    // Throttle updates to avoid overwhelming the network
    if (this.throttleTimeout) {
      return; // Skip this update, previous one is still pending
    }

    this.throttleTimeout = setTimeout(() => {
      if (this.channel && this.currentUser) {
        const cursorData: UserCursor = {
          userId: this.currentUser.userId,
          nick: this.currentUser.nick,
          color: this.currentUser.color,
          position: {
            x,
            y,
            timestamp: Date.now()
          }
        };

        this.channel.send({
          type: 'broadcast',
          event: 'cursor_move',
          payload: cursorData
        });
      }
      
      this.throttleTimeout = null;
    }, 50); // Update every 50ms max
  }

  /**
   * Send touch ripple (Mobile only)
   */
  sendTouchRipple(x: number, y: number, type: 'tap' | 'drag' | 'release' = 'tap'): void {
    if (!this.channel || !this.currentUser || !this.isActive()) {
      return;
    }

    const rippleData: TouchRipple = {
      id: `${this.currentUser.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: this.currentUser.userId,
      nick: this.currentUser.nick,
      color: this.currentUser.color,
      position: {
        x,
        y,
        timestamp: Date.now()
      },
      type
    };

    this.channel.send({
      type: 'broadcast',
      event: 'touch_ripple',
      payload: rippleData
    });
  }

  /**
   * Handle incoming cursor updates from other users
   */
  private handleCursorUpdate(cursorData: UserCursor): void {
    this.cursors.update(cursors => {
      const existingIndex = cursors.findIndex(c => c.userId === cursorData.userId);
      
      if (existingIndex >= 0) {
        // Update existing cursor
        const updated = [...cursors];
        updated[existingIndex] = cursorData;
        return updated;
      } else {
        // Add new cursor
        return [...cursors, cursorData];
      }
    });

    // Remove old cursors (older than 5 seconds)
    this.cleanupOldCursors();
  }

  /**
   * Handle incoming touch ripple from other users
   */
  private handleTouchRipple(rippleData: TouchRipple): void {
    this.touchRipples.update(ripples => [...ripples, rippleData]);

    // Auto-remove ripple after animation duration (based on type)
    const removeDelay = rippleData.type === 'tap' ? 1500 : 
                       rippleData.type === 'drag' ? 800 : 1200;
    
    setTimeout(() => {
      this.touchRipples.update(ripples => 
        ripples.filter(r => r.id !== rippleData.id)
      );
    }, removeDelay);
  }

  /**
   * Handle user leaving cursor sharing
   */
  private handleCursorLeave(userId: string): void {
    this.cursors.update(cursors => cursors.filter(c => c.userId !== userId));
    this.touchRipples.update(ripples => ripples.filter(r => r.userId !== userId));
  }

  /**
   * Remove cursors that haven't been updated recently
   */
  private cleanupOldCursors(): void {
    const cutoffTime = Date.now() - 5000; // 5 seconds ago
    
    this.cursors.update(cursors => 
      cursors.filter(c => c.position.timestamp > cutoffTime)
    );
  }

  /**
   * Get cursor position relative to viewport
   */
  getRelativePosition(event: MouseEvent): { x: number; y: number } {
    return {
      x: (event.clientX / window.innerWidth) * 100, // Convert to percentage
      y: (event.clientY / window.innerHeight) * 100
    };
  }

  /**
   * Get touch position relative to viewport
   */
  getRelativeTouchPosition(touch: Touch): { x: number; y: number } {
    return {
      x: (touch.clientX / window.innerWidth) * 100, // Convert to percentage
      y: (touch.clientY / window.innerHeight) * 100
    };
  }

  /**
   * Detect if this is a mobile device
   */
  private detectMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || window.innerWidth <= 768
      || 'ontouchstart' in window;
  }
}
