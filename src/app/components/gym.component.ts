import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Exercise, GymService } from '../services/gym.service';
import { LangService } from '../services/lang.service';

@Component({
  selector: 'app-gym',
  imports: [FormsModule],
  template: `
    <div class="container">
      @if (!service.sessionState()) {
        <div class="header">
          <h1 class="page-title"><i class="bi bi-heart-pulse"></i>{{ tx().title }}</h1>
          <p class="page-subtitle">{{ tx().subtitle }}</p>
        </div>

        <button class="btn-add" (click)="openRoutineForm()">{{ tx().newRoutine }}</button>

        <div class="routines-grid">
          @for (routine of service.routines(); track routine.id) {
            <div class="routine-card">
              <div class="routine-name">{{ routine.name }}</div>
              <div class="routine-info">{{ routine.exercises.length }} {{ tx().exercises }}</div>
              <div class="routine-actions">
                <button class="btn-start" (click)="service.startSession(routine)">
                  {{ tx().start }}
                </button>
                <button class="btn-delete" (click)="service.deleteRoutine(routine.id)">ðŸ—‘</button>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <div class="empty-icon">ðŸ‹ï¸</div>
              <div class="empty-title">{{ tx().noRoutines }}</div>
              <div class="empty-text">{{ tx().createFirstRoutine }}</div>
            </div>
          }
        </div>
      } @else {
        <div class="session-view">
          <div class="session-header">
            <div class="session-title">{{ service.sessionState()!.routine.name }}</div>
          </div>

          <div class="exercise-card">
            <div class="exercise-name">{{ currentExercise()?.name }}</div>
            <div class="exercise-progress">
              Set {{ service.sessionState()!.setIndex + 1 }} {{ tx().setOf }}
              {{ currentExercise()?.sets }}
            </div>
          </div>

          @if (service.sessionState()!.inRest) {
            <div class="rest-card">
              <div class="rest-label">{{ tx().resting }}</div>
              <div class="rest-timer">{{ service.sessionState()!.restTimeLeft }}s</div>
            </div>
          } @else {
            <button class="btn-rest" (click)="service.startRest()">{{ tx().startRest }}</button>
          }

          <div class="session-controls">
            <button class="btn-control" (click)="service.nextSet()">{{ tx().nextSet }}</button>
            <button class="btn-control" (click)="service.nextExercise()">
              {{ tx().nextExercise }}
            </button>
            <button class="btn-finish" (click)="service.finishSession()">{{ tx().finish }}</button>
            <button class="btn-cancel-session" (click)="service.cancelSession()">
              {{ tx().cancel }}
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 32px;
      }

      .header {
        margin-bottom: 32px;
      }

      .page-title {
        font-size: 26px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 4px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .page-title i {
        color: #6366f1;
      }

      .page-subtitle {
        color: #64748b;
        font-size: 14px;
        margin: 0;
      }

      :host-context(.dark) .page-title {
        color: #f1f5f9;
      }

      :host-context(.dark) .page-subtitle {
        color: #94a3b8;
      }

      .btn-add {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        margin-bottom: 32px;
      }

      :host-context(.dark) .btn-add {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
      }

      .btn-add:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
      }

      :host-context(.dark) .btn-add:hover {
        box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5);
      }

      .form-card {
        background: white;
        border-radius: 20px;
        padding: 28px;
        margin-bottom: 32px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #f3f4f6;
      }

      :host-context(.dark) .form-card {
        background: #1e2433 !important;
        border: 1px solid #2d3748 !important;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3) !important;
      }

      .form-header {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 20px;
        text-align: center;
      }

      :host-context(.dark) .form-header {
        color: #d1d5db !important;
      }

      .input-name {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 20px;
        transition: all 0.2s;
      }

      :host-context(.dark) .input-name {
        background: #252b3b !important;
        border: 2px solid #2d3748 !important;
        color: #d1d5db !important;
      }

      .input-name:focus {
        outline: none;
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }

      :host-context(.dark) .input-name:focus {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
      }

      .exercises-label {
        font-size: 15px;
        font-weight: 700;
        color: #6b7280;
        margin-bottom: 12px;
      }

      :host-context(.dark) .exercises-label {
        color: #9ca3af !important;
      }

      .exercise-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr auto;
        gap: 10px;
        margin-bottom: 10px;
      }

      .exercise-row input {
        padding: 12px;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #111827;
        transition: all 0.2s;
      }

      :host-context(.dark) .exercise-row input {
        background: #252b3b !important;
        border: 2px solid #2d3748 !important;
        color: #d1d5db !important;
      }

      .exercise-row input:focus {
        outline: none;
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }

      :host-context(.dark) .exercise-row input:focus {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
      }

      .btn-remove {
        width: 40px;
        background: #fee2e2;
        color: #991b1b;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-remove:hover {
        background: #fecaca;
      }

      .btn-add-exercise {
        width: 100%;
        padding: 12px;
        background: #f9fafb;
        color: #6b7280;
        border: 2px dashed #d1d5db;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        margin: 12px 0 20px 0;
        transition: all 0.2s;
      }

      :host-context(.dark) .btn-add-exercise {
        background: #252b3b !important;
        border: 2px dashed #2d3748 !important;
        color: #9ca3af !important;
      }

      .btn-add-exercise:hover {
        background: #f3f4f6;
        border-color: #9ca3af;
        color: #374151;
      }

      :host-context(.dark) .btn-add-exercise:hover {
        background: #2d3748 !important;
        border-color: #374151 !important;
        color: #d1d5db !important;
      }

      .form-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .btn-save,
      .btn-cancel {
        padding: 14px;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-save {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }

      .btn-save:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
      }

      .btn-cancel {
        background: #f3f4f6;
        color: #6b7280;
      }

      :host-context(.dark) .btn-cancel {
        background: #252b3b !important;
        color: #9ca3af !important;
      }

      .btn-cancel:hover {
        background: #e5e7eb;
      }

      :host-context(.dark) .btn-cancel:hover {
        background: #2d3748 !important;
      }

      .routines-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }

      .routine-card {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #f3f4f6;
        transition: all 0.3s;
      }

      :host-context(.dark) .routine-card {
        background: #1e2433 !important;
        border: 1px solid #2d3748 !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
      }

      .routine-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      :host-context(.dark) .routine-card:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
      }

      .routine-name {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 8px;
      }

      :host-context(.dark) .routine-name {
        color: #e5e7eb !important;
      }

      .routine-info {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 16px;
        font-weight: 600;
      }

      :host-context(.dark) .routine-info {
        color: #9ca3af !important;
      }

      .routine-actions {
        display: flex;
        gap: 10px;
      }

      .btn-start {
        flex: 1;
        padding: 12px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
      }

      .btn-start:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
      }

      .btn-delete {
        width: 44px;
        background: #fee2e2;
        color: #991b1b;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-delete:hover {
        background: #fecaca;
      }

      .empty-state {
        text-align: center;
        padding: 80px 20px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        border: 1px solid #f3f4f6;
        grid-column: 1 / -1;
      }

      :host-context(.dark) .empty-state {
        background: #1e2433 !important;
        border: 1px solid #2d3748 !important;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3) !important;
      }

      .empty-icon {
        font-size: 64px;
        opacity: 0.3;
        margin-bottom: 16px;
      }

      .empty-title {
        font-size: 20px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 8px;
      }

      :host-context(.dark) .empty-title {
        color: #d1d5db !important;
      }

      .empty-text {
        font-size: 14px;
        color: #9ca3af;
      }

      :host-context(.dark) .empty-text {
        color: #6b7280 !important;
      }

      .session-view {
        max-width: 600px;
        margin: 0 auto;
      }

      .session-header {
        text-align: center;
        margin-bottom: 32px;
      }

      .session-title {
        font-size: 32px;
        font-weight: 700;
        color: #111827;
        letter-spacing: -0.5px;
      }

      :host-context(.dark) .session-title {
        color: #f3f4f6 !important;
      }

      .exercise-card {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        border-radius: 20px;
        padding: 40px 32px;
        text-align: center;
        margin-bottom: 24px;
        box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
      }

      .exercise-name {
        font-size: 28px;
        font-weight: 800;
        color: white;
        margin-bottom: 12px;
        letter-spacing: -0.5px;
      }

      .exercise-progress {
        font-size: 16px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
      }

      .rest-card {
        background: #fef3c7;
        border-radius: 20px;
        padding: 32px;
        text-align: center;
        margin-bottom: 24px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      .rest-label {
        font-size: 18px;
        font-weight: 700;
        color: #92400e;
        margin-bottom: 12px;
      }

      .rest-timer {
        font-size: 64px;
        font-weight: 800;
        color: #92400e;
        letter-spacing: -2px;
      }

      .btn-rest {
        width: 100%;
        padding: 16px;
        background: #fbbf24;
        color: white;
        border: none;
        border-radius: 16px;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        margin-bottom: 24px;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
      }

      .btn-rest:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
      }

      .session-controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .btn-control,
      .btn-finish,
      .btn-cancel-session {
        padding: 14px;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-control {
        background: white;
        color: #ef4444;
        border: 2px solid #ef4444;
      }

      :host-context(.dark) .btn-control {
        background: #252b3b !important;
        color: #ef4444 !important;
        border: 2px solid #ef4444 !important;
      }

      .btn-control:hover {
        background: #ef4444;
        color: white;
      }

      .btn-finish {
        background: #22c55e;
        color: white;
        box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
      }

      .btn-finish:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
      }

      .btn-cancel-session {
        background: #f3f4f6;
        color: #6b7280;
      }

      .btn-cancel-session:hover {
        background: #e5e7eb;
      }

      @media (max-width: 768px) {
        .container {
          padding: 24px 16px;
        }

        .title,
        .session-title {
          font-size: 28px;
        }

        .exercise-row {
          grid-template-columns: 1fr;
        }

        .btn-remove {
          width: 100%;
        }

        .routines-grid {
          grid-template-columns: 1fr;
        }

        .exercise-name {
          font-size: 24px;
        }

        .rest-timer {
          font-size: 56px;
        }
      }
    `,
  ],
})
export class GymComponent {
  private router = inject(Router);
  private langService = inject(LangService);
  routineForm: { name: string; exercises: Exercise[] } = { name: '', exercises: [] };

