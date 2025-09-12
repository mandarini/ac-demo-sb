import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const roomId = 'main-room'

    // Get room configuration
    const { data: room, error: roomError } = await supabaseClient
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (roomError || !room) {
      throw new Error('Room not found')
    }

    // Only spawn if game is running
    if (room.status !== 'running') {
      return new Response(
        JSON.stringify({ message: 'Game not running' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate how many cookies to spawn based on spawn rate
    const spawnCount = Math.max(1, Math.round(room.spawn_rate_per_sec))
    const cookies = []
    const now = new Date()

    for (let i = 0; i < spawnCount; i++) {
      const isCat = Math.random() < 0.15 // 15% chance for cat
      const despawnTime = new Date(now.getTime() + room.ttl_seconds * 1000)

      cookies.push({
        room_id: roomId,
        type: isCat ? 'cat' : 'cookie',
        value: isCat ? 3 : 1,
        x_pct: Math.random() * 90 + 5, // 5% to 95%
        spawned_at: now.toISOString(),
        despawn_at: despawnTime.toISOString()
      })
    }

    const { error: insertError } = await supabaseClient
      .from('cookies')
      .insert(cookies)

    if (insertError) throw insertError

    // Clean up expired cookies periodically
    await supabaseClient
      .from('cookies')
      .delete()
      .eq('room_id', roomId)
      .lt('despawn_at', now.toISOString())

    return new Response(
      JSON.stringify({ 
        success: true, 
        spawned: spawnCount,
        room_status: room.status 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in spawn_cookies:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})