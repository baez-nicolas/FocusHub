import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Exercise, GymService } from '../services/gym.service';

@Component({
  selector: 'app-gym',
  imports: [FormsModule],
  template: `
    <div class="container">
      @if (!service.sessionState()) {
      <div class="header">
        <div class="title">💪 Gym</div>
      </div>

      <button class="btn-add" (click)="openRoutineForm()">+ Nueva Rutina</button>

      <div class="routines-grid">
        @for (routine of service.routines(); track routine.id) {
        <div class="routine-card">
          <div class="routine-name">{{ routine.name }}</div>
          <div class="routine-info">{{ routine.exercises.length }} ejercicios</div>
          <div class="routine-actions">
            <button class="btn-start" (click)="service.startSession(routine)">▶ Iniciar</button>
            <button class="btn-delete" (click)="service.deleteRoutine(routine.id)">🗑</button>
          </div>
        </div>
        } @empty {
        <div class="empty-state">
          <div class="empty-icon">🏋️</div>
          <div class="empty-title">Sin rutinas guardadas</div>
          <div class="empty-text">Crea tu primera rutina de entrenamiento</div>
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
            Set {{ service.sessionState()!.setIndex + 1 }} de {{ currentExercise()?.sets }}
          </div>
        </div>

        @if (service.sessionState()!.inRest) {
        <div class="rest-card">
          <div class="rest-label">⏱ Descansando</div>
          <div class="rest-timer">{{ service.sessionState()!.restTimeLeft }}s</div>
        </div>
        } @else {
        <button class="btn-rest" (click)="service.startRest()">Iniciar Descanso</button>
        }

        <div class="session-controls">
          <button class="btn-control" (click)="service.nextSet()">Siguiente Set</button>
          <button class="btn-control" (click)="service.nextExercise()">Siguiente Ejercicio</button>
          <button class="btn-finish" (click)="service.finishSession()">✓ Terminar</button>
          <button class="btn-cancel-session" (click)="service.cancelSession()">✕ Cancelar</button>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 900px;
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
      }

      :host-context(.dark) .title {
        color: #f3f4f6 !important;
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

      .btn-add:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
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
  routineForm: { name: string; exercises: Exercise[] } = { name: '', exercises: [] };

  constructor(protected service: GymService) {}

  currentExercise = () => {
    const state = this.service.sessionState();
    return state ? state.routine.exercises[state.exerciseIndex] : null;
  };

  async openRoutineForm(): Promise<void> {
    const isDark = document.documentElement.classList.contains('dark');

    // Generar HTML dinámico para los ejercicios
    let exercisesHTML = '';
    this.routineForm.exercises = []; // Resetear ejercicios

    const { value: formValues } = await Swal.fire({
      title: '💪 Nueva Rutina',
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
            ">Nombre de la rutina</label>
            <input
              id="routineName"
              class="swal2-input"
              placeholder="Ej: Piernas y Glúteos"
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
            ">Ejercicios</label>
            <div id="exercisesContainer"></div>
            <button type="button" class="btn-add-ex" id="btnAddExercise">+ Añadir Ejercicio</button>
          </div>
        </div>
      `,
      width: window.innerWidth < 640 ? '95vw' : '580px',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '✓ Guardar',
      cancelButtonText: '✕ Cancelar',
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
            (ex) => ex.name.trim() !== '' && ex.sets > 0 && ex.rest >= 0
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
                <span class="desktop-label-single">Ejercicio</span>
                <label class="field-label">Ejercicio</label>
                <input
                  type="text"
                  class="swal2-input ex-name"
                  data-index="${index}"
                  placeholder="Ej: Sentadillas"
                  value="${ex.name}"
                  style="margin: 0; padding: 10px 12px; font-size: 14px; width: 100%;"
                >
              </div>
              <div class="desktop-label-row">
                <span>Series</span>
                <span>Descanso</span>
              </div>
              <div class="exercise-row">
                <div class="exercise-field">
                  <label class="field-label">Series</label>
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
                  <label class="field-label">Descanso (seg)</label>
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
              <button type="button" class="btn-remove-ex" data-index="${index}">✕ Eliminar</button>
            </div>
          `
            )
            .join('');

          // Agregar event listeners
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

        // Validar al inicio
        validateForm();
      },
      preConfirm: () => {
        const name = (document.getElementById('routineName') as HTMLInputElement).value;
        const exercisesInputs = document.querySelectorAll('.ex-name');
        const exercises: Exercise[] = [];

        exercisesInputs.forEach((input, index) => {
          const nameInput = input as HTMLInputElement;
          const setsInput = document.querySelector(
            `.ex-sets[data-index="${index}"]`
          ) as HTMLInputElement;
          const restInput = document.querySelector(
            `.ex-rest[data-index="${index}"]`
          ) as HTMLInputElement;

          exercises.push({
            name: nameInput.value,
            sets: parseInt(setsInput.value),
            restSeconds: parseInt(restInput.value),
          });
        });

        if (!name || exercises.length === 0) {
          Swal.showValidationMessage('Por favor completa todos los campos');
          return false;
        }

        return { name, exercises };
      },
    });

    if (formValues) {
      this.service.addRoutine(formValues);

      await Swal.fire({
        icon: 'success',
        title: '¡Rutina creada!',
        text: 'La rutina se ha agregado correctamente',
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
