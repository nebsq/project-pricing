
// Custom database types for our application
// These types work with the existing Supabase types

export interface Profile {
  id: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingModule {
  id: string;
  module: string;
  feature: string;
  unit: string;
  monthly_price: number;
  increment: number;
  release_stage: string;
  created_at: string;
  created_by: string | null;
}
