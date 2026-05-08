import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LangService } from '../services/lang.service';
import { SpotifyAuthService } from '../services/spotify-auth.service';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-spotify-callback',
  imports: [],
  template: `
    <div class="callback-page">
      @if (error()) {
        <div class="callback-card">
          <div class="callback-icon error-icon">❌</div>
          <h2>{{ tx().errorTitle }}</h2>
          <p>{{ error() }}</p>
          <button class="back-btn" (click)="goBack()">{{ tx().backBtn }}</button>
        </div>
      } @else {
        <div class="callback-card">
          <div class="spinner"></div>
          <h2>{{ tx().connecting }}</h2>
          <p>{{ tx().pleaseWait }}</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .callback-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0f111a 0%, #1a1a2e 100%);
        padding: 20px;
      }

      .callback-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 48px 40px;
        text-align: center;
        max-width: 420px;
        width: 100%;
        backdrop-filter: blur(12px);
      }

      h2 {
        font-size: 20px;
        font-weight: 700;
        color: #f1f5f9;
        margin: 0 0 10px;
      }

      p {
        color: #94a3b8;
        font-size: 14px;
        margin: 0 0 24px;
      }

      .callback-icon {
        font-size: 48px;
        margin-bottom: 20px;
      }

      .spinner {
        width: 52px;
        height: 52px;
        border: 3px solid rgba(29, 185, 84, 0.2);
        border-top-color: #1db954;
        border-radius: 50%;
        margin: 0 auto 24px;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .back-btn {
        background: #6366f1;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 28px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .back-btn:hover {
        background: #4f46e5;
        transform: translateY(-1px);
      }
    `,
  ],
})
export class SpotifyCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(SpotifyAuthService);
  private spotify = inject(SpotifyService);
  private langService = inject(LangService);

  error = signal<string | null>(null);

  readonly tx = computed(() => {
    const es = this.langService.lang() === 'es';
    return {
      errorTitle: es ? 'Error al conectar con Spotify' : 'Error connecting to Spotify',
      backBtn: es ? '← Volver a Música' : '← Back to Music',
      connecting: es ? 'Conectando con Spotify...' : 'Connecting to Spotify...',
      pleaseWait: es
        ? 'Por favor espera, estamos verificando tu cuenta.'
        : "Please wait, we're verifying your account.",
      errCancelled: es
        ? 'El usuario canceló la autorización de Spotify.'
        : 'User cancelled Spotify authorization.',
      errNoCode: es ? 'No se recibió código de autorización.' : 'No authorization code received.',
      errFailed: es
        ? 'Autenticación fallida. Por favor inténtalo de nuevo.'
        : 'Authentication failed. Please try again.',
    };
  });

  async ngOnInit(): Promise<void> {
    const code = this.route.snapshot.queryParamMap.get('code');
    const err = this.route.snapshot.queryParamMap.get('error');

    if (err) {
      this.error.set(this.tx().errCancelled);
      return;
    }

    if (!code) {
      this.error.set(this.tx().errNoCode);
      return;
    }

    const success = await this.auth.handleCallback(code);
    if (success) {
      await this.spotify.getCurrentUser();
      await this.spotify.getUserPlaylists();
      this.router.navigate(['/music']);
    } else {
      this.error.set(this.tx().errFailed);
    }
  }

  goBack(): void {
    this.router.navigate(['/music']);
  }
}
