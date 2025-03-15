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
    // 1) Create Supabase client WITHOUT forcing Authorization header
    //    i.e., don't do { Authorization: req.headers.get('Authorization')! }
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        // Optionally pass along all headers, or skip entirely
        // global: {
        //   headers: { ...req.headers },
        // },
      }
    )

    // 2) If you *truly* don't want any login checks, remove user checks entirely:
    //
    //    const { data: { user } } = await supabaseClient.auth.getUser()
    //    if (!user) {
    //      return new Response(
    //        JSON.stringify({ error: 'Unauthorized - not logged in' }),
    //        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    //      )
    //    }
    //
    //    // Similarly remove the 'is_admin' check if you don't want to restrict calls

    // --- Insert your code that processes CSV and inserts into the database ---

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
          JSON.stringify({
            error: 'Invalid CSV data - monthly_price must be a number and increment must be an integer',
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Insert a placeholder for created_by if you still want it:
      // created_by: user ? user.id : null,
      validRecords.push({
        module: record.module,
        feature: record.feature,
        unit: record.unit,
        monthly_price: monthlyPrice,
        increment: increment,
        release_stage: record.release_stage,
      })
    }

    // Before inserting new records, delete all existing ones
    const { error: deleteError } = await supabaseClient
      .from('pricing_modules')
      .delete()
      .neq('id', 0) // Delete all records

    if (deleteError) {
      console.error('Database deletion error:', deleteError)
      return new Response(
        JSON.stringify({ error: 'Failed to clear existing data', details: deleteError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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
