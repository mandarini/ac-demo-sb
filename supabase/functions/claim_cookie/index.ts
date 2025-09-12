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

    const { cookieId, deviceId } = await req.json()
    const roomId = 'main-room'

    if (!cookieId || !deviceId) {
      throw new Error('Cookie ID and Device ID are required')
    }

    // Get player by device ID
    const { data: player, error: playerError } = await supabaseClient
      .from('players')
      .select('*')
      .eq('device_id', deviceId)
      .eq('room_id', roomId)
      .single()

    if (playerError || !player) {
      return new Response(
        JSON.stringify({ ok: false, reason: 'Player not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check rate limiting
    const { data: currentScores } = await supabaseClient
      .from('scores')
      .select('last_claim_at')
      .eq('player_id', player.id)
      .single()

    if (currentScores?.last_claim_at) {
      const lastClaim = new Date(currentScores.last_claim_at).getTime()
      const now = new Date().getTime()
      const timeDiff = now - lastClaim

      if (timeDiff < 120) { // 120ms rate limit
        return new Response(
          JSON.stringify({ ok: false, reason: 'Rate limited' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Attempt to claim cookie atomically
    const { data: cookie, error: claimError } = await supabaseClient
      .from('cookies')
      .update({
        owner: player.id,
        claimed_at: new Date().toISOString()
      })
      .eq('id', cookieId)
      .eq('room_id', roomId)
      .is('owner', null)
      .gt('despawn_at', new Date().toISOString())
      .select()
      .single()

    if (claimError || !cookie) {
      return new Response(
        JSON.stringify({ ok: false, reason: 'Cookie already claimed or expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update scores
    const { data: updatedScores, error: scoreError } = await supabaseClient
      .from('scores')
      .upsert({
        player_id: player.id,
        room_id: roomId,
        score_total: (currentScores?.score_total || 0) + cookie.value,
        score_round: (currentScores?.score_round || 0) + cookie.value,
        last_claim_at: new Date().toISOString()
      }, {
        onConflict: 'player_id'
      })
      .select()
      .single()

    if (scoreError) {
      console.error('Score update error:', scoreError)
      return new Response(
        JSON.stringify({ ok: false, reason: 'Score update failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        ok: true,
        value: cookie.value,
        newTotals: {
          score_round: updatedScores.score_round,
          score_total: updatedScores.score_total
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in claim_cookie:', error)
    return new Response(
      JSON.stringify({ ok: false, reason: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})