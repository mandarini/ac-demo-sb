import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase.service';
import { DeviceService } from '../../core/device.service';
import { GameStore } from '../../state/game.store';

@Component({
  selector: 'app-join',
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <!-- Logo/Title -->
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🍪</div>
          <h1 class="text-4xl font-bold text-white mb-2">Cookie Catcher</h1>
          <p class="text-gray-300">Tap to catch cookies and cats!</p>
        </div>

        <!-- Join Card -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          @if (loading()) {
          <div class="text-center">
            <div
              class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"
            ></div>
            <p class="mt-4 text-white">Getting your nickname...</p>
          </div>
          } @else if (nickname()) {
          <div class="text-center">
            <p class="text-gray-300 mb-2">Your nickname:</p>
            <h2 class="text-3xl font-bold text-white mb-6">{{ nickname() }}</h2>

            <button
              (click)="joinGame()"
              class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              [disabled]="joining()"
            >
              @if (joining()) {
              <span>Joining...</span>
              } @else {
              <span>Start Playing!</span>
              }
            </button>
          </div>
          } @else if (error()) {
          <div class="text-center">
            <p class="text-red-400 mb-4">{{ error() }}</p>
            <button
              (click)="retry()"
              class="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600"
            >
              Retry
            </button>
          </div>
          }
        </div>

        <!-- Instructions -->
        <div class="mt-8 text-center text-gray-300 text-sm">
          <p>📱 Tap falling cookies to score points</p>
          <p class="mt-1">🐱 Cats are worth 3x points!</p>
          <p class="mt-1">🏆 Compete for the top spot</p>
        </div>

        <!-- Leaderboard Link -->
        <div class="mt-6 text-center">
          <button
            (click)="goToLeaderboard()"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            🏆 View Leaderboard
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class JoinPage implements OnInit {
  loading = signal(true);
  nickname = signal<string | null>(null);
  error = signal<string | null>(null);
  joining = signal(false);

  constructor(
    private router: Router,
    private supabase: SupabaseService,
    private deviceService: DeviceService,
    private gameStore: GameStore
  ) {}

  async ngOnInit() {
    await this.assignNickname();
  }

  async assignNickname() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const deviceId = this.deviceService.getDeviceId();
      const result = await this.supabase.assignNickname(deviceId);

      if (result?.nick) {
        this.nickname.set(result.nick);
        // Store player info in game store
        this.gameStore.currentPlayer.set(result);
      } else {
        throw new Error('Failed to get nickname');
      }
    } catch (err) {
      console.error('Error assigning nickname:', err);
      this.error.set('Failed to join. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  async joinGame() {
    this.joining.set(true);

    try {
      await this.gameStore.joinGame();
      await this.router.navigate(['/game']);
    } catch (err) {
      console.error('Error joining game:', err);
      this.error.set('Failed to join game. Please try again.');
      this.joining.set(false);
    }
  }

  retry() {
    this.assignNickname();
  }

  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }
}
