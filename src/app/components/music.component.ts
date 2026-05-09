import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LangService } from '../services/lang.service';
import { SpotifyAuthService } from '../services/spotify-auth.service';
import { SpotifyService } from '../services/spotify.service';

interface FeaturedPlaylist {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  safeUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-music',
  imports: [FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title"><i class="bi bi-music-note-beamed"></i>Spotify</h1>
          <p class="page-subtitle">{{ tx().subtitle }}</p>
        </div>
        @if (auth.isLoggedIn() && spotify.currentUser()) {
          <div class="user-bar">
            @if (spotify.currentUser()!.images[0]?.url) {
              <img [src]="spotify.currentUser()!.images[0].url" class="user-avatar" alt="avatar" />
            }
            <span class="user-name">{{ spotify.currentUser()!.display_name }}</span>
            <button class="logout-btn" (click)="auth.logout()" title="{{ tx().logout }}">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        }
      </div>

      @if (notification()) {
        <div [class]="'notification notification-' + notification()!.type">
          <i
            [class]="
              'bi bi-' +
              (notification()!.type === 'success'
                ? 'check-circle-fill'
                : 'exclamation-triangle-fill')
            "
          ></i>
          {{ notification()!.msg }}
        </div>
      }

      @if (!auth.isLoggedIn()) {
        <div class="login-section">
          <div class="login-card">
            <div class="login-icon">🎧</div>
            <h2 class="login-title">{{ tx().connectTitle }}</h2>
            <p class="login-desc">{{ tx().connectDesc }}</p>
            <button class="spotify-login-btn" (click)="login()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.46c-.18.3-.57.39-.87.21-2.38-1.46-5.37-1.79-8.9-.98-.34.08-.68-.13-.76-.47-.08-.34.13-.68.47-.76 3.86-.88 7.17-.5 9.85 1.13.3.18.39.57.21.87zm1.24-2.76c-.23.37-.71.49-1.08.27-2.72-1.67-6.87-2.16-10.09-1.18-.42.13-.86-.11-.99-.52-.13-.42.11-.86.52-.99 3.68-1.12 8.25-.57 11.37 1.34.37.23.49.71.27 1.08zm.11-2.87c-3.27-1.94-8.66-2.12-11.78-1.17-.5.15-1.03-.13-1.18-.63-.15-.5.13-1.03.63-1.18 3.58-1.09 9.53-.88 13.29 1.35.46.27.6.86.33 1.31-.27.46-.86.6-1.31.33z"
                />
              </svg>
              Connect with Spotify
            </button>
          </div>
        </div>
      }

      @if (auth.isLoggedIn()) {
        <div class="search-section">
          <div class="search-bar" [class.focused]="searchFocused">
            <i class="bi bi-search search-icon"></i>
            <input
              type="text"
              class="search-input"
              placeholder="{{ tx().searchPh }}"
              [(ngModel)]="query"
              (keyup.enter)="search()"
              (focus)="searchFocused = true"
              (blur)="searchFocused = false"
            />
            @if (query) {
              <button class="clear-btn" (click)="clearSearch()">
                <i class="bi bi-x-circle-fill"></i>
              </button>
            }
            <button class="search-btn" (click)="search()" [disabled]="spotify.loading()">
              @if (spotify.loading()) {
                <span class="spinner-sm"></span>
              } @else {
                {{ tx().searchBtn }}
              }
            </button>
          </div>
        </div>

        @if (spotify.error()) {
          <div class="error-banner">
            <i class="bi bi-exclamation-triangle-fill"></i>
            {{ spotify.error() }}
            <button class="error-close" (click)="spotify.error.set(null)">
              <i class="bi bi-x"></i>
            </button>
          </div>
        }

        @if (spotify.selectedTrack()) {
          <div class="detail-panel">
            <button class="detail-close" (click)="spotify.selectedTrack.set(null)">
              <i class="bi bi-arrow-left"></i> {{ tx().backToResults }}
            </button>
            <div class="detail-content">
              @if (spotify.selectedTrack()!.album.images?.[0]?.url) {
                <img
                  [src]="spotify.selectedTrack()!.album.images![0].url"
                  class="detail-img"
                  alt="album"
                />
              } @else {
                <div class="detail-img-placeholder">
                  <i class="bi bi-music-note-beamed"></i>
                </div>
              }
              <div class="detail-info">
                <div class="detail-badge track-badge">TRACK</div>
                <h2 class="detail-name">{{ spotify.selectedTrack()!.name }}</h2>
                <div class="detail-meta">
                  <span class="detail-artist">{{ spotify.selectedTrack()!.artists[0]?.name }}</span>
                  <span class="detail-sep">·</span>
                  <span class="detail-album">{{ spotify.selectedTrack()!.album.name }}</span>
                </div>
                @if (spotify.selectedTrack()!.duration_ms) {
                  <div class="detail-duration">
                    <i class="bi bi-clock"></i>
                    {{ formatMs(spotify.selectedTrack()!.duration_ms) }}
                  </div>
                }
                @if (spotify.selectedTrack()!.popularity) {
                  <div class="popularity-row">
                    <span class="pop-label">Popularity</span>
                    <div class="pop-track">
                      <div
                        class="pop-fill"
                        [style.width.%]="spotify.selectedTrack()!.popularity"
                      ></div>
                    </div>
                    <span class="pop-value">{{ spotify.selectedTrack()!.popularity }}/100</span>
                  </div>
                }
                <div class="detail-actions">
                  <a
                    class="btn-spotify-open"
                    [href]="spotify.selectedTrack()!.external_urls.spotify"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="white"
                      style="flex-shrink:0"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.46c-.18.3-.57.39-.87.21-2.38-1.46-5.37-1.79-8.9-.98-.34.08-.68-.13-.76-.47-.08-.34.13-.68.47-.76 3.86-.88 7.17-.5 9.85 1.13.3.18.39.57.21.87zm1.24-2.76c-.23.37-.71.49-1.08.27-2.72-1.67-6.87-2.16-10.09-1.18-.42.13-.86-.11-.99-.52-.13-.42.11-.86.52-.99 3.68-1.12 8.25-.57 11.37 1.34.37.23.49.71.27 1.08zm.11-2.87c-3.27-1.94-8.66-2.12-11.78-1.17-.5.15-1.03-.13-1.18-.63-.15-.5.13-1.03.63-1.18 3.58-1.09 9.53-.88 13.29 1.35.46.27.6.86.33 1.31-.27.46-.86.6-1.31.33z"
                      />
                    </svg>
                    {{ tx().openInSpotify }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        }

        @if (spotify.selectedArtist()) {
          <div class="detail-panel">
            <button class="detail-close" (click)="spotify.selectedArtist.set(null)">
              <i class="bi bi-arrow-left"></i> {{ tx().backToResults }}
            </button>
            <div class="detail-content">
              @if (spotify.selectedArtist()!.images?.[0]?.url) {
                <img
                  [src]="spotify.selectedArtist()!.images![0].url"
                  class="detail-img artist-thumb"
                  alt="artist"
                />
              } @else {
                <div class="detail-img-placeholder">
                  <i class="bi bi-person-circle"></i>
                </div>
              }
              <div class="detail-info">
                <div class="detail-badge artist-badge">ARTIST</div>
                <h2 class="detail-name">{{ spotify.selectedArtist()!.name }}</h2>
                @if (spotify.selectedArtist()!.genres?.length) {
                  <div class="genres-row">
                    @for (g of spotify.selectedArtist()!.genres!.slice(0, 4); track g) {
                      <span class="genre-chip">{{ g }}</span>
                    }
                  </div>
                }
                @if (spotify.selectedArtist()!.followers?.total) {
                  <div class="followers-row">
                    <i class="bi bi-people-fill"></i>
                    {{ formatNumber(spotify.selectedArtist()!.followers!.total) }}
                    {{ tx().followers }}
                  </div>
                }
                @if (spotify.selectedArtist()!.popularity) {
                  <div class="popularity-row">
                    <span class="pop-label">Popularity</span>
                    <div class="pop-track">
                      <div
                        class="pop-fill"
                        [style.width.%]="spotify.selectedArtist()!.popularity"
                      ></div>
                    </div>
                    <span class="pop-value">{{ spotify.selectedArtist()!.popularity }}/100</span>
                  </div>
                }
                <div class="detail-actions">
                  <a
                    class="btn-spotify-open"
                    [href]="spotify.selectedArtist()!.external_urls.spotify"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="white"
                      style="flex-shrink:0"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.46c-.18.3-.57.39-.87.21-2.38-1.46-5.37-1.79-8.9-.98-.34.08-.68-.13-.76-.47-.08-.34.13-.68.47-.76 3.86-.88 7.17-.5 9.85 1.13.3.18.39.57.21.87zm1.24-2.76c-.23.37-.71.49-1.08.27-2.72-1.67-6.87-2.16-10.09-1.18-.42.13-.86-.11-.99-.52-.13-.42.11-.86.52-.99 3.68-1.12 8.25-.57 11.37 1.34.37.23.49.71.27 1.08zm.11-2.87c-3.27-1.94-8.66-2.12-11.78-1.17-.5.15-1.03-.13-1.18-.63-.15-.5.13-1.03.63-1.18 3.58-1.09 9.53-.88 13.29 1.35.46.27.6.86.33 1.31-.27.46-.86.6-1.31.33z"
                      />
                    </svg>
                    {{ tx().openInSpotify }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        }

        @if (hasResults()) {
          <div class="results-section">
            <div class="result-tabs">
              <button [class.active]="activeTab() === 'tracks'" (click)="activeTab.set('tracks')">
                <i class="bi bi-music-note"></i>
                {{ tx().tracks }} ({{ spotify.tracks().length }})
              </button>
              <button [class.active]="activeTab() === 'artists'" (click)="activeTab.set('artists')">
                <i class="bi bi-person-circle"></i>
                {{ tx().artists }} ({{ spotify.artists().length }})
              </button>
            </div>

            @if (activeTab() === 'tracks') {
              <div class="cards-grid">
                @for (track of spotify.tracks(); track track.id) {
                  <div class="music-card">
                    @if (track.album.images?.[0]?.url) {
                      <img
                        [src]="track.album.images![0].url"
                        class="card-img"
                        alt="album"
                        loading="lazy"
                      />
                    } @else {
                      <div class="card-img-placeholder">
                        <i class="bi bi-music-note-beamed"></i>
                      </div>
                    }
                    <div class="card-body">
                      <div class="card-name" [title]="track.name">{{ track.name }}</div>
                      <div class="card-sub" [title]="track.artists[0]?.name">
                        {{ track.artists[0]?.name }}
                      </div>
                      <div class="card-album" [title]="track.album.name">
                        {{ track.album.name }}
                      </div>
                      @if (track.popularity) {
                        <div class="card-pop">⭐ {{ track.popularity }}/100</div>
                      }
                    </div>
                    <div class="card-actions">
                      <button
                        class="card-btn detail-btn"
                        title="{{ tx().viewDetail }}"
                        (click)="viewTrack(track.id)"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <a
                        class="card-btn open-btn"
                        [href]="track.external_urls.spotify"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="{{ tx().openInSpotify }}"
                      >
                        <i class="bi bi-box-arrow-up-right"></i>
                      </a>
                    </div>
                  </div>
                }
              </div>
            }

            @if (activeTab() === 'artists') {
              <div class="cards-grid">
                @for (artist of spotify.artists(); track artist.id) {
                  <div class="music-card artist-card">
                    @if (artist.images?.[0]?.url) {
                      <img
                        [src]="artist.images![0].url"
                        class="card-img artist-img"
                        alt="artist"
                        loading="lazy"
                      />
                    } @else {
                      <div class="card-img-placeholder">
                        <i class="bi bi-person-circle"></i>
                      </div>
                    }
                    <div class="card-body">
                      <div class="card-name" [title]="artist.name">{{ artist.name }}</div>
                      @if (artist.genres?.length) {
                        <div class="card-sub">{{ artist.genres!.slice(0, 2).join(', ') }}</div>
                      }
                      @if (artist.followers?.total) {
                        <div class="card-pop">👥 {{ formatNumber(artist.followers!.total) }}</div>
                      }
                    </div>
                    <div class="card-actions">
                      <button
                        class="card-btn detail-btn"
                        title="{{ tx().viewDetail }}"
                        (click)="viewArtist(artist.id)"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <a
                        class="card-btn open-btn"
                        [href]="artist.external_urls.spotify"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="{{ tx().openInSpotify }}"
                      >
                        <i class="bi bi-box-arrow-up-right"></i>
                      </a>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }

        <div class="user-playlists-section">
          <div class="section-header">
            <div>
              <h2 class="section-title">{{ tx().myPlaylists }}</h2>
              <p class="section-sub">{{ tx().myPlaylistsSub }}</p>
            </div>
            <button class="btn-create-pl" (click)="createFocusHubPlaylist()">
              <i class="bi bi-plus-circle"></i>
              {{ tx().createPlaylist }}
            </button>
          </div>

          @if (spotify.userPlaylists().length) {
            <div class="playlists-grid">
              @for (pl of spotify.userPlaylists(); track pl.id) {
                <a
                  class="pl-card"
                  [href]="pl.external_urls.spotify"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @if (pl.images?.[0]?.url) {
                    <img [src]="pl.images![0].url" class="pl-img" alt="playlist" />
                  } @else {
                    <div class="pl-img-placeholder">
                      <i class="bi bi-collection-play-fill"></i>
                    </div>
                  }
                  <div class="pl-info">
                    <div class="pl-name">{{ pl.name }}</div>
                    @if (pl.tracks?.total) {
                      <div class="pl-tracks">{{ pl.tracks!.total }} {{ tx().tracks }}</div>
                    }
                  </div>
                  <i class="bi bi-box-arrow-up-right pl-open"></i>
                </a>
              }
            </div>
          } @else {
            <div class="empty-box">
              <i class="bi bi-music-note-list"></i>
              <p>{{ tx().noPlaylists }}</p>
            </div>
          }
        </div>
      }

      <section class="featured-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">{{ tx().featuredTitle }}</h2>
            <p class="section-sub">{{ tx().featuredSub }}</p>
          </div>
        </div>
        <div class="embeds-grid">
          @for (pl of featuredPlaylists; track pl.id) {
            <div class="embed-card">
              <div class="embed-label">
                <span class="embed-emoji">{{ pl.emoji }}</span>
                <span>{{ pl.name }}</span>
                <span class="embed-desc">{{ pl.desc }}</span>
              </div>
              <iframe
                [src]="pl.safeUrl"
                frameborder="0"
                allowtransparency="true"
                allow="encrypted-media; autoplay; clipboard-write; fullscreen; picture-in-picture"
                loading="lazy"
                class="spotify-embed"
              ></iframe>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 32px;
      }

      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 28px;
        flex-wrap: wrap;
        gap: 16px;
      }

      .page-title {
        font-size: 26px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 4px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .page-title i {
        color: #6366f1;
      }

      .page-subtitle {
        color: #64748b;
        margin: 4px 0 0;
        font-size: 14.5px;
      }

      .user-bar {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 50px;
        padding: 6px 14px 6px 8px;
      }

      .user-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        object-fit: cover;
      }

      .user-name {
        font-size: 13.5px;
        font-weight: 600;
        color: #1e293b;
      }

      .logout-btn {
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        font-size: 16px;
        padding: 2px;
        display: flex;
        align-items: center;
        transition: color 0.2s;
      }

      .logout-btn:hover {
        color: #ef4444;
      }

      .notification {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 20px;
        animation: fadeSlide 0.3s ease;
      }

      @keyframes fadeSlide {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .notification-success {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #15803d;
      }

      .notification-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
      }

      .login-section {
        display: flex;
        justify-content: center;
        margin: 32px 0 40px;
      }

      .login-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 48px 40px;
        text-align: center;
        max-width: 440px;
        width: 100%;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
      }

      .login-icon {
        font-size: 52px;
        margin-bottom: 18px;
      }

      .login-title {
        font-size: 21px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 10px;
      }

      .login-desc {
        color: #64748b;
        font-size: 14.5px;
        margin: 0 0 28px;
        line-height: 1.6;
      }

      .spotify-login-btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: #1db954;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 14px 32px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.22s ease;
        box-shadow: 0 4px 16px rgba(29, 185, 84, 0.35);
      }

      .spotify-login-btn:hover {
        background: #17a84a;
        transform: translateY(-2px);
        box-shadow: 0 6px 22px rgba(29, 185, 84, 0.45);
      }

      .search-section {
        margin-bottom: 24px;
      }

      .search-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        background: white;
        border: 1.5px solid #e2e8f0;
        border-radius: 14px;
        padding: 6px 6px 6px 16px;
        transition:
          border-color 0.2s,
          box-shadow 0.2s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }

      .search-bar.focused {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }

      .search-icon {
        color: #94a3b8;
        font-size: 17px;
        flex-shrink: 0;
      }

      .search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 15px;
        color: #1e293b;
        background: transparent;
        min-width: 0;
      }

