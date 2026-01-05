import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-setup',
  imports: [],
  template: `
    <div class="container" [class.fullscreen]="isFullscreen()">
      <div class="stars"></div>
      <div class="stars2"></div>
      <div class="stars3"></div>
      <div class="gradient-overlay"></div>

      <div class="content">
        <div class="time-section">
          <div class="time-glow"></div>
          <div class="time-display">{{ currentTime() }}</div>
        </div>
        <div class="date-display">{{ currentDate() }}</div>
        <div class="greeting">{{ greeting() }}</div>
      </div>

      <button class="btn-fullscreen" (click)="toggleFullscreen()">
        <span class="btn-icon">{{ isFullscreen() ? '✕' : '⛶' }}</span>
        <span class="btn-text">{{ isFullscreen() ? 'Salir' : 'Pantalla completa' }}</span>
      </button>
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
        background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
        position: relative;
        padding: 40px 24px;
        overflow: hidden;
      }

      .container.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        min-height: 100vh;
        z-index: 9999;
      }

      .stars,
      .stars2,
      .stars3 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .stars {
        background: transparent
          url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')
          repeat;
        background-size: 200px 200px;
        animation: animateStars 150s linear infinite;
        opacity: 0.4;
      }

      .stars2 {
        background: transparent
          url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')
          repeat;
        background-size: 300px 300px;
        animation: animateStars 200s linear infinite;
        opacity: 0.3;
      }

      .stars3 {
        background: transparent
          url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMyIgaGVpZ2h0PSIzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjMiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')
          repeat;
        background-size: 400px 400px;
        animation: animateStars 250s linear infinite;
        opacity: 0.2;
      }

      @keyframes animateStars {
        from {
          transform: translateY(0);
        }
        to {
          transform: translateY(-2000px);
        }
      }

      .gradient-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 20% 30%, rgba(88, 101, 242, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
        pointer-events: none;
        animation: pulse 15s ease-in-out infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 0.7;
        }
        50% {
          opacity: 1;
        }
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
        background: radial-gradient(ellipse, rgba(139, 92, 246, 0.5) 0%, transparent 70%);
        filter: blur(60px);
        z-index: 1;
        animation: glow 6s ease-in-out infinite;
      }

      @keyframes glow {
        0%,
        100% {
          opacity: 0.3;
          transform: scale(1);
        }
        50% {
          opacity: 0.6;
          transform: scale(1.1);
        }
      }

      .time-display {
        font-size: 160px;
        font-weight: 900;
        color: white;
        letter-spacing: -8px;
        font-variant-numeric: tabular-nums;
        text-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(255, 255, 255, 0.2);
        line-height: 1;
        position: relative;
        z-index: 2;
      }

      .date-display {
        font-size: 32px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.98);
        margin-bottom: 24px;
        letter-spacing: 0.5px;
        text-transform: capitalize;
        text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .greeting {
        font-size: 20px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        letter-spacing: 0.3px;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .btn-fullscreen {
        position: absolute;
        bottom: 40px;
        right: 40px;
        padding: 18px 32px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .btn-fullscreen:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        border-color: rgba(255, 255, 255, 0.5);
      }

      .btn-icon {
        font-size: 20px;
      }

      .btn-text {
        letter-spacing: 0.5px;
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

        .btn-fullscreen {
          bottom: 32px;
          right: 32px;
          padding: 16px 28px;
          font-size: 14px;
        }

        .btn-icon {
          font-size: 18px;
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

        .btn-fullscreen {
          bottom: 24px;
          right: 24px;
          padding: 14px 24px;
          font-size: 13px;
          gap: 8px;
        }

        .btn-text {
          display: none;
        }

        .btn-icon {
          font-size: 20px;
        }
      }
    `,
  ],
})
export class SetupComponent {
  currentTime = signal('');
  currentDate = signal('');
  greeting = signal('');
  isFullscreen = signal(false);

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
    setInterval(() => this.updateTime(), 1000);
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

  toggleFullscreen(): void {
    if (!this.isFullscreen()) {
      document.documentElement.requestFullscreen();
      this.isFullscreen.set(true);
    } else {
      document.exitFullscreen();
      this.isFullscreen.set(false);
    }
  }
}
