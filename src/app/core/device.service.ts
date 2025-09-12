import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private readonly DEVICE_ID_KEY = 'cookie_catcher_device_id';
  private deviceId: string | null = null;

  constructor() {
    this.initializeDeviceId();
  }

  private initializeDeviceId(): void {
    // Try localStorage first
    this.deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    
    if (!this.deviceId) {
      // Try cookie fallback
      this.deviceId = this.getCookie(this.DEVICE_ID_KEY);
    }
    
    if (!this.deviceId) {
      // Generate new device ID
      this.deviceId = this.generateDeviceId();
      this.storeDeviceId(this.deviceId);
    }
  }

  private generateDeviceId(): string {
    return 'device_' + crypto.randomUUID();
  }

  private storeDeviceId(id: string): void {
    // Store in localStorage
    localStorage.setItem(this.DEVICE_ID_KEY, id);
    
    // Store in cookie with long expiration (1 year)
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${this.DEVICE_ID_KEY}=${id}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  getDeviceId(): string {
    if (!this.deviceId) {
      this.initializeDeviceId();
    }
    return this.deviceId!;
  }

  regenerateDeviceId(): string {
    this.deviceId = this.generateDeviceId();
    this.storeDeviceId(this.deviceId);
    return this.deviceId;
  }
}