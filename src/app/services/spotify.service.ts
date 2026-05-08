import { Injectable, inject, signal } from '@angular/core';
import { SpotifyAuthService } from './spotify-auth.service';

const API = 'https://api.spotify.com/v1';

export interface SpotifyImage {
  url: string;
  width?: number;
  height?: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: { id: string; name: string; images: SpotifyImage[] };
  popularity: number;
  duration_ms: number;
  external_urls: { spotify: string };
  preview_url: string | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  popularity: number;
  followers: { total: number };
  external_urls: { spotify: string };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  external_urls: { spotify: string };
  tracks?: { total: number };
  owner: { display_name: string };
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  images: SpotifyImage[];
  email: string;
}

@Injectable({ providedIn: 'root' })
export class SpotifyService {
  private auth = inject(SpotifyAuthService);

  tracks = signal<SpotifyTrack[]>([]);
  artists = signal<SpotifyArtist[]>([]);
  selectedTrack = signal<SpotifyTrack | null>(null);
  selectedArtist = signal<SpotifyArtist | null>(null);
  userPlaylists = signal<SpotifyPlaylist[]>([]);
  currentUser = signal<SpotifyUser | null>(null);
  savedTrackIds = signal<Set<string>>(new Set());
  loading = signal(false);
  error = signal<string | null>(null);

  private async api<T>(path: string, opts: RequestInit = {}): Promise<T> {
    const token = this.auth.getToken();
    if (!token) {
      this.auth.logout();
      throw new Error('No autenticado');
    }

    const res = await fetch(`${API}${path}`, {
      ...opts,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(opts.headers ?? {}),
      },
    });

    if (res.status === 401) {
      this.auth.logout();
      throw new Error('Sesión expirada');
    }
    if (res.status === 204) return null as T;
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error?.message ?? `Error ${res.status}`);
    }
    return res.json() as Promise<T>;
  }

  async search(query: string): Promise<void> {
    if (!query.trim()) return;
    this.loading.set(true);
    this.error.set(null);
    this.selectedTrack.set(null);
    this.selectedArtist.set(null);
    try {
      const params = new URLSearchParams({
        q: query,
        type: 'track,artist',
        limit: '10',
      });
      const data = await this.api<any>(`/search?${params}`);
      this.tracks.set(data.tracks?.items ?? []);
      this.artists.set(data.artists?.items ?? []);
    } catch (e: any) {
      this.error.set(e.message ?? 'Error al buscar en Spotify');
    } finally {
      this.loading.set(false);
    }
  }

  async getTrack(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const track = await this.api<SpotifyTrack>(`/tracks/${id}`);
      this.selectedTrack.set(track);
      this.selectedArtist.set(null);
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.loading.set(false);
    }
  }

  async getArtist(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const artist = await this.api<SpotifyArtist>(`/artists/${id}`);
      this.selectedArtist.set(artist);
      this.selectedTrack.set(null);
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.loading.set(false);
    }
  }

  async saveTrack(id: string): Promise<void> {
    try {
      await this.api(`/me/tracks`, {
        method: 'PUT',
        body: JSON.stringify({ ids: [id] }),
      });
      const s = new Set(this.savedTrackIds());
      s.add(id);
      this.savedTrackIds.set(s);
    } catch (e: any) {
      this.error.set(e.message);
    }
  }

  async getUserPlaylists(): Promise<void> {
    try {
      const data = await this.api<any>('/me/playlists?limit=20');
      this.userPlaylists.set(data.items ?? []);
    } catch (e: any) {
      this.error.set(e.message);
    }
  }

  async getCurrentUser(): Promise<void> {
    try {
      const user = await this.api<SpotifyUser>('/me');
      this.currentUser.set(user);
    } catch (e: any) {
      this.error.set(e.message);
    }
  }

  async createPlaylist(name: string): Promise<SpotifyPlaylist | null> {
    try {
      const pl = await this.api<SpotifyPlaylist>(`/me/playlists`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          public: false,
          description: 'Creada por FocusHub 🎵',
        }),
      });
      this.userPlaylists.set([pl, ...this.userPlaylists()]);
      return pl;
    } catch (e: any) {
      this.error.set(e.message);
      return null;
    }
  }
}
