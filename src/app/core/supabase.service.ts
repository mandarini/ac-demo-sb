import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient<Database>;
  private adminPassword: string | null = null;

  constructor() {
    this.supabase = createClient<Database>(
      environment.supabaseUrl,
      environment.supabaseKey
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

  // Admin authentication
  async authenticateAdmin(password: string): Promise<{ authenticated: boolean; error?: string }> {
    const { data, error } = await this.supabase.functions.invoke('admin-auth', {
      body: { password }
    });
    if (error) throw error;
    if (data?.authenticated) {
      this.adminPassword = password; // Store for subsequent calls
    }
    return data;
  }

  // Clear admin session
  clearAdminSession() {
    this.adminPassword = null;
  }

  // Admin functions
  async adminAction(action: string, params: any = {}) {
    const { data, error } = await this.supabase.functions.invoke('admin_actions', {
      body: { action, password: this.adminPassword, ...params }
    });
    if (error) throw error;
    return data;
  }

  // Realtime subscriptions
  subscribeToRoom(roomId: string, callback: (payload: any) => void): Promise<RealtimeChannel> {
    console.log('🔔 Setting up room subscription for:', roomId);
    return new Promise((resolve) => {
      const channel = this.supabase
        .channel(`room_${roomId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`
        }, (payload) => {
          console.log('🔔 Raw room payload received:', payload);
          callback(payload);
        })
        .subscribe((status) => {
          console.log('🔔 Room subscription status:', status);
          if (status === 'SUBSCRIBED') {
            resolve(channel);
          }
        });
    });
  }

  subscribeToCookies(roomId: string, callback: (payload: any) => void): Promise<RealtimeChannel> {
    console.log('🔔 Setting up cookies subscription for:', roomId);
    return new Promise((resolve) => {
      const channel = this.supabase
        .channel(`cookies_${roomId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'cookies',
          filter: `room_id=eq.${roomId}`
        }, (payload) => {
          console.log('🔔 Raw cookie payload received:', payload);
          callback(payload);
        })
        .subscribe((status) => {
          console.log('🔔 Cookies subscription status:', status);
          if (status === 'SUBSCRIBED') {
            resolve(channel);
          }
        });
    });
  }

  subscribeToScores(roomId: string, callback: (payload: any) => void): Promise<RealtimeChannel> {
    console.log('🔔 Setting up scores subscription for:', roomId);
    return new Promise((resolve) => {
      const channel = this.supabase
        .channel(`scores_${roomId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'scores',
          filter: `room_id=eq.${roomId}`
        }, callback)
        .subscribe((status) => {
          console.log('🔔 Scores subscription status:', status);
          if (status === 'SUBSCRIBED') {
            resolve(channel);
          }
        });
    });
  }

  subscribeToPresence(roomId: string, callbacks: {
    onJoin?: (key: string, current: any, new_: any) => void;
    onLeave?: (key: string, current: any, left: any) => void;
    onSync?: () => void;
  }): RealtimeChannel {
    const channel = this.supabase.channel(`presence_${roomId}`);

    // Set up presence event handlers
    if (callbacks.onSync) {
      channel.on('presence', { event: 'sync' }, () => {
        callbacks.onSync!();
      });
    }
    
    if (callbacks.onJoin) {
      channel.on('presence', { event: 'join' }, ({ key, newPresences }: any) => {
        callbacks.onJoin!(key, channel.presenceState(), newPresences);
      });
    }
    
    if (callbacks.onLeave) {
      channel.on('presence', { event: 'leave' }, ({ key, leftPresences }: any) => {
        callbacks.onLeave!(key, channel.presenceState(), leftPresences);
      });
    }

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
      .order(scoreField, { ascending: false });
    
    if (error) throw error;
    
    // Sort by nickname as secondary sort on client side
    // since Supabase doesn't support ordering by joined table columns
    const sortedData = data?.sort((a: any, b: any) => {
      // First sort by score (already done by DB, but maintain it)
      const scoreDiff = b[scoreField] - a[scoreField];
      if (scoreDiff !== 0) return scoreDiff;
      
      // Then sort by nickname
      return (a.players?.nick || '').localeCompare(b.players?.nick || '');
    });
    
    return sortedData || [];
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