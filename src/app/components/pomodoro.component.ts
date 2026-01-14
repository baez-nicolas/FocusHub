import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PomodoroService } from '../services/pomodoro.service';

@Component({
  selector: 'app-pomodoro',
  imports: [FormsModule],
  template: `
    <div class="container">
      <div class="timer-section">
        <div class="status-label">{{ stateLabel() }}</div>

        <div class="timer">{{ formatTime() }}</div>

        <div class="cycles">
          @for (cycle of [].constructor(service.config().cyclesBeforeLongBreak); track $index) {
          <div class="cycle-dot" [class.active]="$index < service.cycleCount()"></div>
          }
        </div>
        <div class="cycle-text">
          Ciclo {{ service.cycleCount() + 1 }} de {{ service.config().cyclesBeforeLongBreak }}
        </div>

        <div class="controls">
          @if (service.state() === 'IDLE') {
          <button class="btn btn-start" (click)="service.start()">▶ Iniciar</button>
          } @else if (service.state() === 'PAUSED') {
          <button class="btn btn-resume" (click)="service.start()">▶ Reanudar</button>
          <button class="btn btn-stop" (click)="service.stop()">■ Stop</button>
          } @else {
          <button class="btn btn-pause" (click)="service.pause()">❚❚ Pausar</button>
          <button class="btn btn-skip" (click)="service.skip()">⏭ Skip</button>
          }
        </div>
      </div>

      <div class="config-section">
        <div class="config-header">⚙️ Configuración</div>

        <div class="config-grid">
          <div class="config-item">
            <label>Tiempo de foco</label>
            <input type="number" [(ngModel)]="tempConfig.focusMinutes" min="1" max="60" />
            <span class="unit">min</span>
          </div>

          <div class="config-item">
            <label>Descanso corto</label>
            <input type="number" [(ngModel)]="tempConfig.shortBreakMinutes" min="1" max="30" />
            <span class="unit">min</span>
          </div>

          <div class="config-item">
            <label>Descanso largo</label>
            <input type="number" [(ngModel)]="tempConfig.longBreakMinutes" min="1" max="60" />
            <span class="unit">min</span>
          </div>

          <div class="config-item">
            <label>Ciclos antes de descanso largo</label>
            <input type="number" [(ngModel)]="tempConfig.cyclesBeforeLongBreak" min="1" max="10" />
            <span class="unit">ciclos</span>
          </div>
        </div>

        <button class="btn-save" (click)="saveConfig()">✓ Guardar Configuración</button>
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
        margin-bottom: 24px;
        font-variant-numeric: tabular-nums;
        text-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .cycles {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-bottom: 12px;
      }

      .cycle-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.25);
        transition: all 0.3s;
      }

      .cycle-dot.active {
        background: white;
        box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
        transform: scale(1.1);
      }

      .cycle-text {
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

      .config-section {
        background: white;
        border-radius: 20px;
        padding: 32px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #f3f4f6;
      }

      :host-context(.dark) .config-section {
        background: #1e2433 !important;
        border: 1px solid #2d3748 !important;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3) !important;
      }

      .config-header {
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 28px;
        text-align: center;
      }

      :host-context(.dark) .config-header {
        color: #d1d5db !important;
      }

      .config-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        margin-bottom: 28px;
      }

      .config-item {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .config-item label {
        font-size: 13px;
        font-weight: 600;
        color: #6b7280;
        text-transform: lowercase;
      }

      :host-context(.dark) .config-item label {
        color: #9ca3af !important;
      }

      .config-item input {
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        transition: all 0.2s;
        text-align: center;
      }

      :host-context(.dark) .config-item input {
        background: #252b3b !important;
        border: 2px solid #2d3748 !important;
        color: #d1d5db !important;
      }

      .config-item input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      :host-context(.dark) .config-item input:focus {
        border-color: #7066e0 !important;
        box-shadow: 0 0 0 3px rgba(112, 102, 224, 0.2) !important;
      }

      .config-item .unit {
        font-size: 12px;
        color: #9ca3af;
        font-weight: 600;
        text-align: center;
      }

      :host-context(.dark) .config-item .unit {
        color: #6b7280 !important;
      }

      .btn-save {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .btn-save:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      .btn-save:active {
        transform: translateY(0);
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

        .config-section {
          padding: 24px 20px;
        }

        .config-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .btn {
          padding: 12px 24px;
          font-size: 15px;
        }
      }

      @media (max-width: 576px) {
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
