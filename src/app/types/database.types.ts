export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string;
          name: string;
          status: 'idle' | 'running' | 'intermission';
          round_no: number;
          round_started_at: string | null;
          round_ends_at: string | null;
          spawn_rate_per_sec: number;
          ttl_seconds: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          status?: 'idle' | 'running' | 'intermission';
          round_no?: number;
          round_started_at?: string | null;
          round_ends_at?: string | null;
          spawn_rate_per_sec?: number;
          ttl_seconds?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          status?: 'idle' | 'running' | 'intermission';
          round_no?: number;
          round_started_at?: string | null;
          round_ends_at?: string | null;
          spawn_rate_per_sec?: number;
          ttl_seconds?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      nickname_pool: {
        Row: {
          id: string;
          nick: string;
          is_reserved: boolean;
          reserved_by_device_id: string | null;
          reserved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nick: string;
          is_reserved?: boolean;
          reserved_by_device_id?: string | null;
          reserved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nick?: string;
          is_reserved?: boolean;
          reserved_by_device_id?: string | null;
          reserved_at?: string | null;
          created_at?: string;
        };
      };
      players: {
        Row: {
          id: string;
          room_id: string;
          nick: string;
          color: string | null;
          device_id: string;
          joined_at: string;
          last_seen_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          nick: string;
          color?: string | null;
          device_id: string;
          joined_at?: string;
          last_seen_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          nick?: string;
          color?: string | null;
          device_id?: string;
          joined_at?: string;
          last_seen_at?: string;
        };
      };
      cookies: {
        Row: {
          id: string;
          room_id: string;
          type: 'cookie' | 'cat';
          value: number;
          x_pct: number;
          y_pct: number;
          spawned_at: string;
          despawn_at: string;
          owner: string | null;
          claimed_at: string | null;
        };
        Insert: {
          id?: string;
          room_id: string;
          type: 'cookie' | 'cat';
          value: number;
          x_pct: number;
          y_pct: number;
          spawned_at?: string;
          despawn_at: string;
          owner?: string | null;
          claimed_at?: string | null;
        };
        Update: {
          id?: string;
          room_id?: string;
          type?: 'cookie' | 'cat';
          value?: number;
          x_pct?: number;
          y_pct?: number;
          spawned_at?: string;
          despawn_at?: string;
          owner?: string | null;
          claimed_at?: string | null;
        };
      };
      scores: {
        Row: {
          player_id: string;
          room_id: string;
          score_total: number;
          score_round: number;
          last_claim_at: string | null;
          updated_at: string;
        };
        Insert: {
          player_id: string;
          room_id: string;
          score_total?: number;
          score_round?: number;
          last_claim_at?: string | null;
          updated_at?: string;
        };
        Update: {
          player_id?: string;
          room_id?: string;
          score_total?: number;
          score_round?: number;
          last_claim_at?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}