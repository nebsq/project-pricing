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
      pricing_modules: {
        Row: {
          created_at: string | null
          created_by: string | null
          feature: string
          id: string
          increment: number
          module: string
          monthly_price: number
          release_stage: string
          unit: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          feature: string
          id?: string
          increment: number
          module: string
          monthly_price: number
          release_stage: string
          unit: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          feature?: string
          id?: string
          increment?: number
          module?: string
          monthly_price?: number
          release_stage?: string
          unit?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          feature: string
          id: string
          module: string
          monthly_price: number
          pricing_module_id: string | null
          quantity: number
          quote_id: string
          unit: string
        }
        Insert: {
          feature: string
          id?: string
          module: string
          monthly_price: number
          pricing_module_id?: string | null
          quantity: number
          quote_id: string
          unit: string
        }
        Update: {
          feature?: string
          id?: string
          module?: string
          monthly_price?: number
          pricing_module_id?: string | null
          quantity?: number
          quote_id?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_pricing_module_id_fkey"
            columns: ["pricing_module_id"]
            isOneToOne: false
            referencedRelation: "pricing_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          ae_csm_name: string | null
          annual_discount: number | null
          applications: number | null
          champion_name: string | null
          created_at: string
          economic_buyer_name: string | null
          ftes: number | null
          id: string
          implementation_fee: number | null
          name: string
          profile_id: string
          recruitment_marketing_spend: number | null
          sector: string | null
          staffing_agency_spend: number | null
          updated_at: string
          vacancies: number | null
        }
        Insert: {
          ae_csm_name?: string | null
          annual_discount?: number | null
          applications?: number | null
          champion_name?: string | null
          created_at?: string
          economic_buyer_name?: string | null
          ftes?: number | null
          id?: string
          implementation_fee?: number | null
          name: string
          profile_id: string
          recruitment_marketing_spend?: number | null
          sector?: string | null
          staffing_agency_spend?: number | null
          updated_at?: string
          vacancies?: number | null
        }
        Update: {
          ae_csm_name?: string | null
          annual_discount?: number | null
          applications?: number | null
          champion_name?: string | null
          created_at?: string
          economic_buyer_name?: string | null
          ftes?: number | null
          id?: string
          implementation_fee?: number | null
          name?: string
          profile_id?: string
          recruitment_marketing_spend?: number | null
          sector?: string | null
          staffing_agency_spend?: number | null
          updated_at?: string
          vacancies?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
