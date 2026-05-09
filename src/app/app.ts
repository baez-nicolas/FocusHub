import { CommonModule } from '@angular/common';
import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LangService } from './services/lang.service';
import { NewsService } from './services/news.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-container" [class.dark]="themeService.isDark()">
      <nav class="topnav">
        <!-- MOBILE HEADER -->
        <div class="mobile-header">
          <button
            class="hamburger-btn"
            (click)="menuOpen.set(!menuOpen())"
            [attr.aria-expanded]="menuOpen()"
          >
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
          </button>
          <a routerLink="/" class="mobile-brand" (click)="menuOpen.set(false)">
            <span class="brand-name">FocusHub</span>
          </a>
          <div class="mobile-controls">
            <button
              class="lang-btn"
              (click)="langService.toggle()"
              [title]="langService.lang() === 'en' ? 'Cambiar a Español' : 'Switch to English'"
            >
              <i class="bi bi-translate"></i>
              {{ langService.lang() === 'en' ? 'ES' : 'EN' }}
            </button>
            <button class="theme-btn" (click)="themeService.toggle()">
              @if (themeService.isDark()) {
                <i class="bi bi-sun-fill"></i>
              } @else {
                <i class="bi bi-moon-fill"></i>
              }
            </button>
          </div>
        </div>

        <!-- DESKTOP INNER -->
        <div class="topnav-inner">
          <a routerLink="/" class="topnav-brand">
            <img src="/assets/icono.png" alt="FocusHub" class="brand-logo" />
            <span class="brand-name">FocusHub</span>
          </a>

          <div class="topnav-links">
            @for (item of navItems(); track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: item.exact }"
                class="topnav-link"
              >
                <i [class]="'bi bi-' + item.icon"></i>
                <span class="link-label">{{ item.label }}</span>
              </a>
            }
          </div>

          <button
            class="lang-btn"
            (click)="langService.toggle()"
            [title]="langService.lang() === 'en' ? 'Cambiar a Español' : 'Switch to English'"
          >
            <i class="bi bi-translate"></i>
            {{ langService.lang() === 'en' ? 'ES' : 'EN' }}
          </button>
          <button class="theme-btn" (click)="themeService.toggle()">
            @if (themeService.isDark()) {
              <i class="bi bi-sun-fill"></i>
            } @else {
              <i class="bi bi-moon-fill"></i>
            }
          </button>
        </div>
      </nav>

      <!-- MOBILE DRAWER (outside nav for correct stacking) -->
      @if (menuOpen()) {
        <div class="mobile-overlay" (click)="menuOpen.set(false)"></div>
        <div class="mobile-drawer">
          @for (item of navItems(); track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.exact }"
              class="drawer-link"
              (click)="menuOpen.set(false)"
            >
              <i [class]="'bi bi-' + item.icon"></i>
              <span>{{ item.label }}</span>
            </a>
          }
        </div>
      }

      <main class="content-area">
        <router-outlet />
      </main>

      @if (newsService.footerReady()) {
        <footer class="app-footer">
          <p class="footer-credits">
            {{ langService.lang() === 'es' ? 'Desarrollado con' : 'Developed with' }}
            <span class="heart">♥</span> {{ langService.lang() === 'es' ? 'por' : 'by' }}
            <a
              href="https://github.com/baez-nicolas"
              target="_blank"
              rel="noopener noreferrer"
              class="author-link"
              >Nicolás Báez</a
            >
          </p>
          <p class="footer-powered">
            {{ langService.lang() === 'es' ? 'Impulsado por' : 'Powered by' }}
            <a
              href="https://open-platform.theguardian.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="guardian-link"
              >The Guardian API</a
            >
            &amp;
            <a
              href="https://developer.spotify.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="spotify-link"
              >Spotify</a
            >
          </p>
          <div class="footer-socials">
            <a
              href="https://github.com/baez-nicolas"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn"
              aria-label="GitHub"
            >
              <i class="bi bi-github"></i>
            </a>
            <a href="mailto:nicolasbaez1201@gmail.com" class="social-btn" aria-label="Email">
              <i class="bi bi-envelope-fill"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/baez-nicolas/"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn"
              aria-label="LinkedIn"
            >
              <i class="bi bi-linkedin"></i>
            </a>
          </div>
          <p class="footer-legal">
            {{ langService.lang() === 'en' ? 'Educational purposes' : 'Fines educativos' }}
            &copy; 2026
          </p>
        </footer>
      }
    </div>
  `,
  styles: [
    `
      * {
        box-sizing: border-box;
      }

      .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: #f1f5f9;
      }

      .topnav {
        display: flex;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 64px;
        background: rgba(255, 255, 255, 0.97);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid #e2e8f0;
        box-shadow: 0 1px 12px rgba(0, 0, 0, 0.06);
        z-index: 1000;
      }

      .topnav-inner {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 24px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .topnav-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        flex-shrink: 0;
        margin-right: 16px;
      }

      .brand-logo {
        width: 34px;
        height: 34px;
        object-fit: contain;
      }

      .brand-name {
        font-size: 17px;
        font-weight: 700;
        color: #1e293b;
        letter-spacing: -0.3px;
      }

      .topnav-links {
        display: flex;
        align-items: center;
        gap: 2px;
        flex: 1;
        justify-content: flex-end;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .topnav-links::-webkit-scrollbar {
        display: none;
      }

      .topnav-link {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 10px;
        text-decoration: none;
        color: #64748b;
        font-size: 13.5px;
        font-weight: 500;
        transition: all 0.18s ease;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .topnav-link i {
        font-size: 16px;
        line-height: 1;
      }

      .topnav-link:hover {
        background: #f1f5f9;
        color: #1e293b;
      }

      .topnav-link.active {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        box-shadow: 0 3px 10px rgba(99, 102, 241, 0.35);
      }

      .topnav-link.active:hover {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      }

      @media (max-width: 1023px) {
        .link-label {
          display: none;
        }

        .topnav-link {
          padding: 9px 10px;
        }

        .topnav-link i {
          font-size: 18px;
        }
      }

      @media (max-width: 480px) {
        .topnav-inner {
          padding: 0 10px;
          gap: 4px;
        }

        .brand-name {
          display: none;
        }

        .brand-logo {
          width: 28px;
          height: 28px;
        }
      }

      /* MOBILE HEADER */
      .mobile-header {
        display: none;
      }

      @media (max-width: 820px) {
        .topnav-inner {
          display: none;
        }

        .mobile-header {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0 16px;
          height: 64px;
          position: relative;
        }

        .mobile-brand {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .mobile-controls {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
        }
      }

      .hamburger-btn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        width: 40px;
        height: 40px;
        padding: 8px;
        background: none;
        border: none;
        cursor: pointer;
        border-radius: 8px;
        flex-shrink: 0;
      }

      .hamburger-btn:hover {
        background: #f1f5f9;
      }

      .hamburger-bar {
        display: block;
        width: 22px;
        height: 2px;
        background: #475569;
        border-radius: 2px;
        transition: background 0.2s;
      }

      .mobile-overlay {
        position: fixed;
        inset: 64px 0 0 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 998;
        animation: fadeOverlay 0.2s ease;
      }

      @keyframes fadeOverlay {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .mobile-drawer {
        position: fixed;
        top: 64px;
        left: 0;
        bottom: 0;
        width: 260px;
        background: white;
        z-index: 999;
        display: flex;
        flex-direction: column;
        padding: 16px 12px;
        gap: 4px;
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.12);
        animation: slideDrawer 0.22s ease;
        overflow-y: auto;
      }

      @keyframes slideDrawer {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }

      .drawer-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 12px;
        text-decoration: none;
        color: #475569;
        font-size: 15px;
        font-weight: 500;
        transition: all 0.18s;
      }

      .drawer-link i {
        font-size: 20px;
        width: 24px;
        text-align: center;
      }

      .drawer-link:hover {
        background: #f1f5f9;
        color: #1e293b;
      }

      .drawer-link.active {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        box-shadow: 0 3px 10px rgba(99, 102, 241, 0.3);
      }

      .theme-btn {
        flex-shrink: 0;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        color: #475569;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        margin-left: 8px;
      }

      .theme-btn:hover {
        background: #e2e8f0;
        color: #1e293b;
        transform: scale(1.05);
      }

      .lang-btn {
        flex-shrink: 0;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        color: #475569;
        height: 38px;
        padding: 0 12px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.2s ease;
        margin-left: 4px;
        letter-spacing: 0.5px;
      }

      .lang-btn:hover {
        background: #e2e8f0;
        color: #1e293b;
        transform: scale(1.05);
      }

      .content-area {
        flex: 1;
        margin-top: 64px;
      }

      @keyframes footerFadeIn {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .app-footer {
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        padding: 32px 24px 24px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        animation: footerFadeIn 0.7s ease forwards;
      }

      .footer-credits {
        margin: 0;
        font-size: 14px;
        color: #64748b;
      }

      .footer-credits strong {
        color: #1e293b;
        font-weight: 700;
      }

      .author-link {
        color: #1e293b;
        font-weight: 700;
        text-decoration: none;
        position: relative;
        transition: color 0.2s ease;
      }

      .author-link::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        border-radius: 2px;
        transition: width 0.25s ease;
      }

      .author-link:hover {
        color: #6366f1;
      }

      .author-link:hover::after {
        width: 100%;
      }

      .heart {
        color: #f43f5e;
      }

      .footer-powered {
        margin: 0;
        font-size: 13.5px;
        color: #94a3b8;
      }

      .guardian-link {
        color: #6366f1;
        font-weight: 700;
        text-decoration: none;
        transition: color 0.2s ease;
      }

      .guardian-link:hover {
        color: #4f46e5;
      }

      .spotify-link {
        color: #1db954;
        font-weight: 700;
        text-decoration: none;
        transition: color 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .spotify-link:hover {
        color: #17a84a;
      }

      .footer-socials {
        display: flex;
        gap: 12px;
        margin: 6px 0;
      }

      .social-btn {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: #f1f5f9;
        color: #475569;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        text-decoration: none;
        transition: all 0.2s ease;
        border: 1px solid #e2e8f0;
      }

      .social-btn:hover {
        background: #6366f1;
        color: white;
        border-color: #6366f1;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }

      .footer-legal {
        margin: 0;
        font-size: 12px;
        color: #94a3b8;
      }

      @media (min-width: 768px) {
        .app-footer {
          margin-top: 0;
        }
      }

      .app-container.dark {
        background: #0f1419;
      }

      .app-container.dark .topnav {
        background: rgba(22, 28, 45, 0.97);
        border-bottom-color: #2d3748;
        box-shadow: 0 1px 12px rgba(0, 0, 0, 0.3);
      }

      .app-container.dark .hamburger-bar {
        background: #94a3b8;
      }

      .app-container.dark .hamburger-btn:hover {
        background: #1e2a3a;
      }

      .app-container.dark .mobile-drawer {
        background: #161c2d;
      }

      .app-container.dark .drawer-link {
        color: #94a3b8;
      }

      .app-container.dark .drawer-link:hover {
        background: #1e2a3a;
        color: #e2e8f0;
      }

      .app-container.dark .drawer-link.active {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
      }

      .app-container.dark .brand-name {
        color: #f1f5f9;
      }

      .app-container.dark .topnav-link {
        color: #94a3b8;
      }

      .app-container.dark .topnav-link:hover {
        background: #1e2a3a;
        color: #e2e8f0;
      }

      .app-container.dark .topnav-link.active {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
      }

      .app-container.dark .theme-btn {
        background: #1e2a3a;
        border-color: #2d3748;
        color: #94a3b8;
      }

      .app-container.dark .theme-btn:hover {
        background: #2d3748;
        color: #e2e8f0;
      }

      .app-container.dark .app-footer {
        background: #0f111a;
        border-top-color: #1e2a3a;
      }

      .app-container.dark .footer-credits {
        color: #94a3b8;
      }

      .app-container.dark .author-link {
        color: #f1f5f9;
      }

      .app-container.dark .author-link:hover {
        color: #a5b4fc;
      }

      .app-container.dark .footer-powered {
        color: #64748b;
      }

      .app-container.dark .guardian-link {
        color: #3b82f6;
      }

      .app-container.dark .guardian-link:hover {
        color: #60a5fa;
      }

      .app-container.dark .spotify-link {
        color: #1db954;
      }

      .app-container.dark .spotify-link:hover {
        color: #4ade80;
      }

      .app-container.dark .social-btn {
        background: #1e2a3a;
        color: #94a3b8;
        border-color: #2d3748;
      }

      .app-container.dark .social-btn:hover {
        background: #6366f1;
        color: white;
        border-color: #6366f1;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
      }

      .app-container.dark .footer-legal {
        color: #475569;
      }
    `,
  ],
})
export class App {
  themeService = inject(ThemeService);
  langService = inject(LangService);
  newsService = inject(NewsService);
  menuOpen = signal(false);
  constructor() {
    afterNextRender(() => {
      this.newsService.fetchNews();
    });
  }

  navItems = computed(() => {
    const es = this.langService.lang() === 'es';
    return [
      { path: '/', label: es ? 'Inicio' : 'Dashboard', icon: 'house-door', exact: true },
      { path: '/news', label: es ? 'Noticias' : 'News', icon: 'newspaper', exact: false },
      {
        path: '/planner',
        label: es ? 'Planificador' : 'Planner',
        icon: 'calendar-check',
        exact: false,
      },
      { path: '/notes', label: es ? 'Notas' : 'Notes', icon: 'journal-text', exact: false },
      { path: '/gym', label: es ? 'Salud' : 'Health', icon: 'heart-pulse', exact: false },
      {
        path: '/calculator',
        label: es ? 'Calculadora' : 'Calculator',
        icon: 'calculator',
        exact: false,
      },
      { path: '/music', label: 'Spotify', icon: 'spotify', exact: false },
    ];
  });
}
