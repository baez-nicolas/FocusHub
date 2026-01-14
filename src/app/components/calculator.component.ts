import { Component, signal } from '@angular/core';

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

      .calculator-card {
        background: white;
        border-radius: 20px;
        padding: 28px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #f3f4f6;
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

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

      .btn-sci:hover {
        background: #d1d5db;
        transform: translateY(-1px);
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
  display = signal('');
  private lastResult = '';

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
    // Eliminar espacios
    expr = expr.replace(/\s/g, '');

    // Evaluar expresión de forma segura sin eval()
    return this.parseExpression(expr);
  }

  private parseExpression(expr: string): number {
    // Primero evaluamos sumas y restas
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
    // Evaluamos multiplicaciones, divisiones y módulos
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
    // Manejar paréntesis
    if (factor.startsWith('(') && factor.endsWith(')')) {
      return this.parseExpression(factor.slice(1, -1));
    }

    // Manejar números negativos
    if (factor.startsWith('-')) {
      return -this.parseFactor(factor.slice(1));
    }

    // Convertir a número
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
        // Solo dividir si no estamos dentro de paréntesis
        // y si no es un signo negativo al inicio o después de un operador
        if (i > 0 && currentPart.length > 0) {
          parts.push({ operator: parts.length === 0 ? '+' : expr[i], value: currentPart });
          currentPart = '';
          startIndex = i + 1;
        } else if (char === '-' && (i === 0 || operators.includes(expr[i - 1]))) {
          // Es un signo negativo, no un operador
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
