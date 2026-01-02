import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PlannerService } from '../services/planner.service';
import { PomodoroService } from '../services/pomodoro.service';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="row g-4">
        <div class="col-12 col-lg-8">
          <div class="card timer-card shadow-sm border-0">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-clock-history text-primary fs-4 me-2"></i>
                <h5 class="mb-0 fw-bold">{{ stateLabel() }}</h5>
              </div>

              <div class="timer-display text-center my-4">
                <div class="timer-value">{{ formatTime() }}</div>
                <div class="timer-cycle text-muted mt-2">
                  <small
                    >Ciclo {{ pomodoro.cycleCount() + 1 }} de
                    {{ pomodoro.config().cyclesBeforeLongBreak }}</small
                  >
                </div>
              </div>

              <div class="d-flex gap-2 justify-content-center flex-wrap">
                @if (pomodoro.state() === 'IDLE') {
                <button class="btn btn-primary btn-lg px-5" (click)="pomodoro.start()">
                  <i class="bi bi-play-fill me-2"></i>Iniciar
                </button>
                } @else if (pomodoro.state() === 'PAUSED') {
                <button class="btn btn-success btn-lg px-4" (click)="pomodoro.start()">
                  <i class="bi bi-play-fill me-2"></i>Reanudar
                </button>
                <button class="btn btn-outline-danger btn-lg px-4" (click)="pomodoro.stop()">
                  <i class="bi bi-stop-fill me-2"></i>Stop
                </button>
                } @else {
                <button class="btn btn-warning btn-lg px-4" (click)="pomodoro.pause()">
                  <i class="bi bi-pause-fill me-2"></i>Pausar
                </button>
                <button class="btn btn-outline-danger btn-lg px-4" (click)="pomodoro.stop()">
                  <i class="bi bi-stop-fill me-2"></i>Stop
                </button>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body p-4">
              <h6 class="text-muted mb-3 text-uppercase small fw-bold">
                <i class="bi bi-lightning-charge me-1"></i>Hoy
              </h6>
              <div class="stat-item mb-3">
                <div class="d-flex align-items-center">
                  <div
                    class="stat-icon bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3"
                  >
                    <i class="bi bi-clock"></i>
                  </div>
                  <div>
                    <h3 class="mb-0 fw-bold">{{ stats.focusMinutesToday() }}</h3>
                    <small class="text-muted">minutos de foco</small>
                  </div>
                </div>
              </div>
              <div class="stat-item">
                <div class="d-flex align-items-center">
                  <div
                    class="stat-icon bg-success bg-opacity-10 text-success rounded-circle p-2 me-3"
                  >
                    <i class="bi bi-check-circle"></i>
                  </div>
                  <div>
                    <h3 class="mb-0 fw-bold">{{ todayCompletion() }}</h3>
                    <small class="text-muted">tareas completadas</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-calendar-event text-info fs-5 me-2"></i>
                <h6 class="mb-0 fw-bold">Próximo bloque</h6>
              </div>
              @if (nextBlock(); as block) {
              <div class="alert alert-info mb-0 d-flex align-items-start">
                <i class="bi bi-clock me-2 mt-1"></i>
                <div>
                  <div class="fw-bold">{{ block.title }}</div>
                  <small>{{ block.startTime }} – {{ block.endTime }}</small>
                </div>
              </div>
              } @else {
              <div class="text-center text-muted py-3">
                <i class="bi bi-inbox fs-1 d-block mb-2 opacity-25"></i>
                <small>Sin bloques programados</small>
              </div>
              }
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-fire text-danger fs-5 me-2"></i>
                <h6 class="mb-0 fw-bold">Racha</h6>
              </div>
              <div class="text-center">
                <div class="display-4 fw-bold text-danger">{{ stats.streak() }}</div>
                <small class="text-muted">días consecutivos</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        max-width: 1400px;
        margin: 0 auto;
      }

      .timer-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .timer-card .text-primary {
        color: white !important;
      }

      .timer-value {
        font-size: 5rem;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        letter-spacing: -2px;
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      @media (max-width: 768px) {
        .timer-value {
          font-size: 3.5rem;
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
