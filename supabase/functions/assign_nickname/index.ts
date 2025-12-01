import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NicknameWord {
  word: string
  position: number
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

    // Check if device already has a player record
    const { data: existingPlayer } = await supabaseClient
      .from('players')
      .select('*')
      .eq('device_id', deviceId)
      .eq('room_id', roomId)
      .single()

    if (existingPlayer) {
      // Update last seen and return existing player
      await supabaseClient
        .from('players')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', existingPlayer.id)

      return new Response(
        JSON.stringify({
          id: existingPlayer.id,
          nick: existingPlayer.nick,
          color: existingPlayer.color,
          device_id: deviceId,
          room_id: roomId,
          joined_at: existingPlayer.joined_at,
          last_seen_at: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch all nickname words
    const { data: words, error: wordsError } = await supabaseClient
      .from('nickname_words')
      .select('word, position')

    if (wordsError || !words || words.length === 0) {
      throw new Error('Failed to fetch nickname words')
    }

    // Group words by position
    const wordsByPosition: Record<number, string[]> = { 1: [], 2: [], 3: [] }
    for (const w of words as NicknameWord[]) {
      wordsByPosition[w.position]?.push(w.word)
    }

    // Generate unique nickname with retry logic
    const maxRetries = 10
    let nickname: string | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const word1 = wordsByPosition[1][Math.floor(Math.random() * wordsByPosition[1].length)]
      const word2 = wordsByPosition[2][Math.floor(Math.random() * wordsByPosition[2].length)]
      const word3 = wordsByPosition[3][Math.floor(Math.random() * wordsByPosition[3].length)]
      const candidate = `${word1}${word2}${word3}`

      // Check if nickname already exists
      const { data: existing } = await supabaseClient
        .from('players')
        .select('id')
        .eq('nick', candidate)
        .single()

      if (!existing) {
        nickname = candidate
        break
      }
    }

    // Fallback: append random number if all retries failed
    if (!nickname) {
      const word1 = wordsByPosition[1][Math.floor(Math.random() * wordsByPosition[1].length)]
      const word2 = wordsByPosition[2][Math.floor(Math.random() * wordsByPosition[2].length)]
      const word3 = wordsByPosition[3][Math.floor(Math.random() * wordsByPosition[3].length)]
      const randomNum = Math.floor(Math.random() * 100)
      nickname = `${word1}${word2}${word3}${randomNum}`
    }

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

    // Initialize score record
    const { error: scoreError } = await supabaseClient
      .from('scores')
      .insert({
        player_id: newPlayer.id,
        room_id: roomId,
        score_total: 0,
        score_round: 0
      })

    if (scoreError) {
      console.error('Score initialization error:', scoreError)
    }

    return new Response(
      JSON.stringify({
        id: newPlayer.id,
        nick: nickname,
        color: generatePlayerColor(nickname),
        device_id: deviceId,
        room_id: roomId,
        joined_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
