export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_allowlist: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      cookies: {
        Row: {
          claimed_at: string | null
          despawn_at: string
          id: string
          owner: string | null
          room_id: string
          spawned_at: string | null
          type: string
          value: number
          x_pct: number
          y_pct: number
        }
        Insert: {
          claimed_at?: string | null
          despawn_at: string
          id?: string
          owner?: string | null
          room_id: string
          spawned_at?: string | null
          type: string
          value: number
          x_pct: number
          y_pct?: number
        }
        Update: {
          claimed_at?: string | null
          despawn_at?: string
          id?: string
          owner?: string | null
          room_id?: string
          spawned_at?: string | null
          type?: string
          value?: number
          x_pct?: number
          y_pct?: number
        }
        Relationships: [
          {
            foreignKeyName: "cookies_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cookies_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      nickname_words: {
        Row: {
          created_at: string | null
          id: string
          position: number
          word: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          position: number
          word: string
        }
        Update: {
          created_at?: string | null
          id?: string
          position?: number
          word?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          color: string | null
          device_id: string
          id: string
          joined_at: string | null
          last_seen_at: string | null
          nick: string
          room_id: string
        }
        Insert: {
          color?: string | null
          device_id: string
          id?: string
          joined_at?: string | null
          last_seen_at?: string | null
          nick: string
          room_id: string
        }
        Update: {
          color?: string | null
          device_id?: string
          id?: string
          joined_at?: string | null
          last_seen_at?: string | null
          nick?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string
          request_count: number
          window_start: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address: string
          request_count?: number
          window_start?: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          created_at: string | null
          id: string
          max_players: number | null
          name: string
          round_ends_at: string | null
          round_no: number
          round_started_at: string | null
          spawn_rate_per_sec: number
          status: string
          ttl_seconds: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          max_players?: number | null
          name: string
          round_ends_at?: string | null
          round_no?: number
          round_started_at?: string | null
          spawn_rate_per_sec?: number
          status?: string
          ttl_seconds?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_players?: number | null
          name?: string
          round_ends_at?: string | null
          round_no?: number
          round_started_at?: string | null
          spawn_rate_per_sec?: number
          status?: string
          ttl_seconds?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      scores: {
        Row: {
          last_claim_at: string | null
          player_id: string
          room_id: string
          score_round: number
          score_total: number
          updated_at: string | null
        }
        Insert: {
          last_claim_at?: string | null
          player_id: string
          room_id: string
          score_round?: number
          score_total?: number
          updated_at?: string | null
        }
        Update: {
          last_claim_at?: string | null
          player_id?: string
          room_id?: string
          score_round?: number
          score_total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scores_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_action: string
          p_ip_address: string
          p_max_requests?: number
          p_window_seconds?: number
        }
        Returns: boolean
      }
      cleanup_rate_limits: { Args: never; Returns: undefined }
      is_admin: { Args: { user_email: string }; Returns: boolean }
      spawn_cookies_batch: { Args: never; Returns: undefined }
      trigger_spawn: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
