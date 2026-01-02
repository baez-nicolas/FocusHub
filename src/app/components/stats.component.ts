import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'app-stats',
  imports: [CommonModule],
  template: `
    <div class="stats">
      <h1>Stats</h1>

      <div class="metrics">
        <div class="metric-card">
          <span class="value">{{ service.focusMinutesToday() }}</span>
          <span class="label">min hoy</span>
        </div>
        <div class="metric-card">
          <span class="value">{{ service.focusMinutesThisWeek() }}</span>
          <span class="label">min esta semana</span>
        </div>
        <div class="metric-card">
          <span class="value">{{ service.streak() }}</span>
          <span class="label">días de racha</span>
        </div>
        <div class="metric-card">
          <span class="value">{{ service.plannerCompletion() }}%</span>
          <span class="label">planner completado</span>
        </div>
      </div>

      <div class="chart">
        <h2>Últimos 7 días</h2>
        <div class="bars">
          @for (day of service.getLastSevenDays(); track day.date) {
          <div class="bar-container">
            <div class="bar" [style.height.px]="day.minutes * 2"></div>
            <span class="bar-label">{{ formatDate(day.date) }}</span>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .stats {
        padding: 20px;
        max-width: 1000px;
        margin: 0 auto;
      }
      .metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
      }
      .metric-card {
        background: #f5f5f5;
        padding: 30px;
        border-radius: 12px;
        text-align: center;
      }
      .value {
        display: block;
        font-size: 48px;
        font-weight: 600;
      }
      .label {
        font-size: 14px;
        color: #666;
      }
      .chart {
        background: #fff;
        padding: 30px;
        border-radius: 12px;
        border: 1px solid #ddd;
      }
      .bars {
        display: flex;
        gap: 20px;
        align-items: flex-end;
        height: 200px;
        margin-top: 20px;
      }
      .bar-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .bar {
        width: 100%;
        background: #000;
        border-radius: 4px 4px 0 0;
        min-height: 4px;
      }
      .bar-label {
        font-size: 12px;
        color: #666;
        margin-top: 10px;
      }
    `,
  ],
})
export class StatsComponent {
  constructor(protected service: StatsService) {}

  formatDate(date: string): string {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }
}
