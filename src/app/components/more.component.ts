import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { LangService } from '../services/lang.service';

@Component({
  selector: 'app-more',
  imports: [CommonModule],
  template: `
    <div class="more-container">
      <div class="header">
        <h1 class="page-title"><i class="bi bi-info-circle-fill"></i>{{ tx().title }}</h1>
        <p class="page-subtitle">{{ tx().subtitle }}</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon pomodoro">
            <i class="bi bi-clock-history"></i>
          </div>
          <h2>Pomodoro Timer</h2>
          <p class="description">{{ tx().pomDesc }}</p>

          <div class="example">
            <h3>{{ tx().howItWorks }}</h3>
            <ul>
              <li>
                <strong>{{ tx().pomFocusPhase }}</strong> {{ tx().pomFocusText }}
              </li>
              <li>
                <strong>{{ tx().pomShortBreak }}</strong> {{ tx().pomShortText }}
              </li>
              <li>
                <strong>{{ tx().pomLongBreak }}</strong> {{ tx().pomLongText }}
              </li>
            </ul>
          </div>

          <div class="use-case">
            <h3>{{ tx().example }}</h3>
            <p><i class="bi bi-lightbulb"></i> {{ tx().pomExample }}</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon planner">
            <i class="bi bi-calendar-check"></i>
          </div>
          <h2>Planner</h2>
          <p class="description">{{ tx().planDesc }}</p>

          <div class="example">
            <h3>{{ tx().howItWorks }}</h3>
            <ul>
              <li>
                <strong>{{ tx().planCreate }}</strong> {{ tx().planCreateText }}
              </li>
              <li>
                <strong>{{ tx().planMark }}</strong> {{ tx().planMarkText }}
              </li>
              <li>
                <strong>{{ tx().planDelete }}</strong> {{ tx().planDeleteText }}
              </li>
            </ul>
          </div>

          <div class="use-case">
            <h3>{{ tx().example }}</h3>
            <p><i class="bi bi-lightbulb"></i> {{ tx().planExample }}</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon gym">
            <i class="bi bi-heart-pulse"></i>
          </div>
          <h2>{{ tx().gymTitle }}</h2>
          <p class="description">{{ tx().gymDesc }}</p>

          <div class="example">
            <h3>{{ tx().howItWorks }}</h3>
            <ul>
              <li>
                <strong>{{ tx().gymRoutines }}</strong> {{ tx().gymRoutinesText }}
              </li>
              <li>
                <strong>{{ tx().gymSets }}</strong> {{ tx().gymSetsText }}
              </li>
              <li>
                <strong>{{ tx().gymHistory }}</strong> {{ tx().gymHistoryText }}
              </li>
            </ul>
          </div>

          <div class="use-case">
            <h3>{{ tx().example }}</h3>
            <p><i class="bi bi-lightbulb"></i> {{ tx().gymExample }}</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon notes">
            <i class="bi bi-journal-text"></i>
          </div>
          <h2>{{ tx().notesTitle }}</h2>
          <p class="description">{{ tx().notesDesc }}</p>

          <div class="example">
            <h3>{{ tx().howItWorks }}</h3>
            <ul>
              <li>
                <strong>{{ tx().notesCreate }}</strong> {{ tx().notesCreateText }}
              </li>
              <li>
                <strong>{{ tx().notesEdit }}</strong> {{ tx().notesEditText }}
              </li>
              <li>
                <strong>{{ tx().notesDelete }}</strong> {{ tx().notesDeleteText }}
              </li>
            </ul>
          </div>

          <div class="use-case">
            <h3>{{ tx().example }}</h3>
            <p><i class="bi bi-lightbulb"></i> {{ tx().notesExample }}</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon calculator">
            <i class="bi bi-calculator"></i>
          </div>
          <h2>{{ tx().calcTitle }}</h2>
          <p class="description">{{ tx().calcDesc }}</p>

          <div class="example">
            <h3>{{ tx().howItWorks }}</h3>
            <ul>
              <li>
                <strong>{{ tx().calcBasic }}</strong> {{ tx().calcBasicText }}
              </li>
              <li>
                <strong>{{ tx().calcAdvanced }}</strong> {{ tx().calcAdvancedText }}
              </li>
              <li>
                <strong>{{ tx().calcHistory }}</strong> {{ tx().calcHistoryText }}
              </li>
            </ul>
          </div>

          <div class="use-case">
            <h3>{{ tx().example }}</h3>
            <p><i class="bi bi-lightbulb"></i> {{ tx().calcExample }}</p>
          </div>
        </div>
      </div>

      <div class="tips-section">
        <h2><i class="bi bi-stars me-2"></i>{{ tx().proTips }}</h2>
        <div class="tips-grid">
          <div class="tip">
            <i class="bi bi-check-circle-fill"></i>
            <p>
              <strong>{{ tx().tip1Title }}</strong> {{ tx().tip1Text }}
            </p>
          </div>
          <div class="tip">
            <i class="bi bi-check-circle-fill"></i>
            <p>
              <strong>{{ tx().tip2Title }}</strong> {{ tx().tip2Text }}
            </p>
          </div>
          <div class="tip">
            <i class="bi bi-check-circle-fill"></i>
            <p>
              <strong>{{ tx().tip3Title }}</strong> {{ tx().tip3Text }}
            </p>
          </div>
          <div class="tip">
            <i class="bi bi-check-circle-fill"></i>
            <p>
              <strong>{{ tx().tip4Title }}</strong> {{ tx().tip4Text }}
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
        padding: 40px 32px;
      }

      .header {
        margin-bottom: 60px;
      }

      .header .page-title {
        font-size: 26px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 4px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      :host-context(.dark) .header .page-title {
        color: #f1f5f9;
      }

      .header .page-title i {
        color: #6366f1;
      }

      .page-subtitle {
        font-size: 14px;
        color: #64748b;
        margin: 0;
      }

      :host-context(.dark) .page-subtitle {
        color: #94a3b8;
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

      @media (max-width: 820px) {
        .more-container {
          padding: 24px 16px;
        }

        .header h1 {
          font-size: 32px;
          flex-direction: column;
          gap: 12px;
        }

        .page-subtitle {
          font-size: 14px;
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
    `,
  ],
})
export class MoreComponent {
  private langService = inject(LangService);

