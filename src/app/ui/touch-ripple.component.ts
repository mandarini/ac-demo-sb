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
      
      <!-- User Label (only show for taps, not drags) -->
      @if (ripple.type === 'tap') {
        <div 
          class="ripple-label"
          [style.background-color]="ripple.color"
        >
          {{ ripple.nick }}
        </div>
      }
    </div>
  `,
  styles: [`
    .ripple-container {
      position: absolute;
      pointer-events: none;
      z-index: 998; /* Below cursors but above game elements */
    }
    
    .ripple-circle {
      width: 15px;
      height: 15px;
      border: 2px solid;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(2px);
    }
    
    .ripple-label {
      position: absolute;
      top: 25px;
      left: 50%;
      transform: translateX(-50%);
      padding: 3px 6px;
      border-radius: 4px;
      color: white;
      font-size: 10px;
      font-weight: 500;
      white-space: nowrap;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0.9;
      animation: labelFadeIn 0.4s ease-out;
    }
    
    /* Tap Ripple Animation */
    .tap-ripple {
      animation: tapRipple 1.5s ease-out forwards;
    }
    
    @keyframes tapRipple {
      0% {
        width: 15px;
        height: 15px;
        opacity: 0.6;
        transform: scale(1);
      }
      40% {
        width: 40px;
        height: 40px;
        opacity: 0.4;
        transform: scale(1);
      }
      100% {
        width: 50px;
        height: 50px;
        opacity: 0;
        transform: scale(1.1);
      }
    }
    
    /* Drag Ripple Animation (smaller, subtle) */
    .drag-ripple {
      animation: dragRipple 0.8s ease-out forwards;
      width: 20px;
      height: 20px;
    }
    
    @keyframes dragRipple {
      0% {
        opacity: 0.4;
        transform: scale(0.9);
      }
      50% {
        opacity: 0.3;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(1.05);
      }
    }
    
    /* Release Ripple Animation (quick burst) */
    .release-ripple {
      animation: releaseRipple 1.2s ease-out forwards;
    }
    
    @keyframes releaseRipple {
      0% {
        width: 18px;
        height: 18px;
        opacity: 0.5;
        transform: scale(1);
      }
      30% {
        width: 35px;
        height: 35px;
        opacity: 0.3;
        transform: scale(1);
      }
      100% {
        width: 45px;
        height: 45px;
        opacity: 0;
        transform: scale(1.15);
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
