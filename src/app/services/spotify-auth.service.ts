import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

export const SPOTIFY_CLIENT_ID = 'e27e375c8d17461298d5e926fa20ef85';

const REDIRECT_URI = 'https://focus-hub-gamma.vercel.app/spotify-callback';
const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-library-read',
  'user-library-modify',
].join(' ');

@Injectable({ providedIn: 'root' })
export class SpotifyAuthService {
  private router = inject(Router);

  isLoggedIn = signal(false);

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    const token = localStorage.getItem('sp_access_token');
    const expiry = Number(localStorage.getItem('sp_token_expiry') ?? 0);
    if (token && Date.now() < expiry) {
      this.isLoggedIn.set(true);
    } else if (token) {
      this.clearTokens();
    }
  }

  private randomString(len: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const buf = new Uint8Array(len);
    crypto.getRandomValues(buf);
    return Array.from(buf, (b) => chars[b % chars.length]).join('');
  }

  private async pkceChallenge(verifier: string): Promise<string> {
    const encoded = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  async login(): Promise<void> {
    const verifier = this.randomString(128);
    const challenge = await this.pkceChallenge(verifier);
    sessionStorage.setItem('sp_verifier', verifier);

    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });

    window.location.href = `${AUTH_URL}?${params}`;
  }

  async handleCallback(code: string): Promise<boolean> {
    const verifier = sessionStorage.getItem('sp_verifier');
    if (!verifier) return false;

    try {
      const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: SPOTIFY_CLIENT_ID,
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: verifier,
        }),
      });

      if (!res.ok) return false;

      const { access_token, expires_in, refresh_token } = await res.json();
      localStorage.setItem('sp_access_token', access_token);
      localStorage.setItem('sp_token_expiry', String(Date.now() + expires_in * 1000));
      if (refresh_token) localStorage.setItem('sp_refresh_token', refresh_token);
      sessionStorage.removeItem('sp_verifier');
      this.isLoggedIn.set(true);
      return true;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    const expiry = Number(localStorage.getItem('sp_token_expiry') ?? 0);
    if (Date.now() >= expiry) {
      this.clearTokens();
      return null;
    }
    return localStorage.getItem('sp_access_token');
  }

  logout(): void {
    this.clearTokens();
    this.router.navigate(['/music']);
  }

  private clearTokens(): void {
    ['sp_access_token', 'sp_token_expiry', 'sp_refresh_token'].forEach((k) =>
      localStorage.removeItem(k),
    );
    this.isLoggedIn.set(false);
  }
}
