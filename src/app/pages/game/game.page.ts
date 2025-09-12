import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStore } from '../../state/game.store';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  template: `
    <div class="min-h-screen relative overflow-hidden">
      <!-- Game Canvas -->
      <div class="absolute inset-0">
        <div class="relative w-full h-full" id="game-canvas">
          <!-- Cookies will be rendered here -->
          @for (cookie of gameStore.activeCookies(); track cookie.id) {
            <div 
              class="absolute text-4xl cursor-pointer select-none transition-transform hover:scale-110"
              [style.left.%]="cookie.x_pct"
              [style.top.px]="getCookiePosition(cookie)"
              (click)="claimCookie(cookie.id)"
            >
              {{ cookie.type === 'cat' ? '🐱' : '🍪' }}
            </div>
          }
        </div>
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
  styles: []
})
export class GamePage implements OnInit, OnDestroy {
  constructor(
    public gameStore: GameStore,
    private router: Router
  ) {}

  ngOnInit() {
    // Game store should already be initialized from join page
    if (!this.gameStore.currentPlayer()) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy() {
    // Clean up when leaving game
    this.gameStore.destroy();
  }

  getCookiePosition(cookie: any): number {
    const now = Date.now();
    const spawnTime = new Date(cookie.spawned_at).getTime();
    const despawnTime = new Date(cookie.despawn_at).getTime();
    const totalTime = despawnTime - spawnTime;
    const elapsed = now - spawnTime;
    const progress = Math.min(elapsed / totalTime, 1);
    
    const position = progress * window.innerHeight;
    // Log first cookie details for debugging
    if (cookie.id === this.gameStore.activeCookies()[0]?.id) {
      console.log('Cookie position:', {
        progress,
        position,
        elapsed: elapsed / 1000,
        totalTime: totalTime / 1000
      });
    }
    return position;
  }

  async claimCookie(cookieId: string) {
    await this.gameStore.claimCookie(cookieId);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}