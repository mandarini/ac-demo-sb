import { Component, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinNotificationService, JoinNotification } from '../core/join-notification.service';
import { JoinNotificationComponent } from './join-notification.component';

@Component({
  selector: 'app-join-notifications-container',
  standalone: true,
  imports: [CommonModule, JoinNotificationComponent],
  template: `
    <div class="notifications-container">
      @for (notification of visibleNotifications(); track notification.id) {
        <app-join-notification 
          [notification]="notification"
          [class.fading]="isNearExpiry(notification)"
        />
      }
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 1001; /* Above cursors and game elements */
      display: flex;
      flex-direction: column;
      gap: 4px;
      pointer-events: none; /* Don't interfere with game interactions */
      max-height: calc(100vh - 160px); /* Leave space for top and bottom */
      overflow: hidden;
    }
    
    /* Mobile responsive adjustments */
    @media (max-width: 640px) {
      .notifications-container {
        right: 10px;
        top: 70px;
        max-width: calc(100vw - 20px);
      }
    }
    
    /* Limit the number of visible notifications to prevent overflow */
    .notifications-container {
      max-height: 400px; /* Show roughly 6-7 notifications max */
    }
  `]
})
export class JoinNotificationsContainerComponent {
  // Get notifications from the service
  visibleNotifications = computed(() => {
    const notifications = this.joinNotificationService.notifications();
    // Limit to last 6 notifications to prevent UI overflow
    return notifications.slice(-6);
  });

  constructor(private joinNotificationService: JoinNotificationService) {}

  /**
   * Check if a notification is near expiry (last 1 second) for fade effect
   */
  isNearExpiry(notification: JoinNotification): boolean {
    const now = Date.now();
    const timeUntilExpiry = notification.expiresAt - now;
    return timeUntilExpiry <= 1000 && timeUntilExpiry > 0;
  }
}
