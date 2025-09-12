import { Injectable, signal, computed, effect } from '@angular/core';
import { SupabaseService } from '../core/supabase.service';
import { DeviceService } from '../core/device.service';
import { PresenceService } from '../core/presence.service';

export interface Room {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'intermission';
  round_no: number;
  round_started_at: string | null;
  round_ends_at: string | null;
  spawn_rate_per_sec: number;
  ttl_seconds: number;
}

export interface Cookie {
  id: string;
  room_id: string;
  type: 'cookie' | 'cat';
  value: number;
  x_pct: number;
  spawned_at: string;
  despawn_at: string;
  owner: string | null;
  claimed_at: string | null;
}

export interface Player {
  id: string;
  room_id: string;
  nick: string;
  color: string | null;
  device_id: string;
  joined_at: string;
  last_seen_at: string;
}

export interface Score {
  player_id: string;
  room_id: string;
  score_total: number;
  score_round: number;
  last_claim_at: string | null;
  players: {
    nick: string;
    color: string | null;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GameStore {
  // Core state signals
  private readonly roomId = 'main-room'; // Single room for the conference
  room = signal<Room | null>(null);
  currentPlayer = signal<Player | null>(null);
  cookies = signal<Cookie[]>([]);
  scores = signal<Score[]>([]);
  
  // Game state
  timeRemaining = signal<number>(0);
  isGameActive = computed(() => this.room()?.status === 'running');
  isIntermission = computed(() => this.room()?.status === 'intermission');
  
  // Leaderboards
  roundLeaderboard = computed(() => {
    return this.scores()
      .filter(s => s.score_round > 0)
      .sort((a, b) => {
        if (b.score_round !== a.score_round) {
          return b.score_round - a.score_round;
        }
        return a.players.nick.localeCompare(b.players.nick);
      })
      .slice(0, 10);
  });
  
  alltimeLeaderboard = computed(() => {
    return this.scores()
      .filter(s => s.score_total > 0)
      .sort((a, b) => {
        if (b.score_total !== a.score_total) {
          return b.score_total - a.score_total;
        }
        return a.players.nick.localeCompare(b.players.nick);
      })
      .slice(0, 10);
  });

  // Player's current scores
  myScores = computed(() => {
    const player = this.currentPlayer();
    if (!player) return null;
    
    return this.scores().find(s => s.player_id === player.id) || null;
  });

  myRoundRank = computed(() => {
    const myScore = this.myScores();
    if (!myScore) return null;
    
    const sortedScores = this.scores()
      .sort((a, b) => {
        if (b.score_round !== a.score_round) {
          return b.score_round - a.score_round;
        }
        return a.players.nick.localeCompare(b.players.nick);
      });
    
    return sortedScores.findIndex(s => s.player_id === myScore.player_id) + 1;
  });

  myAlltimeRank = computed(() => {
    const myScore = this.myScores();
    if (!myScore) return null;
    
    const sortedScores = this.scores()
      .sort((a, b) => {
        if (b.score_total !== a.score_total) {
          return b.score_total - a.score_total;
        }
        return a.players.nick.localeCompare(b.players.nick);
      });
    
    return sortedScores.findIndex(s => s.player_id === myScore.player_id) + 1;
  });

  // Active cookies (not claimed and not expired)
  activeCookies = computed(() => {
    const now = new Date().getTime();
    return this.cookies().filter(cookie => 
      !cookie.owner && 
      new Date(cookie.despawn_at).getTime() > now
    );
  });

  private subscriptions: any[] = [];
  private gameTimer: any = null;

  constructor(
    private supabase: SupabaseService,
    private deviceService: DeviceService,
    public presence: PresenceService
  ) {
    // Start timer for countdown
    this.startGameTimer();
  }

  // Initialize player and join game
  async joinGame(): Promise<void> {
    const deviceId = this.deviceService.getDeviceId();
    
    try {
      // Assign nickname and create player
      const playerData = await this.supabase.assignNickname(deviceId);
      this.currentPlayer.set(playerData);

      // Join presence
      this.presence.joinPresence(this.roomId, {
        nick: playerData.nick,
        color: playerData.color,
        device_id: deviceId,
        last_seen: new Date().toISOString()
      });

      // Start subscriptions
      await this.startSubscriptions();
      
    } catch (error) {
      console.error('Failed to join game:', error);
      throw error;
    }
  }

  // Start realtime subscriptions
  private async startSubscriptions(): Promise<void> {
    // Clean up existing subscriptions
    this.cleanupSubscriptions();

    // Load initial data first
    await this.loadInitialData();

    // Subscribe to room changes
    const roomSub = this.supabase.subscribeToRoom(this.roomId, (payload) => {
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        this.room.set(payload.new as Room);
      }
    });
    this.subscriptions.push(roomSub);

    // Subscribe to cookies
    const cookiesSub = this.supabase.subscribeToCookies(this.roomId, (payload) => {
      if (payload.eventType === 'INSERT') {
        this.cookies.update(cookies => [...cookies, payload.new as Cookie]);
      } else if (payload.eventType === 'UPDATE') {
        this.cookies.update(cookies => 
          cookies.map(cookie => 
            cookie.id === payload.new.id ? payload.new as Cookie : cookie
          )
        );
      } else if (payload.eventType === 'DELETE') {
        this.cookies.update(cookies => 
          cookies.filter(cookie => cookie.id !== payload.old.id)
        );
      }
    });
    this.subscriptions.push(cookiesSub);

    // Subscribe to scores
    const scoresSub = this.supabase.subscribeToScores(this.roomId, (payload) => {
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        this.scores.update(scores => {
          const existing = scores.findIndex(s => s.player_id === payload.new.player_id);
          if (existing >= 0) {
            scores[existing] = payload.new as Score;
          } else {
            scores.push(payload.new as Score);
          }
          return [...scores];
        });
      }
    });
    this.subscriptions.push(scoresSub);

    // Load initial data
    await this.loadInitialData();
  }

