import { effect, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

type PomodoroState =
  | 'IDLE'
  | 'RUNNING_FOCUS'
  | 'RUNNING_SHORT_BREAK'
  | 'RUNNING_LONG_BREAK'
  | 'PAUSED';

interface PomodoroConfig {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
}

interface PomodoroSession {
  date: string;
  durationMinutes: number;
}

interface PomodoroTimerState {
  state: PomodoroState;
  secondsLeft: number;
  cycleCount: number;
  lastUpdateTimestamp: number;
}

@Injectable({ providedIn: 'root' })
export class PomodoroService {
  config = signal<PomodoroConfig>({
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    cyclesBeforeLongBreak: 4,
  });
  state = signal<PomodoroState>('IDLE');
  secondsLeft = signal(0);
  cycleCount = signal(0);
  sessions = signal<PomodoroSession[]>([]);

  private intervalId?: number;

  constructor(private storage: StorageService) {
    this.config.set(this.storage.get('fh_pomodoro_config', this.config()));
    this.sessions.set(this.storage.get('fh_pomodoro_sessions', []));

    effect(() => {
      this.storage.set('fh_pomodoro_config', this.config());
    });

    this.restoreTimerState();

    effect(() => {
      this.persistTimerState();
    });
  }

  private restoreTimerState(): void {
    const savedState = this.storage.get<PomodoroTimerState | null>('fh_pomodoro_timer_state', null);

    if (savedState && savedState.state !== 'IDLE') {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - savedState.lastUpdateTimestamp) / 1000);

      let adjustedSecondsLeft = savedState.secondsLeft - elapsedSeconds;

      if (adjustedSecondsLeft <= 0) {
        this.handleMultiplePhaseCompletions(savedState, Math.abs(adjustedSecondsLeft));
      } else {
        this.state.set(savedState.state);
        this.secondsLeft.set(adjustedSecondsLeft);
        this.cycleCount.set(savedState.cycleCount);

        if (savedState.state !== 'PAUSED') {
          this.runTimer();
        }
      }
    }
  }

  private handleMultiplePhaseCompletions(
    savedState: PomodoroTimerState,
    excessSeconds: number
  ): void {
    let currentState = savedState.state;
    let currentCycleCount = savedState.cycleCount;
    let remainingSeconds = excessSeconds;

    while (remainingSeconds > 0) {
      let phaseDuration = 0;

      if (currentState === 'RUNNING_FOCUS') {
        phaseDuration = this.config().focusMinutes * 60;
        this.recordSession();
        currentCycleCount++;

        if (currentCycleCount >= this.config().cyclesBeforeLongBreak) {
          currentState = 'RUNNING_LONG_BREAK';
        } else {
          currentState = 'RUNNING_SHORT_BREAK';
        }
      } else if (currentState === 'RUNNING_SHORT_BREAK') {
        phaseDuration = this.config().shortBreakMinutes * 60;
        currentState = 'RUNNING_FOCUS';
      } else if (currentState === 'RUNNING_LONG_BREAK') {
        phaseDuration = this.config().longBreakMinutes * 60;
        currentCycleCount = 0;
        currentState = 'RUNNING_FOCUS';
      }

      if (remainingSeconds >= phaseDuration) {
        remainingSeconds -= phaseDuration;
      } else {
        this.state.set(currentState);
        this.secondsLeft.set(phaseDuration - remainingSeconds);
        this.cycleCount.set(currentCycleCount);
        this.runTimer();
        return;
      }
    }

    this.state.set(currentState);
    this.cycleCount.set(currentCycleCount);
    this.startCurrentPhase();
  }

  private startCurrentPhase(): void {
    const st = this.state();
    if (st === 'RUNNING_FOCUS') {
      this.secondsLeft.set(this.config().focusMinutes * 60);
    } else if (st === 'RUNNING_SHORT_BREAK') {
      this.secondsLeft.set(this.config().shortBreakMinutes * 60);
    } else if (st === 'RUNNING_LONG_BREAK') {
      this.secondsLeft.set(this.config().longBreakMinutes * 60);
    }
    this.runTimer();
  }

  private persistTimerState(): void {
    const timerState: PomodoroTimerState = {
      state: this.state(),
      secondsLeft: this.secondsLeft(),
      cycleCount: this.cycleCount(),
      lastUpdateTimestamp: Date.now(),
    };
    this.storage.set('fh_pomodoro_timer_state', timerState);
  }

  start(): void {
    if (this.state() === 'IDLE') {
      this.cycleCount.set(0);
      this.startFocus();
    } else if (this.state() === 'PAUSED') {
      this.resume();
    }
  }

  pause(): void {
    if (this.state() !== 'IDLE' && this.state() !== 'PAUSED') {
      this.state.set('PAUSED');
      this.clearTimer();
    }
  }

  resume(): void {
    if (this.state() === 'PAUSED') {
      this.runTimer();
    }
  }

  stop(): void {
    this.state.set('IDLE');
    this.secondsLeft.set(0);
    this.cycleCount.set(0);
    this.clearTimer();
    this.storage.remove('fh_pomodoro_timer_state');
  }

  skip(): void {
    this.clearTimer();
    this.handlePhaseComplete();
  }

  private startFocus(): void {
    this.state.set('RUNNING_FOCUS');
    this.secondsLeft.set(this.config().focusMinutes * 60);
    this.runTimer();
  }

  private startShortBreak(): void {
    this.state.set('RUNNING_SHORT_BREAK');
    this.secondsLeft.set(this.config().shortBreakMinutes * 60);
    this.runTimer();
  }

  private startLongBreak(): void {
    this.state.set('RUNNING_LONG_BREAK');
    this.secondsLeft.set(this.config().longBreakMinutes * 60);
    this.runTimer();
  }

  private runTimer(): void {
    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      const left = this.secondsLeft();
      if (left <= 0) {
        this.clearTimer();
        this.handlePhaseComplete();
      } else {
        this.secondsLeft.set(left - 1);
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private handlePhaseComplete(): void {
    const st = this.state();
    if (st === 'RUNNING_FOCUS') {
      this.recordSession();
      this.cycleCount.update((c) => c + 1);
      if (this.cycleCount() >= this.config().cyclesBeforeLongBreak) {
        this.startLongBreak();
      } else {
        this.startShortBreak();
      }
    } else if (st === 'RUNNING_SHORT_BREAK') {
      this.startFocus();
    } else if (st === 'RUNNING_LONG_BREAK') {
      this.cycleCount.set(0);
      this.startFocus();
    }
  }

  private recordSession(): void {
    const session: PomodoroSession = {
      date: new Date().toISOString().split('T')[0],
      durationMinutes: this.config().focusMinutes,
    };
    this.sessions.update((sessions) => [...sessions, session]);
    this.storage.set('fh_pomodoro_sessions', this.sessions());
  }

  getSessions(): PomodoroSession[] {
    return this.sessions();
  }
}
