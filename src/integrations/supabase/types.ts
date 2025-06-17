export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bus_routes: {
        Row: {
          city_id: string
          color: string | null
          created_at: string
          id: string
          is_active: boolean | null
          operator: string | null
          route_name: string
          route_number: string
        }
        Insert: {
          city_id: string
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          operator?: string | null
          route_name: string
          route_number: string
        }
        Update: {
          city_id?: string
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          operator?: string | null
          route_name?: string
          route_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "bus_routes_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      bus_stops: {
        Row: {
          city_id: string
          college_id: string | null
          created_at: string
          distance_to_college_meters: number | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          stop_type: string | null
        }
        Insert: {
          city_id: string
          college_id?: string | null
          created_at?: string
          distance_to_college_meters?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          stop_type?: string | null
        }
        Update: {
          city_id?: string
          college_id?: string | null
          created_at?: string
          distance_to_college_meters?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          stop_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bus_stops_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bus_stops_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country: string | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          state: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          state?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          state?: string | null
        }
        Relationships: []
      }
      colleges: {
        Row: {
          address: string
          city_id: string
          college_type: string | null
          contact_phone: string | null
          created_at: string
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          website: string | null
        }
        Insert: {
          address: string
          city_id: string
          college_type?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          website?: string | null
        }
        Update: {
          address?: string
          city_id?: string
          college_type?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "colleges_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          notification_preferences: Json | null
          phone: string | null
          selected_city_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          notification_preferences?: Json | null
          phone?: string | null
          selected_city_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          notification_preferences?: Json | null
          phone?: string | null
          selected_city_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_selected_city_id_fkey"
            columns: ["selected_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      rides: {
        Row: {
          created_at: string
          destination_stop_id: string | null
          end_time: string | null
          id: string
          route_id: string | null
          source_stop_id: string | null
          start_time: string | null
          status: string | null
          ticket_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          destination_stop_id?: string | null
          end_time?: string | null
          id?: string
          route_id?: string | null
          source_stop_id?: string | null
          start_time?: string | null
          status?: string | null
          ticket_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          destination_stop_id?: string | null
          end_time?: string | null
          id?: string
          route_id?: string | null
          source_stop_id?: string | null
          start_time?: string | null
          status?: string | null
          ticket_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rides_destination_stop_id_fkey"
            columns: ["destination_stop_id"]
            isOneToOne: false
            referencedRelation: "bus_stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rides_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "bus_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rides_source_stop_id_fkey"
            columns: ["source_stop_id"]
            isOneToOne: false
            referencedRelation: "bus_stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rides_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      route_stops: {
        Row: {
          estimated_time_minutes: number | null
          id: string
          route_id: string | null
          stop_id: string | null
          stop_sequence: number
        }
        Insert: {
          estimated_time_minutes?: number | null
          id?: string
          route_id?: string | null
          stop_id?: string | null
          stop_sequence: number
        }
        Update: {
          estimated_time_minutes?: number | null
          id?: string
          route_id?: string | null
          stop_id?: string | null
          stop_sequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "bus_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_stops_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "bus_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          activated_at: string | null
          created_at: string
          id: string
          qr_code: string | null
          route_id: string | null
          status: string | null
          ticket_type: string | null
          user_id: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          activated_at?: string | null
          created_at?: string
          id?: string
          qr_code?: string | null
          route_id?: string | null
          status?: string | null
          ticket_type?: string | null
          user_id: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          activated_at?: string | null
          created_at?: string
          id?: string
          qr_code?: string | null
          route_id?: string | null
          status?: string | null
          ticket_type?: string | null
          user_id?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "bus_routes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
