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

    const { action, ...params } = await req.json()
    const roomId = 'main-room'

    switch (action) {
      case 'start_round':
        return await startRound(supabaseClient, roomId)
      
      case 'stop_round':
        return await stopRound(supabaseClient, roomId)
      
      case 'start_intermission':
        return await startIntermission(supabaseClient, roomId)
      
      case 'update_spawn_rate':
        return await updateSpawnRate(supabaseClient, roomId, params.rate)
      
      case 'spawn_cookies':
        return await spawnCookies(supabaseClient, roomId, params.count || 10)
      
      case 'clear_cookies':
        return await clearCookies(supabaseClient, roomId)
      
      case 'reset_round_scores':
        return await resetRoundScores(supabaseClient, roomId)
      
      case 'reset_all_scores':
        return await resetAllScores(supabaseClient, roomId)
      
      default:
        throw new Error(`Unknown action: ${action}`)
    }

  } catch (error) {
    console.error('Error in admin_actions:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function startRound(supabaseClient: any, roomId: string) {
  const { data: room } = await supabaseClient
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  const newRoundNo = (room?.round_no || 0) + 1
  const startTime = new Date()
  const endTime = new Date(startTime.getTime() + 30 * 1000) // 30 seconds

  const { error } = await supabaseClient
    .from('rooms')
    .update({
      status: 'running',
      round_no: newRoundNo,
      round_started_at: startTime.toISOString(),
      round_ends_at: endTime.toISOString()
    })
    .eq('id', roomId)

  if (error) throw error

  // Reset round scores for new round
  if (newRoundNo > 1) {
    await supabaseClient
      .from('scores')
      .update({ score_round: 0 })
      .eq('room_id', roomId)
  }

  return new Response(
    JSON.stringify({ success: true, round: newRoundNo }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function stopRound(supabaseClient: any, roomId: string) {
  const { error } = await supabaseClient
    .from('rooms')
    .update({
      status: 'idle',
      round_ends_at: null
    })
    .eq('id', roomId)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function startIntermission(supabaseClient: any, roomId: string) {
  const startTime = new Date()
  const endTime = new Date(startTime.getTime() + 10 * 1000) // 10 seconds

  const { error } = await supabaseClient
    .from('rooms')
    .update({
      status: 'intermission',
      round_started_at: startTime.toISOString(),
      round_ends_at: endTime.toISOString()
    })
    .eq('id', roomId)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateSpawnRate(supabaseClient: any, roomId: string, rate: number) {
  const { error } = await supabaseClient
    .from('rooms')
    .update({ spawn_rate_per_sec: rate })
    .eq('id', roomId)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true, rate }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function spawnCookies(supabaseClient: any, roomId: string, count: number) {
  const cookies = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const isCat = Math.random() < 0.15 // 15% chance for cat
    const despawnTime = new Date(now.getTime() + 8000) // 8 seconds to fall

    cookies.push({
      room_id: roomId,
      type: isCat ? 'cat' : 'cookie',
      value: isCat ? 3 : 1,
      x_pct: Math.random() * 90 + 5, // 5% to 95%
      spawned_at: now.toISOString(),
      despawn_at: despawnTime.toISOString()
    })
  }

  const { error } = await supabaseClient
    .from('cookies')
    .insert(cookies)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true, spawned: count }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function clearCookies(supabaseClient: any, roomId: string) {
  const { error } = await supabaseClient
    .from('cookies')
    .delete()
    .eq('room_id', roomId)
    .is('owner', null)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function resetRoundScores(supabaseClient: any, roomId: string) {
  const { error } = await supabaseClient
    .from('scores')
    .update({ score_round: 0 })
    .eq('room_id', roomId)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function resetAllScores(supabaseClient: any, roomId: string) {
  const { error } = await supabaseClient
    .from('scores')
    .update({ 
      score_round: 0,
      score_total: 0,
      last_claim_at: null
    })
    .eq('room_id', roomId)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}