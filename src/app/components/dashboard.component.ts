import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlannerService } from '../services/planner.service';
import { PomodoroService } from '../services/pomodoro.service';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="container">
      <div class="header">
        <div class="title">🏠 Dashboard</div>
        <div class="subtitle">Tu resumen de productividad</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-value">{{ stats.focusMinutesToday() }}</div>
          <div class="stat-label">minutos de foco</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-value">{{ todayCompletion() }}</div>
          <div class="stat-label">tareas completadas</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">{{ stats.streak() }}</div>
          <div class="stat-label">días consecutivos</div>
        </div>
      </div>

      <div class="next-section">
        <div class="section-header">
          <span class="icon">📅</span>
          <span>Próximo bloque</span>
        </div>
        @if (nextBlock(); as block) {
        <div class="next-block">
          <div class="block-title">{{ block.title }}</div>
          <div class="block-time">{{ block.startTime }} – {{ block.endTime }}</div>
        </div>
        } @else {
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <div class="empty-text">Sin bloques programados</div>
        </div>
        }
      </div>

      <div class="quick-actions">
        <div class="section-header">
          <span class="icon">⚡</span>
          <span>Accesos rápidos</span>
        </div>
        <div class="actions-grid">
          <button class="action-btn" (click)="navigate('/pomodoro')">
            <div class="action-icon">⏱️</div>
            <div class="action-text">Pomodoro</div>
          </button>
          <button class="action-btn" (click)="navigate('/planner')">
            <div class="action-icon">📅</div>
            <div class="action-text">Planner</div>
          </button>
          <button class="action-btn" (click)="navigate('/stats')">
            <div class="action-icon">📊</div>
            <div class="action-text">Stats</div>
          </button>
          <button class="action-btn" (click)="navigate('/calculator')">
            <div class="action-icon">🔢</div>
            <div class="action-text">Calculadora</div>
          </button>
        </div>
      </div>

      @if (pomodoroService.state() !== 'IDLE' && pomodoroService.state() !== 'PAUSED') {
      <div class="pomodoro-widget">
        <div class="pomodoro-label">{{ getPhaseLabel() }}</div>
        <div class="pomodoro-time">{{ formatTime() }}</div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 24px;
      }

      .header {
        margin-bottom: 32px;
        text-align: center;
      }

      .title {
        font-size: 32px;
        font-weight: 700;
        color: #111827;
        letter-spacing: -0.5px;
        margin-bottom: 8px;
      }

      .subtitle {
        font-size: 16px;
        color: #6b7280;
        font-weight: 500;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 32px;
      }

      .stat-card {
        background: white;
        border-radius: 16px;
        padding: 28px 20px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #f3f4f6;
        transition: all 0.3s;
      }

      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .stat-icon {
        font-size: 36px;
        margin-bottom: 12px;
      }

      .stat-value {
        font-size: 32px;
        font-weight: 800;
        color: #111827;
        margin-bottom: 6px;
        line-height: 1;
      }

      .stat-label {
        font-size: 13px;
        color: #6b7280;
        font-weight: 600;
      }

      .next-section {
        background: white;
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #f3f4f6;
        margin-bottom: 32px;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 20px;
      }

      .section-header .icon {
        font-size: 20px;
      }

      .next-block {
        background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
        border-radius: 12px;
        padding: 20px;
        border-left: 4px solid #667eea;
      }

      .block-title {
        font-size: 16px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 6px;
      }

      .block-time {
        font-size: 14px;
        color: #6b7280;
        font-weight: 500;
      }

      .empty-state {
        text-align: center;
        padding: 32px 20px;
      }

      .empty-icon {
        font-size: 48px;
        opacity: 0.3;
        margin-bottom: 12px;
      }

      .empty-text {
        font-size: 14px;
        color: #9ca3af;
        font-weight: 500;
      }

      .quick-actions {
        background: white;
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #f3f4f6;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }

      .action-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 16px;
        padding: 24px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
      }

      .action-btn:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
      }

      .action-icon {
        font-size: 36px;
        margin-bottom: 12px;
      }

      .action-text {
        font-size: 14px;
        font-weight: 600;
        color: white;
      }

      .pomodoro-widget {
        position: fixed;
        bottom: 40px;
        right: 40px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px);
        padding: 20px 32px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        z-index: 10;
        transition: all 0.3s ease;
      }

      .pomodoro-widget:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
      }

      .pomodoro-label {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .pomodoro-time {
        font-size: 36px;
        font-weight: 900;
        color: white;
        font-variant-numeric: tabular-nums;
        letter-spacing: -1px;
        text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      @media (max-width: 768px) {
        .container {
          padding: 24px 16px;
        }

        .stats-grid {
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .stat-card {
          padding: 24px 20px;
        }

        .actions-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .pomodoro-widget {
          bottom: 24px;
          right: 24px;
          padding: 16px 24px;
        }

        .pomodoro-label {
          font-size: 12px;
        }

        .pomodoro-time {
          font-size: 28px;
        }
      }

      @media (max-width: 576px) {
        .actions-grid {
          grid-template-columns: 1fr;
        }

        .pomodoro-widget {
          bottom: 16px;
          right: 16px;
          padding: 12px 20px;
        }

        .pomodoro-label {
          font-size: 11px;
          margin-bottom: 4px;
        }

        .pomodoro-time {
          font-size: 24px;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  pomodoroService = inject(PomodoroService);
  private planner = inject(PlannerService);
  protected stats = inject(StatsService);
  private router = inject(Router);

  formatTime = computed(() => {
    const sec = this.pomodoroService.secondsLeft();
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  getPhaseLabel(): string {
    const state = this.pomodoroService.state();
    if (state === 'RUNNING_FOCUS') {
      return 'Enfoque';
    } else if (state === 'RUNNING_SHORT_BREAK' || state === 'RUNNING_LONG_BREAK') {
      return 'Descanso';
    }
    return '';
  }

  nextBlock = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    const blocks = this.planner.getBlocksForDate(today);
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    return blocks.find((b: any) => b.startTime >= currentTime);
  });

  todayCompletion = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    const blocks = this.planner.getBlocksForDate(today);
    const done = blocks.filter((b: any) => b.status === 'DONE').length;
    return `${done}/${blocks.length}`;
  });

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
