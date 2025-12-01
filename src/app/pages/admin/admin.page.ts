import { Component, OnInit, signal, computed } from '@angular/core';
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
      @if (isAdmin()) {
        <app-realtime-cursors
          roomName="admin-room"
          [username]="userName()"
          userColor="#EF4444"
          [userId]="userId()"
        />
      }

      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-white">Admin Panel</h1>
          @if (isAuthenticated()) {
            <div class="flex items-center gap-4">
              @if (userAvatar()) {
                <img
                  [src]="userAvatar()"
                  alt="Profile"
                  class="w-8 h-8 rounded-full"
                />
              }
              <span class="text-white/80">{{ userName() }}</span>
              <button
                (click)="logout()"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Sign Out
              </button>
            </div>
          }
        </div>

        @if (!isAuthenticated()) {
          <!-- GitHub Login -->
          <div class="bg-white/10 backdrop-blur rounded-lg p-8 text-center">
            <h2 class="text-xl font-bold text-white mb-4">Admin Access Required</h2>
            <p class="text-white/60 mb-6">Sign in with GitHub to access admin controls.</p>
            <button
              (click)="signInWithGitHub()"
              class="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-3 mx-auto"
              [disabled]="loading()"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {{ loading() ? 'Signing in...' : 'Sign in with GitHub' }}
            </button>
            @if (error()) {
              <p class="text-red-400 mt-4">{{ error() }}</p>
            }
          </div>
        } @else if (!isAdmin()) {
          <!-- Not Authorized -->
          <div class="bg-white/10 backdrop-blur rounded-lg p-8 text-center">
            <h2 class="text-xl font-bold text-red-400 mb-4">Access Denied</h2>
            <p class="text-white/60 mb-4">
              Your account ({{ userEmail() }}) is not authorized for admin access.
            </p>
            <button
              (click)="logout()"
              class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Sign Out
            </button>
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
                  START GAME
                </button>
                <button
                  (click)="adminAction('stop_round')"
                  class="px-8 py-4 bg-red-500 text-white text-lg font-bold rounded-lg hover:bg-red-600 min-w-[150px]"
                  [disabled]="loading()"
                >
                  STOP GAME
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
                  (click)="adminAction('spawn_cookies', { count: 100 })"
                  class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  [disabled]="loading()"
                >
                  Spawn 100 Cookies
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
  error = signal<string | null>(null);
  loading = signal(false);
  status = signal<string | null>(null);
  spawnRate = 2;

  // Computed signals from SupabaseService
  isAuthenticated = computed(() => !!this.supabase.session());
  isAdmin = computed(() => this.supabase.isAdmin());
  user = computed(() => this.supabase.user());
  userName = computed(() => this.user()?.user_metadata?.['full_name'] || this.user()?.email || 'Admin');
  userEmail = computed(() => this.user()?.email || '');
  userAvatar = computed(() => this.user()?.user_metadata?.['avatar_url'] || null);
  userId = computed(() => this.user()?.id || 'admin');

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    // Auth state is managed by SupabaseService signals
  }

  async signInWithGitHub() {
    this.loading.set(true);
    this.error.set(null);

    try {
      await this.supabase.signInWithGitHub();
      // Redirect happens automatically via OAuth flow
    } catch (err) {
      console.error('GitHub sign in error:', err);
      this.error.set('Failed to sign in with GitHub. Please try again.');
      this.loading.set(false);
    }
  }

  async adminAction(action: string, params: any = {}) {
    console.log('adminAction called:', action, params);
    this.loading.set(true);
    this.status.set(null);

    try {
      console.log('Calling supabase.adminAction...');
      const result = await this.supabase.adminAction(action, params);
      console.log('adminAction result:', result);
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

  async logout() {
    try {
      await this.supabase.signOut();
      this.status.set(null);
      this.error.set(null);
    } catch (err) {
      console.error('Logout error:', err);
      this.error.set('Failed to sign out');
    }
  }
}