      .search-input::placeholder {
        color: #94a3b8;
      }

      .clear-btn {
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        font-size: 15px;
        padding: 4px;
        display: flex;
        align-items: center;
        transition: color 0.18s;
        flex-shrink: 0;
      }

      .clear-btn:hover {
        color: #ef4444;
      }

      .search-btn {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 80px;
        justify-content: center;
      }

      .search-btn:hover:not(:disabled) {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }

      .search-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .spinner-sm {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.35);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .error-banner {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 10px;
        padding: 12px 14px;
        color: #dc2626;
        font-size: 14px;
        margin-bottom: 20px;
      }

      .error-close {
        margin-left: auto;
        background: none;
        border: none;
        color: #dc2626;
        cursor: pointer;
        font-size: 16px;
        padding: 2px;
        display: flex;
        align-items: center;
      }

      .detail-panel {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 22px;
        margin-bottom: 28px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
        animation: slideDown 0.3s ease;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .detail-close {
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        font-size: 13.5px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 0;
        margin-bottom: 18px;
        transition: color 0.18s;
      }

      .detail-close:hover {
        color: #6366f1;
      }

      .detail-content {
        display: flex;
        gap: 24px;
        align-items: flex-start;
        flex-wrap: wrap;
      }

      .detail-img {
        width: 150px;
        height: 150px;
        border-radius: 12px;
        object-fit: cover;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
        flex-shrink: 0;
      }

      .artist-thumb {
        border-radius: 50% !important;
      }

      .detail-img-placeholder {
        width: 150px;
        height: 150px;
        border-radius: 12px;
        background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 42px;
        color: #94a3b8;
        flex-shrink: 0;
      }

      .detail-info {
        flex: 1;
        min-width: 200px;
      }

      .detail-badge {
        font-size: 10.5px;
        font-weight: 700;
        letter-spacing: 1.5px;
        margin-bottom: 6px;
        text-transform: uppercase;
      }

      .track-badge {
        color: #6366f1;
      }

      .artist-badge {
        color: #1db954;
      }

      .detail-name {
        font-size: 24px;
        font-weight: 800;
        color: #1e293b;
        margin: 0 0 8px;
        line-height: 1.2;
      }

      .detail-meta {
        color: #64748b;
        font-size: 14.5px;
        margin-bottom: 14px;
      }

      .detail-sep {
        margin: 0 6px;
        color: #cbd5e1;
      }

      .detail-album {
        color: #94a3b8;
      }

      .detail-duration {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #64748b;
        font-size: 13.5px;
        margin-bottom: 14px;
      }

      .genres-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 12px;
      }

