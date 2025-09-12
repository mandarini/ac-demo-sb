import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStore } from '../../state/game.store';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen relative overflow-hidden">
      <!-- Cookie Rain Container -->
      <div id="cookieRainContainer">
        @for (cookie of animatedCookies; track cookie.id) {
          <div 
            class="cookie"
            [style.left]="cookie.style.left"
            [style.animation-duration]="cookie.style.animationDuration"
            (click)="claimCookie(cookie.id)"
          >
            {{ cookie.emoji }}
          </div>
        }
      </div>

      <!-- HUD -->
      <div class="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none">
        <div class="bg-black/50 backdrop-blur rounded-lg px-4 py-2 pointer-events-auto">
          <p class="text-white font-bold">{{ gameStore.currentPlayer()?.nick || 'Player' }}</p>
          <p class="text-yellow-400 text-xl">Score: {{ gameStore.myScores()?.score_round || 0 }}</p>
        </div>

        <div class="bg-black/50 backdrop-blur rounded-lg px-4 py-2 text-center">
          @if (gameStore.isGameActive()) {
            <p class="text-white text-2xl font-bold">{{ gameStore.timeRemaining() }}s</p>
            <p class="text-gray-300 text-sm">Round {{ gameStore.room()?.round_no }}</p>
          } @else if (gameStore.isIntermission()) {
            <p class="text-yellow-400 font-bold">Intermission</p>
            <p class="text-white">{{ gameStore.timeRemaining() }}s</p>
          } @else {
            <p class="text-gray-400">Waiting to start...</p>
          }
        </div>

        <div class="bg-black/50 backdrop-blur rounded-lg px-4 py-2 pointer-events-auto">
          <p class="text-gray-300 text-sm">Online</p>
          <p class="text-white font-bold">{{ gameStore.presence.onlineCount() }}</p>
        </div>
      </div>

      <!-- Temporary back button -->
      <button 
        (click)="goBack()"
        class="absolute bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
      >
        ← Back
      </button>
    </div>
  `,
  styles: [`
    #cookieRainContainer {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      z-index: 100;
      pointer-events: none;
    }
    
    .cookie {
      position: absolute;
      font-size: 40px;
      animation: fall linear;
      cursor: pointer;
      pointer-events: auto;
      user-select: none;
    }
    
    .cookie:hover {
      transform: scale(1.2);
    }
    
    @keyframes fall {
      from {
        transform: translateY(-100px);
      }
      to {
        transform: translateY(calc(100vh + 100px));
      }
    }
  `]
})
export class GamePage implements OnInit, OnDestroy {
  // Simple animation buffer for rendering
  animatedCookies: Array<{
    id: string;
    emoji: string;
    style: { left: string; animationDuration: string };
  }> = [];

  constructor(
    public gameStore: GameStore,
    private router: Router
  ) {
    // When active cookies change, re-render the simple animated list
    effect(() => {
      const active = this.gameStore.activeCookies();
      // Map to simple objects for rendering
      this.animatedCookies = active.map(c => ({
        id: c.id,
        emoji: c.type === 'cat' ? '🐱' : '🍪',
        style: {
          left: Math.random() * 100 + '%',
          animationDuration: (Math.random() * 2 + 2).toFixed(2) + 's'
        }
      }));
    });
  }

  ngOnInit() {
    if (!this.gameStore.currentPlayer()) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy() {
    this.gameStore.destroy();
    this.animatedCookies = [];
  }

  async claimCookie(cookieId: string) {
    await this.gameStore.claimCookie(cookieId);
    // Remove immediately from UI
    this.animatedCookies = this.animatedCookies.filter(c => c.id !== cookieId);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}