import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-setup',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="setup" [class.fullscreen]="isFullscreen()">
      <div class="content">
        <div class="datetime">
          <div class="time">{{ currentTime() }}</div>
          <div class="date">{{ currentDate() }}</div>
        </div>

        @if (weather.weather(); as w) {
        <div class="weather">
          <span class="temp">{{ w.temp }}°C</span>
          <span class="city">{{ w.city }}</span>
        </div>
        } @else {
        <div class="weather-input">
          <input
            type="text"
            placeholder="Ciudad"
            [(ngModel)]="cityInput"
            (keyup.enter)="setCity()"
          />
        </div>
        }
      </div>

      <button class="btn-fullscreen" (click)="toggleFullscreen()">
        {{ isFullscreen() ? '✕' : 'Pantalla completa' }}
      </button>
    </div>
  `,
  styles: [
    `
      .setup {
        min-height: calc(100vh - 100px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        position: relative;
      }
      .setup.fullscreen {
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
      .time {
        font-size: 96px;
        font-weight: 300;
        margin-bottom: 10px;
      }
      .date {
        font-size: 32px;
        font-weight: 300;
        opacity: 0.9;
      }
      .weather {
        margin-top: 40px;
        font-size: 24px;
        opacity: 0.9;
      }
      .temp {
        font-size: 48px;
        font-weight: 300;
        display: block;
        margin-bottom: 10px;
      }
      .city {
        font-size: 20px;
      }
      .weather-input {
        margin-top: 40px;
      }
      .weather-input input {
        padding: 15px 25px;
        font-size: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-radius: 30px;
        text-align: center;
      }
      .weather-input input::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }
      .btn-fullscreen {
        position: absolute;
        bottom: 30px;
        right: 30px;
        padding: 12px 24px;
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        cursor: pointer;
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
