import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link"
          >
            <i class="bi bi-house-door"></i>
            <span>Dashboard</span>
          </a>
          <a routerLink="/pomodoro" routerLinkActive="active" class="nav-link">
            <i class="bi bi-clock-history"></i>
            <span>Pomodoro</span>
          </a>
          <a routerLink="/planner" routerLinkActive="active" class="nav-link">
            <i class="bi bi-calendar-check"></i>
            <span>Planner</span>
          </a>
          <a routerLink="/stats" routerLinkActive="active" class="nav-link">
            <i class="bi bi-bar-chart"></i>
            <span>Stats</span>
          </a>
          <a routerLink="/gym" routerLinkActive="active" class="nav-link">
            <i class="bi bi-heart-pulse"></i>
            <span>Gym</span>
          </a>
          <a routerLink="/notes" routerLinkActive="active" class="nav-link">
            <i class="bi bi-journal-text"></i>
            <span>Notas</span>
          </a>
          <a routerLink="/calculator" routerLinkActive="active" class="nav-link">
            <i class="bi bi-calculator"></i>
            <span>Calculadora</span>
          </a>
          <a routerLink="/setup" routerLinkActive="active" class="nav-link mt-auto">
            <i class="bi bi-cloud-sun"></i>
            <span>Setup</span>
          </a>
        </div>
      </nav>

      <div class="main-content">
        <nav
          class="navbar navbar-expand-lg navbar-light bg-white border-bottom d-lg-none sticky-top"
        >
          <div class="container-fluid">
            <a class="navbar-brand d-flex align-items-center" href="#">
              <i class="bi bi-bullseye text-primary fs-4"></i>
              <span class="ms-2 fw-bold">FocusHub</span>
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mobileNav"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mobileNav">
              <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                  <a
                    routerLink="/"
                    routerLinkActive="active"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="nav-link mobile-link"
                  >
                    <i class="bi bi-house-door me-2"></i>Dashboard
                  </a>
                </li>
                <li class="nav-item">
                  <a routerLink="/pomodoro" routerLinkActive="active" class="nav-link mobile-link">
                    <i class="bi bi-clock-history me-2"></i>Pomodoro
                  </a>
                </li>
                <li class="nav-item">
                  <a routerLink="/planner" routerLinkActive="active" class="nav-link mobile-link">
                    <i class="bi bi-calendar-check me-2"></i>Planner
                  </a>
                </li>
                <li class="nav-item">
                  <a routerLink="/stats" routerLinkActive="active" class="nav-link mobile-link">
                    <i class="bi bi-bar-chart me-2"></i>Stats
                  </a>
                </li>
                <li class="nav-item">
                  <a routerLink="/gym" routerLinkActive="active" class="nav-link mobile-link">
                    <i class="bi bi-heart-pulse me-2"></i>Gym
                  </a>
                </li>
                <li class="nav-item">
                  <a routerLink="/notes" routerLinkActive="active" class="nav-link mobile-link">
                    <i class="bi bi-journal-text me-2"></i>Notas
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    routerLink="/calculator"
                    routerLinkActive="active"
                    class="nav-link mobile-link"
                  >
                    <i class="bi bi-calculator me-2"></i>Calculadora
                  </a>
                </li>
                <li class="nav-item">
                  <a routerLink="/setup" routerLinkActive="active" class="nav-link mobile-link">
                    <i class="bi bi-cloud-sun me-2"></i>Setup
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main class="content-area">
          <router-outlet />
        </main>
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

      @media (min-width: 992px) {
        .main-content {
          margin-left: 260px;
        }
      }

      .content-area {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
      }

      .mobile-link {
        padding: 12px 20px !important;
        border-radius: 8px;
        margin: 4px 0;
      }

      .mobile-link.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white !important;
      }

      .mobile-link:hover {
        background: rgba(102, 126, 234, 0.1);
      }

      @media (max-width: 991px) {
        .content-area {
          padding: 16px;
        }
      }
    `,
  ],
})
export class App {}
