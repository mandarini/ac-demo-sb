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
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
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

        <!-- Social Links -->
        <div class="mt-8 flex flex-wrap justify-center items-center gap-4 text-sm">
          <a 
            href="https://github.com/mandarini" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          
          <a 
            href="https://x.com/psybercity" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter
          </a>
          
          <a 
            href="https://psyber.city" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Website
          </a>
          
          <span class="text-gray-500">|</span>
          
          <a 
            href="https://github.com/mandarini/ac-demo-sb" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
            Source Code
          </a>
          
          <a 
            href="https://supabase.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z"/>
            </svg>
            Supabase Docs
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
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
}