  readonly tx = computed(() => {
    const es = this.langService.lang() === 'es';
    return {
      title: es ? 'Guía de FocusHub' : 'FocusHub Guide',
      subtitle: es
        ? 'Aprende a usar todas las herramientas para maximizar tu productividad'
        : 'Learn to use all the tools to maximize your productivity',
      howItWorks: es ? '¿Cómo funciona?' : 'How does it work?',
      example: es ? 'Ejemplo:' : 'Example:',

      pomDesc: es
        ? 'Técnica de gestión del tiempo que divide el trabajo en intervalos de 25 minutos con descansos cortos.'
        : 'Time management technique that divides work into 25-minute intervals with short breaks.',
      pomFocusPhase: es ? 'Fase de Enfoque:' : 'Focus Phase:',
      pomFocusText: es ? '25 minutos de trabajo concentrado' : '25 minutes of concentrated work',
      pomShortBreak: es ? 'Descanso Corto:' : 'Short Break:',
      pomShortText: es ? '5 minutos de descanso' : '5 minutes of rest',
      pomLongBreak: es ? 'Descanso Largo:' : 'Long Break:',
      pomLongText: es ? '15-30 minutos cada 4 pomodoros' : '15-30 minutes every 4 pomodoros',
      pomExample: es
        ? 'Necesitas estudiar para un examen. Configura 4 pomodoros de 25 minutos con descansos de 5 minutos. Después del cuarto pomodoro, toma un descanso largo de 20 minutos.'
        : 'You need to study for an exam. Set 4 pomodoros of 25 minutes with 5-minute breaks. After the fourth pomodoro, take a long break of 20 minutes.',

      planDesc: es
        ? 'Organiza tus tareas diarias, semanales y mensuales. Lleva el control de todo lo que necesitas hacer.'
        : 'Organize your daily, weekly and monthly tasks. Keep track of everything you need to do.',
      planCreate: es ? 'Crear tareas:' : 'Create tasks:',
      planCreateText: es
        ? 'Agrega nuevas actividades con título y descripción'
        : 'Add new activities with title and description',
      planMark: es ? 'Marcar completado:' : 'Mark completed:',
      planMarkText: es ? 'Tilda cuando termines una tarea' : 'Check off when you finish a task',
      planDelete: es ? 'Eliminar:' : 'Delete:',
      planDeleteText: es
        ? 'Quita las tareas que ya no necesites'
        : 'Remove tasks you no longer need',
      planExample: es
        ? 'Lunes por la mañana: agrega "Reunión 10am", "Enviar informe", "Comprar leche". Tilda cada una al completarla y mantén tu día organizado.'
        : 'Monday morning: Add "10am Meeting", "Send report", "Buy milk". Check each one as you complete it and keep your day organized.',

      gymTitle: es ? 'Gimnasio' : 'Gym',
      gymDesc: es
        ? 'Planifica y registra tus rutinas de ejercicio. Lleva un historial de tus sesiones de entrenamiento.'
        : 'Plan and record your workout routines. Keep a history of your training sessions.',
      gymRoutines: es ? 'Rutinas:' : 'Routines:',
      gymRoutinesText: es
        ? 'Crea planes de entrenamiento personalizados'
        : 'Create personalized workout plans',
      gymSets: es ? 'Series y repeticiones:' : 'Sets and reps:',
      gymSetsText: es ? 'Registra cada ejercicio' : 'Record each exercise',
      gymHistory: es ? 'Historial:' : 'History:',
      gymHistoryText: es ? 'Revisa tus entrenamientos anteriores' : 'Review your previous workouts',
      gymExample: es
        ? 'Crea "Rutina del Lunes": Press de banca 4x12, Dominadas 3x10, Sentadillas 4x15. Guárdala y repítela cada semana aumentando progresivamente el peso.'
        : 'Create "Monday Routine": Bench press 4x12, Pull-ups 3x10, Squats 4x15. Save and repeat each week progressively increasing weight.',

      notesTitle: es ? 'Notas' : 'Notes',
      notesDesc: es
        ? 'Espacio para tus ideas, apuntes y pensamientos. Todo organizado en un lugar.'
        : 'Space for your ideas, notes and thoughts. Everything organized in one place.',
      notesCreate: es ? 'Crear notas:' : 'Create notes:',
      notesCreateText: es
        ? 'Escribe títulos y contenido ilimitado'
        : 'Write titles and unlimited content',
      notesEdit: es ? 'Editar:' : 'Edit:',
      notesEditText: es
        ? 'Modifica tus notas en cualquier momento'
        : 'Modify your notes at any time',
      notesDelete: es ? 'Eliminar:' : 'Delete:',
      notesDeleteText: es ? 'Borra lo que ya no necesites' : 'Remove what you no longer need',
      notesExample: es
        ? 'Estás en una reunión y necesitas anotar ideas rápido. Crea una nota "Ideas Proyecto X" y agrega todos los puntos importantes para revisar después.'
        : 'You\'re in a meeting and need to jot down ideas fast. Create a note "Project X Ideas" and add all the important points to review later.',

      calcTitle: es ? 'Calculadora' : 'Calculator',
      calcDesc: es
        ? 'Calculadora completa para tus operaciones matemáticas rápidas sin salir de FocusHub.'
        : 'Full calculator for your quick math operations without leaving FocusHub.',
      calcBasic: es ? 'Operaciones básicas:' : 'Basic operations:',
      calcBasicText: es
        ? 'Suma, resta, multiplicación, división'
        : 'Addition, subtraction, multiplication, division',
      calcAdvanced: es ? 'Funciones avanzadas:' : 'Advanced functions:',
      calcAdvancedText: es ? 'Porcentajes, potencias, raíces' : 'Percentages, powers, roots',
      calcHistory: es ? 'Historial:' : 'History:',
      calcHistoryText: es ? 'Revisa tus cálculos anteriores' : 'Review your previous calculations',
      calcExample: es
        ? 'Estás planificando tu presupuesto mensual. Usa la calculadora para sumar gastos: 500 + 200 + 150 + 300 = 1150. Compáralo con tus ingresos sin cambiar de app.'
        : "You're planning your monthly budget. Use the calculator to add expenses: 500 + 200 + 150 + 300 = 1150. Compare with your income without switching apps.",

      proTips: es ? 'Consejos Pro' : 'Pro Tips',
      tip1Title: es ? 'Combina herramientas:' : 'Combine tools:',
      tip1Text: es
        ? 'Usa el Pomodoro mientras trabajas en tareas del Planificador'
        : 'Use Pomodoro while working on Planner tasks',
      tip2Title: es ? 'Revisa Estadísticas:' : 'Check Stats:',
      tip2Text: es
        ? 'Analiza tu productividad semanalmente para mejorar'
        : 'Analyze your productivity weekly to improve',
      tip3Title: es ? 'Dashboard:' : 'Dashboard:',
      tip3Text: es
        ? 'Es tu centro de control, vuelve allí para ver todo de un vistazo'
        : "It's your control center, go back there to see everything at a glance",
      tip4Title: es ? 'Rutina mañanera:' : 'Morning routine:',
      tip4Text: es
        ? 'Abre FocusHub, revisa tu Planificador y comienza un Pomodoro'
        : 'Open FocusHub, check your Planner and start a Pomodoro',
    };
  });
}
