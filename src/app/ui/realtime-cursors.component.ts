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

  // Touch state tracking to prevent multiple ripples
  private touchStartTime: number = 0;
  private touchStartPosition: { x: number; y: number } | null = null;
  private isDragging: boolean = false;
  private lastDragRippleTime: number = 0;

  constructor(public cursorService: CursorService) {}

  ngOnInit() {
    if (!this.roomName || !this.username) {
      console.warn('RealtimeCursors: roomName and username are required');
      return;
    }

    // Use the provided userId (device_id) or generate one as fallback
    const finalUserId = this.userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('🖱️ Initializing cursor sharing for user:', finalUserId, 'nick:', this.username);

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
      // Only prevent default if NOT touching an interactive element
      if (!this.isInteractiveElement(event.target as Element)) {
        event.preventDefault();
      }
      
      const touch = event.touches[0];
      if (touch) {
        const position = this.cursorService.getRelativeTouchPosition(touch);
        
        // Record touch start for tap detection
        this.touchStartTime = Date.now();
        this.touchStartPosition = position;
        this.isDragging = false;
        
        // Don't create ripple yet - wait to see if it's a tap or drag
      }
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.cursorService.isActive() && this.cursorService.isMobileDevice()) {
      // Only prevent scrolling if NOT on an interactive element
      if (!this.isInteractiveElement(event.target as Element)) {
        event.preventDefault();
      }
      
      const touch = event.touches[0];
      if (touch && this.touchStartPosition) {
        const position = this.cursorService.getRelativeTouchPosition(touch);
        
        // Check if we've moved significantly (indicates dragging)
        const deltaX = Math.abs(position.x - this.touchStartPosition.x);
        const deltaY = Math.abs(position.y - this.touchStartPosition.y);
        const hasMovedSignificantly = deltaX > 2 || deltaY > 2; // 2% of screen
        
        if (hasMovedSignificantly) {
          this.isDragging = true;
          
          // Throttle drag ripples to avoid spam (max every 100ms)
          const now = Date.now();
          if (now - this.lastDragRippleTime > 100) {
            this.cursorService.sendTouchRipple(position.x, position.y, 'drag');
            this.lastDragRippleTime = now;
          }
        }
      }
    }
  }

  @HostListener('document:touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (this.cursorService.isActive() && this.cursorService.isMobileDevice()) {
      // Only prevent default if NOT touching an interactive element
      if (!this.isInteractiveElement(event.target as Element)) {
        event.preventDefault();
      }
      
      const touch = event.changedTouches[0];
      if (touch && this.touchStartPosition) {
        const position = this.cursorService.getRelativeTouchPosition(touch);
        const touchDuration = Date.now() - this.touchStartTime;
        
        // Determine if this was a quick tap or a drag
        if (!this.isDragging && touchDuration < 300) {
          // Quick tap - create single tap ripple
          this.cursorService.sendTouchRipple(position.x, position.y, 'tap');
        } else if (this.isDragging) {
          // End of drag - create release ripple
          this.cursorService.sendTouchRipple(position.x, position.y, 'release');
        }
        
        // Reset touch state
        this.touchStartPosition = null;
        this.touchStartTime = 0;
        this.isDragging = false;
      }
    }
  }

  /**
   * Check if the touched element is interactive (clickable)
   */
  private isInteractiveElement(element: Element | null): boolean {
    if (!element) return false;
    
    // Check for common interactive elements and classes
    const interactiveSelectors = [
      'button',
      'a',
      'input',
      'textarea',
      'select',
      '[role="button"]',
      '[tabindex]',
      '.cookie',           // Game cookies
      '[onclick]',         // Elements with click handlers
      '[ng-click]',        // Angular click handlers
      '[data-clickable]'   // Custom clickable marker
    ];
    
    // Check if the element itself matches
    for (const selector of interactiveSelectors) {
      if (element.matches && element.matches(selector)) {
        return true;
      }
    }
    
    // Check if any parent element matches (bubbling up)
    let parent = element.parentElement;
    let depth = 0;
    while (parent && depth < 5) { // Limit depth to avoid performance issues
      for (const selector of interactiveSelectors) {
        if (parent.matches && parent.matches(selector)) {
          return true;
        }
      }
      parent = parent.parentElement;
      depth++;
    }
    
    return false;
  }
}
