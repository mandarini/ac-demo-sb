import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

export interface JoinNotification {
  id: string;
  nick: string;
  color: string;
  timestamp: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class JoinNotificationService {
  private readonly NOTIFICATION_DURATION_MS = 5000; // 5 seconds
  
  // Signal for reactive notifications list
  notifications = signal<JoinNotification[]>([]);
  
  constructor() {
    // Clean up expired notifications every second
    this.startCleanupTimer();
  }

  /**
   * Add a new join notification
   */
  addJoinNotification(nick: string, color: string, deviceId: string): void {
    const now = Date.now();
    const notification: JoinNotification = {
      id: `${deviceId}-${now}`, // Unique ID based on device and timestamp
      nick,
      color,
      timestamp: now,
      expiresAt: now + this.NOTIFICATION_DURATION_MS
    };

    // Add to the list
    this.notifications.update(notifications => [...notifications, notification]);
    
    console.log('🎉 Join notification added:', notification);
  }

  /**
   * Remove a specific notification by ID
   */
  removeNotification(id: string): void {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  /**
   * Start the cleanup timer to remove expired notifications
   */
  private startCleanupTimer(): void {
    // Check every 100ms for smooth removal timing
    setInterval(() => {
      const now = Date.now();
      const currentNotifications = this.notifications();
      const activeNotifications = currentNotifications.filter(n => n.expiresAt > now);
      
      // Only update if there are expired notifications
      if (activeNotifications.length !== currentNotifications.length) {
        this.notifications.set(activeNotifications);
      }
    }, 100);
  }

  /**
   * Clear all notifications (useful for cleanup)
   */
  clearAll(): void {
    this.notifications.set([]);
  }
}
