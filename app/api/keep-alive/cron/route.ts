import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * Cron Keep-Alive Endpoint
 * This endpoint is designed to be called by external cron services
 * It performs multiple operations to ensure Supabase stays active
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key-change-this'
    
    // Optional: Verify cron secret for security
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const results = {
      keepAliveQuery: null as any,
      userProfileQuery: null as any,
      settingsQuery: null as any,
      timestamp: new Date().toISOString()
    }

    // 1. Query keep_alive table
    try {
      const { data: keepAliveData, error: keepAliveError } = await supabase
        .from('keep_alive')
        .select('*')
        .order('last_ping', { ascending: false })
        .limit(1)
        .single()

      if (!keepAliveError && keepAliveData) {
        // Update ping
        await supabase
          .from('keep_alive')
          .update({
            last_ping: new Date().toISOString(),
            ping_count: (keepAliveData.ping_count || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', keepAliveData.id)
        
        results.keepAliveQuery = { success: true, data: keepAliveData }
      }
    } catch (e) {
      results.keepAliveQuery = { success: false, error: String(e) }
    }

    // 2. Query user_profile (lightweight query)
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profile')
        .select('id')
        .limit(1)
      
      results.userProfileQuery = { 
        success: !profileError, 
        data: profileData,
        error: profileError?.message 
      }
    } catch (e) {
      results.userProfileQuery = { success: false, error: String(e) }
    }

    // 3. Query site_settings (lightweight query)
    try {
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
      
      results.settingsQuery = { 
        success: !settingsError, 
        data: settingsData,
        error: settingsError?.message 
      }
    } catch (e) {
      results.settingsQuery = { success: false, error: String(e) }
    }

    return NextResponse.json({
      success: true,
      message: 'Cron keep-alive executed successfully',
      results
    }, { status: 200 })

  } catch (error) {
    console.error('Cron keep-alive error:', error)
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

