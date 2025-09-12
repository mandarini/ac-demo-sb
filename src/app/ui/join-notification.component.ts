import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinNotification } from '../core/join-notification.service';

@Component({
  selector: 'app-join-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="join-notification"
      [style.background-color]="notification.color"
    >
      <div class="notification-content">
        <span class="join-icon">🎉</span>
        <span class="join-text">
          <strong>{{ notification.nick }}</strong> joined the game!
        </span>
      </div>
    </div>
  `,
  styles: [`
    .join-notification {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      min-width: 250px;
      max-width: 350px;
      
      /* Entrance animation */
      animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    
    .join-icon {
      font-size: 18px;
      flex-shrink: 0;
    }
    
    .join-text {
      color: white;
      font-size: 14px;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      flex: 1;
    }
    
    .join-text strong {
      font-weight: 700;
      color: inherit;
    }
    
    /* Slide in from right animation */
    @keyframes slideInRight {
      0% {
        transform: translateX(100%);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    /* Exit animation (will be triggered programmatically) */
    .join-notification.exiting {
      animation: slideOutRight 0.3s ease-in forwards;
    }
    
    @keyframes slideOutRight {
      0% {
        transform: translateX(0);
        opacity: 1;
      }
      100% {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    /* Fade out animation for the last second */
    .join-notification.fading {
      animation: fadeOut 1s ease-out forwards;
    }
    
    @keyframes fadeOut {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0.3;
      }
    }
  `]
})
export class JoinNotificationComponent {
  @Input({ required: true }) notification!: JoinNotification;
}
