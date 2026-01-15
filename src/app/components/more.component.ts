import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PomodoroService } from '../services/pomodoro.service';

@Component({
  selector: 'app-more',
  imports: [CommonModule],
  template: `
    <div class="more-container">
      <div class="header">
        <h1><i class="bi bi-info-circle-fill me-3"></i>Guía de FocusHub</h1>
        <p class="subtitle">
          Aprende a usar todas las herramientas para maximizar tu productividad
        </p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon pomodoro">
            <i class="bi bi-clock-history"></i>
          </div>
          <h2>Pomodoro Timer</h2>
          <p class="description">
            Técnica de gestión del tiempo que divide el trabajo en intervalos de 25 minutos con
            descansos breves.
          </p>

          <div class="example">
            <h3>¿Cómo funciona?</h3>
            <ul>
              <li><strong>Fase de Enfoque:</strong> 25 minutos de trabajo concentrado</li>
              <li><strong>Descanso Corto:</strong> 5 minutos de pausa</li>
              <li><strong>Descanso Largo:</strong> 15-30 minutos cada 4 pomodoros</li>
            </ul>
          </div>

          <div class="use-case">
            <h3>Ejemplo de uso:</h3>
            <p>
              <i class="bi bi-lightbulb"></i> Tienes que estudiar para un examen. Configura 4
              pomodoros de 25 minutos con descansos de 5 minutos. Después del cuarto pomodoro, toma
              un descanso largo de 20 minutos.
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon planner">
            <i class="bi bi-calendar-check"></i>
          </div>
          <h2>Planner</h2>
          <p class="description">
            Organiza tus tareas diarias, semanales y mensuales. Mantén un registro de todo lo que
            necesitas hacer.
          </p>

          <div class="example">
            <h3>¿Cómo funciona?</h3>
            <ul>
              <li>
                <strong>Crea tareas:</strong> Agrega nuevas actividades con título y descripción
              </li>
              <li><strong>Marca completadas:</strong> Haz check cuando termines una tarea</li>
              <li><strong>Elimina:</strong> Borra tareas que ya no necesitas</li>
            </ul>
          </div>

          <div class="use-case">
            <h3>Ejemplo de uso:</h3>
            <p>
              <i class="bi bi-lightbulb"></i> Lunes por la mañana: Agrega "Reunión 10am", "Enviar
              informe", "Comprar leche". Ve marcando cada una al completarla y mantén tu día
              organizado.
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon gym">
            <i class="bi bi-heart-pulse"></i>
          </div>
          <h2>Gimnasio</h2>
          <p class="description">
            Planifica y registra tus rutinas de ejercicio. Mantén un historial de tus
            entrenamientos.
          </p>

          <div class="example">
            <h3>¿Cómo funciona?</h3>
            <ul>
              <li><strong>Rutinas:</strong> Crea planes de ejercicio personalizados</li>
              <li><strong>Series y repeticiones:</strong> Registra cada ejercicio</li>
              <li><strong>Historial:</strong> Revisa tus entrenamientos anteriores</li>
            </ul>
          </div>

          <div class="use-case">
            <h3>Ejemplo de uso:</h3>
            <p>
              <i class="bi bi-lightbulb"></i> Crea "Rutina Lunes": Press banca 4x12, Dominadas 3x10,
              Sentadillas 4x15. Guarda y repite cada semana aumentando peso progresivamente.
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon notes">
            <i class="bi bi-journal-text"></i>
          </div>
          <h2>Notas</h2>
          <p class="description">
            Espacio para tus ideas, apuntes y pensamientos. Todo organizado en un solo lugar.
          </p>

          <div class="example">
            <h3>¿Cómo funciona?</h3>
            <ul>
              <li><strong>Crear notas:</strong> Escribe títulos y contenido ilimitado</li>
              <li><strong>Editar:</strong> Modifica tus notas en cualquier momento</li>
              <li><strong>Eliminar:</strong> Borra lo que ya no necesitas</li>
            </ul>
          </div>

          <div class="use-case">
            <h3>Ejemplo de uso:</h3>
            <p>
              <i class="bi bi-lightbulb"></i> Estás en una reunión y necesitas apuntar ideas rápido.
              Crea una nota "Ideas Proyecto X" y añade todos los puntos importantes para revisarlos
              después.
            </p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon calculator">
            <i class="bi bi-calculator"></i>
          </div>
          <h2>Calculadora</h2>
          <p class="description">
            Calculadora completa para tus operaciones matemáticas rápidas sin salir de FocusHub.
          </p>

          <div class="example">
            <h3>¿Cómo funciona?</h3>
            <ul>
              <li><strong>Operaciones básicas:</strong> Suma, resta, multiplicación, división</li>
              <li><strong>Funciones avanzadas:</strong> Porcentajes, potencias, raíces</li>
              <li><strong>Historial:</strong> Revisa tus cálculos anteriores</li>
            </ul>
          </div>

          <div class="use-case">
            <h3>Ejemplo de uso:</h3>
            <p>
              <i class="bi bi-lightbulb"></i> Estás planeando tu presupuesto mensual. Usa la
              calculadora para sumar gastos: 500 + 200 + 150 + 300 = 1150. Compara con tus ingresos
              sin cambiar de app.
            </p>
          </div>
        </div>
      </div>

      <div class="tips-section">
        <h2><i class="bi bi-stars me-2"></i>Tips Pro</h2>
        <div class="tips-grid">
          <div class="tip">
            <i class="bi bi-check-circle-fill"></i>
            <p>
              <strong>Combina herramientas:</strong> Usa Pomodoro mientras trabajas en tareas del
              Planner
            </p>
          </div>
          <div class="tip">
            <i class="bi bi-check-circle-fill"></i>
            <p><strong>Revisa Stats:</strong> Analiza tu productividad semanalmente para mejorar</p>
          </div>
          <div class="tip">
            <i class="bi bi-check-circle-fill"></i>
            <p>
              <strong>Dashboard:</strong> Es tu centro de control, vuelve ahí para ver todo de un
              vistazo
            </p>
          </div>
          <div class="tip">
            <i class="bi bi-check-circle-fill"></i>
            <p>
              <strong>Rutina matutina:</strong> Abre FocusHub, revisa tu Planner y empieza un
              Pomodoro
            </p>
          </div>
        </div>
      </div>

      @if (pomodoroService.state() !== 'IDLE' && pomodoroService.state() !== 'PAUSED') {
      <div class="pomodoro-widget" (click)="goToPomodoro()">
        <div class="pomodoro-icon">⏱️</div>
        <div class="pomodoro-content">
          <div class="pomodoro-label">{{ getPhaseLabel() }}</div>
          <div class="pomodoro-time">{{ formatTime() }}</div>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .more-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 24px;
      }

      .header {
        text-align: center;
        margin-bottom: 60px;
      }

      .header h1 {
        font-size: 48px;
        font-weight: 800;
        color: #1a1a1a;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      :host-context(.dark) .header h1 {
        color: #f3f4f6 !important;
      }

      .header h1 i {
        color: #4f46e5;
      }

      .subtitle {
        font-size: 20px;
        color: #6b7280;
        font-weight: 500;
      }

      :host-context(.dark) .subtitle {
        color: #9ca3af !important;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
        gap: 32px;
        margin-bottom: 60px;
      }

      .feature-card {
        background: white;
        border-radius: 20px;
        padding: 32px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        border: 2px solid transparent;
      }

      :host-context(.dark) .feature-card {
        background: #1e2433 !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
      }

      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        border-color: #4f46e5;
      }

      :host-context(.dark) .feature-card:hover {
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
        border-color: #6366f1 !important;
      }

      .feature-icon {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
        font-size: 36px;
        color: white;
      }

      .feature-icon.pomodoro {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }

      .feature-icon.planner {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      }

      .feature-icon.stats {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      }

      .feature-icon.gym {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      }

      .feature-icon.notes {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      }

      .feature-icon.calculator {
        background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
      }

      .feature-card h2 {
        font-size: 28px;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 12px;
      }

      :host-context(.dark) .feature-card h2 {
        color: #e5e7eb !important;
      }

      .description {
        font-size: 16px;
        color: #6b7280;
        line-height: 1.6;
        margin-bottom: 24px;
      }

      :host-context(.dark) .description {
        color: #9ca3af !important;
      }

      .example,
      .use-case {
        background: #f9fafb;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
      }

      :host-context(.dark) .example,
      :host-context(.dark) .use-case {
        background: #252b3b !important;
      }

      .example h3,
      .use-case h3 {
        font-size: 18px;
        font-weight: 700;
        color: #374151;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
      }

      :host-context(.dark) .example h3,
      :host-context(.dark) .use-case h3 {
        color: #d1d5db !important;
      }

      .example ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .example li {
        padding: 8px 0;
        color: #4b5563;
        font-size: 15px;
        line-height: 1.5;
      }

      :host-context(.dark) .example li {
        color: #9ca3af !important;
      }

      .example li strong {
        color: #1f2937;
        font-weight: 600;
      }

      :host-context(.dark) .example li strong {
        color: #d1d5db !important;
      }

      .use-case p {
        color: #4b5563;
        font-size: 15px;
        line-height: 1.6;
        margin: 0;
      }

      :host-context(.dark) .use-case p {
        color: #9ca3af !important;
      }

      .use-case i {
        color: #f59e0b;
        margin-right: 8px;
      }

      .tips-section {
        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
        border-radius: 24px;
        padding: 48px;
        color: white;
      }

      .tips-section h2 {
        font-size: 36px;
        font-weight: 800;
        margin-bottom: 32px;
        text-align: center;
      }

      .tips-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
      }

      .tip {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 24px;
        display: flex;
        align-items: start;
        gap: 16px;
        transition: all 0.3s ease;
      }

      .tip:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: scale(1.05);
      }

      .tip i {
        font-size: 24px;
        color: #fbbf24;
        flex-shrink: 0;
        margin-top: 4px;
      }

      .tip p {
        margin: 0;
        font-size: 16px;
        line-height: 1.5;
      }

      .tip strong {
        font-weight: 700;
      }

      @media (max-width: 768px) {
        .more-container {
          padding: 24px 16px;
        }

        .header h1 {
          font-size: 32px;
          flex-direction: column;
          gap: 12px;
        }

        .subtitle {
          font-size: 16px;
        }

        .features-grid {
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .feature-card {
          padding: 24px;
          text-align: center;
        }

        .feature-icon {
          margin-left: auto;
          margin-right: auto;
        }

        .example,
        .use-case {
          text-align: left;
        }

        .tips-section {
          padding: 32px 24px;
        }

        .tips-section h2 {
          font-size: 28px;
        }

        .tips-grid {
          grid-template-columns: 1fr;
        }

        .tip {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .tip i {
          margin-top: 0;
        }
      }

      .pomodoro-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.95) 0%,
          rgba(139, 92, 246, 0.95) 100%
        );
        backdrop-filter: blur(16px);
        padding: 12px 20px;
        border-radius: 16px;
        border: 1.5px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        width: 160px;
      }

      .pomodoro-widget:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
        border-color: rgba(255, 255, 255, 0.35);
      }

      .pomodoro-icon {
        font-size: 24px;
        line-height: 1;
        flex-shrink: 0;
      }

      .pomodoro-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-width: 0;
      }

      .pomodoro-label {
        font-size: 9px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.85);
        text-transform: uppercase;
        letter-spacing: 1px;
        line-height: 1;
      }

      .pomodoro-time {
        font-size: 20px;
        font-weight: 800;
        color: white;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.5px;
        line-height: 1;
      }

      :host-context(.dark) .pomodoro-widget {
        background: linear-gradient(
          135deg,
          rgba(79, 70, 229, 0.95) 0%,
          rgba(124, 58, 237, 0.95) 100%
        );
        border-color: rgba(255, 255, 255, 0.2);
      }

      :host-context(.dark) .pomodoro-widget:hover {
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 12px 40px rgba(79, 70, 229, 0.4);
      }
    `,
  ],
})
export class MoreComponent {
  pomodoroService = inject(PomodoroService);
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

  goToPomodoro(): void {
    this.router.navigate(['/pomodoro']);
  }
}
