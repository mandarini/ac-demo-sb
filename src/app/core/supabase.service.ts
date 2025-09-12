import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = createClient<Database>(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  get client(): SupabaseClient<Database> {
    return this.supabase;
  }

  // Nickname assignment
  async assignNickname(deviceId: string) {
    const { data, error } = await this.supabase.functions.invoke('assign_nickname', {
      body: { deviceId }
    });
    if (error) throw error;
    return data;
  }

  // Claim cookie
  async claimCookie(cookieId: string, deviceId: string) {
    const { data, error } = await this.supabase.functions.invoke('claim_cookie', {
      body: { cookieId, deviceId }
    });
    if (error) throw error;
    return data;
  }

  // Admin functions
  async adminAction(action: string, params: any = {}) {
    const { data, error } = await this.supabase.functions.invoke('admin_actions', {
      body: { action, ...params }
    });
    if (error) throw error;
    return data;
  }

  // Realtime subscriptions
  subscribeToRoom(roomId: string, callback: (payload: any) => void): RealtimeChannel {
    return this.supabase
      .channel(`room_${roomId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`
      }, callback)
      .subscribe();
  }

  subscribeToCookies(roomId: string, callback: (payload: any) => void): RealtimeChannel {
    return this.supabase
      .channel(`cookies_${roomId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'cookies',
        filter: `room_id=eq.${roomId}`
      }, callback)
      .subscribe();
  }

  subscribeToScores(roomId: string, callback: (payload: any) => void): RealtimeChannel {
    return this.supabase
      .channel(`scores_${roomId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'scores',
        filter: `room_id=eq.${roomId}`
      }, callback)
      .subscribe();
  }

  subscribeToPresence(roomId: string, callbacks: {
    onJoin?: (key: string, current: any, new_: any) => void;
    onLeave?: (key: string, current: any, left: any) => void;
    onSync?: () => void;
  }): RealtimeChannel {
    const channel = this.supabase.channel(`presence_${roomId}`, {
      config: { presence: { key: roomId } }
    });

    if (callbacks.onJoin) channel.on('presence', { event: 'join' }, callbacks.onJoin);
    if (callbacks.onLeave) channel.on('presence', { event: 'leave' }, callbacks.onLeave);
    if (callbacks.onSync) channel.on('presence', { event: 'sync' }, callbacks.onSync);

    return channel.subscribe();
  }

  // Database queries
  async getRoomData(roomId: string) {
    const { data, error } = await this.supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getActiveCookies(roomId: string) {
    const { data, error } = await this.supabase
      .from('cookies')
      .select('*')
      .eq('room_id', roomId)
      .is('owner', null)
      .gt('despawn_at', new Date().toISOString());
    
    if (error) throw error;
    return data;
  }

  async getLeaderboard(roomId: string, type: 'round' | 'total') {
    const scoreField = type === 'round' ? 'score_round' : 'score_total';
    
    const { data, error } = await this.supabase
      .from('scores')
      .select(`
        *,
        players!inner (
          nick,
          color
        )
      `)
      .eq('room_id', roomId)
      .gt(scoreField, 0)
      .order(scoreField, { ascending: false })
      .order('players.nick', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async getPlayerCount(roomId: string) {
    const { count, error } = await this.supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId)
      .gte('last_seen_at', new Date(Date.now() - 60000).toISOString()); // Active in last minute
    
    if (error) throw error;
    return count || 0;
  }
}