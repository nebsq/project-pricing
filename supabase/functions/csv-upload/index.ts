
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { parse } from 'https://esm.sh/csv-parse@5.5.0/sync'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // Get user data to verify admin status
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - not logged in' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is an admin
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profileData || !profileData.is_admin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body as text (CSV content)
    const csvText = await req.text()
    if (!csvText || csvText.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Empty CSV file' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse CSV
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    // Validate each record
    const requiredColumns = ['module', 'feature', 'unit', 'monthly_price', 'increment', 'release_stage']
    const validRecords = []

    for (const record of records) {
      // Check if all required columns exist
      const hasAllColumns = requiredColumns.every(col => col in record)
      if (!hasAllColumns) {
        return new Response(
          JSON.stringify({ error: 'Invalid CSV format - missing required columns' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Validate data types
      const monthlyPrice = parseFloat(record.monthly_price)
      const increment = parseInt(record.increment)

      if (isNaN(monthlyPrice) || isNaN(increment)) {
        return new Response(
          JSON.stringify({ error: 'Invalid CSV data - monthly_price must be a number and increment must be an integer' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Add validated record
      validRecords.push({
        module: record.module,
        feature: record.feature,
        unit: record.unit,
        monthly_price: monthlyPrice,
        increment: increment,
        release_stage: record.release_stage,
        created_by: user.id
      })
    }

    // Insert data into Supabase
    const { error: insertError } = await supabaseClient
      .from('pricing_modules')
      .insert(validRecords)

    if (insertError) {
      console.error('Database insertion error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Database insertion failed', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Data inserted successfully', count: validRecords.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
