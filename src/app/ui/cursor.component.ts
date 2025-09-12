import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCursor } from '../core/cursor.service';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="cursor-container"
      [style.left.%]="cursor.position.x"
      [style.top.%]="cursor.position.y"
      [style.transform]="'translate(-50%, -50%)'"
    >
      <!-- Cursor Pointer -->
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        class="cursor-pointer"
        [style.color]="cursor.color"
      >
        <path 
          fill="currentColor" 
          d="M8.5 2L3 7.5L8.5 13L10.5 11L7 7.5L10.5 4L8.5 2Z"
          transform="rotate(-45 12 12)"
        />
        <path 
          fill="white" 
          stroke="currentColor"
          stroke-width="1"
          d="M8.5 3L4 7.5L8.5 12L9.5 11L6.5 7.5L9.5 4.5L8.5 3Z"
          transform="rotate(-45 12 12)"
        />
      </svg>
      
      <!-- User Label -->
      <div 
        class="cursor-label"
        [style.background-color]="cursor.color"
      >
        {{ cursor.nick }}
      </div>
    </div>
  `,
  styles: [`
    .cursor-container {
      position: absolute;
      pointer-events: none;
      z-index: 1000;
      transition: all 0.1s ease-out;
    }
    
    .cursor-pointer {
      filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
    }
    
    .cursor-label {
      position: absolute;
      top: 20px;
      left: 8px;
      padding: 4px 8px;
      border-radius: 6px;
      color: white;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    /* Smooth entrance animation */
    .cursor-container {
      animation: cursorEnter 0.2s ease-out;
    }
    
    @keyframes cursorEnter {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
  `]
})
export class CursorComponent {
  @Input({ required: true }) cursor!: UserCursor;
}
