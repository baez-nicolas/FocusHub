import { Component, computed, effect, inject, signal } from '@angular/core';
import { LangService } from '../services/lang.service';

@Component({
  selector: 'app-calculator',
  imports: [],
  template: `
    <div class="container">
      <div class="header">
        <h1 class="page-title"><i class="bi bi-calculator"></i>{{ tx().title }}</h1>
        <p class="page-subtitle">{{ tx().subtitle }}</p>
      </div>

      <div class="calc-layout">
        <div class="history-panel">
          <div class="history-header">
            <span class="history-title">{{ tx().historyTitle }}</span>
            @if (history().length > 0) {
              <button class="clear-all-btn" (click)="clearHistory()">{{ tx().clearAll }}</button>
            }
          </div>
          @if (history().length === 0) {
            <p class="history-empty">{{ tx().historyEmpty }}</p>
          }
          @for (item of history(); track $index) {
            <div class="history-item">
              <span class="history-expr">{{ formatExpr(item) }}</span>
              <button class="history-del" (click)="deleteHistoryItem($index)">✕</button>
            </div>
          }
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

      @media (max-width: 820px) {
        .container {
          padding: 24px 16px;
        }

        .page-title {
          text-align: center;
          justify-content: center;
        }

        .page-title i {
          display: none;
        }

        .page-subtitle {
          text-align: center;
        }
      }

      .header {
        margin-bottom: 32px;
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
        margin: 0;
      }

      :host-context(.dark) .page-title {
        color: #f1f5f9;
      }

      :host-context(.dark) .page-subtitle {
        color: #94a3b8;
      }

      .calc-layout {
        display: grid;
        grid-template-columns: 1fr 720px;
        gap: 24px;
        align-items: start;
      }

      @media (max-width: 900px) {
        .calc-layout {
          grid-template-columns: 1fr;
        }

        .history-panel {
          order: 2;
        }
      }

      .history-panel {
        background: white;
        border-radius: 20px;
        padding: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #f3f4f6;
        max-height: 620px;
        overflow-y: auto;
      }

      :host-context(.dark) .history-panel {
        background: #1e2433;
        border-color: #2d3748;
      }

      .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .history-title {
        font-size: 15px;
        font-weight: 700;
        color: #1e293b;
      }

      :host-context(.dark) .history-title {
        color: #f1f5f9;
      }

      .clear-all-btn {
        font-size: 12px;
        color: #6366f1;
        background: none;
        border: none;
        cursor: pointer;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 6px;
        transition: background 0.15s;
      }

      .clear-all-btn:hover {
        background: #f3f4f6;
      }

      :host-context(.dark) .clear-all-btn:hover {
        background: #252b3b;
      }

      .history-empty {
        color: #94a3b8;
        font-size: 13px;
        text-align: center;
        padding: 20px 0;
        margin: 0;
      }

      .history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 4px;
        border-bottom: 1px solid #f1f5f9;
        gap: 8px;
      }

      .history-item:last-child {
        border-bottom: none;
      }

      :host-context(.dark) .history-item {
        border-color: #2d3748;
      }

      .history-expr {
        font-size: 17px;
        color: #374151;
        font-family: monospace;
        flex: 1;
        word-break: break-all;
        line-height: 1.5;
      }

      :host-context(.dark) .history-expr {
        color: #d1d5db;
      }

      .history-del {
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        font-size: 11px;
        padding: 3px 6px;
        border-radius: 4px;
        flex-shrink: 0;
        transition: all 0.15s;
      }

      .history-del:hover {
        background: #fee2e2;
        color: #ef4444;
      }

      :host-context(.dark) .history-del:hover {
        background: #7f1d1d;
        color: #fca5a5;
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
        padding: 28px 24px;
        border-radius: 16px;
        font-size: 46px;
        font-weight: 700;
        text-align: right;
        margin-bottom: 20px;
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
        margin-bottom: 20px;
      }

      .btn {
        padding: 22px;
        border: none;
        border-radius: 14px;
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
        padding: 18px 8px;
        border: none;
        border-radius: 10px;
        font-size: 17px;
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
    `,
  ],
})
export class CalculatorComponent {
  private langService = inject(LangService);
  display = signal('');
  private lastResult = '';
  history = signal<string[]>(JSON.parse(localStorage.getItem('calc-history') ?? '[]'));

  constructor() {
    effect(() => {
      localStorage.setItem('calc-history', JSON.stringify(this.history()));
    });
  }

  readonly tx = computed(() => {
    const es = this.langService.lang() === 'es';
    return {
      title: es ? 'Calculadora' : 'Calculator',
      subtitle: es ? 'Operaciones básicas y avanzadas' : 'Basic and advanced operations',
      historyTitle: es ? 'Historial' : 'History',
      clearAll: es ? 'Borrar todo' : 'Clear all',
      historyEmpty: es ? 'Sin cálculos aún' : 'No calculations yet',
    };
  });

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
      const expression = this.display();
      let expr = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      const result = this.evaluateExpression(expr);
      this.lastResult = result.toString();
      this.history.update((h) => [`${expression} = ${this.lastResult}`, ...h]);
      this.display.set(this.lastResult);
    } catch {
      this.display.set('Error');
      setTimeout(() => this.display.set(''), 1500);
    }
  }

  clearHistory(): void {
    this.history.set([]);
  }

  formatExpr(expr: string): string {
    return expr
      .replace(/([+\-×÷*/%=])/g, ' $1 ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  deleteHistoryItem(index: number): void {
    this.history.update((h) => h.filter((_, i) => i !== index));
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
    operators: string[],
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
