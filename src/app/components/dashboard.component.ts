import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PlannerService } from '../services/planner.service';
import { PomodoroService } from '../services/pomodoro.service';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="container">
      <div class="timer-section">
        <div class="status-label">{{ stateLabel() }}</div>
        <div class="timer">{{ formatTime() }}</div>
        <div class="cycle-info">
          Ciclo {{ pomodoro.cycleCount() + 1 }} de {{ pomodoro.config().cyclesBeforeLongBreak }}
        </div>

        <div class="controls">
          @if (pomodoro.state() === 'IDLE') {
          <button class="btn btn-start" (click)="pomodoro.start()">▶ Iniciar</button>
          } @else if (pomodoro.state() === 'PAUSED') {
          <button class="btn btn-resume" (click)="pomodoro.start()">▶ Reanudar</button>
          <button class="btn btn-stop" (click)="pomodoro.stop()">■ Stop</button>
          } @else {
          <button class="btn btn-pause" (click)="pomodoro.pause()">❚❚ Pausar</button>
          <button class="btn btn-skip" (click)="pomodoro.skip()">⏭ Skip</button>
          }
        </div>
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
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 24px;
      }

      .timer-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 24px;
        padding: 48px 32px;
        text-align: center;
        margin-bottom: 32px;
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
      }

      .status-label {
        font-size: 18px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.95);
        margin-bottom: 24px;
        letter-spacing: 0.3px;
      }

      .timer {
        font-size: 96px;
        font-weight: 800;
        color: white;
        letter-spacing: -4px;
        line-height: 1;
        margin-bottom: 16px;
        font-variant-numeric: tabular-nums;
        text-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .cycle-info {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 32px;
        font-weight: 500;
      }

      .controls {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn {
        padding: 14px 32px;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      }

      .btn:active {
        transform: translateY(0);
      }

      .btn-start,
      .btn-resume {
        background: white;
        color: #667eea;
      }

      .btn-pause {
        background: #fbbf24;
        color: white;
      }

      .btn-stop,
      .btn-skip {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        backdrop-filter: blur(10px);
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

      @media (max-width: 768px) {
        .container {
          padding: 24px 16px;
        }

        .timer-section {
          padding: 36px 24px;
        }

        .timer {
          font-size: 72px;
          letter-spacing: -2px;
        }

        .btn {
          padding: 12px 24px;
          font-size: 15px;
        }

        .stats-grid {
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .stat-card {
          padding: 24px 20px;
        }
      }

      @media (max-width: 480px) {
        .timer {
          font-size: 64px;
        }

        .controls {
          gap: 10px;
        }

        .btn {
          flex: 1;
          min-width: 140px;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  constructor(
    protected pomodoro: PomodoroService,
    private planner: PlannerService,
    protected stats: StatsService,
    private router: Router
  ) {}

  stateLabel = computed(() => {
    const st = this.pomodoro.state();
    if (st === 'IDLE') return 'Listo para comenzar';
    if (st === 'PAUSED') return 'En pausa';
    if (st === 'RUNNING_FOCUS') return '🎯 Modo Foco';
    if (st === 'RUNNING_SHORT_BREAK') return '☕ Descanso Corto';
    if (st === 'RUNNING_LONG_BREAK') return '🌟 Descanso Largo';
    return '';
  });

  formatTime = computed(() => {
    const sec = this.pomodoro.secondsLeft();
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  nextBlock = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    const blocks = this.planner.getBlocksForDate(today);
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    return blocks.find((b) => b.startTime >= currentTime);
  });

  todayCompletion = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    const blocks = this.planner.getBlocksForDate(today);
    const done = blocks.filter((b) => b.status === 'DONE').length;
    return `${done}/${blocks.length}`;
  });
}
