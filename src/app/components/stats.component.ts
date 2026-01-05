import { Component } from '@angular/core';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'app-stats',
  imports: [],
  template: `
    <div class="container">
      <div class="header">
        <h1>Estadísticas</h1>
      </div>

      <div class="cards">
        <div class="card">
          <div class="card-icon">⏱️</div>
          <div class="card-value">{{ service.focusMinutesToday() }}</div>
          <div class="card-label">minutos hoy</div>
        </div>

        <div class="card">
          <div class="card-icon">📅</div>
          <div class="card-value">{{ service.focusMinutesThisWeek() }}</div>
          <div class="card-label">minutos esta semana</div>
        </div>

        <div class="card">
          <div class="card-icon">🔥</div>
          <div class="card-value">{{ service.streak() }}</div>
          <div class="card-label">días de racha</div>
        </div>

        <div class="card">
          <div class="card-icon">✅</div>
          <div class="card-value">{{ service.plannerCompletion() }}%</div>
          <div class="card-label">completado</div>
        </div>
      </div>

      <div class="chart-section">
        <h2>Actividad de la última semana</h2>
        <div class="chart">
          @for (day of service.getLastSevenDays(); track day.date) {
          <div class="bar-wrap">
            <div class="bar" [style.height.%]="getBarHeight(day.minutes)">
              <span class="bar-value">{{ day.minutes }}</span>
            </div>
            <div class="bar-date">{{ formatDate(day.date) }}</div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 36px 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .header {
        margin-bottom: 32px;
      }

      h1 {
        font-size: 32px;
        font-weight: 700;
        color: #111827;
        margin: 0;
        letter-spacing: -0.5px;
      }

      .cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        margin-bottom: 48px;
      }

      .card {
        background: white;
        border-radius: 16px;
        padding: 32px 24px;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        border: 1px solid #f3f4f6;
        transition: all 0.3s;
      }

      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        border-color: #e5e7eb;
      }

      .card-icon {
        font-size: 40px;
        margin-bottom: 16px;
        filter: grayscale(0.2);
      }

      .card-value {
        font-size: 48px;
        font-weight: 800;
        color: #111827;
        margin-bottom: 8px;
        letter-spacing: -1px;
        line-height: 1;
      }

      .card-label {
        font-size: 14px;
        color: #6b7280;
        font-weight: 600;
        text-transform: lowercase;
      }

      .chart-section {
        background: white;
        border-radius: 16px;
        padding: 36px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        border: 1px solid #f3f4f6;
      }

      h2 {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 36px 0;
        letter-spacing: -0.3px;
      }

      .chart {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        height: 280px;
        gap: 16px;
        padding: 0 4px;
      }

      .bar-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        max-width: 80px;
      }

      .bar {
        width: 100%;
        background: linear-gradient(to top, #8b5cf6, #c4b5fd);
        border-radius: 8px 8px 0 0;
        min-height: 12px;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10px;
        transition: all 0.3s;
        position: relative;
        margin-bottom: auto;
        box-shadow: 0 -2px 8px rgba(139, 92, 246, 0.15);
      }

      .bar:hover {
        background: linear-gradient(to top, #7c3aed, #ddd6fe);
        transform: scaleY(1.02);
        box-shadow: 0 -4px 12px rgba(139, 92, 246, 0.25);
      }

      .bar-value {
        font-size: 13px;
        font-weight: 700;
        color: white;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .bar-date {
        font-size: 13px;
        color: #6b7280;
        margin-top: 12px;
        font-weight: 600;
      }

      @media (max-width: 1024px) {
        .cards {
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .chart {
          height: 240px;
        }
      }

      @media (max-width: 768px) {
        .container {
          padding: 28px 20px;
        }

        h1 {
          font-size: 28px;
        }

        .cards {
          gap: 16px;
          margin-bottom: 36px;
        }

        .card {
          padding: 24px 20px;
        }

        .card-icon {
          font-size: 36px;
          margin-bottom: 12px;
        }

        .card-value {
          font-size: 40px;
        }

        .card-label {
          font-size: 13px;
        }

        .chart-section {
          padding: 28px 24px;
        }

        h2 {
          font-size: 18px;
          margin-bottom: 28px;
        }

        .chart {
          height: 200px;
          gap: 12px;
        }

        .bar-value {
          font-size: 12px;
        }

        .bar-date {
          font-size: 12px;
          margin-top: 10px;
        }
      }

      @media (max-width: 520px) {
        .container {
          padding: 24px 16px;
        }

        h1 {
          font-size: 26px;
        }

        .cards {
          grid-template-columns: 1fr;
          gap: 14px;
          margin-bottom: 28px;
        }

        .card {
          padding: 24px 20px;
        }

        .card-icon {
          font-size: 34px;
        }

        .card-value {
          font-size: 38px;
        }

        .chart-section {
          padding: 24px 20px;
        }

        h2 {
          font-size: 17px;
          margin-bottom: 24px;
        }

        .chart {
          height: 180px;
          gap: 10px;
        }

        .bar {
          border-radius: 6px 6px 0 0;
        }

        .bar-value {
          font-size: 11px;
        }

        .bar-date {
          font-size: 11px;
          margin-top: 8px;
        }
      }
    `,
  ],
})
export class StatsComponent {
  constructor(protected service: StatsService) {}

  formatDate(date: string): string {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    return `${day}/${month}`;
  }

  getBarHeight(minutes: number): number {
    const max = Math.max(...this.service.getLastSevenDays().map((d) => d.minutes), 60);
    return max > 0 ? (minutes / max) * 100 : 10;
  }
}
