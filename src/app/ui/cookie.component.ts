import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookie',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="cookie-emoji absolute text-4xl cursor-pointer select-none"
      [style.left.%]="cookie.x_pct"
      [style.animation-duration.ms]="duration"
      (click)="onClaim()"
      (animationend)="onAnimationEnd()"
    >
      {{ cookie.type === 'cat' ? '🐱' : '🍪' }}
    </div>
  `,
  styles: [`
    @keyframes fall {
      from {
        transform: translateY(-100px);
      }
      to {
        transform: translateY(100vh);
      }
    }
    
    .cookie-emoji {
      animation: fall linear forwards;
      will-change: transform;
      transform: translateZ(0); /* Force GPU acceleration */
    }
    
    .cookie-emoji:hover {
      animation-play-state: paused;
      transform: scale(1.2);
    }
  `]
})
export class CookieComponent implements OnInit {
  @Input() cookie: any;
  @Output() claim = new EventEmitter<string>();
  @Output() expired = new EventEmitter<string>();
  
  duration = 0;

  ngOnInit() {
    const spawnTime = new Date(this.cookie.spawned_at).getTime();
    const despawnTime = new Date(this.cookie.despawn_at).getTime();
    this.duration = despawnTime - spawnTime;
  }

  onClaim() {
    this.claim.emit(this.cookie.id);
  }

  onAnimationEnd() {
    // Cookie has reached the bottom
    this.expired.emit(this.cookie.id);
  }
}