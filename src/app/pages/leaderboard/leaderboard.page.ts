import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStore } from '../../state/game.store';

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <!-- Header -->
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <button
            (click)="goBack()"
            class="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back
          </button>
          
          <h1 class="text-3xl font-bold text-white text-center">
            🏆 Leaderboard
          </h1>
          
          <div class="w-16"></div> <!-- Spacer for centering -->
        </div>

        <!-- Game Status -->
        <div class="text-center mb-8">
          @if (gameStore.room()) {
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2">
              <div class="w-3 h-3 rounded-full" 
                   [class]="gameStore.room()?.status === 'running' ? 'bg-green-400 animate-pulse' : 
                           gameStore.room()?.status === 'intermission' ? 'bg-yellow-400' : 'bg-gray-400'">
              </div>
              <span class="text-white font-medium">
                {{ gameStore.room()?.status === 'running' ? 'Game Active' : 
                   gameStore.room()?.status === 'intermission' ? 'Intermission' : 'Game Idle' }}
              </span>
            </div>
          }
        </div>

        <!-- Leaderboard Tabs -->
        <div class="flex justify-center mb-6">
          <div class="bg-white/10 backdrop-blur-lg rounded-xl p-1 flex">
            <button
              (click)="activeTab = 'round'"
              class="px-6 py-2 rounded-lg font-medium transition-all duration-200"
              [class]="activeTab === 'round' ? 
                'bg-white text-purple-900 shadow-lg' : 
                'text-white hover:bg-white/10'"
            >
              Current Round
            </button>
            <button
              (click)="activeTab = 'alltime'"
              class="px-6 py-2 rounded-lg font-medium transition-all duration-200"
              [class]="activeTab === 'alltime' ? 
                'bg-white text-purple-900 shadow-lg' : 
                'text-white hover:bg-white/10'"
            >
              All Time
            </button>
          </div>
        </div>

        <!-- Round Leaderboard -->
        @if (activeTab === 'round') {
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <div class="flex items-center gap-2 mb-6">
              <span class="text-2xl">🎯</span>
              <h2 class="text-xl font-bold text-white">Current Round Leaders</h2>
            </div>
            
            @if (gameStore.roundLeaderboard().length > 0) {
              <div class="space-y-3">
                @for (player of gameStore.roundLeaderboard(); track player.player_id; let i = $index) {
                  <div class="flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
                       [class]="i === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                               i === 1 ? 'bg-gray-300/20 border border-gray-300/30' :
                               i === 2 ? 'bg-orange-600/20 border border-orange-600/30' :
                               'bg-white/5 hover:bg-white/10'">
                    <!-- Rank -->
                    <div class="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                         [class]="i === 0 ? 'bg-yellow-500 text-yellow-900' :
                                 i === 1 ? 'bg-gray-300 text-gray-900' :
                                 i === 2 ? 'bg-orange-600 text-white' :
                                 'bg-white/20 text-white'">
                      {{ i + 1 }}
                    </div>
                    
                    <!-- Player Info -->
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        @if (player.players.color) {
                          <div class="w-4 h-4 rounded-full border-2 border-white/30"
                               [style.background-color]="player.players.color">
                          </div>
                        }
                        <span class="font-semibold text-white">{{ player.players.nick }}</span>
                        @if (i === 0) {
                          <span class="text-yellow-400">👑</span>
                        }
                      </div>
                    </div>
                    
                    <!-- Score -->
                    <div class="text-right">
                      <div class="text-xl font-bold text-white">{{ player.score_round }}</div>
                      <div class="text-xs text-white/60">points</div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-12">
                <div class="text-6xl mb-4">🎯</div>
                <p class="text-white/60">No scores yet this round</p>
                <p class="text-white/40 text-sm mt-2">Be the first to catch some cookies!</p>
              </div>
            }
          </div>
        }

        <!-- All-Time Leaderboard -->
        @if (activeTab === 'alltime') {
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <div class="flex items-center gap-2 mb-6">
              <span class="text-2xl">🏆</span>
              <h2 class="text-xl font-bold text-white">All-Time Champions</h2>
            </div>
            
            @if (gameStore.alltimeLeaderboard().length > 0) {
              <div class="space-y-3">
                @for (player of gameStore.alltimeLeaderboard(); track player.player_id; let i = $index) {
                  <div class="flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
                       [class]="i === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                               i === 1 ? 'bg-gray-300/20 border border-gray-300/30' :
                               i === 2 ? 'bg-orange-600/20 border border-orange-600/30' :
                               'bg-white/5 hover:bg-white/10'">
                    <!-- Rank -->
                    <div class="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                         [class]="i === 0 ? 'bg-yellow-500 text-yellow-900' :
                                 i === 1 ? 'bg-gray-300 text-gray-900' :
                                 i === 2 ? 'bg-orange-600 text-white' :
                                 'bg-white/20 text-white'">
                      {{ i + 1 }}
                    </div>
                    
                    <!-- Player Info -->
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        @if (player.players.color) {
                          <div class="w-4 h-4 rounded-full border-2 border-white/30"
                               [style.background-color]="player.players.color">
                          </div>
                        }
                        <span class="font-semibold text-white">{{ player.players.nick }}</span>
                        @if (i === 0) {
                          <span class="text-yellow-400">👑</span>
                        }
                      </div>
                    </div>
                    
                    <!-- Score -->
                    <div class="text-right">
                      <div class="text-xl font-bold text-white">{{ player.score_total }}</div>
                      <div class="text-xs text-white/60">total points</div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-12">
                <div class="text-6xl mb-4">🏆</div>
                <p class="text-white/60">No all-time scores yet</p>
                <p class="text-white/40 text-sm mt-2">Start playing to make your mark!</p>
              </div>
            }
          </div>
        }

        <!-- Stats Footer -->
        <div class="mt-8 text-center">
          <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div class="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div class="text-2xl font-bold text-white">{{ gameStore.scores().length }}</div>
              <div class="text-white/60 text-sm">Total Players</div>
            </div>
            <div class="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div class="text-2xl font-bold text-white">{{ gameStore.room()?.round_no || 0 }}</div>
              <div class="text-white/60 text-sm">Current Round</div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            (click)="goToGame()"
            class="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            🎮 Play Game
          </button>
          <button
            (click)="goToJoin()"
            class="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            🚀 Join Game
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LeaderboardPage implements OnInit, OnDestroy {
  activeTab: 'round' | 'alltime' = 'alltime';

  constructor(
    private router: Router,
    public gameStore: GameStore
  ) {}

  async ngOnInit() {
    // Initialize the game store to get realtime data
    if (!this.gameStore.currentPlayer()) {
      // If no current player, start leaderboard subscriptions without joining as a player
      await this.gameStore.startLeaderboardSubscriptions();
    } else {
      // If already a player, just ensure we have latest data
      await this.gameStore.loadInitialData();
    }
  }

  ngOnDestroy() {
    // Don't destroy the game store as it might be used elsewhere
  }

  goBack() {
    window.history.back();
  }

  goToGame() {
    this.router.navigate(['/game']);
  }

  goToJoin() {
    this.router.navigate(['/']);
  }
}
