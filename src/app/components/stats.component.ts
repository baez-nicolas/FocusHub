import { Component } from '@angular/core';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'app-stats',
  imports: [],
  template: `
    <div class="container">
      <div class="header">
        <div class="title">📊 Estadísticas</div>
        <div class="subtitle">Tu progreso y rendimiento</div>
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
        <div class="chart-header">Actividad de los últimos 7 días</div>
        <div class="chart">
          @for (day of service.getLastSevenDays(); track day.date) {
          <div class="bar-wrap">
            <div class="bar" [style.height.%]="getBarHeight(day.minutes)">
              @if (day.minutes > 0) {
              <span class="bar-value">{{ day.minutes }}</span>
              }
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
        max-width: 1000px;
        margin: 0 auto;
        padding: 40px 24px;
      }

      .header {
        text-align: center;
        margin-bottom: 40px;
      }

      .title {
        font-size: 32px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }

      .subtitle {
        font-size: 15px;
        color: #6b7280;
        font-weight: 500;
      }

      .cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 40px;
      }

      .card {
        background: white;
        border-radius: 16px;
        padding: 28px 20px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #f3f4f6;
        transition: all 0.3s;
      }

      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .card-icon {
        font-size: 36px;
        margin-bottom: 12px;
      }

      .card-value {
        font-size: 40px;
        font-weight: 800;
        color: #111827;
        margin-bottom: 6px;
        line-height: 1;
        letter-spacing: -1px;
      }

      .card-label {
        font-size: 13px;
        color: #6b7280;
        font-weight: 600;
        text-transform: lowercase;
      }

      .chart-section {
        background: white;
        border-radius: 20px;
        padding: 32px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #f3f4f6;
      }

      .chart-header {
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 32px;
        text-align: center;
        letter-spacing: -0.3px;
      }

      .chart {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        height: 240px;
        gap: 12px;
        padding: 0 4px;
      }

      .bar-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        max-width: 90px;
      }

      .bar {
        width: 100%;
        background: linear-gradient(to top, #8b5cf6, #c4b5fd);
        border-radius: 10px 10px 0 0;
        min-height: 10px;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 8px;
        transition: all 0.3s;
        margin-bottom: auto;
        box-shadow: 0 -2px 12px rgba(139, 92, 246, 0.2);
      }

      .bar:hover {
        background: linear-gradient(to top, #7c3aed, #ddd6fe);
        transform: scaleY(1.03);
        box-shadow: 0 -4px 16px rgba(139, 92, 246, 0.3);
      }

      .bar-value {
        font-size: 12px;
        font-weight: 700;
        color: white;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }

      .bar-date {
        font-size: 13px;
        color: #6b7280;
        margin-top: 12px;
        font-weight: 600;
      }

      @media (max-width: 768px) {
        .cards {
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .container {
          padding: 28px 20px;
        }

        .title {
          font-size: 28px;
        }

        .subtitle {
          font-size: 14px;
        }

        .cards {
          gap: 14px;
          margin-bottom: 32px;
        }

        .card {
          padding: 24px 16px;
        }

        .card-icon {
          font-size: 32px;
        }

        .card-value {
          font-size: 36px;
        }

        .card-label {
          font-size: 12px;
        }

        .chart-section {
          padding: 28px 24px;
        }

        .chart-header {
          font-size: 17px;
          margin-bottom: 24px;
        }

        .chart {
          height: 200px;
          gap: 10px;
        }

        .bar-value {
          font-size: 11px;
        }

        .bar-date {
          font-size: 12px;
          margin-top: 10px;
        }
      }

      @media (max-width: 576px) {
        .container {
          padding: 24px 16px;
        }

        .title {
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

        .chart-header {
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
