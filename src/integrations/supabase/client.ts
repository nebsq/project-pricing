// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cfdsslfvwyarxbbiioaz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZHNzbGZ2d3lhcnhiYmlpb2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDI0NTEsImV4cCI6MjA1NzQ3ODQ1MX0.Ej-Avl5YXxrMS_41pwjQIJUUlW8uNM4rUGTbFjfVq68";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);