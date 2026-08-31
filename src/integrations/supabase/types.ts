export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          number: string;
          title: string;
          type: string;
          role: string;
          year: string | null;
          status: string | null;
          category: "FILMMAKING" | "VFX / CG" | "EDITING" | "DESIGN" | "CONTENT";
          description: string;
          process: string[];
          visuals: string;
          image: string;
          poster_image: string | null;
          has_video: boolean;
          video_id: string | null;
          show_before_after: boolean;
          before_image: string | null;
          after_image: string | null;
          full_credits: string | null;
          gallery_images: string[] | null;
          client: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          number: string;
          title: string;
          type: string;
          role: string;
          year?: string | null;
          status?: string | null;
          category: "FILMMAKING" | "VFX / CG" | "EDITING" | "DESIGN" | "CONTENT";
          description: string;
          process: string[];
          visuals: string;
          image: string;
          poster_image?: string | null;
          has_video?: boolean;
          video_id?: string | null;
          show_before_after?: boolean;
          before_image?: string | null;
          after_image?: string | null;
          full_credits?: string | null;
          gallery_images?: string[] | null;
          client?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      admin_sessions: {
        Row: {
          id: string;
          token: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          token: string;
          expires_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_sessions"]["Insert"]>;
      };
      editing_projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          project_number: string;
          category: "EDITING";
          client_name: string | null;
          year: string | null;
          role: string;
          description: string;
          synopsis: string | null;
          logline: string | null;
          thumbnail_url: string | null;
          hero_image_url: string | null;
          tags: string[] | null;
          tools: string[] | null;
          editing_breakdown: Json | null;
          credits: string | null;
          status: string | null;
          featured: boolean;
          published: boolean;
          display_order: number;
          notice: string | null;
          section_visibility: Json | null;
          seo_settings: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          project_number?: string;
          category?: "EDITING";
          client_name?: string | null;
          year?: string | null;
          role: string;
          description: string;
          synopsis?: string | null;
          logline?: string | null;
          thumbnail_url?: string | null;
          hero_image_url?: string | null;
          tags?: string[] | null;
          tools?: string[] | null;
          editing_breakdown?: Json | null;
          credits?: string | null;
          status?: string | null;
          featured?: boolean;
          published?: boolean;
          display_order?: number;
          notice?: string | null;
          section_visibility?: Json | null;
          seo_settings?: Json | null;
        };
        Update: Partial<Database["public"]["Tables"]["editing_projects"]["Insert"]>;
      };
      editing_project_videos: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          video_number: string;
          drive_url: string | null;
          drive_file_id: string;
          thumbnail_url: string | null;
          description: string | null;
          duration: string | null;
          published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          video_number?: string;
          drive_url?: string | null;
          drive_file_id: string;
          thumbnail_url?: string | null;
          description?: string | null;
          duration?: string | null;
          published?: boolean;
          display_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["editing_project_videos"]["Insert"]>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
