import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursorService } from '../core/cursor.service';
import { CursorComponent } from './cursor.component';
import { TouchRippleComponent } from './touch-ripple.component';

@Component({
  selector: 'app-realtime-cursors',
  standalone: true,
  imports: [CommonModule, CursorComponent, TouchRippleComponent],
  template: `
    <div class="cursors-overlay">
      <!-- Desktop Cursors -->
      @if (!cursorService.isMobileDevice()) {
        @for (cursor of cursorService.cursors(); track cursor.userId) {
          <app-cursor [cursor]="cursor" />
        }
      }
      
      <!-- Mobile Touch Ripples -->
      @for (ripple of cursorService.touchRipples(); track ripple.id) {
        <app-touch-ripple [ripple]="ripple" />
      }
    </div>
  `,
  styles: [`
    .cursors-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 999; /* Below HUD (1000+) but above game elements */
      overflow: hidden;
    }
  `]
})
export class RealtimeCursorsComponent implements OnInit, OnDestroy {
  @Input({ required: true }) roomName!: string;
  @Input({ required: true }) username!: string;
  @Input() userColor: string = '#3B82F6'; // Default blue color
  @Input() userId?: string;

  constructor(public cursorService: CursorService) {}

  ngOnInit() {
    if (!this.roomName || !this.username) {
      console.warn('RealtimeCursors: roomName and username are required');
      return;
    }

    // Generate userId if not provided
    const finalUserId = this.userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Join cursor sharing
    this.cursorService.joinCursorSharing(this.roomName, {
      userId: finalUserId,
      nick: this.username,
      color: this.userColor
    });
  }

  ngOnDestroy() {
    this.cursorService.leaveCursorSharing();
  }

  // Desktop mouse events
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.cursorService.isActive() && !this.cursorService.isMobileDevice()) {
      const position = this.cursorService.getRelativePosition(event);
      this.cursorService.updateCursorPosition(position.x, position.y);
    }
  }

  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    // When mouse leaves the document, we could optionally hide our cursor
    // For now, we'll keep it active as long as the component is mounted
  }

  // Mobile touch events
  @HostListener('document:touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (this.cursorService.isActive() && this.cursorService.isMobileDevice()) {
      event.preventDefault(); // Prevent default touch behavior
      const touch = event.touches[0];
      if (touch) {
        const position = this.cursorService.getRelativeTouchPosition(touch);
        this.cursorService.sendTouchRipple(position.x, position.y, 'tap');
      }
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.cursorService.isActive() && this.cursorService.isMobileDevice()) {
      // Prevent scrolling during touch move for better ripple experience
      event.preventDefault();
      const touch = event.touches[0];
      if (touch) {
        const position = this.cursorService.getRelativeTouchPosition(touch);
        this.cursorService.sendTouchRipple(position.x, position.y, 'drag');
      }
    }
  }

  @HostListener('document:touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (this.cursorService.isActive() && this.cursorService.isMobileDevice()) {
      event.preventDefault();
      const touch = event.changedTouches[0];
      if (touch) {
        const position = this.cursorService.getRelativeTouchPosition(touch);
        this.cursorService.sendTouchRipple(position.x, position.y, 'release');
      }
    }
  }
}
