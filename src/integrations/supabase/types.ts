export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_super_admin: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_super_admin?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_super_admin?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          approved: boolean | null
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          logo_url: string | null
          name: string
          sector: string | null
          website: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          name: string
          sector?: string | null
          website?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          name?: string
          sector?: string | null
          website?: string | null
        }
        Relationships: []
      }
      company_posts: {
        Row: {
          approved: boolean | null
          company_id: string
          content: string
          created_at: string | null
          id: string
          title: string
          type: string
          user_id: string
          collaboration_type: string | null
          related_companies: string[] | null
          impact_metrics: Json | null
          shared_wealth_contribution: string | null
        }
        Insert: {
          approved?: boolean | null
          company_id: string
          content: string
          created_at?: string | null
          id?: string
          title: string
          type: string
          user_id: string
          collaboration_type?: string | null
          related_companies?: string[] | null
          impact_metrics?: Json | null
          shared_wealth_contribution?: string | null
        }
        Update: {
          approved?: boolean | null
          company_id?: string
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          type?: string
          user_id?: string
          collaboration_type?: string | null
          related_companies?: string[] | null
          impact_metrics?: Json | null
          shared_wealth_contribution?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_posts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_users: {
        Row: {
          company_id: string
          id: string
          is_active: boolean | null
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      content_sections: {
        Row: {
          content: Json
          created_at: string
          id: string
          section_key: string
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          section_key: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          section_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      directors: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          position: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          position: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          position?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_updates: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published_at: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_updates_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          position: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          position?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          position?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      forum_topics: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: string;
          author_id: string;
          created_at: string;
          updated_at: string;
          view_count: number;
          reply_count: number;
          is_pinned: boolean;
          is_locked: boolean;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category: string;
          author_id: string;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
          reply_count?: number;
          is_pinned?: boolean;
          is_locked?: boolean;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: string;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
          reply_count?: number;
          is_pinned?: boolean;
          is_locked?: boolean;
          image_url?: string | null;
        };
        Relationships: [];
      };
      forum_replies: {
        Row: {
          id: string;
          topic_id: string;
          content: string;
          author_id: string;
          created_at: string;
          updated_at: string;
          is_solution: boolean;
        };
        Insert: {
          id?: string;
          topic_id: string;
          content: string;
          author_id: string;
          created_at?: string;
          updated_at?: string;
          is_solution?: boolean;
        };
        Update: {
          id?: string;
          topic_id?: string;
          content?: string;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
          is_solution?: boolean;
        };
        Relationships: [];
      };
      user_companies: {
        Row: {
          id: string;
          user_id: string;
          company_id: string | null;
          company_name: string;
          role: string;
          position: string;
          is_shared_wealth_licensed: boolean;
          license_number: string | null;
          license_date: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_id?: string | null;
          company_name: string;
          role: string;
          position: string;
          is_shared_wealth_licensed?: boolean;
          license_number?: string | null;
          license_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_id?: string | null;
          company_name?: string;
          role?: string;
          position?: string;
          is_shared_wealth_licensed?: boolean;
          license_number?: string | null;
          license_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      network_companies: {
        Row: {
          id: string;
          name: string;
          sector: string;
          country: string;
          description: string | null;
          employees: number | null;
          shared_value: string | null;
          impact_score: number | null;
          joined_date: string | null;
          website: string | null;
          logo: string | null;
          highlights: string[] | null;
          location: string | null;
          status: string;
          is_shared_wealth_licensed: boolean;
          license_number: string | null;
          license_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sector: string;
          country: string;
          description?: string | null;
          employees?: number | null;
          shared_value?: string | null;
          impact_score?: number | null;
          joined_date?: string | null;
          website?: string | null;
          logo?: string | null;
          highlights?: string[] | null;
          location?: string | null;
          status?: string;
          is_shared_wealth_licensed?: boolean;
          license_number?: string | null;
          license_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sector?: string;
          country?: string;
          description?: string | null;
          employees?: number | null;
          shared_value?: string | null;
          impact_score?: number | null;
          joined_date?: string | null;
          website?: string | null;
          logo?: string | null;
          highlights?: string[] | null;
          location?: string | null;
          status?: string;
          is_shared_wealth_licensed?: boolean;
          license_number?: string | null;
          license_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      company_applications: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          sector: string;
          country: string;
          description: string | null;
          website: string | null;
          employees: number | null;
          is_shared_wealth_licensed: boolean;
          license_number: string | null;
          license_date: string | null;
          applicant_role: string;
          applicant_position: string;
          status: string;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          sector: string;
          country: string;
          description?: string | null;
          website?: string | null;
          employees?: number | null;
          is_shared_wealth_licensed?: boolean;
          license_number?: string | null;
          license_date?: string | null;
          applicant_role: string;
          applicant_position: string;
          status?: string;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          sector?: string;
          country?: string;
          description?: string | null;
          website?: string | null;
          employees?: number | null;
          is_shared_wealth_licensed?: boolean;
          license_number?: string | null;
          license_date?: string | null;
          applicant_role?: string;
          applicant_position?: string;
          status?: string;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      collaboration_meetings: {
        Row: {
          id: string;
          company_id: string;
          meeting_title: string;
          meeting_date: string;
          participants: string[];
          meeting_notes: string | null;
          outcomes: string | null;
          impact_score: number | null;
          shared_wealth_contribution: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          meeting_title: string;
          meeting_date: string;
          participants: string[];
          meeting_notes?: string | null;
          outcomes?: string | null;
          impact_score?: number | null;
          shared_wealth_contribution?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          meeting_title?: string;
          meeting_date?: string;
          participants?: string[];
          meeting_notes?: string | null;
          outcomes?: string | null;
          impact_score?: number | null;
          shared_wealth_contribution?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collaboration_meetings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_meetings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ];
      };
      company_growth_metrics: {
        Row: {
          id: string;
          company_id: string;
          metric_date: string;
          metric_type: string;
          metric_value: number;
          metric_unit: string | null;
          notes: string | null;
          shared_wealth_impact: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          metric_date: string;
          metric_type: string;
          metric_value: number;
          metric_unit?: string | null;
          notes?: string | null;
          shared_wealth_impact?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          metric_date?: string;
          metric_type?: string;
          metric_value?: number;
          metric_unit?: string | null;
          notes?: string | null;
          shared_wealth_impact?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "company_growth_metrics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ];
      };
      network_connections: {
        Row: {
          id: string;
          source_company_id: string;
          target_company_id: string;
          connection_type: string;
          connection_date: string;
          description: string | null;
          outcome: string | null;
          value_generated: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_company_id: string;
          target_company_id: string;
          connection_type: string;
          connection_date: string;
          description?: string | null;
          outcome?: string | null;
          value_generated?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          source_company_id?: string;
          target_company_id?: string;
          connection_type?: string;
          connection_date?: string;
          description?: string | null;
          outcome?: string | null;
          value_generated?: string | null;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "network_connections_source_company_id_fkey"
            columns: ["source_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_connections_target_company_id_fkey"
            columns: ["target_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_connections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ];
      };
      activity_feed: {
        Row: {
          id: string;
          activity_type: string;
          company_id: string;
          user_id: string;
          title: string;
          description: string | null;
          metadata: Json | null;
          is_featured: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_type: string;
          company_id: string;
          user_id: string;
          title: string;
          description?: string | null;
          metadata?: Json | null;
          is_featured?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          activity_type?: string;
          company_id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          metadata?: Json | null;
          is_featured?: boolean | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activity_feed_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feed_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ];
      };
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      make_user_admin: {
        Args: { user_email: string; is_super?: boolean }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "admin" | "founding_member" | "media_manager" | "member"
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
  public: {
    Enums: {
      user_role: ["admin", "founding_member", "media_manager", "member"],
    },
  },
} as const
