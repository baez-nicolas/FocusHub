import { Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NewsService } from '../services/news.service';
import { PomodoroService } from '../services/pomodoro.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="news-container">
      <div class="news-header">
        <div class="header-top">
          <div>
            <h1 class="page-title">
              <i class="bi bi-newspaper"></i>
              News
            </h1>
            <p class="page-subtitle">Últimas noticias de The Guardian</p>
          </div>
        </div>

        <div class="controls">
          <div class="search-wrap">
            <i class="bi bi-search search-icon"></i>
            <input
              type="text"
              class="search-input"
              placeholder="Buscar noticias..."
              [(ngModel)]="searchQuery"
              (keydown.enter)="search()"
            />
            @if (searchQuery) {
              <button class="clear-btn" (click)="clearSearch()">
                <i class="bi bi-x"></i>
              </button>
            }
          </div>

          <div class="section-filters">
            @for (s of newsService.sections; track s.value) {
              <button
                class="filter-chip"
                [class.active]="selectedSection === s.value"
                (click)="selectSection(s.value)"
              >
                {{ s.label }}
              </button>
            }
          </div>
        </div>
      </div>

      @if (newsService.loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Cargando noticias...</p>
        </div>
      } @else if (newsService.error()) {
        <div class="error-state">
          <i class="bi bi-wifi-off"></i>
          <p>{{ newsService.error() }}</p>
          <button class="retry-btn" (click)="search()">Reintentar</button>
        </div>
      } @else if (newsService.articles().length === 0) {
        <div class="empty-state">
          <i class="bi bi-newspaper"></i>
          <p>No se encontraron noticias</p>
        </div>
      } @else {
        <div class="articles-grid">
          @for (article of newsService.articles(); track article.id) {
            <a
              class="article-card"
              [href]="article.webUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              @if (article.thumbnail) {
                <div class="card-image">
                  <img [src]="article.thumbnail" [alt]="article.webTitle" loading="lazy" />
                </div>
              } @else {
                <div class="card-image card-image-placeholder">
                  <i class="bi bi-newspaper"></i>
                </div>
              }
              <div class="card-body">
                <div class="card-meta">
                  <span class="section-badge">{{ article.sectionName }}</span>
                  <span class="card-date">{{ formatDate(article.webPublicationDate) }}</span>
                </div>
                <h3 class="card-title">{{ article.webTitle }}</h3>
                @if (article.trailText) {
                  <p class="card-trail" [innerHTML]="article.trailText"></p>
                }
              </div>
              <div class="card-footer">
                <span>Leer en The Guardian</span>
                <i class="bi bi-arrow-up-right"></i>
              </div>
            </a>
          }
        </div>

        <div class="pagination">
          <button
            class="page-btn"
            [disabled]="newsService.currentPage() <= 1"
            (click)="newsService.prevPage()"
          >
            <i class="bi bi-chevron-left"></i>
            Anterior
          </button>
          <span class="page-info">
            Página {{ newsService.currentPage() }} de {{ newsService.totalPages() }}
          </span>
          <button
            class="page-btn"
            [disabled]="newsService.currentPage() >= newsService.totalPages()"
            (click)="newsService.nextPage()"
          >
            Siguiente
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      }
    </div>

    @if (pomodoroService.state() !== 'IDLE' && pomodoroService.state() !== 'PAUSED') {
      <div class="pomodoro-widget" (click)="goToPomodoro()">
        <span class="pomodoro-icon">⏱️</span>
        <div class="pomodoro-content">
          <span class="pomodoro-label">{{ getPhaseLabel() }}</span>
          <span class="pomodoro-time">{{ formatTime() }}</span>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .news-container {
        padding: 32px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .news-header {
        margin-bottom: 28px;
      }

      .header-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 20px;
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
        font-size: 14px;
        margin: 0;
      }

      .controls {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .search-wrap {
        position: relative;
        max-width: 480px;
      }

      .search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
        font-size: 16px;
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        padding: 11px 44px 11px 42px;
        border: 1.5px solid #e2e8f0;
        border-radius: 12px;
        font-size: 14px;
        color: #1e293b;
        background: white;
        outline: none;
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease;
      }

      .search-input:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
      }

      .search-input::placeholder {
        color: #94a3b8;
      }

      .clear-btn {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 4px;
        border-radius: 6px;
        transition: color 0.2s ease;
      }

      .clear-btn:hover {
        color: #475569;
      }

      .section-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .filter-chip {
        padding: 6px 14px;
        border-radius: 20px;
        border: 1.5px solid #e2e8f0;
        background: white;
        color: #64748b;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.18s ease;
        white-space: nowrap;
      }

      .filter-chip:hover {
        border-color: #6366f1;
        color: #6366f1;
      }

      .filter-chip.active {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border-color: transparent;
        color: white;
        box-shadow: 0 3px 10px rgba(99, 102, 241, 0.3);
      }

      /* States */

      .loading-state,
      .error-state,
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 80px 24px;
        gap: 16px;
        color: #94a3b8;
      }

      .loading-state p,
      .error-state p,
      .empty-state p {
        font-size: 16px;
      }

      .spinner {
        width: 44px;
        height: 44px;
        border: 3px solid #e2e8f0;
        border-top-color: #6366f1;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .error-state i,
      .empty-state i {
        font-size: 48px;
        opacity: 0.4;
      }

      .retry-btn {
        padding: 10px 24px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s ease;
      }

      .retry-btn:hover {
        opacity: 0.9;
      }

      /* Articles Grid */

      .articles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 32px;
      }

      .article-card {
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 16px;
        overflow: hidden;
        text-decoration: none;
        border: 1px solid #f1f5f9;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        transition: all 0.22s ease;
      }

      .article-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
        border-color: #e2e8f0;
      }

      .card-image {
        width: 100%;
        height: 180px;
        overflow: hidden;
        background: #f1f5f9;
        flex-shrink: 0;
      }

      .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }

      .article-card:hover .card-image img {
        transform: scale(1.04);
      }

      .card-image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      }

      .card-image-placeholder i {
        font-size: 40px;
        color: #cbd5e1;
      }

      .card-body {
        flex: 1;
        padding: 16px;
      }

      .card-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }

      .section-badge {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #6366f1;
        background: rgba(99, 102, 241, 0.08);
        padding: 3px 8px;
        border-radius: 6px;
      }

      .card-date {
        font-size: 12px;
        color: #94a3b8;
        margin-left: auto;
      }

      .card-title {
        font-size: 15px;
        font-weight: 600;
        color: #1e293b;
        line-height: 1.45;
        margin: 0 0 10px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .card-trail {
        font-size: 13px;
        color: #64748b;
        line-height: 1.5;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-top: 1px solid #f1f5f9;
        font-size: 12px;
        font-weight: 600;
        color: #6366f1;
      }

      .card-footer i {
        font-size: 14px;
        transition: transform 0.2s ease;
      }

      .article-card:hover .card-footer i {
        transform: translate(2px, -2px);
      }

      /* Pagination */

      .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        padding: 8px 0 32px;
      }

      .page-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 20px;
        border: 1.5px solid #e2e8f0;
        border-radius: 10px;
        background: white;
        color: #475569;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .page-btn:hover:not(:disabled) {
        border-color: #6366f1;
        color: #6366f1;
        background: rgba(99, 102, 241, 0.05);
      }

      .page-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .page-info {
        font-size: 14px;
        color: #64748b;
        font-weight: 500;
      }

      /* Responsive */

      @media (max-width: 768px) {
        .news-container {
          padding: 20px 16px;
        }

        .articles-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Pomodoro widget */

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

      .pomodoro-widget:active {
        transform: translateY(-1px);
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

      /* Dark mode overrides (applied via :host-context) */

      :host-context(.dark) .page-title {
        color: #f1f5f9;
      }

      :host-context(.dark) .page-subtitle {
        color: #94a3b8;
      }

      :host-context(.dark) .search-input {
        background: #1e2a3a;
        border-color: #2d3748;
        color: #e2e8f0;
      }

      :host-context(.dark) .search-input::placeholder {
        color: #64748b;
      }

      :host-context(.dark) .search-input:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      }

      :host-context(.dark) .filter-chip {
        background: #1e2a3a;
        border-color: #2d3748;
        color: #94a3b8;
      }

      :host-context(.dark) .filter-chip:hover {
        border-color: #6366f1;
        color: #a5b4fc;
      }

      :host-context(.dark) .filter-chip.active {
        border-color: transparent;
        color: white;
      }

      :host-context(.dark) .article-card {
        background: #161c2d;
        border-color: #1e2a3a;
      }

      :host-context(.dark) .article-card:hover {
        border-color: #2d3748;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
      }

      :host-context(.dark) .card-image {
        background: #1e2a3a;
      }

      :host-context(.dark) .card-image-placeholder {
        background: linear-gradient(135deg, #1e2a3a 0%, #2d3748 100%);
      }

      :host-context(.dark) .card-title {
        color: #e2e8f0;
      }

      :host-context(.dark) .card-trail {
        color: #94a3b8;
      }

      :host-context(.dark) .card-footer {
        border-top-color: #1e2a3a;
      }

      :host-context(.dark) .page-btn {
        background: #161c2d;
        border-color: #2d3748;
        color: #94a3b8;
      }

      :host-context(.dark) .page-btn:hover:not(:disabled) {
        background: #1e2a3a;
        border-color: #6366f1;
        color: #a5b4fc;
      }

      :host-context(.dark) .pomodoro-widget {
        background: linear-gradient(
          135deg,
          rgba(79, 70, 229, 0.95) 0%,
          rgba(124, 58, 237, 0.95) 100%
        );
        border-color: rgba(255, 255, 255, 0.2);
      }
    `,
  ],
})
export class NewsComponent implements OnInit {
  newsService = inject(NewsService);
  pomodoroService = inject(PomodoroService);
  private router = inject(Router);

  searchQuery = '';
  selectedSection = '';

  formatTime = computed(() => {
    const sec = this.pomodoroService.secondsLeft();
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  ngOnInit(): void {
    if (this.newsService.articles().length === 0) {
      this.newsService.fetchNews();
    }
  }

  search(): void {
    this.newsService.fetchNews(this.searchQuery, this.selectedSection, 1);
  }

  selectSection(section: string): void {
    this.selectedSection = section;
    this.newsService.fetchNews(this.searchQuery, section, 1);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.newsService.fetchNews('', this.selectedSection, 1);
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  getPhaseLabel(): string {
    const state = this.pomodoroService.state();
    if (state === 'RUNNING_FOCUS') return 'Enfoque';
    if (state === 'RUNNING_SHORT_BREAK' || state === 'RUNNING_LONG_BREAK') return 'Descanso';
    return '';
  }

  goToPomodoro(): void {
    this.router.navigate(['/pomodoro']);
  }
}
