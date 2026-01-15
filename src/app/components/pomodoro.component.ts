import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
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
          <button class="btn btn-config" (click)="openConfigModal()">⚙️ Configuración</button>
          } @else if (service.state() === 'PAUSED') {
          <button class="btn btn-resume" (click)="service.start()">▶ Reanudar</button>
          <button class="btn btn-stop" (click)="service.stop()">■ Stop</button>
          } @else {
          <button class="btn btn-pause" (click)="service.pause()">❚❚ Pausar</button>
          <button class="btn btn-skip" (click)="service.skip()">⏭ Skip</button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px 24px;
      }

      .timer-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 32px;
        padding: 56px 40px;
        text-align: center;
        margin-bottom: 32px;
        box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
        position: relative;
        overflow: hidden;
      }

      .timer-section::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        animation: rotate 20s linear infinite;
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .timer-section > * {
        position: relative;
        z-index: 1;
      }

      :host-context(.dark) .timer-section {
        background: linear-gradient(135deg, #5b5fc7 0%, #6b46a8 100%);
        box-shadow: 0 20px 60px rgba(91, 95, 199, 0.5);
      }

      .status-label {
        font-size: 20px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.95);
        margin-bottom: 32px;
        letter-spacing: 1px;
        text-transform: uppercase;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .timer {
        font-size: 120px;
        font-weight: 900;
        color: white;
        letter-spacing: -6px;
        line-height: 1;
        margin-bottom: 32px;
        font-variant-numeric: tabular-nums;
        text-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      }

      .cycles {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-bottom: 16px;
      }

      .cycle-dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transition: all 0.3s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .cycle-dot.active {
        background: white;
        box-shadow: 0 0 16px rgba(255, 255, 255, 0.8), 0 0 32px rgba(255, 255, 255, 0.4);
        transform: scale(1.2);
      }

      .cycle-text {
        font-size: 15px;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 40px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .controls {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn {
        padding: 16px 40px;
        border: none;
        border-radius: 16px;
        font-size: 17px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        letter-spacing: 0.5px;
      }

      .btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      }

      .btn:active {
        transform: translateY(-1px);
      }

      .btn-start,
      .btn-resume {
        background: white;
        color: #667eea;
        font-size: 18px;
        padding: 18px 48px;
      }

      :host-context(.dark) .btn-start,
      :host-context(.dark) .btn-resume {
        background: rgba(255, 255, 255, 0.2);
        color: #e0e7ff;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .btn-pause {
        background: rgba(251, 191, 36, 0.95);
        color: white;
      }

      .btn-stop,
      .btn-skip {
        background: rgba(255, 255, 255, 0.25);
        color: white;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .btn-config {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.25);
        font-size: 16px;
        padding: 16px 32px;
      }

      :host-context(.dark) .btn-config {
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .config-section {
        background: white;
        border-radius: 24px;
        padding: 40px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid #f3f4f6;
      }

      :host-context(.dark) .config-section {
        background: #1e2433 !important;
        border: 1px solid #374151 !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
      }

      .config-header {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 32px;
        text-align: center;
        letter-spacing: 0.5px;
      }

      :host-context(.dark) .config-header {
        color: #e5e7eb !important;
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

      :host-context(.dark) .btn-save {
        background: linear-gradient(135deg, #5b5fc7 0%, #6b46a8 100%);
        box-shadow: 0 4px 12px rgba(91, 95, 199, 0.4);
      }

      .btn-save:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      :host-context(.dark) .btn-save:hover {
        box-shadow: 0 6px 20px rgba(91, 95, 199, 0.5);
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
  constructor(protected service: PomodoroService) {}

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

  async openConfigModal(): Promise<void> {
    const isDark = document.documentElement.classList.contains('dark');
    const currentConfig = this.service.config();

    const { value: formValues } = await Swal.fire({
      title: '⚙️ Configuración del Timer',
      html: `
        <style>
          * {
            box-sizing: border-box;
          }
          .swal2-html-container {
            overflow-x: hidden !important;
            max-width: 100%;
          }

          /* Quitar flechitas de input number */
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }

          @media (max-width: 640px) {
            .modal-container {
              padding: 12px !important;
              max-width: 100% !important;
              overflow-x: hidden !important;
            }
            .config-grid-modal {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }
            .swal2-input {
              padding: 10px 12px !important;
              font-size: 14px !important;
            }
            .modal-label {
              font-size: 14px !important;
            }
            .config-icon {
              font-size: 28px !important;
            }
          }
          .config-grid-modal {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .config-item-modal {
            background: ${isDark ? '#252b3b' : '#f9fafb'};
            padding: 20px;
            border-radius: 16px;
            border: 2px solid ${isDark ? '#374151' : '#e5e7eb'};
            transition: all 0.3s;
          }
          .config-item-modal:hover {
            border-color: ${isDark ? '#667eea' : '#667eea'};
            transform: translateY(-2px);
            box-shadow: 0 8px 16px ${
              isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.15)'
            };
          }
          .config-icon {
            font-size: 36px;
            margin-bottom: 12px;
            display: block;
          }
          .config-label-text {
            font-size: 13px;
            font-weight: 600;
            color: ${isDark ? '#9ca3af' : '#6b7280'};
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 8px;
            display: block;
          }
          .input-wrapper {
            position: relative;
          }
          .config-unit {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
            font-weight: 600;
            color: ${isDark ? '#6b7280' : '#9ca3af'};
            pointer-events: none;
          }
        </style>
        <div class="modal-container" style="padding: 20px; max-width: 100%; margin: 0 auto; overflow-x: hidden;">
          <div class="config-grid-modal">
            <div class="config-item-modal">
              <span class="config-icon">🎯</span>
              <span class="config-label-text">Tiempo de Foco</span>
              <div class="input-wrapper">
                <input
                  id="focusMinutes"
                  class="swal2-input"
                  type="number"
                  min="1"
                  max="60"
                  value="${currentConfig.focusMinutes}"
                  style="
                    width: 100%;
                    margin: 0;
                    padding: 14px 16px;
                    font-size: 24px;
                    font-weight: 700;
                    border-radius: 12px;
                    box-sizing: border-box;
                    text-align: center;
                    border: 2px solid ${isDark ? '#374151' : '#e5e7eb'};
                  "
                >
                <span class="config-unit">min</span>
              </div>
            </div>

            <div class="config-item-modal">
              <span class="config-icon">☕</span>
              <span class="config-label-text">Descanso Corto</span>
              <div class="input-wrapper">
                <input
                  id="shortBreakMinutes"
                  class="swal2-input"
                  type="number"
                  min="1"
                  max="30"
                  value="${currentConfig.shortBreakMinutes}"
                  style="
                    width: 100%;
                    margin: 0;
                    padding: 14px 16px;
                    font-size: 24px;
                    font-weight: 700;
                    border-radius: 12px;
                    box-sizing: border-box;
                    text-align: center;
                    border: 2px solid ${isDark ? '#374151' : '#e5e7eb'};
                  "
                >
                <span class="config-unit">min</span>
              </div>
            </div>

            <div class="config-item-modal">
              <span class="config-icon">🌟</span>
              <span class="config-label-text">Descanso Largo</span>
              <div class="input-wrapper">
                <input
                  id="longBreakMinutes"
                  class="swal2-input"
                  type="number"
                  min="1"
                  max="60"
                  value="${currentConfig.longBreakMinutes}"
                  style="
                    width: 100%;
                    margin: 0;
                    padding: 14px 16px;
                    font-size: 24px;
                    font-weight: 700;
                    border-radius: 12px;
                    box-sizing: border-box;
                    text-align: center;
                    border: 2px solid ${isDark ? '#374151' : '#e5e7eb'};
                  "
                >
                <span class="config-unit">min</span>
              </div>
            </div>

            <div class="config-item-modal">
              <span class="config-icon">🔄</span>
              <span class="config-label-text">Ciclos</span>
              <div class="input-wrapper">
                <input
                  id="cyclesBeforeLongBreak"
                  class="swal2-input"
                  type="number"
                  min="1"
                  max="10"
                  value="${currentConfig.cyclesBeforeLongBreak}"
                  style="
                    width: 100%;
                    margin: 0;
                    padding: 14px 16px;
                    font-size: 24px;
                    font-weight: 700;
                    border-radius: 12px;
                    box-sizing: border-box;
                    text-align: center;
                    border: 2px solid ${isDark ? '#374151' : '#e5e7eb'};
                  "
                >
                <span class="config-unit">ciclos</span>
              </div>
            </div>
          </div>
        </div>
      `,
      width: window.innerWidth < 640 ? '95vw' : '680px',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '✓ Guardar',
      cancelButtonText: '✕ Cancelar',
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'swal-planner-modal',
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel',
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const inputs = [
          document.getElementById('focusMinutes') as HTMLInputElement,
          document.getElementById('shortBreakMinutes') as HTMLInputElement,
          document.getElementById('longBreakMinutes') as HTMLInputElement,
          document.getElementById('cyclesBeforeLongBreak') as HTMLInputElement,
        ];

        const validateForm = () => {
          const allValid = inputs.every((input) => {
            const value = parseInt(input.value);
            const min = parseInt(input.min);
            const max = parseInt(input.max);
            return value >= min && value <= max;
          });

          if (confirmButton) {
            confirmButton.disabled = !allValid;
            confirmButton.style.opacity = allValid ? '1' : '0.5';
            confirmButton.style.cursor = allValid ? 'pointer' : 'not-allowed';
          }
        };

        inputs.forEach((input) => input.addEventListener('input', validateForm));
        validateForm();
      },
      preConfirm: () => {
        const focusMinutes = parseInt(
          (document.getElementById('focusMinutes') as HTMLInputElement).value
        );
        const shortBreakMinutes = parseInt(
          (document.getElementById('shortBreakMinutes') as HTMLInputElement).value
        );
        const longBreakMinutes = parseInt(
          (document.getElementById('longBreakMinutes') as HTMLInputElement).value
        );
        const cyclesBeforeLongBreak = parseInt(
          (document.getElementById('cyclesBeforeLongBreak') as HTMLInputElement).value
        );

        if (
          focusMinutes < 1 ||
          shortBreakMinutes < 1 ||
          longBreakMinutes < 1 ||
          cyclesBeforeLongBreak < 1
        ) {
          Swal.showValidationMessage('Por favor completa todos los campos correctamente');
          return false;
        }

        return { focusMinutes, shortBreakMinutes, longBreakMinutes, cyclesBeforeLongBreak };
      },
    });

    if (formValues) {
      this.service.config.set(formValues);

      await Swal.fire({
        icon: 'success',
        title: '¡Configuración guardada!',
        text: 'Los cambios se aplicarán en el próximo ciclo',
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1e2433' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#111827',
      });
    }
  }
}
