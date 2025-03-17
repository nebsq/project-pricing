
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

export interface Quote {
  id: string;
  profile_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  implementation_fee: number | null;
  annual_discount: number | null;
  ae_csm_name?: string | null;
  champion_name?: string | null;
  economic_buyer_name?: string | null;
  ftes?: number | null;
  vacancies?: number | null;
  applications?: number | null;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  pricing_module_id: string | null;
  module: string;
  feature: string;
  unit: string;
  monthly_price: number;
  quantity: number;
}
