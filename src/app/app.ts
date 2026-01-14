import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-container">
      <nav class="sidebar d-none d-lg-flex flex-column p-3">
        <div class="brand mb-4">
          <i class="bi bi-bullseye text-primary fs-2"></i>
          <h4 class="ms-2 mb-0 fw-bold">FocusHub</h4>
        </div>

        <div class="nav-links flex-column">
          @for (item of navItems; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.exact }"
            class="nav-link"
            [class.mt-auto]="item.divider"
          >
            <i [class]="'bi bi-' + item.icon"></i>
            <span>{{ item.label }}</span>
          </a>
          }
        </div>
      </nav>

      <div class="main-content">
        <nav class="mobile-navbar d-lg-none">
          <div class="mobile-header">
            <div class="brand-mobile">
              <i class="bi bi-bullseye text-primary"></i>
              <span class="fw-bold">FocusHub</span>
            </div>
            <button class="menu-toggle" (click)="toggleMenu()" [class.active]="menuOpen()">
              <span></span>
              <span></span>
              <span></span>
            </button>
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
        <footer class="app-footer">
          <p>&copy; 2026 Nicolás Báez</p>
        </footer>
      </div>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        height: 100vh;
        overflow: hidden;
      }

      .sidebar {
        width: 260px;
        background: linear-gradient(180deg, #1a1d29 0%, #0f111a 100%);
        color: white;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
        z-index: 1000;
      }

      .brand {
        display: flex;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .brand h4 {
        color: white;
      }

      .nav-links {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
      }

      .sidebar .nav-link {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        border-radius: 10px;
        transition: all 0.2s ease;
        font-weight: 500;
      }

      .sidebar .nav-link i {
        font-size: 20px;
        width: 24px;
        margin-right: 12px;
      }

      .sidebar .nav-link:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        transform: translateX(4px);
      }

      .sidebar .nav-link.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 0;
        background: #f8f9fa;
      }

      @media (min-width: 768px) {
        .main-content {
          margin-left: 260px;
        }
      }

      .mobile-navbar {
        background: white;
        border-bottom: 2px solid #e5e7eb;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .mobile-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
      }

      .brand-mobile {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
      }

      .brand-mobile i {
        font-size: 24px;
      }

      .menu-toggle {
        background: none;
        border: none;
        width: 30px;
        height: 24px;
        position: relative;
        cursor: pointer;
        padding: 0;
        z-index: 101;
      }

      .menu-toggle span {
        display: block;
        position: absolute;
        height: 3px;
        width: 100%;
        background: #1a1d29;
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
        background: rgba(0, 0, 0, 0.5);
        z-index: 99;
        animation: fadeIn 0.3s ease;
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
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        padding: 80px 20px 20px;
        animation: slideIn 0.3s ease;
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
        padding: 14px 16px;
        color: #374151;
        text-decoration: none;
        border-radius: 10px;
        font-weight: 500;
        transition: all 0.2s ease;
        margin-bottom: 4px;
      }

      .mobile-link i {
        font-size: 20px;
        width: 24px;
      }

      .mobile-link:hover {
        background: #f3f4f6;
        color: #667eea;
      }

      .mobile-link.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .content-area {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
      }

      @media (max-width: 767px) {
        .content-area {
          padding: 16px;
        }
      }

      .app-footer {
        background: white;
        border-top: 1px solid #e5e7eb;
        padding: 16px 24px;
        text-align: center;
      }

      .app-footer p {
        margin: 0;
        color: #6b7280;
        font-size: 14px;
        font-weight: 500;
      }

      @media (max-width: 767px) {
        .app-footer {
          padding: 12px 16px;
        }

        .app-footer p {
          font-size: 13px;
        }
      }
    `,
  ],
})
export class App {
  menuOpen = signal(false);

  navItems = [
    { path: '/', label: 'Dashboard', icon: 'house-door', exact: true, divider: false },
    { path: '/pomodoro', label: 'Pomodoro', icon: 'clock-history', exact: false, divider: false },
    { path: '/planner', label: 'Planner', icon: 'calendar-check', exact: false, divider: false },
    { path: '/stats', label: 'Stats', icon: 'bar-chart', exact: false, divider: false },
    { path: '/gym', label: 'Gym', icon: 'heart-pulse', exact: false, divider: false },
    { path: '/notes', label: 'Notas', icon: 'journal-text', exact: false, divider: false },
    { path: '/calculator', label: 'Calculadora', icon: 'calculator', exact: false, divider: false },
    { path: '/more', label: 'Más Info', icon: 'info-circle', exact: false, divider: true },
  ];

  toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
