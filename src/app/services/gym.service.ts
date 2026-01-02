import { effect, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

export interface Exercise {
  name: string;
  sets: number;
  restSeconds: number;
  weight?: string;
  reps?: string;
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface GymSession {
  date: string;
  durationMinutes: number;
  routineName: string;
}

export interface SessionState {
  routine: Routine;
  exerciseIndex: number;
  setIndex: number;
  restTimeLeft: number;
  inRest: boolean;
  startTime: Date;
}

@Injectable({ providedIn: 'root' })
export class GymService {
  routines = signal<Routine[]>([]);
  history = signal<GymSession[]>([]);
  sessionState = signal<SessionState | null>(null);

  private restIntervalId?: number;

  constructor(private storage: StorageService) {
    this.routines.set(this.storage.get('fh_gym_routines', []));
    this.history.set(this.storage.get('fh_gym_history', []));

    effect(() => {
      this.storage.set('fh_gym_routines', this.routines());
    });
    effect(() => {
      this.storage.set('fh_gym_history', this.history());
    });
  }

  addRoutine(routine: Omit<Routine, 'id'>): void {
    const newRoutine: Routine = { ...routine, id: crypto.randomUUID() };
    this.routines.update((rs) => [...rs, newRoutine]);
  }

  updateRoutine(id: string, updates: Partial<Routine>): void {
    this.routines.update((rs) => rs.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }

  deleteRoutine(id: string): void {
    this.routines.update((rs) => rs.filter((r) => r.id !== id));
  }

  startSession(routine: Routine): void {
    this.sessionState.set({
      routine,
      exerciseIndex: 0,
      setIndex: 0,
      restTimeLeft: 0,
      inRest: false,
      startTime: new Date(),
    });
  }

  startRest(): void {
    const state = this.sessionState();
    if (!state || state.inRest) return;

    const exercise = state.routine.exercises[state.exerciseIndex];
    this.sessionState.update((s) =>
      s ? { ...s, inRest: true, restTimeLeft: exercise.restSeconds } : null
    );

    this.clearRestTimer();
    this.restIntervalId = window.setInterval(() => {
      const current = this.sessionState();
      if (!current || current.restTimeLeft <= 0) {
        this.clearRestTimer();
        this.sessionState.update((s) => (s ? { ...s, inRest: false, restTimeLeft: 0 } : null));
      } else {
        this.sessionState.update((s) => (s ? { ...s, restTimeLeft: s.restTimeLeft - 1 } : null));
      }
    }, 1000);
  }

  nextSet(): void {
    const state = this.sessionState();
    if (!state) return;

    const exercise = state.routine.exercises[state.exerciseIndex];
    if (state.setIndex + 1 < exercise.sets) {
      this.sessionState.update((s) =>
        s ? { ...s, setIndex: s.setIndex + 1, inRest: false, restTimeLeft: 0 } : null
      );
    } else {
      this.nextExercise();
    }
  }

  nextExercise(): void {
    const state = this.sessionState();
    if (!state) return;

    if (state.exerciseIndex + 1 < state.routine.exercises.length) {
      this.sessionState.update((s) =>
        s
          ? {
              ...s,
              exerciseIndex: s.exerciseIndex + 1,
              setIndex: 0,
              inRest: false,
              restTimeLeft: 0,
            }
          : null
      );
    } else {
      this.finishSession();
    }
  }

  finishSession(): void {
    const state = this.sessionState();
    if (!state) return;

    const duration = Math.round((new Date().getTime() - state.startTime.getTime()) / 60000);
    const session: GymSession = {
      date: new Date().toISOString().split('T')[0],
      durationMinutes: duration,
      routineName: state.routine.name,
    };
    this.history.update((h) => [...h, session]);
    this.sessionState.set(null);
    this.clearRestTimer();
  }

  cancelSession(): void {
    this.sessionState.set(null);
    this.clearRestTimer();
  }

  private clearRestTimer(): void {
    if (this.restIntervalId) {
      clearInterval(this.restIntervalId);
      this.restIntervalId = undefined;
    }
  }
}
