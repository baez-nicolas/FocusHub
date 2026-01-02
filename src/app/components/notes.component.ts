import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../services/notes.service';

@Component({
  selector: 'app-notes',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="notes">
      <h1>Notas</h1>
      <textarea [(ngModel)]="service.content" placeholder="Escribe tus notas..."></textarea>
    </div>
  `,
  styles: [
    `
      .notes {
        padding: 20px;
        max-width: 900px;
        margin: 0 auto;
        height: calc(100vh - 140px);
        display: flex;
        flex-direction: column;
      }
      textarea {
        flex: 1;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 12px;
        font-size: 16px;
        font-family: inherit;
        resize: none;
      }
    `,
  ],
})
export class NotesComponent {
  constructor(protected service: NotesService) {}
}
