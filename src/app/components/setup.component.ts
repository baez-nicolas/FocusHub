import { Component, inject, signal } from '@angular/core';
import { PomodoroService } from '../services/pomodoro.service';

@Component({
  selector: 'app-setup',
  imports: [],
  template: `
    <div class="container" [style.background-image]="'url(' + currentBackground() + ')'">
      <div class="overlay"></div>

      <div class="content">
        <div class="time-section">
          <div class="time-glow"></div>
          <div class="time-display">{{ currentTime() }}</div>
        </div>
        <div class="date-display">{{ currentDate() }}</div>
        <div class="greeting">{{ greeting() }}</div>
      </div>

      @if (pomodoroService.state() !== 'IDLE' && pomodoroService.state() !== 'PAUSED') {
      <div class="pomodoro-widget">
        <div class="pomodoro-label">{{ getPhaseLabel() }}</div>
        <div class="pomodoro-time">{{ formatTime() }}</div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .container {
        min-height: calc(100vh - 80px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: 40px 24px;
        overflow: hidden;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        transition: background-image 1s ease-in-out;
      }

      .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.3) 0%,
          rgba(0, 0, 0, 0.5) 50%,
          rgba(0, 0, 0, 0.7) 100%
        );
        pointer-events: none;
      }

      .content {
        text-align: center;
        position: relative;
        z-index: 1;
      }

      .time-section {
        position: relative;
        display: inline-block;
        margin-bottom: 32px;
      }

      .time-glow {
        position: absolute;
        inset: -40px;
        background: radial-gradient(ellipse, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
        filter: blur(60px);
        z-index: 1;
        animation: glow 8s ease-in-out infinite;
      }

      @keyframes glow {
        0%,
        100% {
          opacity: 0.4;
          transform: scale(1);
        }
        50% {
          opacity: 0.7;
          transform: scale(1.15);
        }
      }

      .time-display {
        font-size: 160px;
        font-weight: 900;
        color: white;
        letter-spacing: -8px;
        font-variant-numeric: tabular-nums;
        text-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 80px rgba(255, 255, 255, 0.3),
          0 4px 20px rgba(0, 0, 0, 0.9);
        line-height: 1;
        position: relative;
        z-index: 2;
      }

      .date-display {
        font-size: 32px;
        font-weight: 700;
        color: white;
        margin-bottom: 24px;
        letter-spacing: 0.5px;
        text-transform: capitalize;
        text-shadow: 0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 6px rgba(0, 0, 0, 0.9);
      }

      .greeting {
        font-size: 20px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.95);
        letter-spacing: 0.3px;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 4px rgba(0, 0, 0, 0.9);
      }

      .pomodoro-widget {
        position: fixed;
        bottom: 40px;
        right: 40px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px);
        padding: 20px 32px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        z-index: 10;
        transition: all 0.3s ease;
      }

      .pomodoro-widget:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
      }

      .pomodoro-label {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .pomodoro-time {
        font-size: 36px;
        font-weight: 900;
        color: white;
        font-variant-numeric: tabular-nums;
        letter-spacing: -1px;
        text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      @media (max-width: 768px) {
        .time-display {
          font-size: 120px;
          letter-spacing: -5px;
        }

        .date-display {
          font-size: 24px;
          margin-bottom: 20px;
        }

        .greeting {
          font-size: 18px;
        }

        .pomodoro-widget {
          bottom: 24px;
          right: 24px;
          padding: 16px 24px;
        }

        .pomodoro-label {
          font-size: 12px;
        }

        .pomodoro-time {
          font-size: 28px;
        }
      }

      @media (max-width: 520px) {
        .time-display {
          font-size: 88px;
          letter-spacing: -3px;
        }

        .date-display {
          font-size: 20px;
          margin-bottom: 16px;
        }

        .greeting {
          font-size: 16px;
        }

        .pomodoro-widget {
          bottom: 16px;
          right: 16px;
          padding: 12px 20px;
        }

        .pomodoro-label {
          font-size: 11px;
          margin-bottom: 4px;
        }

        .pomodoro-time {
          font-size: 24px;
        }
      }
    `,
  ],
})
export class SetupComponent {
  pomodoroService = inject(PomodoroService);
  currentTime = signal('');
  currentDate = signal('');
  greeting = signal('');

  private backgrounds = [
    '/assets/backgrounds/foto1.jpg',
    '/assets/backgrounds/foto2.jfif',
    '/assets/backgrounds/foto3.jpg',
    '/assets/backgrounds/foto4.jpg',
    '/assets/backgrounds/foto5.jpg',
    '/assets/backgrounds/foto6.jpg',
  ];

  currentBackground = signal(this.backgrounds[0]);

  private morningGreetings = [
    '¡Buenos días! Que tengas un excelente comienzo ☀️',
    '¡Buen día! Que sea un día productivo 🌅',
    '¡Buenos días! Hoy será un gran día ✨',
    '¡Buen comienzo! A por un día increíble 🌞',
    '¡Buenos días! Empieza con energía positiva 🌤️',
  ];

  private afternoonGreetings = [
    '¡Buenas tardes! Que tengas una tarde productiva 🌤️',
    '¡Buena tarde! Sigue con ese ritmo ⭐',
    '¡Buenas tardes! Que sea una tarde increíble ✨',
    '¡Buena tarde! A seguir cumpliendo metas 🎯',
    '¡Buenas tardes! Aprovecha cada momento 🌟',
  ];

  private eveningGreetings = [
    '¡Buenas noches! Que tengas una noche tranquila 🌙',
    '¡Buena noche! Descansa y recarga energías ✨',
    '¡Buenas noches! Que tengas dulces sueños 💫',
    '¡Buena noche! Es hora de relajarse 🌃',
    '¡Buenas noches! Mañana será otro gran día 🌠',
  ];

  constructor() {
    this.updateTime();
    this.updateBackground();
    setInterval(() => this.updateTime(), 1000);
    setInterval(() => this.updateBackground(), 30000);
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime.set(
      now.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
    this.currentDate.set(
      now.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
    this.updateGreeting(now.getHours(), now.getDate());
  }

  updateGreeting(hour: number, dayOfMonth: number): void {
    let greetings: string[];

    if (hour >= 6 && hour < 12) {
      greetings = this.morningGreetings;
    } else if (hour >= 12 && hour < 20) {
      greetings = this.afternoonGreetings;
    } else {
      greetings = this.eveningGreetings;
    }

    const dayIndex = dayOfMonth % greetings.length;
    this.greeting.set(greetings[dayIndex]);
  }

  updateBackground(): void {
    const randomIndex = Math.floor(Math.random() * this.backgrounds.length);
    this.currentBackground.set(this.backgrounds[randomIndex]);
  }

  getPhaseLabel(): string {
    const state = this.pomodoroService.state();
    if (state === 'RUNNING_FOCUS') {
      return 'Enfoque';
    } else if (state === 'RUNNING_SHORT_BREAK' || state === 'RUNNING_LONG_BREAK') {
      return 'Descanso';
    }
    return '';
  }

  formatTime(): string {
    const seconds = this.pomodoroService.secondsLeft();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
