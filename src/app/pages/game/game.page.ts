import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStore } from '../../state/game.store';
import { RealtimeCursorsComponent } from '../../ui/realtime-cursors.component';

@Component({
  selector: 'app-game',
  imports: [CommonModule, RealtimeCursorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen relative overflow-hidden">
      <!-- Realtime Cursors -->
      <app-realtime-cursors 
        roomName="main-room"
        [username]="gameStore.currentPlayer()?.nick || 'Player'"
        [userColor]="gameStore.currentPlayer()?.color || '#3B82F6'"
        [userId]="gameStore.currentPlayer()?.device_id"
      />
      
      <!-- Cookie Rain Container -->
      <div id="cookieRainContainer">
        @for (cookie of animatedCookies; track cookie.id) {
          <div 
            class="cookie"
            [style.left]="cookie.style.left"
            [style.animation-duration]="cookie.style.animationDuration"
            [style.animation-delay]="cookie.style.animationDelay"
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
            <p class="text-green-400 text-xl font-bold">🎮 GAME STARTED</p>
            <p class="text-gray-300 text-sm">Catch the cookies!</p>
          } @else if (gameStore.isGameOver()) {
            <p class="text-red-400 text-xl font-bold">🏁 GAME OVER</p>
            <p class="text-gray-300 text-sm">Check the leaderboard!</p>
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
      animation: fall linear forwards;
      cursor: pointer;
      pointer-events: auto;
      user-select: none;
      top: -100px; /* Start above viewport */
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
    style: { left: string; animationDuration: string; animationDelay: string };
  }> = [];

  private processedCookieIds = new Set<string>();

  constructor(
    public gameStore: GameStore,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // When active cookies change, add new ones without disrupting existing animations
    effect(() => {
      const active = this.gameStore.activeCookies();
      
      // Find new cookies that haven't been processed yet
      const newCookies = active.filter(c => !this.processedCookieIds.has(c.id));
      
      // Add new cookies to the animated list
      if (newCookies.length > 0) {
        newCookies.forEach(c => {
          this.processedCookieIds.add(c.id);
          this.animatedCookies.push({
            id: c.id,
            emoji: c.type === 'cat' ? '🐱' : '🍪',
            style: {
              left: Math.random() * 80 + 10 + '%', // Keep cookies away from edges
              animationDuration: (Math.random() * 4 + 4).toFixed(2) + 's', // Slower: 4-8 seconds
              animationDelay: '0.1s' // Small delay to ensure DOM is ready
            }
          });
        });
        
        // Force change detection to ensure DOM updates
        this.cdr.markForCheck();
      }

      // Remove cookies that are no longer active
      const activeCookieIds = new Set(active.map(c => c.id));
      this.animatedCookies = this.animatedCookies.filter(c => activeCookieIds.has(c.id));
      
      // Clean up processed IDs for cookies that are no longer active
      this.processedCookieIds.forEach(id => {
        if (!activeCookieIds.has(id)) {
          this.processedCookieIds.delete(id);
        }
      });
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
    this.processedCookieIds.clear();
  }

  async claimCookie(cookieId: string) {
    // Remove immediately from UI - do not wait for server response
    this.animatedCookies = this.animatedCookies.filter(c => c.id !== cookieId);
    await this.gameStore.claimCookie(cookieId);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}