  constructor(protected service: GymService) {}

  readonly tx = computed(() => {
    const es = this.langService.lang() === 'es';
    return {
      title: es ? 'Salud' : 'Health',
      subtitle: es ? 'Rutinas y ejercicio' : 'Routines and exercise',
      newRoutine: es ? '+ Nueva Rutina' : '+ New Routine',
      exercises: es ? 'ejercicios' : 'exercises',
      start: es ? 'â–¶ Iniciar' : 'â–¶ Start',
      noRoutines: es ? 'Sin rutinas guardadas' : 'No saved routines',
      createFirstRoutine: es
        ? 'Crea tu primera rutina de entrenamiento'
        : 'Create your first training routine',
      setOf: es ? 'de' : 'of',
      resting: es ? 'â± Descansando' : 'â± Resting',
      startRest: es ? 'Iniciar Descanso' : 'Start Rest',
      nextSet: es ? 'Siguiente Serie' : 'Next Set',
      nextExercise: es ? 'Siguiente Ejercicio' : 'Next Exercise',
      finish: es ? 'âœ“ Terminar' : 'âœ“ Finish',
      cancel: es ? 'âœ• Cancelar' : 'âœ• Cancel',
      swalTitle: es ? 'ðŸ’ª Nueva Rutina' : 'ðŸ’ª New Routine',
      swalRoutineName: es ? 'Nombre de la rutina' : 'Routine name',
      swalRoutineNamePh: es ? 'Ej.: Piernas y GlÃºteos' : 'E.g.: Legs & Glutes',
      swalExercises: es ? 'Ejercicios' : 'Exercises',
      swalAddEx: es ? '+ Agregar Ejercicio' : '+ Add Exercise',
      swalExercisePh: es ? 'Ej.: Sentadillas' : 'E.g.: Squats',
      swalSets: es ? 'Series' : 'Sets',
      swalRest: es ? 'Descanso (seg)' : 'Rest (sec)',
      swalRemove: es ? 'âœ• Eliminar' : 'âœ• Remove',
      swalExLabel: es ? 'Ejercicio' : 'Exercise',
      swalSave: es ? 'âœ“ Guardar' : 'âœ“ Save',
      swalCancel: es ? 'âœ• Cancelar' : 'âœ• Cancel',
      swalFillAll: es ? 'Por favor completa todos los campos' : 'Please fill in all fields',
      swalCreated: es ? 'Â¡Rutina creada!' : 'Routine created!',
      swalCreatedText: es
        ? 'La rutina fue agregada exitosamente'
        : 'The routine has been added successfully',
    };
  });