      .genre-chip {
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 3px 10px;
        font-size: 12px;
        color: #64748b;
        font-weight: 500;
        text-transform: capitalize;
      }

      .followers-row {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #64748b;
        font-size: 13.5px;
        margin-bottom: 14px;
      }

      .popularity-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 18px;
      }

      .pop-label {
        font-size: 12.5px;
        color: #94a3b8;
        flex-shrink: 0;
      }

      .pop-track {
        flex: 1;
        height: 6px;
        background: #f1f5f9;
        border-radius: 3px;
        overflow: hidden;
      }

      .pop-fill {
        height: 100%;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        border-radius: 3px;
        transition: width 0.5s ease;
      }

      .pop-value {
        font-size: 12px;
        color: #94a3b8;
        font-weight: 600;
        flex-shrink: 0;
      }

      .detail-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .btn-spotify-open {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #1db954;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 10px 22px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s;
      }

      .btn-spotify-open:hover {
        background: #17a84a;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);
      }

      .results-section {
        margin-bottom: 32px;
      }

      .result-tabs {
        display: flex;
        gap: 4px;
        background: #f1f5f9;
        border-radius: 12px;
        padding: 4px;
        width: fit-content;
        margin-bottom: 18px;
      }

      .result-tabs button {
        display: flex;
        align-items: center;
        gap: 6px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px 16px;
        border-radius: 9px;
        font-size: 13.5px;
        font-weight: 500;
        color: #64748b;
        transition: all 0.18s;
        white-space: nowrap;
      }

      .result-tabs button.active {
        background: white;
        color: #1e293b;
        font-weight: 600;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.09);
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
      }

      .music-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        overflow: hidden;
        transition: all 0.22s ease;
        display: flex;
        flex-direction: column;
      }

      .music-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.11);
        border-color: #c7d2fe;
      }

      .card-img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        display: block;
      }

      .artist-img {
        border-radius: 0;
      }

      .card-img-placeholder {
        width: 100%;
        aspect-ratio: 1;
        background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 34px;
        color: #94a3b8;
      }

      .card-body {
        padding: 12px 14px 6px;
        flex: 1;
      }

      .card-name {
        font-size: 13.5px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-sub {
        font-size: 12.5px;
        color: #64748b;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-album {
        font-size: 12px;
        color: #94a3b8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-pop {
        font-size: 12px;
        color: #94a3b8;
        margin-top: 5px;
      }

      .card-actions {
        padding: 8px 10px 10px;
        display: flex;
        gap: 6px;
        justify-content: flex-end;
        border-top: 1px solid #f8fafc;
        margin-top: 8px;
      }

      .card-btn {
        width: 30px;
        height: 30px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        background: #f8fafc;
        color: #64748b;
        cursor: pointer;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.18s;
      }

      .detail-btn:hover {
        background: #eef2ff;
        color: #6366f1;
        border-color: #c7d2fe;
      }

      .open-btn:hover {
        background: #f0fdf4;
        color: #16a34a;
        border-color: #bbf7d0;
      }

      a.open-btn {
        text-decoration: none;
      }

      .add-btn:hover {
        background: #eef2ff;
        color: #6366f1;
        border-color: #c7d2fe;
      }

      .user-playlists-section {
        margin-bottom: 40px;
      }

      .section-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 12px;
      }

      .section-title {
        font-size: 19px;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
      }

      .section-sub {
        font-size: 13px;
        color: #94a3b8;
        margin: 4px 0 0;
      }

      .btn-create-pl {
        display: flex;
        align-items: center;
        gap: 7px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 10px 18px;
        font-size: 13.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
      }

      .btn-create-pl:hover {
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
      }

      .playlists-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 10px;
      }

      .pl-card {
        display: flex;
        align-items: center;
        gap: 12px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 10px 12px;
        cursor: pointer;
        transition: all 0.18s;
        text-decoration: none;
        color: inherit;
      }

      .pl-card:hover {
        border-color: #c7d2fe;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
        transform: translateX(2px);
      }

      .pl-img {
        width: 46px;
        height: 46px;
        border-radius: 8px;
        object-fit: cover;
        flex-shrink: 0;
      }

      .pl-img-placeholder {
        width: 46px;
        height: 46px;
        border-radius: 8px;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #94a3b8;
        flex-shrink: 0;
      }

      .pl-info {
        flex: 1;
        min-width: 0;
      }

      .pl-name {
        font-size: 13.5px;
        font-weight: 600;
        color: #1e293b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .pl-tracks {
        font-size: 12px;
        color: #94a3b8;
      }

      .pl-open {
        color: #cbd5e1;
        font-size: 13px;
        flex-shrink: 0;
      }

      .empty-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 30px;
        background: #f8fafc;
        border: 1px dashed #e2e8f0;
        border-radius: 12px;
        color: #94a3b8;
        font-size: 13.5px;
        text-align: center;
      }

      .empty-box i {
        font-size: 28px;
      }

      .empty-box p {
        margin: 0;
      }

      .featured-section {
        margin-top: 12px;
      }

      .embeds-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .embed-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        transition: box-shadow 0.2s;
      }

      .embed-card:hover {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      }

      .embed-label {
        padding: 13px 16px 11px;
        font-size: 14.5px;
        font-weight: 700;
        color: #1e293b;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid #f1f5f9;
      }

      .embed-emoji {
        font-size: 18px;
      }

      .embed-desc {
        font-size: 12px;
        color: #94a3b8;
        font-weight: 400;
        margin-left: auto;
      }

      .spotify-embed {
        width: 100%;
        height: 352px;
        display: block;
        border: none;
      }

      @media (max-width: 1023px) {
        .cards-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .embeds-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 640px) {
        .container {
          padding: 20px 16px 32px;
        }

        .page-title {
          font-size: 22px;
          text-align: center;
          justify-content: center;
        }

        .page-title i {
          display: none;
        }

        .page-subtitle {
          text-align: center;
        }

        .page-header {
          flex-direction: column;
          align-items: center;
        }

        .header-left {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .section-header {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .section-title {
          text-align: center;
        }

        .section-sub {
          text-align: center;
        }

        .btn-create-pl i {
          display: none;
        }

        .cards-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .cards-grid .card-body {
          padding: 6px 8px 4px;
        }

        .cards-grid .card-name {
          font-size: 11px;
        }

        .cards-grid .card-sub,
        .cards-grid .card-album,
        .cards-grid .card-pop {
          font-size: 10px;
        }

        .cards-grid .card-actions {
          padding: 4px 6px;
          gap: 4px;
        }

        .cards-grid .card-btn {
          width: 26px;
          height: 26px;
          font-size: 12px;
        }

        .embeds-grid {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          gap: 12px;
          padding-bottom: 8px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .embeds-grid::-webkit-scrollbar {
          display: none;
        }

        .embed-card {
          flex: 0 0 82%;
          scroll-snap-align: start;
          min-width: 0;
        }

        .spotify-embed {
          height: 152px;
        }

        .detail-content {
          flex-direction: column;
        }
        .detail-img,
        .detail-img-placeholder {
          width: 100%;
          height: 200px;
          border-radius: 12px;
        }
        .login-card {
          padding: 32px 22px;
        }
        .user-bar {
          padding: 5px 12px 5px 7px;
        }
      }

      :host-context(.dark) .page-title {
        color: #f1f5f9;
      }
      :host-context(.dark) .page-subtitle {
        color: #94a3b8;
      }
      :host-context(.dark) .user-bar {
        background: #1e2a3a;
        border-color: #2d3748;
      }
      :host-context(.dark) .user-name {
        color: #f1f5f9;
      }
      :host-context(.dark) .login-card {
        background: #1e2a3a;
        border-color: #2d3748;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
      }
      :host-context(.dark) .login-title {
        color: #f1f5f9;
      }
      :host-context(.dark) .login-desc {
        color: #94a3b8;
      }
      :host-context(.dark) .search-bar {
        background: #1e2a3a;
        border-color: #2d3748;
      }
      :host-context(.dark) .search-bar.focused {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      }
      :host-context(.dark) .search-input {
        color: #f1f5f9;
      }
      :host-context(.dark) .search-input::placeholder {
        color: #475569;
      }
      :host-context(.dark) .error-banner {
        background: rgba(220, 38, 38, 0.1);
        border-color: rgba(220, 38, 38, 0.3);
        color: #fca5a5;
      }
      :host-context(.dark) .notification-success {
        background: rgba(21, 128, 61, 0.12);
        border-color: rgba(21, 128, 61, 0.3);
        color: #86efac;
      }
      :host-context(.dark) .notification-error {
        background: rgba(220, 38, 38, 0.1);
        border-color: rgba(220, 38, 38, 0.3);
        color: #fca5a5;
      }
      :host-context(.dark) .detail-panel {
        background: #1e2a3a;
        border-color: #2d3748;
      }
      :host-context(.dark) .detail-close {
        color: #94a3b8;
      }
      :host-context(.dark) .detail-close:hover {
        color: #a5b4fc;
      }
      :host-context(.dark) .detail-name {
        color: #f1f5f9;
      }
      :host-context(.dark) .detail-meta {
        color: #94a3b8;
      }
      :host-context(.dark) .detail-album {
        color: #64748b;
      }
      :host-context(.dark) .detail-img-placeholder {
        background: #2d3748;
        color: #64748b;
      }
      :host-context(.dark) .detail-duration {
        color: #94a3b8;
      }
      :host-context(.dark) .genre-chip {
        background: #2d3748;
        border-color: #374151;
        color: #94a3b8;
      }
      :host-context(.dark) .followers-row {
        color: #94a3b8;
      }
      :host-context(.dark) .pop-label {
        color: #64748b;
      }
      :host-context(.dark) .pop-track {
        background: #2d3748;
      }
      :host-context(.dark) .pop-value {
        color: #64748b;
      }
      :host-context(.dark) .result-tabs {
        background: #1e2a3a;
      }
      :host-context(.dark) .result-tabs button {
        color: #94a3b8;
      }
      :host-context(.dark) .result-tabs button.active {
        background: #2d3748;
        color: #f1f5f9;
      }
      :host-context(.dark) .music-card {
        background: #1e2a3a;
        border-color: #2d3748;
      }
      :host-context(.dark) .music-card:hover {
        border-color: #4f46e5;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.3);
      }
      :host-context(.dark) .card-img-placeholder {
        background: linear-gradient(135deg, #1e2a3a, #2d3748);
        color: #475569;
      }
      :host-context(.dark) .card-name {
        color: #f1f5f9;
      }
      :host-context(.dark) .card-sub {
        color: #94a3b8;
      }
      :host-context(.dark) .card-album {
        color: #64748b;
      }
      :host-context(.dark) .card-pop {
        color: #64748b;
      }
      :host-context(.dark) .card-actions {
        border-top-color: #2d3748;
      }
      :host-context(.dark) .card-btn {
        background: #2d3748;
        border-color: #374151;
        color: #94a3b8;
      }
      :host-context(.dark) .detail-btn:hover {
        background: rgba(99, 102, 241, 0.15);
        color: #a5b4fc;
        border-color: #4338ca;
      }
      :host-context(.dark) .open-btn:hover {
        background: rgba(22, 163, 74, 0.12);
        color: #86efac;
        border-color: rgba(22, 163, 74, 0.3);
      }
      :host-context(.dark) .pl-picker-dropdown {
        background: #1e293b;
        border-color: #334155;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      }

      :host-context(.dark) .pl-picker-item {
        color: #e2e8f0;
      }

      :host-context(.dark) .pl-picker-item:hover {
        background: #0f172a;
      }

      :host-context(.dark) .section-title {
        color: #f1f5f9;
      }
      :host-context(.dark) .section-sub {
        color: #64748b;
      }
      :host-context(.dark) .pl-card {
        background: #1e2a3a;
        border-color: #2d3748;
      }
      :host-context(.dark) .pl-card:hover {
        border-color: #4f46e5;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
      }
      :host-context(.dark) .pl-name {
        color: #f1f5f9;
      }
      :host-context(.dark) .pl-tracks {
        color: #64748b;
      }
      :host-context(.dark) .pl-img-placeholder {
        background: #2d3748;
        color: #64748b;
      }
      :host-context(.dark) .empty-box {
        background: #1e2a3a;
        border-color: #2d3748;
        color: #64748b;
      }
      :host-context(.dark) .embed-card {
        background: #1e2a3a;
        border-color: #2d3748;
      }
      :host-context(.dark) .embed-label {
        color: #f1f5f9;
        border-bottom-color: #2d3748;
      }
      :host-context(.dark) .embed-desc {
        color: #64748b;
      }
    `,
  ],
})
export class MusicComponent implements OnInit {
  auth = inject(SpotifyAuthService);
  spotify = inject(SpotifyService);
  private sanitizer = inject(DomSanitizer);
  private langService = inject(LangService);

  readonly tx = computed(() => {
    const es = this.langService.lang() === 'es';
    return {
      subtitle: es ? 'Música para enfocarse y entrenar' : 'Music to focus and train',
      logout: es ? 'Cerrar sesión' : 'Log out',
      connectTitle: es ? 'Conecta tu cuenta de Spotify' : 'Connect your Spotify account',
      connectDesc: es
        ? 'Busca canciones, guarda favoritos, crea playlists y mucho más.'
        : 'Search songs, save favorites, create playlists and much more.',
      searchPh: es ? 'Buscar canciones, artistas...' : 'Search songs, artists...',
      searchBtn: es ? 'Buscar' : 'Search',
      search: es ? 'Buscar' : 'Search',
      backToResults: es ? 'Volver a resultados' : 'Back to results',
      followers: es ? 'seguidores' : 'followers',
      tracks: es ? 'Canciones' : 'Tracks',
      artists: es ? 'Artistas' : 'Artists',
      viewDetail: es ? 'Ver detalle' : 'View detail',
      openInSpotify: es ? 'Abrir en Spotify' : 'Open in Spotify',
      myPlaylists: es ? 'Mis Playlists' : 'My Playlists',
      myPlaylistsSub: es ? 'Tus playlists de Spotify' : 'Your Spotify playlists',
      createPlaylist: es ? 'Crear "FocusHub Session"' : 'Create "FocusHub Session"',
      noPlaylists: es ? 'No hay playlists cargadas aún.' : 'No playlists loaded yet.',
      featuredTitle: es ? 'Playlists Recomendadas' : 'Recommended Playlists',
      featuredSub: es
        ? 'Sin cuenta — reproducí directo desde aquí'
        : 'No account needed — play directly from here',
      popularity: es ? 'Popularidad' : 'Popularity',
    };
  });

  query = '';
  searchFocused = false;
  activeTab = signal<'tracks' | 'artists'>('tracks');
  notification = signal<{ type: 'success' | 'error'; msg: string } | null>(null);
  hasResults = computed(
    () => this.spotify.tracks().length > 0 || this.spotify.artists().length > 0,
  );

  featuredPlaylists: FeaturedPlaylist[] = [];

  ngOnInit(): void {
    this.featuredPlaylists = [
      {
        id: '37i9dQZF1DWZeKCadgRdKQ',
        name: 'Focus Flow',
        emoji: '🎯',
        desc: 'Deep concentration',
        safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator',
        ),
      },
      {
        id: '37i9dQZF1DX2ENAPP1Tyed',
        name: 'Beast Mode',
        emoji: '💪',
        desc: 'Energy to train',
        safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://open.spotify.com/embed/playlist/37i9dQZF1DX2ENAPP1Tyed?utm_source=generator',
        ),
      },
      {
        id: '37i9dQZF1DWWQRwui0ExPn',
        name: 'Lo-Fi Beats',
        emoji: '🌙',
        desc: 'Relaxed atmosphere',
        safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator',
        ),
      },
    ];

    if (this.auth.isLoggedIn()) {
      this.spotify.getCurrentUser();
      this.spotify.getUserPlaylists();
    }
  }

  login(): void {
    this.auth.login();
  }

  async search(): Promise<void> {
    if (!this.query.trim()) return;
    await this.spotify.search(this.query);
    if (this.spotify.tracks().length > 0) {
      this.activeTab.set('tracks');
    } else if (this.spotify.artists().length > 0) {
      this.activeTab.set('artists');
    }
  }

  clearSearch(): void {
    this.query = '';
    this.spotify.tracks.set([]);
    this.spotify.artists.set([]);
    this.spotify.selectedTrack.set(null);
    this.spotify.selectedArtist.set(null);
    this.spotify.error.set(null);
  }

  async viewTrack(id: string): Promise<void> {
    await this.spotify.getTrack(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async viewArtist(id: string): Promise<void> {
    await this.spotify.getArtist(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async createFocusHubPlaylist(): Promise<void> {
    const pl = await this.spotify.createPlaylist('FocusHub Session 🎵');
    if (pl) {
      this.showNotification(
        'success',
        this.langService.lang() === 'es'
          ? '¡Playlist "FocusHub Session" creada exitosamente!'
          : 'Playlist "FocusHub Session" created successfully!',
      );
    } else {
      const err = this.spotify.error();
      const isScope =
        err?.toLowerCase().includes('scope') || err?.includes('403') || err?.includes('Forbidden');
      const es = this.langService.lang() === 'es';
      this.showNotification(
        'error',
        isScope
          ? es
            ? 'Sin permisos: cerrá sesión y volvé a entrar para autorizar.'
            : 'Missing permissions: log out and log in again to authorize.'
          : (err ?? (es ? 'Error al crear la playlist.' : 'Error creating playlist.')),
      );
    }
  }

  formatMs(ms: number): string {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  formatNumber(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
    return String(n);
  }

  private showNotification(type: 'success' | 'error', msg: string): void {
    this.notification.set({ type, msg });
    setTimeout(() => this.notification.set(null), 3500);
  }
}
