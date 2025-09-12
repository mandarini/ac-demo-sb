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

    const { deviceId } = await req.json()
    const roomId = 'main-room'

    if (!deviceId) {
      throw new Error('Device ID is required')
    }

    // Check if device already has a reserved nickname
    const { data: existingReservation } = await supabaseClient
      .from('nickname_pool')
      .select('*')
      .eq('reserved_by_device_id', deviceId)
      .eq('is_reserved', true)
      .single()

    let nickname = null
    let playerId = null

    if (existingReservation) {
      nickname = existingReservation.nick
      
      // Get or create player record
      const { data: existingPlayer } = await supabaseClient
        .from('players')
        .select('*')
        .eq('device_id', deviceId)
        .eq('room_id', roomId)
        .single()

      if (existingPlayer) {
        playerId = existingPlayer.id
        
        // Update last seen
        await supabaseClient
          .from('players')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', playerId)
      } else {
        // Create new player record
        const { data: newPlayer, error: playerError } = await supabaseClient
          .from('players')
          .insert({
            room_id: roomId,
            nick: nickname,
            device_id: deviceId,
            color: generatePlayerColor(nickname)
          })
          .select()
          .single()

        if (playerError) throw playerError
        playerId = newPlayer.id
      }
    } else {
      // Reserve a new nickname
      const { data: availableNick, error: nickError } = await supabaseClient
        .from('nickname_pool')
        .select('*')
        .eq('is_reserved', false)
        .limit(1)
        .single()

      if (nickError || !availableNick) {
        throw new Error('No available nicknames')
      }

      // Reserve the nickname
      const { error: reserveError } = await supabaseClient
        .from('nickname_pool')
        .update({
          is_reserved: true,
          reserved_by_device_id: deviceId,
          reserved_at: new Date().toISOString()
        })
        .eq('id', availableNick.id)

      if (reserveError) throw reserveError

      nickname = availableNick.nick

      // Create player record
      const { data: newPlayer, error: playerError } = await supabaseClient
        .from('players')
        .insert({
          room_id: roomId,
          nick: nickname,
          device_id: deviceId,
          color: generatePlayerColor(nickname)
        })
        .select()
        .single()

      if (playerError) throw playerError
      playerId = newPlayer.id
    }

    // Initialize score record only for new players
    // Check if scores already exist for this player
    const { data: existingScores } = await supabaseClient
      .from('scores')
      .select('*')
      .eq('player_id', playerId)
      .single()

    if (!existingScores) {
      // Only create scores for truly new players
      const { error: scoreError } = await supabaseClient
        .from('scores')
        .insert({
          player_id: playerId,
          room_id: roomId,
          score_total: 0,
          score_round: 0
        })

      if (scoreError) {
        console.error('Score initialization error:', scoreError)
      }
    }

    return new Response(
      JSON.stringify({
        id: playerId,
        nick: nickname,
        color: generatePlayerColor(nickname),
        device_id: deviceId,
        room_id: roomId,
        joined_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in assign_nickname:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function generatePlayerColor(nickname: string): string {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ]
  
  // Simple hash of nickname to color
  let hash = 0
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}