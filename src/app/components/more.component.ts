import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
          <div class="feature-icon stats">
            <i class="bi bi-bar-chart"></i>
          </div>
          <h2>Estadísticas</h2>
          <p class="description">
            Visualiza tu productividad con gráficos. Mide tus sesiones de Pomodoro y analiza tu
            progreso.
          </p>

          <div class="example">
            <h3>¿Cómo funciona?</h3>
            <ul>
              <li><strong>Pomodoros completados:</strong> Contador total de sesiones</li>
              <li><strong>Tiempo total:</strong> Horas invertidas en trabajo concentrado</li>
              <li><strong>Gráficos:</strong> Visualización de tu actividad semanal</li>
            </ul>
          </div>

          <div class="use-case">
            <h3>Ejemplo de uso:</h3>
            <p>
              <i class="bi bi-lightbulb"></i> Revisa tus stats cada viernes para ver cuántos
              pomodoros hiciste. Si hiciste 20 esta semana, intenta hacer 22 la próxima.
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

      .header h1 i {
        color: #4f46e5;
      }

      .subtitle {
        font-size: 20px;
        color: #6b7280;
        font-weight: 500;
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

      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        border-color: #4f46e5;
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

      .description {
        font-size: 16px;
        color: #6b7280;
        line-height: 1.6;
        margin-bottom: 24px;
      }

      .example,
      .use-case {
        background: #f9fafb;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
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

      .example li strong {
        color: #1f2937;
        font-weight: 600;
      }

      .use-case p {
        color: #4b5563;
        font-size: 15px;
        line-height: 1.6;
        margin: 0;
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
      }
    `,
  ],
})
export class MoreComponent {}