  currentExercise = () => {
    const state = this.service.sessionState();
    return state ? state.routine.exercises[state.exerciseIndex] : null;
  };

  async openRoutineForm(): Promise<void> {
    const isDark = document.documentElement.classList.contains('dark');
    const t = this.tx();

    let exercisesHTML = '';
    this.routineForm.exercises = [];

    const { value: formValues } = await Swal.fire({
      title: t.swalTitle,
      html: `
        <style>
          * {
            box-sizing: border-box;
          }
          .swal2-html-container {
            overflow-x: hidden !important;
            max-width: 100%;
          }
          @media (max-width: 640px) {
            .modal-container {
              padding: 12px !important;
              max-width: 100% !important;
              overflow-x: hidden !important;
            }
            .modal-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
            .swal2-input { padding: 10px 12px !important; font-size: 14px !important; }
            .modal-label { font-size: 14px !important; }
          }
          .exercise-item {
            background: ${isDark ? '#2d3748' : '#f9fafb'};
            padding: 14px;
            border-radius: 8px;
            margin-bottom: 12px;
            border: 1px solid ${isDark ? '#374151' : '#e5e7eb'};
            overflow: hidden;
          }
          .exercise-field {
            margin-bottom: 10px;
          }
          .exercise-field:last-of-type {
            margin-bottom: 0;
          }
          .field-label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: ${isDark ? '#9ca3af' : '#6b7280'};
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .exercise-name-field {
            margin-bottom: 12px;
          }
          .exercise-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 10px;
          }
          @media (min-width: 641px) {
            .field-label {
              display: none;
            }
          }
          .btn-remove-ex {
            background: #ef4444;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            width: 100%;
          }
          .btn-remove-ex:hover {
            background: #dc2626;
          }
          .btn-add-ex {
            background: ${isDark ? '#374151' : '#f3f4f6'};
            color: ${isDark ? '#d1d5db' : '#6b7280'};
            border: 2px dashed ${isDark ? '#4b5563' : '#d1d5db'};
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            width: 100%;
            margin-top: 8px;
          }
          .btn-add-ex:hover {
            background: ${isDark ? '#4b5563' : '#e5e7eb'};
          }
          #exercisesContainer {
            max-height: 320px;
            overflow-y: auto;
            overflow-x: hidden;
          }
          .desktop-label-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 4px;
          }
          .desktop-label-row span {
            font-size: 12px;
            font-weight: 700;
            color: ${isDark ? '#9ca3af' : '#6b7280'};
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .desktop-label-single {
            font-size: 12px;
            font-weight: 700;
            color: ${isDark ? '#9ca3af' : '#6b7280'};
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            display: block;
          }
          @media (max-width: 640px) {
            .desktop-label-row, .desktop-label-single {
              display: none !important;
            }
          }
        </style>
        <div class="modal-container" style="padding: 16px; max-width: 100%; margin: 0 auto; overflow-x: hidden;">
          <div style="margin-bottom: 16px;">
            <label class="modal-label" style="
              display: block;
              font-size: 15px;
              font-weight: 700;
              color: ${isDark ? '#ffffff' : '#111827'};
              margin-bottom: 8px;
              letter-spacing: 0.3px;
            ">${t.swalRoutineName}</label>
            <input
              id="routineName"
              class="swal2-input"
              placeholder="${t.swalRoutineNamePh}"
              autofocus
              style="
                width: 100%;
                margin: 0;
                padding: 12px 14px;
                font-size: 15px;
                border-radius: 8px;
                box-sizing: border-box;
              "
            >
          </div>

          <div style="margin-bottom: 16px;">
            <label class="modal-label" style="
              display: block;
              font-size: 15px;
              font-weight: 700;
              color: ${isDark ? '#ffffff' : '#111827'};
              margin-bottom: 8px;
              letter-spacing: 0.3px;
            ">${t.swalExercises}</label>
            <div id="exercisesContainer"></div>
            <button type="button" class="btn-add-ex" id="btnAddExercise">${t.swalAddEx}</button>
          </div>
        </div>
      `,
      width: window.innerWidth < 640 ? '95vw' : '580px',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: t.swalSave,
      cancelButtonText: t.swalCancel,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'swal-planner-modal',
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel',
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const nameInput = document.getElementById('routineName') as HTMLInputElement;
        const exercisesContainer = document.getElementById('exercisesContainer') as HTMLElement;
        const btnAddExercise = document.getElementById('btnAddExercise') as HTMLButtonElement;

        let exercises: Array<{ name: string; sets: number; rest: number }> = [];

        const validateForm = () => {
          const hasName = nameInput.value.trim() !== '';
          const hasExercises = exercises.length > 0;
          const allExercisesFilled = exercises.every(
            (ex) => ex.name.trim() !== '' && ex.sets > 0 && ex.rest >= 0,
          );

          const isValid = hasName && hasExercises && allExercisesFilled;

          if (confirmButton) {
            confirmButton.disabled = !isValid;
            confirmButton.style.opacity = isValid ? '1' : '0.5';
            confirmButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
          }
        };

        const renderExercises = () => {
          exercisesContainer.innerHTML = exercises
            .map(
              (ex, index) => `
            <div class="exercise-item">
              <div class="exercise-name-field">
                <span class="desktop-label-single">${t.swalExLabel}</span>
                <label class="field-label">${t.swalExLabel}</label>
                <input
                  type="text"
                  class="swal2-input ex-name"
                  data-index="${index}"
                  placeholder="${t.swalExercisePh}"
                  value="${ex.name}"
                  style="margin: 0; padding: 10px 12px; font-size: 14px; width: 100%;"
                >
              </div>
              <div class="desktop-label-row">
                <span>${t.swalSets}</span>
                <span>${t.swalRest}</span>
              </div>
              <div class="exercise-row">
                <div class="exercise-field">
                  <label class="field-label">${t.swalSets}</label>
                  <input
                    type="number"
                    class="swal2-input ex-sets"
                    data-index="${index}"
                    placeholder="3"
                    value="${ex.sets}"
                    min="1"
                    style="margin: 0; padding: 10px 12px; font-size: 14px; width: 100%;"
                  >
                </div>
                <div class="exercise-field">
                  <label class="field-label">${t.swalRest}</label>
                  <input
                    type="number"
                    class="swal2-input ex-rest"
                    data-index="${index}"
                    placeholder="60"
                    value="${ex.rest}"
                    min="0"
                    style="margin: 0; padding: 10px 12px; font-size: 14px; width: 100%;"
                  >
                </div>
              </div>
              <button type="button" class="btn-remove-ex" data-index="${index}">${t.swalRemove}</button>
            </div>
          `,
            )
            .join('');

          exercisesContainer.querySelectorAll('.ex-name').forEach((input) => {
            input.addEventListener('input', (e) => {
              const idx = parseInt((e.target as HTMLInputElement).dataset['index']!);
              exercises[idx].name = (e.target as HTMLInputElement).value;
              validateForm();
            });
          });

          exercisesContainer.querySelectorAll('.ex-sets').forEach((input) => {
            input.addEventListener('input', (e) => {
              const idx = parseInt((e.target as HTMLInputElement).dataset['index']!);
              exercises[idx].sets = parseInt((e.target as HTMLInputElement).value) || 0;
              validateForm();
            });
          });

          exercisesContainer.querySelectorAll('.ex-rest').forEach((input) => {
            input.addEventListener('input', (e) => {
              const idx = parseInt((e.target as HTMLInputElement).dataset['index']!);
              exercises[idx].rest = parseInt((e.target as HTMLInputElement).value) || 0;
              validateForm();
            });
          });

          exercisesContainer.querySelectorAll('.btn-remove-ex').forEach((btn) => {
            btn.addEventListener('click', (e) => {
              const idx = parseInt((e.target as HTMLButtonElement).dataset['index']!);
              exercises.splice(idx, 1);
              renderExercises();
              validateForm();
            });
          });

          validateForm();
        };

        btnAddExercise.addEventListener('click', () => {
          exercises.push({ name: '', sets: 3, rest: 60 });
          renderExercises();
        });

        nameInput.addEventListener('input', validateForm);

        validateForm();
      },
      preConfirm: () => {
        const name = (document.getElementById('routineName') as HTMLInputElement).value;
        const exercisesInputs = document.querySelectorAll('.ex-name');
        const exercises: Exercise[] = [];

        exercisesInputs.forEach((input, index) => {
          const nameInput = input as HTMLInputElement;
          const setsInput = document.querySelector(
            `.ex-sets[data-index="${index}"]`,
          ) as HTMLInputElement;
          const restInput = document.querySelector(
            `.ex-rest[data-index="${index}"]`,
          ) as HTMLInputElement;

          exercises.push({
            name: nameInput.value,
            sets: parseInt(setsInput.value),
            restSeconds: parseInt(restInput.value),
          });
        });

        if (!name || exercises.length === 0) {
          Swal.showValidationMessage(t.swalFillAll);
          return false;
        }

        return { name, exercises };
      },
    });

    if (formValues) {
      this.service.addRoutine(formValues);

      await Swal.fire({
        icon: 'success',
        title: t.swalCreated,
        text: t.swalCreatedText,
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1e2433' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#111827',
      });
    }
  }

  addExercise(): void {
    this.routineForm.exercises.push({ name: '', sets: 3, restSeconds: 60 });
  }

  removeExercise(index: number): void {
    this.routineForm.exercises.splice(index, 1);
  }

  saveRoutine(): void {
    this.service.addRoutine(this.routineForm);
  }
}
