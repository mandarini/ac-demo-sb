import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouchRipple } from '../core/cursor.service';

@Component({
  selector: 'app-touch-ripple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="ripple-container"
      [style.left.%]="ripple.position.x"
      [style.top.%]="ripple.position.y"
      [style.transform]="'translate(-50%, -50%)'"
    >
      <!-- Animated Ripple Circle -->
      <div 
        class="ripple-circle"
        [style.border-color]="ripple.color"
        [class.tap-ripple]="ripple.type === 'tap'"
        [class.drag-ripple]="ripple.type === 'drag'"
        [class.release-ripple]="ripple.type === 'release'"
      ></div>
      
      <!-- User Label -->
      <div 
        class="ripple-label"
        [style.background-color]="ripple.color"
      >
        {{ ripple.nick }}
      </div>
    </div>
  `,
  styles: [`
    .ripple-container {
      position: absolute;
      pointer-events: none;
      z-index: 998; /* Below cursors but above game elements */
    }
    
    .ripple-circle {
      width: 20px;
      height: 20px;
      border: 3px solid;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(4px);
    }
    
    .ripple-label {
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 8px;
      border-radius: 6px;
      color: white;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      animation: labelFadeIn 0.3s ease-out;
    }
    
    /* Tap Ripple Animation */
    .tap-ripple {
      animation: tapRipple 2s ease-out forwards;
    }
    
    @keyframes tapRipple {
      0% {
        width: 20px;
        height: 20px;
        opacity: 1;
        transform: scale(1);
      }
      50% {
        width: 60px;
        height: 60px;
        opacity: 0.8;
        transform: scale(1);
      }
      100% {
        width: 80px;
        height: 80px;
        opacity: 0;
        transform: scale(1.2);
      }
    }
    
    /* Drag Ripple Animation (smaller, persistent) */
    .drag-ripple {
      animation: dragRipple 1s ease-out forwards;
      width: 30px;
      height: 30px;
    }
    
    @keyframes dragRipple {
      0% {
        opacity: 1;
        transform: scale(0.8);
      }
      50% {
        opacity: 0.9;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(1.1);
      }
    }
    
    /* Release Ripple Animation (quick burst) */
    .release-ripple {
      animation: releaseRipple 1.5s ease-out forwards;
    }
    
    @keyframes releaseRipple {
      0% {
        width: 25px;
        height: 25px;
        opacity: 1;
        transform: scale(1);
      }
      30% {
        width: 50px;
        height: 50px;
        opacity: 0.9;
        transform: scale(1);
      }
      100% {
        width: 70px;
        height: 70px;
        opacity: 0;
        transform: scale(1.3);
      }
    }
    
    /* Label fade in animation */
    @keyframes labelFadeIn {
      0% {
        opacity: 0;
        transform: translateX(-50%) translateY(10px);
      }
      100% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    
    /* Entrance animation for the entire container */
    .ripple-container {
      animation: rippleEnter 0.2s ease-out;
    }
    
    @keyframes rippleEnter {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
  `]
})
export class TouchRippleComponent {
  @Input({ required: true }) ripple!: TouchRipple;
}
