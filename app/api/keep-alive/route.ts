import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * Keep-Alive API Endpoint
 * This endpoint queries the keep_alive table to prevent Supabase from going inactive
 * Can be called by cron jobs, monitoring services, or scheduled tasks
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Query the keep_alive table
    const { data, error } = await supabase
      .from('keep_alive')
      .select('*')
      .order('last_ping', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Keep-alive query error:', error)
      
      // Try to create the table if it doesn't exist (fallback)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Table may not exist. Please run the SQL migration first.',
          message: 'Run the SQL in db/keep-alive.sql on your Supabase database'
        },
        { status: 500 }
      )
    }

    // Update the ping timestamp
    const updateResult = await supabase
      .rpc('update_keep_alive_ping')

    if (updateResult.error) {
      // Fallback: manual update if RPC doesn't work
      await supabase
        .from('keep_alive')
        .update({
          last_ping: new Date().toISOString(),
          ping_count: (data?.ping_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', data?.id || 1)
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase keep-alive ping successful',
      data: {
        id: data?.id,
        status: data?.status,
        last_ping: data?.last_ping,
        ping_count: data?.ping_count,
        timestamp: new Date().toISOString()
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Keep-alive endpoint error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST endpoint to manually trigger keep-alive
 */
export async function POST(request: NextRequest) {
  return GET(request)
}

