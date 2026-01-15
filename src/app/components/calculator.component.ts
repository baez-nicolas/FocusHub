import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PomodoroService } from '../services/pomodoro.service';

@Component({
  selector: 'app-calculator',
  imports: [],
  template: `
    <div class="container">
      <div class="header">
        <div class="title">🔢 Calculadora</div>
      </div>

      <div class="calculator-card">
        <div class="display">{{ display() || '0' }}</div>

        <div class="buttons">
          <button class="btn func" (click)="clear()">C</button>
          <button class="btn func" (click)="deleteLast()">⌫</button>
          <button class="btn func" (click)="appendOperator('%')">%</button>
          <button class="btn operator" (click)="appendOperator('÷')">÷</button>

          <button class="btn" (click)="appendNumber('7')">7</button>
          <button class="btn" (click)="appendNumber('8')">8</button>
          <button class="btn" (click)="appendNumber('9')">9</button>
          <button class="btn operator" (click)="appendOperator('×')">×</button>

          <button class="btn" (click)="appendNumber('4')">4</button>
          <button class="btn" (click)="appendNumber('5')">5</button>
          <button class="btn" (click)="appendNumber('6')">6</button>
          <button class="btn operator" (click)="appendOperator('-')">−</button>

          <button class="btn" (click)="appendNumber('1')">1</button>
          <button class="btn" (click)="appendNumber('2')">2</button>
          <button class="btn" (click)="appendNumber('3')">3</button>
          <button class="btn operator" (click)="appendOperator('+')">+</button>

          <button class="btn" (click)="appendNumber('0')">0</button>
          <button class="btn" (click)="appendNumber('.')">.</button>
          <button class="btn func" (click)="negate()">±</button>
          <button class="btn equals" (click)="calculate()">=</button>
        </div>

        <div class="scientific">
          <button class="btn-sci" (click)="applyFunction('sin')">sin</button>
          <button class="btn-sci" (click)="applyFunction('cos')">cos</button>
          <button class="btn-sci" (click)="applyFunction('tan')">tan</button>
          <button class="btn-sci" (click)="applyFunction('log')">log</button>
          <button class="btn-sci" (click)="applyFunction('ln')">ln</button>
          <button class="btn-sci" (click)="applyFunction('sqrt')">√</button>
          <button class="btn-sci" (click)="applyFunction('square')">x²</button>
          <button class="btn-sci" (click)="applyFunction('pow')">xʸ</button>
          <button class="btn-sci" (click)="appendNumber('π')">π</button>
          <button class="btn-sci" (click)="appendNumber('e')">e</button>
        </div>
      </div>

      @if (pomodoroService.state() !== 'IDLE' && pomodoroService.state() !== 'PAUSED') {
      <div class="pomodoro-widget" (click)="goToPomodoro()">
        <div class="pomodoro-icon">⏱️</div>
        <div class="pomodoro-content">
          <div class="pomodoro-label">{{ getPhaseLabel() }}</div>
          <div class="pomodoro-time">{{ formatTime() }}</div>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 40px 24px;
      }

      @media (max-width: 767px) {
        .container {
          padding: 24px 16px;
        }
      }

      .header {
        margin-bottom: 32px;
        text-align: center;
      }

      .title {
        font-size: 32px;
        font-weight: 700;
        color: #111827;
        letter-spacing: -0.5px;
      }

      :host-context(.dark) .title {
        color: #f3f4f6 !important;
      }

      .calculator-card {
        background: white;
        border-radius: 20px;
        padding: 28px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #f3f4f6;
      }

      :host-context(.dark) .calculator-card {
        background: #1e2433 !important;
        border: 1px solid #2d3748 !important;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3) !important;
      }

      .display {
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        color: white;
        padding: 32px 24px;
        border-radius: 16px;
        font-size: 48px;
        font-weight: 700;
        text-align: right;
        margin-bottom: 24px;
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        word-break: break-all;
        font-variant-numeric: tabular-nums;
      }

      .buttons {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin-bottom: 24px;
      }

      .btn {
        padding: 24px;
        border: none;
        border-radius: 12px;
        font-size: 24px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        background: #f3f4f6;
        color: #111827;
      }

      :host-context(.dark) .btn {
        background: #252b3b !important;
        color: #d1d5db !important;
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      :host-context(.dark) .btn:hover {
        background: #2d3748 !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
      }

      .btn:active {
        transform: translateY(0);
      }

      .btn.operator {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn.func {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
      }

      .btn.equals {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
      }

      .scientific {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
      }

      .btn-sci {
        padding: 16px 8px;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        background: #e5e7eb;
        color: #374151;
      }

      :host-context(.dark) .btn-sci {
        background: #252b3b !important;
        color: #9ca3af !important;
      }

      .btn-sci:hover {
        background: #d1d5db;
        transform: translateY(-1px);
      }

      :host-context(.dark) .btn-sci:hover {
        background: #2d3748 !important;
      }

      @media (max-width: 576px) {
        .display {
          font-size: 36px;
          padding: 24px 16px;
          min-height: 60px;
        }

        .btn {
          padding: 18px;
          font-size: 20px;
        }

        .btn-sci {
          padding: 12px 6px;
          font-size: 14px;
        }

        .scientific {
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }
      }

      .pomodoro-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.95) 0%,
          rgba(139, 92, 246, 0.95) 100%
        );
        backdrop-filter: blur(16px);
        padding: 12px 20px;
        border-radius: 16px;
        border: 1.5px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        width: 160px;
      }

      .pomodoro-widget:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
        border-color: rgba(255, 255, 255, 0.35);
      }

      .pomodoro-widget:active {
        transform: translateY(-1px);
      }

      .pomodoro-icon {
        font-size: 24px;
        line-height: 1;
        flex-shrink: 0;
      }

      .pomodoro-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-width: 0;
      }

      .pomodoro-label {
        font-size: 9px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.85);
        text-transform: uppercase;
        letter-spacing: 1px;
        line-height: 1;
      }

      .pomodoro-time {
        font-size: 20px;
        font-weight: 800;
        color: white;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.5px;
        line-height: 1;
      }

      :host-context(.dark) .pomodoro-widget {
        background: linear-gradient(
          135deg,
          rgba(79, 70, 229, 0.95) 0%,
          rgba(124, 58, 237, 0.95) 100%
        );
        border-color: rgba(255, 255, 255, 0.2);
      }

      :host-context(.dark) .pomodoro-widget:hover {
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 12px 40px rgba(79, 70, 229, 0.4);
      }
    `,
  ],
})
export class CalculatorComponent {
  pomodoroService = inject(PomodoroService);
  private router = inject(Router);
  display = signal('');
  private lastResult = '';

