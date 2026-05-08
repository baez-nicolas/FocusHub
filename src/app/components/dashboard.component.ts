import { Component, computed, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LangService } from '../services/lang.service';
import { NewsService } from '../services/news.service';

interface DashPlaylist {
  id: string;
  name: string;
  emoji: string;
  safeUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="dash-wrapper">
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="hero-inner">
          <h1 class="hero-title">
            <span class="t-focus">Focus</span><span class="t-hub">Hub</span>
          </h1>
          <p class="hero-sub">{{ tx().heroSub }}</p>
          <p class="hero-date">{{ currentDateTime() }}</p>
          <div class="hero-actions">
            <button class="hbtn hbtn-primary" (click)="navigate('/news')">
              <i class="bi bi-newspaper"></i> {{ tx().news }}
            </button>
            <button class="hbtn" (click)="navigate('/notes')">
              <i class="bi bi-journal-text"></i> {{ tx().notes }}
            </button>
            <button class="hbtn" (click)="navigate('/calculator')">
              <i class="bi bi-calculator"></i> {{ tx().calculator }}
            </button>
          </div>
        </div>
      </section>

      <div class="sections-wrap">
        <section class="dash-section">
          <div class="sec-hdr">
            <div class="sec-title">
              <i class="bi bi-newspaper"></i>
              {{ tx().latestNews }}
            </div>
            <button class="see-all" (click)="navigate('/news')">{{ tx().seeAll }}</button>
          </div>

          @if (newsService.loading() && !latestNews().length) {
            <div class="news-grid">
              <div class="news-card skel-card"></div>
              <div class="news-card skel-card"></div>
              <div class="news-card skel-card"></div>
            </div>
          } @else if (latestNews().length) {
            <div class="news-grid">
              @for (article of latestNews(); track article.id) {
                <div class="news-card" (click)="openUrl(article.webUrl)">
                  @if (article.thumbnail) {
                    <img
                      [src]="article.thumbnail"
                      class="n-img"
                      [alt]="article.webTitle"
                      loading="lazy"
                    />
                  } @else {
                    <div class="n-img n-img-ph">
                      <i class="bi bi-newspaper"></i>
                    </div>
                  }
                  <div class="n-body">
                    <span class="n-section">{{ article.sectionName }}</span>
                    <h3 class="n-title">{{ article.webTitle }}</h3>
                    @if (article.trailText) {
                      <p class="n-trail">{{ stripHtml(article.trailText) }}</p>
                    }
                  </div>
                </div>
              }
            </div>
          } @else if (!newsService.loading()) {
            <div class="empty-box">
              <i class="bi bi-newspaper"></i>
              <p>{{ tx().noNews }}</p>
            </div>
          }
        </section>

        <section class="dash-section">
          <div class="sec-hdr">
            <div class="sec-title">
              <i class="bi bi-spotify"></i>
              {{ tx().recommendedPlaylists }}
            </div>
            <button class="see-all" (click)="navigate('/music')">{{ tx().seeAll }}</button>
          </div>

