import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase.service';
import { RealtimeCursorsComponent } from '../../ui/realtime-cursors.component';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, RealtimeCursorsComponent],
  template: `
    <div class="min-h-screen p-4">
      <!-- Realtime Cursors for Admin Collaboration -->
      @if (authenticated()) {
        <app-realtime-cursors 
          roomName="admin-room"
          username="Admin"
          userColor="#EF4444"
          userId="admin"
        />
      }
      
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-white mb-8">Admin Panel</h1>

        @if (!authenticated()) {
          <!-- Passcode Form -->
          <div class="bg-white/10 backdrop-blur rounded-lg p-6">
            <h2 class="text-xl font-bold text-white mb-4">Enter Admin Passcode</h2>
            <div class="flex gap-2">
              <input
                type="password"
                [(ngModel)]="passcode"
                (keyup.enter)="authenticate()"
                class="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                placeholder="Enter passcode..."
              />
              <button
                (click)="authenticate()"
                class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="loading()"
              >
                {{ loading() ? 'Authenticating...' : 'Login' }}
              </button>
            </div>
            @if (error()) {
              <p class="text-red-400 mt-2">{{ error() }}</p>
            }
          </div>
        } @else {
          <!-- Admin Controls -->
          <div class="space-y-6">
            <!-- Game Controls -->
            <div class="bg-white/10 backdrop-blur rounded-lg p-6">
              <h2 class="text-xl font-bold text-white mb-4">Game Controls</h2>
              <div class="flex gap-4 justify-center">
                <button
                  (click)="adminAction('start_round')"
                  class="px-8 py-4 bg-green-500 text-white text-lg font-bold rounded-lg hover:bg-green-600 min-w-[150px]"
                  [disabled]="loading()"
                >
                  🎮 START GAME
                </button>
                <button
                  (click)="adminAction('stop_round')"
                  class="px-8 py-4 bg-red-500 text-white text-lg font-bold rounded-lg hover:bg-red-600 min-w-[150px]"
                  [disabled]="loading()"
                >
                  🛑 STOP GAME
                </button>
              </div>
              <div class="flex gap-4 justify-center mt-4">
                <button
                  (click)="adminAction('clear_cookies')"
                  class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  [disabled]="loading()"
                >
                  Clear All Cookies
                </button>
              </div>
            </div>

            <!-- Spawn Controls -->
            <div class="bg-white/10 backdrop-blur rounded-lg p-6">
              <h2 class="text-xl font-bold text-white mb-4">Spawn Controls</h2>
              <div class="flex gap-4 items-end">
                <div class="flex-1">
                  <label class="text-white text-sm">Spawn Rate (per second)</label>
                  <input
                    type="number"
                    [(ngModel)]="spawnRate"
                    min="0.5"
                    max="10"
                    step="0.5"
                    class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
                <button
                  (click)="updateSpawnRate()"
                  class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  [disabled]="loading()"
                >
                  Update Rate
                </button>
                <button
                  (click)="adminAction('spawn_cookies', { count: 10 })"
                  class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  [disabled]="loading()"
                >
                  Spawn 10 Cookies
                </button>
              </div>
            </div>

            <!-- Score Controls -->
            <div class="bg-white/10 backdrop-blur rounded-lg p-6">
              <h2 class="text-xl font-bold text-white mb-4">Score Controls</h2>
              <div class="flex gap-4">
                <button
                  (click)="adminAction('reset_round_scores')"
                  class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  [disabled]="loading()"
                >
                  Reset Round Scores
                </button>
                <button
                  (click)="confirmAndResetAll()"
                  class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  [disabled]="loading()"
                >
                  Reset All Scores
                </button>
              </div>
            </div>

            <!-- Status -->
            @if (status()) {
              <div class="bg-white/10 backdrop-blur rounded-lg p-6">
                <h2 class="text-xl font-bold text-white mb-4">Status</h2>
                <pre class="text-green-400">{{ status() }}</pre>
              </div>
            }
          </div>
        }

        <!-- Back Button -->
        <button
          (click)="goBack()"
          class="mt-8 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          ← Back to Game
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class AdminPage implements OnInit {
  authenticated = signal(false);
  passcode = '';
  error = signal<string | null>(null);
  loading = signal(false);
  status = signal<string | null>(null);
  spawnRate = 2;

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if already authenticated in session
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      this.authenticated.set(true);
    }
  }

  async authenticate() {
    if (!this.passcode.trim()) {
      this.error.set('Please enter a password');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await this.supabase.authenticateAdmin(this.passcode);
      
      if (result.authenticated) {
        this.authenticated.set(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        this.error.set(null);
      } else {
        this.error.set(result.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      this.error.set('Authentication failed. Please try again.');
    } finally {
      this.loading.set(false);
      this.passcode = '';
    }
  }

  async adminAction(action: string, params: any = {}) {
    this.loading.set(true);
    this.status.set(null);
    
    try {
      const result = await this.supabase.adminAction(action, params);
      this.status.set(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error('Admin action failed:', err);
      this.status.set(`Error: ${err}`);
    } finally {
      this.loading.set(false);
    }
  }

  async updateSpawnRate() {
    await this.adminAction('update_spawn_rate', { rate: this.spawnRate });
  }

  async confirmAndResetAll() {
    if (confirm('Are you sure you want to reset ALL scores? This cannot be undone.')) {
      await this.adminAction('reset_all_scores');
    }
  }

  goBack() {
    this.router.navigate(['/game']);
  }
}