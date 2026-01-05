import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-setup',
  imports: [FormsModule],
  template: `
    <div class="container" [class.fullscreen]="isFullscreen()">
      <div class="content">
        <div class="time-display">{{ currentTime() }}</div>
        <div class="date-display">{{ currentDate() }}</div>

        @if (weather.weather(); as w) {
        <div class="weather-card">
          <div class="weather-icon">🌤️</div>
          <div class="temp">{{ w.temp }}°</div>
          <div class="city">{{ w.city }}</div>
        </div>
        } @else {
        <div class="weather-input-card">
          <input
            type="text"
            placeholder="Ingresa tu ciudad"
            [(ngModel)]="cityInput"
            (keyup.enter)="setCity()"
          />
          <button (click)="setCity()">✓</button>
        </div>
        }
      </div>

      <button class="btn-fullscreen" (click)="toggleFullscreen()">
        {{ isFullscreen() ? '✕ Salir' : '⛶ Pantalla completa' }}
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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        padding: 40px 24px;
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

      .content {
        text-align: center;
      }

      .time-display {
        font-size: 120px;
        font-weight: 800;
        color: white;
        letter-spacing: -4px;
        margin-bottom: 16px;
        font-variant-numeric: tabular-nums;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        line-height: 1;
      }

      .date-display {
        font-size: 24px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.95);
        margin-bottom: 48px;
        letter-spacing: 0.3px;
        text-transform: capitalize;
      }

      .weather-card {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 24px;
        padding: 32px 48px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      .weather-icon {
        font-size: 56px;
        margin-bottom: 16px;
      }

      .temp {
        font-size: 56px;
        font-weight: 700;
        color: white;
        margin-bottom: 8px;
        letter-spacing: -2px;
      }

      .city {
        font-size: 20px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
      }

      .weather-input-card {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        display: flex;
        gap: 12px;
      }

      .weather-input-card input {
        padding: 14px 20px;
        font-size: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 12px;
        min-width: 240px;
        font-weight: 500;
        transition: all 0.2s;
      }

      .weather-input-card input:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.2);
      }

      .weather-input-card input::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }

      .weather-input-card button {
        padding: 14px 20px;
        background: white;
        color: #667eea;
        border: none;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .weather-input-card button:hover {
        transform: scale(1.05);
      }

      .btn-fullscreen {
        position: absolute;
        bottom: 32px;
        right: 32px;
        padding: 14px 24px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .btn-fullscreen:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }

      @media (max-width: 768px) {
        .time-display {
          font-size: 80px;
          letter-spacing: -2px;
        }

        .date-display {
          font-size: 18px;
          margin-bottom: 32px;
        }

        .weather-card {
          padding: 24px 32px;
        }

        .weather-icon {
          font-size: 48px;
        }

        .temp {
          font-size: 48px;
        }

        .city {
          font-size: 18px;
        }

        .weather-input-card input {
          min-width: 200px;
          font-size: 15px;
        }

        .btn-fullscreen {
          bottom: 24px;
          right: 24px;
          padding: 12px 20px;
          font-size: 14px;
        }
      }

      @media (max-width: 480px) {
        .time-display {
          font-size: 64px;
        }

        .date-display {
          font-size: 16px;
        }

        .weather-input-card {
          flex-direction: column;
        }

        .weather-input-card input {
          min-width: 100%;
        }
      }
    `,
  ],
})
export class SetupComponent {
  currentTime = signal('');
  currentDate = signal('');
  isFullscreen = signal(false);
  cityInput = '';

  constructor(protected weather: WeatherService) {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);

    this.weather.fetchWeather();
    setInterval(() => this.weather.fetchWeather(), 30 * 60 * 1000);
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime.set(
      now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
    this.currentDate.set(
      now.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
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

  setCity(): void {
    if (this.cityInput.trim()) {
      this.weather.setCity(this.cityInput.trim());
      this.cityInput = '';
    }
  }
}
