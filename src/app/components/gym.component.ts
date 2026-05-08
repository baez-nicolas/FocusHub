import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LangService } from '../services/lang.service';

interface DayRecord {
  date: string;
  steps: number;
  activity?: string;
}

@Component({
  selector: 'app-gym',
  imports: [FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1 class="page-title"><i class="bi bi-heart-pulse"></i>{{ tx().title }}</h1>
        <p class="page-subtitle">{{ tx().subtitle }}</p>
      </div>

      <div class="tip-banner">
        <span class="tip-icon">💡</span>
        <span>{{ tx().tip }}</span>
      </div>

      <div class="main-grid">
        <div class="input-card">
          <div class="input-card-title">{{ tx().todaySteps }}</div>
          <div class="step-input-wrap">
            <input
              type="number"
              class="step-input"
              [(ngModel)]="stepsInput"
              [placeholder]="tx().stepsPlaceholder"
              min="0"
              max="100000"
            />
          </div>
          <div class="quick-btns">
            @for (q of quickValues; track q) {
              <button class="btn-quick" (click)="setQuick(q)">{{ q.toLocaleString() }}</button>
            }
          </div>
          <div class="activity-label">{{ tx().activityType }}</div>
          <div class="activity-btns">
            <button
              class="btn-activity"
              [class.active]="activityType === 'walk'"
              (click)="activityType = 'walk'"
            >
              {{ tx().walk }}
            </button>
            <button
              class="btn-activity"
              [class.active]="activityType === 'bike'"
              (click)="activityType = 'bike'"
            >
              {{ tx().bike }}
            </button>
            <button
              class="btn-activity"
              [class.active]="activityType === 'run'"
              (click)="activityType = 'run'"
            >
              {{ tx().run }}
            </button>
          </div>
          <button class="btn-log btn-log-full" (click)="logSteps()">{{ tx().log }}</button>
        </div>

        <div class="stats-grid">
          <div class="stat-card steps">
            <div class="stat-icon">👟</div>
            <div class="stat-value">{{ todayRecord().steps.toLocaleString() }}</div>
            <div class="stat-label">{{ tx().stepsLabel }}</div>
          </div>
          <div class="stat-card dist">
            <div class="stat-icon">📍</div>
            <div class="stat-value">{{ distance() }}</div>
            <div class="stat-label">{{ tx().km }}</div>
          </div>
          <div class="stat-card kcal">
            <div class="stat-icon">🔥</div>
            <div class="stat-value">{{ calories() }}</div>
            <div class="stat-label">{{ tx().kcal }}</div>
          </div>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-label">{{ tx().progress }}</span>
          <span class="progress-pct">{{ progressPct() }}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar" [style.width.%]="progressPct()"></div>
          <div class="goal-marker" [style.left.%]="100">
            <span class="goal-marker-label">10K</span>
          </div>
        </div>
        <div class="progress-sub">
          {{ todayRecord().steps.toLocaleString() }} / 10,000 {{ tx().stepsLabel }}
        </div>
      </div>

      <div class="award-section">
        <div class="award-title">{{ tx().awards }}</div>
        <div class="awards-row">
          @for (award of awards(); track award.steps) {
            <div class="award-chip" [class.earned]="todayRecord().steps >= award.steps">
              @if (award.img) {
                <img [src]="award.img" class="award-chip-img" [alt]="award.name" />
              } @else {
                <span class="award-medal">{{ award.medal }}</span>
              }
              <span class="award-name">{{
                award.steps >= 1000 ? award.steps / 1000 + 'K' : award.steps
              }}</span>
            </div>
          }
        </div>
        @if (currentAward()) {
          <div class="award-banner">
            @if (currentAward()!.img) {
              <img
                [src]="currentAward()!.img"
                class="award-banner-img"
                [alt]="currentAward()!.name"
              />
            } @else {
              <span class="award-banner-medal">{{ currentAward()!.medal }}</span>
            }
            <div class="award-banner-text">
              <div class="award-banner-title">{{ currentAward()!.name }}</div>
              <div class="award-banner-sub">{{ currentAward()!.quote ?? tx().congrats }}</div>
            </div>
          </div>
        }
      </div>

      <div class="history-section">
        <div class="history-title">{{ tx().history }}</div>
        <div class="history-list">
          @for (r of last7Days(); track r.date) {
            <div class="history-row">
              <div class="history-date">{{ formatDate(r.date) }}</div>
              <div class="history-bar-wrap">
                <div class="history-bar" [style.width.%]="barWidth(r.steps)"></div>
              </div>
              <div class="history-act">{{ activityIcon(r.activity) }}</div>
              <div class="history-steps">{{ r.steps.toLocaleString() }}</div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 32px;
      }

      .header {
        margin-bottom: 8px;
      }

      .page-title {
        font-size: 26px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 4px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .page-title i {
        color: #6366f1;
      }

      .page-subtitle {
        color: #64748b;
        font-size: 14px;
        margin: 0 0 20px;
      }

      :host-context(.dark) .page-title {
        color: #f1f5f9;
      }
      :host-context(.dark) .page-subtitle {
        color: #94a3b8;
      }

      .tip-banner {
        display: flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.1) 0%,
          rgba(139, 92, 246, 0.1) 100%
        );
        border: 1px solid rgba(99, 102, 241, 0.25);
        border-radius: 12px;
        padding: 12px 18px;
        margin-bottom: 28px;
        font-size: 14px;
        font-weight: 600;
        color: #4338ca;
      }

      :host-context(.dark) .tip-banner {
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.15) 0%,
          rgba(139, 92, 246, 0.15) 100%
        );
        border-color: rgba(99, 102, 241, 0.3);
        color: #a5b4fc;
      }

      .tip-icon {
        font-size: 18px;
      }

      .main-grid {
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 24px;
        margin-bottom: 24px;
      }

      @media (max-width: 900px) {
        .main-grid {
          grid-template-columns: 1fr;
        }
      }

      .input-card {
        background: white;
        border-radius: 20px;
        padding: 28px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
        border: 1px solid #f3f4f6;
      }

      :host-context(.dark) .input-card {
        background: #1e2433;
        border-color: #2d3748;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
      }

      .input-card-title {
        font-size: 15px;
        font-weight: 700;
        color: #374151;
        margin-bottom: 16px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      :host-context(.dark) .input-card-title {
        color: #9ca3af;
      }

      .step-input-wrap {
        display: flex;
        gap: 10px;
        margin-bottom: 16px;
      }

      .step-input {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 22px;
        font-weight: 700;
        color: #111827;
        background: white;
        transition: all 0.2s;
        -moz-appearance: textfield;
      }

      .step-input::-webkit-inner-spin-button,
      .step-input::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }

      .step-input:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      }

      :host-context(.dark) .step-input {
        background: #252b3b;
        border-color: #374151;
        color: #f1f5f9;
      }

      :host-context(.dark) .step-input:focus {
        border-color: #818cf8;
        box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
      }

      .btn-log {
        padding: 14px 20px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        white-space: nowrap;
      }

      .btn-log-full {
        width: 100%;
        margin-top: 14px;
        padding: 14px;
      }

      .btn-log:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
      }

      .quick-btns {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .btn-quick {
        padding: 7px 14px;
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s;
      }

      .btn-quick:hover {
        background: #e0e7ff;
        border-color: #6366f1;
        color: #4338ca;
      }

      :host-context(.dark) .btn-quick {
        background: #252b3b;
        border-color: #374151;
        color: #9ca3af;
      }

      :host-context(.dark) .btn-quick:hover {
        background: rgba(99, 102, 241, 0.2);
        border-color: #6366f1;
        color: #a5b4fc;
      }

      .activity-label {
        font-size: 12px;
        font-weight: 600;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 14px 0 8px;
      }

      .activity-btns {
        display: flex;
        gap: 8px;
      }

      .btn-activity {
        flex: 1;
        padding: 8px 6px;
        background: #f3f4f6;
        color: #374151;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s;
        text-align: center;
      }

      .btn-activity:hover {
        background: #e0e7ff;
        border-color: #6366f1;
        color: #4338ca;
      }

      .btn-activity.active {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border-color: transparent;
        color: white;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }

      :host-context(.dark) .btn-activity {
        background: #252b3b;
        border-color: #374151;
        color: #9ca3af;
      }

      :host-context(.dark) .btn-activity:hover {
        background: rgba(99, 102, 241, 0.2);
        border-color: #6366f1;
        color: #a5b4fc;
      }

      :host-context(.dark) .btn-activity.active {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border-color: transparent;
        color: white;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      .stat-card.kcal {
        grid-column: 1 / -1;
      }

      @media (max-width: 500px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .stat-card {
        background: white;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #f3f4f6;
        text-align: center;
        transition: transform 0.2s;
      }

      .stat-card:hover {
        transform: translateY(-3px);
      }

      :host-context(.dark) .stat-card {
        background: #1e2433;
        border-color: #2d3748;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .stat-icon {
        font-size: 28px;
        margin-bottom: 8px;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 800;
        color: #111827;
        letter-spacing: -0.5px;
        line-height: 1;
        margin-bottom: 6px;
      }

      :host-context(.dark) .stat-value {
        color: #f1f5f9;
      }

      .stat-label {
        font-size: 12px;
        font-weight: 600;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .stat-card.steps .stat-value {
        color: #6366f1;
      }
      .stat-card.kcal .stat-value {
        color: #ef4444;
      }
      .stat-card.dist .stat-value {
        color: #10b981;
      }
      .stat-card.time .stat-value {
        color: #f59e0b;
      }

      .progress-section {
        background: white;
        border-radius: 20px;
        padding: 24px 28px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
        border: 1px solid #f3f4f6;
        margin-bottom: 24px;
      }

      :host-context(.dark) .progress-section {
        background: #1e2433;
        border-color: #2d3748;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
      }

      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .progress-label {
        font-size: 14px;
        font-weight: 700;
        color: #374151;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      :host-context(.dark) .progress-label {
        color: #9ca3af;
      }

      .progress-pct {
        font-size: 20px;
        font-weight: 800;
        color: #6366f1;
      }

      .progress-bar-wrap {
        position: relative;
        background: #f3f4f6;
        border-radius: 100px;
        height: 14px;
        margin-bottom: 10px;
        overflow: hidden;
      }

      :host-context(.dark) .progress-bar-wrap {
        background: #252b3b;
      }

      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
        border-radius: 100px;
        transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        max-width: 100%;
      }

      .progress-sub {
        font-size: 13px;
        color: #9ca3af;
        font-weight: 600;
        text-align: right;
      }

      .award-section {
        background: white;
        border-radius: 20px;
        padding: 24px 28px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
        border: 1px solid #f3f4f6;
        margin-bottom: 24px;
      }

      :host-context(.dark) .award-section {
        background: #1e2433;
        border-color: #2d3748;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
      }

      .award-title {
        font-size: 15px;
        font-weight: 700;
        color: #374151;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 16px;
      }

      :host-context(.dark) .award-title {
        color: #9ca3af;
      }

      .awards-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 16px;
      }

      .award-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 100px;
        border: 2px solid #e5e7eb;
        background: #f9fafb;
        font-size: 14px;
        font-weight: 700;
        color: #9ca3af;
        transition: all 0.3s;
        opacity: 0.5;
      }

      :host-context(.dark) .award-chip {
        border-color: #374151;
        background: #252b3b;
        color: #6b7280;
      }

      .award-chip.earned {
        opacity: 1;
        border-color: #f59e0b;
        background: #fef3c7;
        color: #92400e;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
      }

      :host-context(.dark) .award-chip.earned {
        background: rgba(245, 158, 11, 0.15);
        border-color: #f59e0b;
        color: #fcd34d;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
      }

      .award-medal {
        font-size: 18px;
      }

      .award-chip-img {
        width: 24px;
        height: 24px;
        object-fit: cover;
        border-radius: 50%;
        filter: grayscale(1);
        opacity: 0.5;
        transition: all 0.3s;
      }

      .award-chip.earned .award-chip-img {
        filter: grayscale(0);
        opacity: 1;
      }

      .award-name {
        font-size: 13px;
        font-weight: 800;
      }

      .award-banner {
        display: flex;
        align-items: center;
        gap: 16px;
        background: linear-gradient(
          135deg,
          rgba(245, 158, 11, 0.12) 0%,
          rgba(251, 191, 36, 0.12) 100%
        );
        border: 1.5px solid rgba(245, 158, 11, 0.4);
        border-radius: 14px;
        padding: 16px 20px;
        animation: popIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes popIn {
        from {
          transform: scale(0.85);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      .award-banner-medal {
        font-size: 40px;
      }
      .award-banner-img {
        width: 72px;
        height: 72px;
        object-fit: cover;
        border-radius: 50%;
        border: 3px solid rgba(245, 158, 11, 0.5);
        flex-shrink: 0;
      }
      .award-banner-img {
        width: 72px;
        height: 72px;
        object-fit: cover;
        border-radius: 50%;
        border: 3px solid rgba(245, 158, 11, 0.5);
        flex-shrink: 0;
      }

      .award-banner-title {
        font-size: 18px;
        font-weight: 800;
        color: #92400e;
      }

      :host-context(.dark) .award-banner-title {
        color: #fcd34d;
      }

      .award-banner-sub {
        font-size: 13px;
        color: #b45309;
        font-weight: 600;
      }

      :host-context(.dark) .award-banner-sub {
        color: #fbbf24;
      }

      .history-section {
        background: white;
        border-radius: 20px;
        padding: 24px 28px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
        border: 1px solid #f3f4f6;
      }

      :host-context(.dark) .history-section {
        background: #1e2433;
        border-color: #2d3748;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
      }

      .history-title {
        font-size: 15px;
        font-weight: 700;
        color: #374151;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 16px;
      }

      :host-context(.dark) .history-title {
        color: #9ca3af;
      }

      .history-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .history-row {
        display: grid;
        grid-template-columns: 90px 1fr 22px 70px;
        align-items: center;
        gap: 12px;
      }

      .history-date {
        font-size: 13px;
        font-weight: 600;
        color: #6b7280;
        text-transform: capitalize;
      }

      :host-context(.dark) .history-date {
        color: #9ca3af;
      }

      .history-bar-wrap {
        background: #f3f4f6;
        border-radius: 100px;
        height: 8px;
        overflow: hidden;
      }

      :host-context(.dark) .history-bar-wrap {
        background: #252b3b;
      }

      .history-bar {
        height: 100%;
        background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
        border-radius: 100px;
        transition: width 0.5s ease;
        min-width: 2px;
      }

      .history-act {
        font-size: 16px;
        text-align: center;
      }

      .history-steps {
        font-size: 13px;
        font-weight: 700;
        color: #374151;
        text-align: right;
      }

      :host-context(.dark) .history-steps {
        color: #d1d5db;
      }

      @media (max-width: 768px) {
        .container {
          padding: 24px 16px;
        }
        .stat-value {
          font-size: 22px;
        }
        .history-row {
          grid-template-columns: 70px 1fr 22px 55px;
        }
      }
    `,
  ],
})
export class GymComponent {
  private langService = inject(LangService);

  stepsInput: number | null = null;
  activityType = '';
  readonly quickValues = [2500, 5000, 7500, 10000];

  readonly awards = computed(() => {
    const es = this.langService.lang() === 'es';
    return [
      { steps: 2500, medal: '🥉', name: es ? 'Bronce' : 'Bronze' },
      { steps: 5000, medal: '🥈', name: es ? 'Plata' : 'Silver' },
      { steps: 7500, medal: '🥇', name: es ? 'Oro' : 'Gold' },
      {
        steps: 10000,
        medal: '⚽',
        name: es ? '¡Como Messi!' : 'Like Messi!',
        img: 'assets/leomessi.png',
        quote: es
          ? 'El mejor del mundo camina 10K. Hoy fuiste uno de ellos. 🐐'
          : 'The best in the world walks 10K. Today you were one of them. 🐐',
      },
      {
        steps: 15000,
        medal: '🤖',
        name: es ? 'Eres un Prime' : "You're a Prime",
        img: 'assets/prime.png',
        quote: es
          ? 'Autobots, a rodar. ⚙️ — Optimus Prime'
          : 'Autobots, roll out. ⚙️ — Optimus Prime',
      },
      {
        steps: 20000,
        medal: '💚',
        name: 'One for All',
        img: 'assets/midoriya.webp',
        quote: es ? '¡PLUS ULTRA! ⚡ — Izuku Midoriya' : 'PLUS ULTRA! ⚡ — Izuku Midoriya',
      },
      {
        steps: 25000,
        medal: '🪓',
        name: es ? 'Dios de la Guerra' : 'God of War',
        img: 'assets/kratos.png',
        quote: es
          ? 'Sé mejor, muchacho. No repitas mis errores. — Kratos'
          : 'Be better, boy. Do not repeat my mistakes. — Kratos',
      },
      {
        steps: 30000,
        medal: '👽',
        name: 'Alien X',
        img: 'assets/alienx.png',
        quote: es
          ? 'El poder cósmico te pertenece. 🌌 — Alien X'
          : 'Cosmic power is yours. 🌌 — Alien X',
      },
      {
        steps: 35000,
        medal: '⭐',
        name: 'Super Saiyan',
        img: 'assets/goku.png',
        quote: es
          ? 'Siempre hay alguien más fuerte... hasta que eres tú. ⭐ — Goku'
          : 'There is always someone stronger... until it is you. ⭐ — Goku',
      },
    ];
  });

  private records = signal<DayRecord[]>(JSON.parse(localStorage.getItem('step-records') ?? '[]'));

  constructor() {
    effect(() => {
      localStorage.setItem('step-records', JSON.stringify(this.records()));
    });
  }

  readonly tx = computed(() => {
    const es = this.langService.lang() === 'es';
    return {
      title: es ? 'Salud' : 'Health',
      subtitle: es ? 'Contador de pasos diarios' : 'Daily step counter',
      tip: es
        ? '10,000 pasos al día es la meta ideal para mantener una vida activa y saludable'
        : '10,000 steps a day is the ideal goal to maintain an active and healthy lifestyle',
      todaySteps: es ? 'Pasos de hoy' : "Today's steps",
      stepsPlaceholder: es ? 'Ej.: 8500' : 'e.g. 8500',
      log: es ? 'Guardar' : 'Save',
      stepsLabel: es ? 'Pasos' : 'Steps',
      kcal: es ? 'Kcal quemadas' : 'Kcal burned',
      km: es ? 'Kilómetros' : 'Kilometers',
      progress: es ? 'Progreso hacia 10K' : 'Progress to 10K',
      awards: es ? 'Logros del día' : "Today's achievements",
      congrats: es ? '¡Meta alcanzada! Sigue así 💪' : 'Goal reached! Keep it up 💪',
      history: es ? 'Últimos 7 días' : 'Last 7 days',
      activityType: es ? 'Tipo de actividad' : 'Activity type',
      walk: es ? 'Caminata' : 'Walk',
      bike: es ? 'Bicicleta' : 'Bike',
      run: es ? 'Correr' : 'Run',
    };
  });

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }

  readonly todayRecord = computed((): DayRecord => {
    const t = this.today();
    return this.records().find((r) => r.date === t) ?? { date: t, steps: 0 };
  });

  readonly calories = computed(() => {
    const { steps, activity } = this.todayRecord();
    const rate = activity === 'run' ? 0.07 : activity === 'bike' ? 0.035 : 0.04;
    return Math.round(steps * rate);
  });

  readonly distance = computed(() => {
    const { steps, activity } = this.todayRecord();
    const stride = activity === 'run' ? 0.00135 : activity === 'bike' ? 0.003 : 0.00075;
    return (steps * stride).toFixed(2);
  });

  readonly progressPct = computed(() => {
    return Math.min(100, Math.round((this.todayRecord().steps / 10000) * 100));
  });

  readonly currentAward = computed(() => {
    const steps = this.todayRecord().steps;
    const earned = [...this.awards()].reverse().find((a) => steps >= a.steps);
    return earned ?? null;
  });

  readonly last7Days = computed(() => {
    const result: DayRecord[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = this.records().find((r) => r.date === dateStr);
      result.push(found ?? { date: dateStr, steps: 0 });
    }
    return result;
  });

  barWidth(steps: number): number {
    const max = Math.max(...this.last7Days().map((r) => r.steps), 10000);
    return Math.min(100, Math.round((steps / max) * 100));
  }

  formatDate(dateStr: string): string {
    const es = this.langService.lang() === 'es';
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString(es ? 'es-ES' : 'en-US', { weekday: 'short', day: 'numeric' });
  }

  activityIcon(activity?: string): string {
    if (activity === 'walk') return '🚶';
    if (activity === 'bike') return '🚴';
    if (activity === 'run') return '🏃';
    return '';
  }

  setQuick(val: number): void {
    this.stepsInput = val;
  }

  logSteps(): void {
    if (!this.stepsInput || this.stepsInput < 0) return;
    const t = this.today();
    const current = this.records().filter((r) => r.date !== t);
    this.records.set([
      ...current,
      { date: t, steps: this.stepsInput, activity: this.activityType || undefined },
    ]);
    this.stepsInput = null;
    this.activityType = '';
  }
}