  formatTime = computed(() => {
    const sec = this.pomodoroService.secondsLeft();
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  getPhaseLabel(): string {
    const state = this.pomodoroService.state();
    if (state === 'RUNNING_FOCUS') {
      return 'Enfoque';
    } else if (state === 'RUNNING_SHORT_BREAK' || state === 'RUNNING_LONG_BREAK') {
      return 'Descanso';
    }
    return '';
  }

  goToPomodoro(): void {
    this.router.navigate(['/pomodoro']);
  }

  appendNumber(num: string): void {
    const current = this.display();
    if (num === 'π') {
      this.display.set(current + Math.PI.toString());
    } else if (num === 'e') {
      this.display.set(current + Math.E.toString());
    } else {
      this.display.set(current + num);
    }
  }

  appendOperator(op: string): void {
    const current = this.display();
    if (current && !this.endsWithOperator(current)) {
      this.display.set(current + op);
    }
  }

  clear(): void {
    this.display.set('');
  }

  deleteLast(): void {
    const current = this.display();
    this.display.set(current.slice(0, -1));
  }

  negate(): void {
    const current = this.display();
    if (current && current !== '0') {
      if (current.startsWith('-')) {
        this.display.set(current.slice(1));
      } else {
        this.display.set('-' + current);
      }
    }
  }

  calculate(): void {
    try {
      let expr = this.display().replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      const result = this.evaluateExpression(expr);
      this.lastResult = result.toString();
      this.display.set(this.lastResult);
    } catch {
      this.display.set('Error');
      setTimeout(() => this.display.set(''), 1500);
    }
  }

  private evaluateExpression(expr: string): number {
    expr = expr.replace(/\s/g, '');

    return this.parseExpression(expr);
  }

  private parseExpression(expr: string): number {
    let terms = this.splitByOperator(expr, ['+', '-']);
    if (terms.length > 1) {
      let result = this.parseTerm(terms[0].value);
      for (let i = 1; i < terms.length; i++) {
        if (terms[i].operator === '+') {
          result += this.parseTerm(terms[i].value);
        } else {
          result -= this.parseTerm(terms[i].value);
        }
      }
      return result;
    }
    return this.parseTerm(expr);
  }

  private parseTerm(term: string): number {
    let factors = this.splitByOperator(term, ['*', '/', '%']);
    if (factors.length > 1) {
      let result = this.parseFactor(factors[0].value);
      for (let i = 1; i < factors.length; i++) {
        if (factors[i].operator === '*') {
          result *= this.parseFactor(factors[i].value);
        } else if (factors[i].operator === '/') {
          result /= this.parseFactor(factors[i].value);
        } else if (factors[i].operator === '%') {
          result %= this.parseFactor(factors[i].value);
        }
      }
      return result;
    }
    return this.parseFactor(term);
  }

  private parseFactor(factor: string): number {
    if (factor.startsWith('(') && factor.endsWith(')')) {
      return this.parseExpression(factor.slice(1, -1));
    }

    if (factor.startsWith('-')) {
      return -this.parseFactor(factor.slice(1));
    }

    const num = parseFloat(factor);
    if (isNaN(num)) {
      throw new Error('Invalid number');
    }
    return num;
  }

  private splitByOperator(
    expr: string,
    operators: string[]
  ): Array<{ operator: string; value: string }> {
    const parts: Array<{ operator: string; value: string }> = [];
    let currentPart = '';
    let parenthesesLevel = 0;
    let startIndex = 0;

    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];

      if (char === '(') {
        parenthesesLevel++;
        currentPart += char;
      } else if (char === ')') {
        parenthesesLevel--;
        currentPart += char;
      } else if (parenthesesLevel === 0 && operators.includes(char)) {
        if (i > 0 && currentPart.length > 0) {
          parts.push({ operator: parts.length === 0 ? '+' : expr[i], value: currentPart });
          currentPart = '';
          startIndex = i + 1;
        } else if (char === '-' && (i === 0 || operators.includes(expr[i - 1]))) {
          currentPart += char;
        } else {
          currentPart += char;
        }
      } else {
        currentPart += char;
      }
    }

    if (currentPart) {
      parts.push({
        operator: parts.length === 0 ? '+' : expr[startIndex - 1],
        value: currentPart,
      });
    }

    return parts.length > 0 ? parts : [{ operator: '+', value: expr }];
  }

  applyFunction(func: string): void {
    try {
      const current = parseFloat(this.display() || '0');
      let result: number;

      switch (func) {
        case 'sin':
          result = Math.sin(current);
          break;
        case 'cos':
          result = Math.cos(current);
          break;
        case 'tan':
          result = Math.tan(current);
          break;
        case 'log':
          result = Math.log10(current);
          break;
        case 'ln':
          result = Math.log(current);
          break;
        case 'sqrt':
          result = Math.sqrt(current);
          break;
        case 'square':
          result = current * current;
          break;
        case 'pow':
          this.appendOperator('^');
          return;
        default:
          return;
      }

      this.display.set(result.toString());
    } catch {
      this.display.set('Error');
      setTimeout(() => this.display.set(''), 1500);
    }
  }

  private endsWithOperator(str: string): boolean {
    return /[+\-×÷%]$/.test(str);
  }
}
