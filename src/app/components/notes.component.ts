import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../services/notes.service';

@Component({
  selector: 'app-notes',
  imports: [FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <div class="title">📝 Notas</div>
        <div class="subtitle">Captura tus ideas y pensamientos</div>
      </div>

      <div class="editor">
        <textarea
          [(ngModel)]="service.content"
          placeholder="Escribe aquí tus notas, ideas, recordatorios..."
          spellcheck="false"
        ></textarea>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px 24px;
        height: calc(100vh - 80px);
        display: flex;
        flex-direction: column;
      }

      .header {
        text-align: center;
        margin-bottom: 32px;
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

      .editor {
        flex: 1;
        background: white;
        border-radius: 20px;
        padding: 4px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #f3f4f6;
      }

      textarea {
        width: 100%;
        height: 100%;
        padding: 28px;
        border: none;
        border-radius: 16px;
        font-size: 16px;
        line-height: 1.7;
        font-family: inherit;
        resize: none;
        color: #1f2937;
      }

      textarea:focus {
        outline: none;
      }

      textarea::placeholder {
        color: #d1d5db;
      }

      @media (max-width: 768px) {
        .container {
          padding: 24px 16px;
        }

        .title {
          font-size: 28px;
        }

        textarea {
          padding: 20px;
          font-size: 15px;
        }
      }
    `,
  ],
})
export class NotesComponent {
  constructor(protected service: NotesService) {}
}
