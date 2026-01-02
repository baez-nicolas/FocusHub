import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PomodoroService } from '../services/pomodoro.service';

@Component({
  selector: 'app-pomodoro',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col">
          <h2 class="fw-bold mb-1">
            <i class="bi bi-clock-history text-primary me-2"></i>Pomodoro
          </h2>
          <p class="text-muted mb-0">Configura tu técnica de productividad</p>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-12 col-lg-4">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-white border-bottom">
              <h6 class="mb-0 fw-bold"><i class="bi bi-gear me-2"></i>Configuración</h6>
            </div>
            <div class="card-body p-4">
              <div class="mb-3">
                <label class="form-label small text-muted fw-bold">TIEMPO DE FOCO (MIN)</label>
                <input
                  type="number"
                  class="form-control form-control-lg"
                  [(ngModel)]="tempConfig.focusMinutes"
                  min="1"
                  max="60"
                />
              </div>
              <div class="mb-3">
                <label class="form-label small text-muted fw-bold">DESCANSO CORTO (MIN)</label>
                <input
                  type="number"
                  class="form-control form-control-lg"
                  [(ngModel)]="tempConfig.shortBreakMinutes"
                  min="1"
                  max="30"
                />
              </div>
              <div class="mb-3">
                <label class="form-label small text-muted fw-bold">DESCANSO LARGO (MIN)</label>
                <input
                  type="number"
                  class="form-control form-control-lg"
                  [(ngModel)]="tempConfig.longBreakMinutes"
                  min="1"
                  max="60"
                />
              </div>
              <div class="mb-4">
                <label class="form-label small text-muted fw-bold"
                  >CICLOS ANTES DE DESCANSO LARGO</label
                >
                <input
                  type="number"
                  class="form-control form-control-lg"
                  [(ngModel)]="tempConfig.cyclesBeforeLongBreak"
                  min="1"
                  max="10"
                />
              </div>
              <button class="btn btn-primary w-100" (click)="saveConfig()">
                <i class="bi bi-check-circle me-2"></i>Guardar Configuración
              </button>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-8">
          <div class="card timer-card shadow border-0">
            <div class="card-body p-5 text-center">
              <div class="mb-4">
                <h3 class="fw-bold mb-2">{{ stateLabel() }}</h3>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-white" [style.width.%]="progressPercent()"></div>
                </div>
              </div>

              <div class="timer-display mb-4">
                {{ formatTime() }}
              </div>

              <div class="cycle-indicator mb-4">
                <div class="d-flex justify-content-center gap-2">
                  @for (cycle of [].constructor(service.config().cyclesBeforeLongBreak); track
                  $index) {
                  <div class="cycle-dot" [class.active]="$index < service.cycleCount()"></div>
                  }
                </div>
                <small class="d-block mt-2 opacity-75">
                  Ciclo {{ service.cycleCount() + 1 }} de
                  {{ service.config().cyclesBeforeLongBreak }}
                </small>
              </div>

              <div class="d-flex gap-3 justify-content-center flex-wrap">
                @if (service.state() === 'IDLE') {
                <button class="btn btn-light btn-lg px-5" (click)="service.start()">
                  <i class="bi bi-play-fill me-2"></i>Iniciar
                </button>
                } @else if (service.state() === 'PAUSED') {
                <button class="btn btn-light btn-lg px-4" (click)="service.start()">
                  <i class="bi bi-play-fill me-2"></i>Reanudar
                </button>
                <button class="btn btn-outline-light btn-lg px-4" (click)="service.stop()">
                  <i class="bi bi-stop-fill me-2"></i>Stop
                </button>
                } @else {
                <button class="btn btn-light btn-lg px-4" (click)="service.pause()">
                  <i class="bi bi-pause-fill me-2"></i>Pausar
                </button>
                <button class="btn btn-outline-light btn-lg px-4" (click)="service.skip()">
                  <i class="bi bi-skip-forward me-2"></i>Skip
                </button>
                <button class="btn btn-outline-light btn-lg px-4" (click)="service.stop()">
                  <i class="bi bi-stop-fill me-2"></i>Stop
                </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .timer-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        min-height: 500px;
        display: flex;
        align-items: center;
      }

      .timer-display {
        font-size: 7rem;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        letter-spacing: -4px;
        line-height: 1;
      }

      .cycle-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;
      }

      .cycle-dot.active {
        background: white;
        box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
      }

      @media (max-width: 768px) {
        .timer-display {
          font-size: 4rem;
        }
      }
    `,
  ],
})
export class PomodoroComponent {
  tempConfig: any;

  constructor(protected service: PomodoroService) {
    this.tempConfig = { ...this.service.config() };
  }

  stateLabel = computed(() => {
    const st = this.service.state();
    if (st === 'IDLE') return '⏸️ Listo para comenzar';
    if (st === 'PAUSED') return '⏸️ En pausa';
    if (st === 'RUNNING_FOCUS') return '🎯 Modo Foco Activo';
    if (st === 'RUNNING_SHORT_BREAK') return '☕ Descanso Corto';
    if (st === 'RUNNING_LONG_BREAK') return '🌟 Descanso Largo';
    return '';
  });

  formatTime = computed(() => {
    const sec = this.service.secondsLeft();
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  progressPercent = computed(() => {
    const st = this.service.state();
    const left = this.service.secondsLeft();
    let total = 0;

    if (st === 'RUNNING_FOCUS') total = this.service.config().focusMinutes * 60;
    else if (st === 'RUNNING_SHORT_BREAK') total = this.service.config().shortBreakMinutes * 60;
    else if (st === 'RUNNING_LONG_BREAK') total = this.service.config().longBreakMinutes * 60;

    if (total === 0) return 0;
    return ((total - left) / total) * 100;
  });

  saveConfig(): void {
    this.service.config.set({ ...this.tempConfig });
  }
}
