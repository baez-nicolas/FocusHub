import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Exercise, GymService } from '../services/gym.service';

@Component({
  selector: 'app-gym',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gym">
      @if (!service.sessionState()) {
      <h1>Gym</h1>
      <button class="btn-new" (click)="openRoutineForm()">+ Nueva rutina</button>

      @if (showRoutineForm()) {
      <div class="form-card">
        <input type="text" placeholder="Nombre de rutina" [(ngModel)]="routineForm.name" />
        <h3>Ejercicios</h3>
        @for (ex of routineForm.exercises; track $index; let i = $index) {
        <div class="exercise-form">
          <input type="text" placeholder="Ejercicio" [(ngModel)]="ex.name" />
          <input type="number" placeholder="Sets" [(ngModel)]="ex.sets" />
          <input type="number" placeholder="Descanso (seg)" [(ngModel)]="ex.restSeconds" />
          <button (click)="removeExercise(i)">✗</button>
        </div>
        }
        <button class="btn-add-exercise" (click)="addExercise()">+ Ejercicio</button>
        <div class="form-actions">
          <button class="btn-primary" (click)="saveRoutine()">Guardar</button>
          <button class="btn-secondary" (click)="cancelRoutineForm()">Cancelar</button>
        </div>
      </div>
      }

      <div class="routines-list">
        @for (routine of service.routines(); track routine.id) {
        <div class="routine-card">
          <h3>{{ routine.name }}</h3>
          <p>{{ routine.exercises.length }} ejercicios</p>
          <div class="routine-actions">
            <button class="btn-primary" (click)="service.startSession(routine)">Iniciar</button>
            <button class="btn-secondary" (click)="service.deleteRoutine(routine.id)">
              Borrar
            </button>
          </div>
        </div>
        } @empty {
        <p class="empty">Sin rutinas guardadas</p>
        }
      </div>
      } @else {
      <div class="session-view">
        <h1>{{ service.sessionState()!.routine.name }}</h1>
        <div class="exercise-display">
          <h2>{{ currentExercise()?.name }}</h2>
          <p>Set {{ service.sessionState()!.setIndex + 1 }} / {{ currentExercise()?.sets }}</p>
        </div>

        @if (service.sessionState()!.inRest) {
        <div class="rest-timer">
          <h3>Descansando</h3>
          <div class="timer">{{ service.sessionState()!.restTimeLeft }}s</div>
        </div>
        } @else {
        <button class="btn-rest" (click)="service.startRest()">Iniciar descanso</button>
        }

        <div class="session-controls">
          <button class="btn-primary" (click)="service.nextSet()">Siguiente set</button>
          <button class="btn-primary" (click)="service.nextExercise()">Siguiente ejercicio</button>
          <button class="btn-secondary" (click)="service.finishSession()">Terminar</button>
          <button class="btn-secondary" (click)="service.cancelSession()">Cancelar</button>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .gym {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      .btn-new {
        padding: 10px 20px;
        background: #000;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        margin-bottom: 20px;
      }
      .form-card {
        background: #f5f5f5;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
      }
      .form-card input {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 16px;
        width: 100%;
        margin-bottom: 10px;
      }
      .exercise-form {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr auto;
        gap: 10px;
        margin-bottom: 10px;
      }
      .exercise-form input {
        width: auto;
        margin: 0;
      }
      .btn-add-exercise {
        padding: 8px 16px;
        background: #ddd;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        margin-bottom: 15px;
      }
      .form-actions {
        display: flex;
        gap: 10px;
      }
      .btn-primary,
      .btn-secondary {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }
      .btn-primary {
        background: #000;
        color: #fff;
      }
      .btn-secondary {
        background: #ddd;
        color: #000;
      }
      .routines-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .routine-card {
        background: #fff;
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #ddd;
      }
      .routine-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
      }
      .empty {
        text-align: center;
        color: #999;
        padding: 40px;
      }
      .session-view {
        text-align: center;
      }
      .exercise-display {
        background: #f5f5f5;
        padding: 40px;
        border-radius: 12px;
        margin: 20px 0;
      }
      .rest-timer {
        background: #fff3cd;
        padding: 30px;
        border-radius: 12px;
        margin: 20px 0;
      }
      .timer {
        font-size: 48px;
        font-weight: 600;
        margin-top: 10px;
      }
      .btn-rest {
        padding: 15px 30px;
        background: #ff9800;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 18px;
        margin: 20px 0;
      }
      .session-controls {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
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