  // Load initial game data
  private async loadInitialData(): Promise<void> {
    try {
      // Load room data
      const roomData = await this.supabase.getRoomData(this.roomId);
      this.room.set(roomData);

      // Load active cookies
      const cookiesData = await this.supabase.getActiveCookies(this.roomId);
      this.cookies.set(cookiesData);

      // Load leaderboard
      const scoresData = await this.supabase.getLeaderboard(this.roomId, 'total');
      this.scores.set(scoresData);

    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }

  // Claim a cookie
  async claimCookie(cookieId: string): Promise<{ success: boolean; message?: string }> {
    const deviceId = this.deviceService.getDeviceId();
    
    try {
      const result = await this.supabase.claimCookie(cookieId, deviceId);
      
      if (result.ok) {
        // Optimistically remove cookie from UI
        this.cookies.update(cookies => 
          cookies.map(cookie => 
            cookie.id === cookieId 
              ? { ...cookie, owner: this.currentPlayer()?.id || 'claimed', claimed_at: new Date().toISOString() }
              : cookie
          )
        );
        
        return { success: true };
      } else {
        return { success: false, message: result.reason };
      }
    } catch (error) {
      console.error('Failed to claim cookie:', error);
      return { success: false, message: 'Network error' };
    }
  }

  // Timer for countdown
  private startGameTimer(): void {
    this.gameTimer = setInterval(() => {
      const room = this.room();
      if (room?.round_ends_at) {
        const now = new Date().getTime();
        const endTime = new Date(room.round_ends_at).getTime();
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
        this.timeRemaining.set(remaining);
      } else {
        this.timeRemaining.set(0);
      }
    }, 1000);
  }

  // Cleanup
  private cleanupSubscriptions(): void {
    this.subscriptions.forEach(sub => {
      if (sub?.unsubscribe) {
        sub.unsubscribe();
      }
    });
    this.subscriptions = [];
  }

  destroy(): void {
    this.cleanupSubscriptions();
    this.presence.leavePresence();
    
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
  }
}