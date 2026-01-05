import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

      @if (showRoutineForm()) {
      <div class="form-card">
        <div class="form-header">Crear Rutina</div>

        <input
          type="text"
          placeholder="Nombre de la rutina"
          [(ngModel)]="routineForm.name"
          class="input-name"
        />

        <div class="exercises-label">Ejercicios</div>

        @for (ex of routineForm.exercises; track $index; let i = $index) {
        <div class="exercise-row">
          <input type="text" placeholder="Ejercicio" [(ngModel)]="ex.name" class="ex-name" />
          <input type="number" placeholder="Sets" [(ngModel)]="ex.sets" class="ex-sets" />
          <input
            type="number"
            placeholder="Descanso (s)"
            [(ngModel)]="ex.restSeconds"
            class="ex-rest"
          />
          <button class="btn-remove" (click)="removeExercise(i)">✕</button>
        </div>
        }

        <button class="btn-add-exercise" (click)="addExercise()">+ Añadir Ejercicio</button>

        <div class="form-actions">
          <button class="btn-save" (click)="saveRoutine()">✓ Guardar</button>
          <button class="btn-cancel" (click)="cancelRoutineForm()">✕ Cancelar</button>
        </div>
      </div>
      }

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

      .form-header {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 20px;
        text-align: center;
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

      .input-name:focus {
        outline: none;
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }

      .exercises-label {
        font-size: 15px;
        font-weight: 700;
        color: #6b7280;
        margin-bottom: 12px;
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

      .exercise-row input:focus {
        outline: none;
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
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

      .btn-add-exercise:hover {
        background: #f3f4f6;
        border-color: #9ca3af;
        color: #374151;
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

      .btn-cancel:hover {
        background: #e5e7eb;
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

      .routine-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .routine-name {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 8px;
      }

      .routine-info {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 16px;
        font-weight: 600;
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

      .empty-text {
        font-size: 14px;
        color: #9ca3af;
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
  showRoutineForm = signal(false);
  routineForm: { name: string; exercises: Exercise[] } = { name: '', exercises: [] };

  constructor(protected service: GymService) {}

  currentExercise = () => {
    const state = this.service.sessionState();
    return state ? state.routine.exercises[state.exerciseIndex] : null;
  };

  openRoutineForm(): void {
    this.showRoutineForm.set(true);
    this.routineForm = { name: '', exercises: [] };
  }

  addExercise(): void {
    this.routineForm.exercises.push({ name: '', sets: 3, restSeconds: 60 });
  }

  removeExercise(index: number): void {
    this.routineForm.exercises.splice(index, 1);
  }

  saveRoutine(): void {
    this.service.addRoutine(this.routineForm);
    this.cancelRoutineForm();
  }

  cancelRoutineForm(): void {
    this.showRoutineForm.set(false);
  }
}