          <div class="pl-grid">
            @for (pl of playlists; track pl.id) {
              <div class="pl-card">
                <div class="pl-label">
                  <span class="pl-emoji">{{ pl.emoji }}</span>
                  {{ pl.name }}
                </div>
                <iframe
                  [src]="pl.safeUrl"
                  frameborder="0"
                  allowtransparency="true"
                  allow="encrypted-media; autoplay; clipboard-write; fullscreen; picture-in-picture"
                  loading="lazy"
                  class="pl-iframe"
                ></iframe>
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .dash-wrapper {
        width: 100%;
        min-width: 0;
      }

      .hero {
        position: relative;
        width: 100%;
        min-height: 320px;
        background: #0d0f1c;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 64px 24px;
      }

      .hero-glow {
        position: absolute;
        top: -80px;
        left: 50%;
        transform: translateX(-50%);
        width: 700px;
        height: 450px;
        background: radial-gradient(
          ellipse at center,
          rgba(99, 102, 241, 0.28) 0%,
          rgba(139, 92, 246, 0.14) 40%,
          transparent 70%
        );
        pointer-events: none;
      }

      .hero-inner {
        position: relative;
        z-index: 1;
        text-align: center;
        max-width: 680px;
        width: 100%;
      }

      @keyframes fadeSlideDown {
        from {
          opacity: 0;
          transform: translateY(-40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .hero-title {
        font-size: clamp(46px, 9vw, 80px);
        font-weight: 900;
        letter-spacing: -3px;
        margin: 0 0 14px;
        line-height: 1;
        animation: fadeSlideDown 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: 0.05s;
      }

      .t-focus {
        color: #ffffff;
      }

      .t-hub {
        color: #6366f1;
      }

      .hero-sub {
        color: rgba(255, 255, 255, 0.6);
        font-size: 16px;
        margin: 0 0 6px;
        font-weight: 400;
        animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: 0.45s;
      }

      .hero-date {
        color: rgba(255, 255, 255, 0.35);
        font-size: 13px;
        margin: 0 0 32px;
        animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: 0.7s;
      }

      .hero-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: 0.95s;
      }

      .hbtn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 11px 22px;
        border-radius: 8px;
        border: 1.5px solid rgba(255, 255, 255, 0.22);
        background: transparent;
        color: white;
        font-size: 14.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .hbtn:hover {
        background: rgba(255, 255, 255, 0.09);
        border-color: rgba(255, 255, 255, 0.4);
      }

      .hbtn-primary {
        background: #6366f1;
        border-color: #6366f1;
        box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
      }

      .hbtn-primary:hover {
        background: #4f46e5;
        border-color: #4f46e5;
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
      }

      .sections-wrap {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 24px 56px;
        display: flex;
        flex-direction: column;
        gap: 52px;
      }

      .sec-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
      }

      .sec-title {
        font-size: 18px;
        font-weight: 800;
        color: #1e293b;
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .sec-title i {
        font-size: 20px;
        color: #6366f1;
      }

      .see-all {
        background: none;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 6px 16px;
        font-size: 13px;
        font-weight: 600;
        color: #6366f1;
        cursor: pointer;
        transition: all 0.18s;
      }

      .see-all:hover {
        background: #eef2ff;
        border-color: #c7d2fe;
      }

      .news-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .news-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.22s ease;
        display: flex;
        flex-direction: column;
      }

      .news-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
        border-color: #c7d2fe;
      }

      .n-img {
        width: 100%;
        height: 176px;
        object-fit: cover;
        display: block;
        flex-shrink: 0;
      }

      .n-img-ph {
        background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        color: #94a3b8;
        height: 176px;
      }

      .n-body {
        padding: 14px 16px 18px;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .n-section {
        font-size: 10.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        color: #6366f1;
        margin-bottom: 6px;
      }

      .n-title {
        font-size: 14.5px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 8px;
        line-height: 1.45;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .n-trail {
        font-size: 13px;
        color: #64748b;
        margin: 0;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .skel-card {
        height: 300px;
        background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
        cursor: default;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      .empty-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 36px;
        background: #f8fafc;
        border: 1px dashed #e2e8f0;
        border-radius: 12px;
        color: #94a3b8;
        font-size: 14px;
        text-align: center;
      }

      .empty-box i {
        font-size: 30px;
      }

      .empty-box p {
        margin: 0;
      }

      .pl-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .pl-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        overflow: hidden;
        transition: box-shadow 0.2s ease;
      }

      .pl-card:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
      }

      .pl-label {
        padding: 13px 16px 11px;
        font-size: 14px;
        font-weight: 700;
        color: #1e293b;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid #f1f5f9;
      }

      .pl-emoji {
        font-size: 17px;
      }

      .pl-iframe {
        width: 100%;
        height: 300px;
        display: block;
        border: none;
      }

      .pomodoro-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.95) 0%,
          rgba(139, 92, 246, 0.95) 100%
        );
        backdrop-filter: blur(16px);
        padding: 12px 20px;
        border-radius: 16px;
        border: 1.5px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        width: 160px;
      }

      .pomodoro-widget:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
        border-color: rgba(255, 255, 255, 0.35);
      }

      .pomodoro-icon {
        font-size: 24px;
        line-height: 1;
        flex-shrink: 0;
      }

      .pomodoro-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-width: 0;
      }

      .pomodoro-label {
        font-size: 9px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.85);
        text-transform: uppercase;
        letter-spacing: 1px;
        line-height: 1;
      }

      .pomodoro-time {
        font-size: 20px;
        font-weight: 800;
        color: white;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.5px;
        line-height: 1;
      }

      @media (max-width: 1023px) {
        .news-grid,
        .pl-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 640px) {
        .hero {
          min-height: 260px;
          padding: 48px 20px;
        }

        .hero-sub {
          font-size: 14.5px;
        }

        .news-grid,
        .pl-grid {
          grid-template-columns: 1fr;
        }

        .sections-wrap {
          padding: 28px 16px 40px;
          gap: 40px;
        }

        .n-img,
        .n-img-ph {
          height: 200px;
        }
      }

      :host-context(.dark) .sec-title {
        color: #f1f5f9;
      }

      :host-context(.dark) .see-all {
        border-color: #2d3748;
        color: #a5b4fc;
      }

      :host-context(.dark) .see-all:hover {
        background: rgba(99, 102, 241, 0.1);
        border-color: #4338ca;
      }

      :host-context(.dark) .news-card {
        background: #1e2a3a;
        border-color: #2d3748;
      }

      :host-context(.dark) .news-card:hover {
        border-color: #4f46e5;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
      }

      :host-context(.dark) .n-img-ph {
        background: linear-gradient(135deg, #1e2a3a, #2d3748);
        color: #64748b;
      }

      :host-context(.dark) .n-title {
        color: #f1f5f9;
      }

      :host-context(.dark) .n-trail {
        color: #94a3b8;
      }

      :host-context(.dark) .pl-card {
        background: #1e2a3a;
        border-color: #2d3748;
      }

      :host-context(.dark) .pl-card:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      }

      :host-context(.dark) .pl-label {
        color: #f1f5f9;
        border-bottom-color: #2d3748;
      }

      :host-context(.dark) .empty-box {
        background: #1e2a3a;
        border-color: #2d3748;
        color: #64748b;
      }

      :host-context(.dark) .skel-card {
        background: linear-gradient(90deg, #1e2a3a 25%, #2d3748 50%, #1e2a3a 75%);
        background-size: 200% 100%;
      }
    `,
  ],
})
export class DashboardComponent {
  newsService = inject(NewsService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private langService = inject(LangService);

  readonly tx = computed(() => {
    const es = this.langService.lang() === 'es';
    return {
      heroSub: es
        ? 'Tu hub de productividad — Noticias, Notas y más'
        : 'Your productivity hub — News, Notes & More',
      news: es ? 'Noticias' : 'News',
      notes: es ? 'Notas' : 'Notes',
      calculator: es ? 'Calculadora' : 'Calculator',
      latestNews: es ? 'Últimas Noticias' : 'Latest News',
      seeAll: es ? 'Ver todo' : 'See all',
      noNews: es ? 'Sin noticias disponibles' : 'No news available',
      recommendedPlaylists: es ? 'Playlists Recomendadas' : 'Recommended Playlists',
      days: es
        ? ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      months: es
        ? [
            'enero',
            'febrero',
            'marzo',
            'abril',
            'mayo',
            'junio',
            'julio',
            'agosto',
            'septiembre',
            'octubre',
            'noviembre',
            'diciembre',
          ]
        : [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
    };
  });

  playlists: DashPlaylist[] = [
    {
      id: '37i9dQZF1DWZeKCadgRdKQ',
      name: 'Focus Flow',
      emoji: '🎯',
      safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator',
      ),
    },
    {
      id: '37i9dQZF1DWdPom8yNOT6f',
      name: 'Beast Mode',
      emoji: '💪',
      safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://open.spotify.com/embed/playlist/37i9dQZF1DWdPom8yNOT6f?utm_source=generator',
      ),
    },
    {
      id: '37i9dQZF1DWWQRwui0ExPn',
      name: 'Lo-Fi Beats',
      emoji: '🌙',
      safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator',
      ),
    },
  ];

  latestNews = computed(() => this.newsService.articles().slice(0, 3));

  currentDateTime = computed(() => {
    const now = new Date();
    const { days, months } = this.tx();
    const es = this.langService.lang() === 'es';
    if (es) {
      return `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
    }
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  });

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  openUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}
