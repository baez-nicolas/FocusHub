import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NewsService } from './services/news.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-container" [class.dark]="themeService.isDark()">
      <nav class="topnav">
        <div class="topnav-inner">
          <a routerLink="/" class="topnav-brand">
            <img src="/assets/icono.png" alt="FocusHub" class="brand-logo" />
            <span class="brand-name">FocusHub</span>
          </a>

          <div class="topnav-links">
            @for (item of navItems; track item.path) {
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

          <button class="theme-btn" (click)="themeService.toggle()">
            @if (themeService.isDark()) {
              <i class="bi bi-sun-fill"></i>
            } @else {
              <i class="bi bi-moon-fill"></i>
            }
          </button>
        </div>
      </nav>

      <nav class="mobile-navbar">
        <div class="mobile-header">
          <div class="brand-mobile">
            <img src="/assets/icono.png" alt="FocusHub" class="brand-logo-mobile" />
            <span class="fw-bold">FocusHub</span>
          </div>
          <div class="mobile-actions">
            <button class="theme-toggle-mobile" (click)="themeService.toggle()">
              @if (themeService.isDark()) {
                <i class="bi bi-sun-fill"></i>
              } @else {
                <i class="bi bi-moon-fill"></i>
              }
            </button>
            <button class="menu-toggle" (click)="toggleMenu()" [class.active]="menuOpen()">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        @if (menuOpen()) {
          <div class="mobile-menu" (click)="closeMenu()">
            <div class="mobile-menu-content" (click)="$event.stopPropagation()">
              @for (item of navItems; track item.path) {
                <a
                  [routerLink]="item.path"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: item.exact }"
                  class="mobile-link"
                  (click)="closeMenu()"
                >
                  <i [class]="'bi bi-' + item.icon"></i>
                  <span>{{ item.label }}</span>
                </a>
              }
            </div>
          </div>
        }
      </nav>

      <main class="content-area">
        <router-outlet />
      </main>

      @if (newsService.footerReady()) {
        <footer class="app-footer">
          <p class="footer-credits">
            Desarrollado con <span class="heart">♥</span> por
            <a
              href="https://github.com/baez-nicolas"
              target="_blank"
              rel="noopener noreferrer"
              class="author-link"
              >Nicolás Báez</a
            >
          </p>
          <p class="footer-powered">
            Powered by
            <a
              href="https://open-platform.theguardian.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="guardian-link"
              >The Guardian API</a
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
          <p class="footer-legal">Fines educativos &copy; 2026</p>
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

      /* ─── TOP NAVBAR (desktop / tablet) ─── */

      .topnav {
        display: none;
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

      @media (min-width: 768px) {
        .topnav {
          display: flex;
          align-items: center;
        }

        .mobile-navbar {
          display: none;
        }
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
        margin-right: 8px;
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

      @media (min-width: 768px) and (max-width: 1023px) {
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

      /* ─── MOBILE NAVBAR ─── */

      .mobile-navbar {
        background: white;
        border-bottom: 1.5px solid #e5e7eb;
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
      }

      .mobile-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 20px;
        position: relative;
        z-index: 1001;
      }

      .mobile-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .brand-logo-mobile {
        width: 30px;
        height: 30px;
        object-fit: contain;
      }

      .brand-mobile {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 17px;
        color: #1e293b;
      }

      .theme-toggle-mobile {
        background: none;
        border: none;
        color: #475569;
        font-size: 21px;
        cursor: pointer;
        padding: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .theme-toggle-mobile:hover {
        transform: scale(1.1);
      }

      .menu-toggle {
        background: none;
        border: none;
        width: 30px;
        height: 24px;
        position: relative;
        cursor: pointer;
        padding: 0;
        z-index: 1002;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .menu-toggle span {
        display: block;
        position: absolute;
        height: 2.5px;
        width: 100%;
        background: #475569;
        border-radius: 3px;
        opacity: 1;
        left: 0;
        transition: all 0.3s ease;
      }

      .menu-toggle span:nth-child(1) {
        top: 0;
      }
      .menu-toggle span:nth-child(2) {
        top: 10px;
      }
      .menu-toggle span:nth-child(3) {
        top: 20px;
      }

      .menu-toggle.active span:nth-child(1) {
        top: 10px;
        transform: rotate(135deg);
      }

      .menu-toggle.active span:nth-child(2) {
        opacity: 0;
        left: -60px;
      }

      .menu-toggle.active span:nth-child(3) {
        top: 10px;
        transform: rotate(-135deg);
      }

      .mobile-menu {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        z-index: 999;
        animation: fadeIn 0.25s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .mobile-menu-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 280px;
        height: 100vh;
        background: white;
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        padding: 80px 16px 20px;
        animation: slideIn 0.28s ease;
        overflow-y: auto;
      }

      @keyframes slideIn {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }

      .mobile-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 13px 16px;
        color: #374151;
        text-decoration: none;
        border-radius: 10px;
        font-weight: 500;
        font-size: 14.5px;
        transition: all 0.2s ease;
        margin-bottom: 3px;
      }

      .mobile-link i {
        font-size: 19px;
        width: 22px;
      }

      .mobile-link:hover {
        background: #f3f4f6;
        color: #6366f1;
      }

      .mobile-link.active {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }

      /* ─── CONTENT AREA ─── */

      .content-area {
        flex: 1;
        overflow-y: auto;
      }

      @media (min-width: 768px) {
        .content-area {
          margin-top: 64px;
        }
      }

      /* ─── FOOTER ─── */

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

      /* ─── DARK MODE ─── */

      .app-container.dark {
        background: #0f1419;
      }

      .app-container.dark .topnav {
        background: rgba(22, 28, 45, 0.97);
        border-bottom-color: #2d3748;
        box-shadow: 0 1px 12px rgba(0, 0, 0, 0.3);
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

      .app-container.dark .mobile-navbar {
        background: #161c2d;
        border-bottom-color: #2d3748;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .app-container.dark .brand-mobile {
        color: #e2e8f0;
      }

      .app-container.dark .theme-toggle-mobile {
        color: #94a3b8;
      }

      .app-container.dark .menu-toggle span {
        background: #94a3b8;
      }

      .app-container.dark .mobile-menu-content {
        background: #161c2d;
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
      }

      .app-container.dark .mobile-link {
        color: #cbd5e1;
      }

      .app-container.dark .mobile-link:hover {
        background: #1e2a3a;
        color: #e2e8f0;
      }

      .app-container.dark .mobile-link.active {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
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
  newsService = inject(NewsService);
  menuOpen = signal(false);

  constructor() {
    afterNextRender(() => {
      this.newsService.fetchNews();
    });
  }

  navItems = [
    { path: '/', label: 'Dashboard', icon: 'house-door', exact: true },
    { path: '/pomodoro', label: 'Pomodoro', icon: 'clock-history', exact: false },
    { path: '/planner', label: 'Planner', icon: 'calendar-check', exact: false },
    { path: '/gym', label: 'Gym', icon: 'heart-pulse', exact: false },
    { path: '/notes', label: 'Notas', icon: 'journal-text', exact: false },
    { path: '/news', label: 'News', icon: 'newspaper', exact: false },
    { path: '/calculator', label: 'Calculadora', icon: 'calculator', exact: false },
    { path: '/more', label: 'Más Info', icon: 'info-circle', exact: false },
  ];

  toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
