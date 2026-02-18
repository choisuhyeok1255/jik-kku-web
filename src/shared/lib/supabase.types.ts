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
    PostgrestVersion: "14.1"
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
      game_logs: {
        Row: {
          away_team_id: number | null
          away_team_score: number | null
          companion: string | null
          created_at: string
          game_log_image: string | null
          home_team_id: number | null
          home_team_score: number | null
          id: number
          is_certify: boolean
          match_date: string | null
          mvp: string | null
          note: string | null
          stadium_id: number | null
          user_id: string
          weather: number | null
        }
        Insert: {
          away_team_id?: number | null
          away_team_score?: number | null
          companion?: string | null
          created_at?: string
          game_log_image?: string | null
          home_team_id?: number | null
          home_team_score?: number | null
          id?: number
          is_certify?: boolean
          match_date?: string | null
          mvp?: string | null
          note?: string | null
          stadium_id?: number | null
          user_id?: string
          weather?: number | null
        }
        Update: {
          away_team_id?: number | null
          away_team_score?: number | null
          companion?: string | null
          created_at?: string
          game_log_image?: string | null
          home_team_id?: number | null
          home_team_score?: number | null
          id?: number
          is_certify?: boolean
          match_date?: string | null
          mvp?: string | null
          note?: string | null
          stadium_id?: number | null
          user_id?: string
          weather?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_logs_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_logs_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_logs_stadium_id_fkey"
            columns: ["stadium_id"]
            isOneToOne: false
            referencedRelation: "stadium"
            referencedColumns: ["id"]
          },
        ]
      }
      share: {
        Row: {
          attendee_user_ids: Json | null
          content: string | null
          created_at: string | null
          deadline: string
          id: number
          max_attendees: number
          stadium_id: number | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          attendee_user_ids?: Json | null
          content?: string | null
          created_at?: string | null
          deadline: string
          id?: number
          max_attendees: number
          stadium_id?: number | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          attendee_user_ids?: Json | null
          content?: string | null
          created_at?: string | null
          deadline?: string
          id?: number
          max_attendees?: number
          stadium_id?: number | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "share_stadium_id_fkey"
            columns: ["stadium_id"]
            isOneToOne: false
            referencedRelation: "stadium"
            referencedColumns: ["id"]
          },
        ]
      }
      stadium: {
        Row: {
          home_order: number | null
          id: number
          league_level: Database["public"]["Enums"]["league_level_enum"] | null
          name: string | null
        }
        Insert: {
          home_order?: number | null
          id?: number
          league_level?: Database["public"]["Enums"]["league_level_enum"] | null
          name?: string | null
        }
        Update: {
          home_order?: number | null
          id?: number
          league_level?: Database["public"]["Enums"]["league_level_enum"] | null
          name?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          id: number
          short_team_name: string | null
          stadium_id: number | null
          team_logo: string | null
          team_name: string | null
        }
        Insert: {
          id?: number
          short_team_name?: string | null
          stadium_id?: number | null
          team_logo?: string | null
          team_name?: string | null
        }
        Update: {
          id?: number
          short_team_name?: string | null
          stadium_id?: number | null
          team_logo?: string | null
          team_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_stadium_id_fkey"
            columns: ["stadium_id"]
            isOneToOne: false
            referencedRelation: "stadium"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          nickname: string
          team_id: number | null
        }
        Insert: {
          created_at?: string
          id: string
          nickname: string
          team_id?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          nickname?: string
          team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_win_stats: {
        Row: {
          draws: number | null
          losses: number | null
          nickname: string | null
          total_games: number | null
          user_id: string | null
          win_rate: number | null
          wins: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_random_nickname: { Args: never; Returns: string }
    }
    Enums: {
      league_level_enum: "first" | "second"
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
    Enums: {
      league_level_enum: ["first", "second"],
    },
  },
} as const
