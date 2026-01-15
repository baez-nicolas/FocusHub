import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NotesService } from '../services/notes.service';
import { PomodoroService } from '../services/pomodoro.service';

@Component({
  selector: 'app-notes',
  imports: [FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <div class="title">📝 Notas</div>
        <div class="subtitle">Organiza tus ideas y pensamientos</div>
      </div>

      <div class="toolbar">
        <div class="search-box">
          <i class="search-icon">🔍</i>
          <input
            type="text"
            [(ngModel)]="service.searchQuery"
            placeholder="Buscar notas..."
            class="search-input"
          />
        </div>

        <select [(ngModel)]="service.selectedCategory" class="category-filter">
          <option value="all">📁 Todas</option>
          @for (cat of service.categories(); track cat) {
          <option [value]="cat">{{ getCategoryIcon(cat) }} {{ cat }}</option>
          }
        </select>

        <button class="btn-new" (click)="openForm()">+ Nueva Nota</button>
      </div>

      <div class="notes-grid">
        @for (note of service.filteredNotes(); track note.id) {
        <div class="note-card">
          <div class="note-header">
            <div class="note-category">
              {{ getCategoryIcon(note.category) }} {{ note.category }}
            </div>
            <div class="note-actions">
              <button class="btn-icon" (click)="editNote(note.id)">✏️</button>
              <button class="btn-icon" (click)="deleteNote(note.id)">🗑️</button>
            </div>
          </div>
          <div class="note-title">{{ note.title }}</div>
          <div class="note-content">{{ note.content }}</div>
          <div class="note-date">{{ formatDate(note.updatedAt) }}</div>
        </div>
        } @empty {
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <div class="empty-title">Sin notas</div>
          <div class="empty-text">Crea tu primera nota para comenzar</div>
          <button class="btn-empty" (click)="openForm()">+ Crear Nota</button>
        </div>
        }
      </div>

      @if (pomodoroService.state() !== 'IDLE' && pomodoroService.state() !== 'PAUSED') {
      <div class="pomodoro-widget">
        <div class="pomodoro-label">{{ getPhaseLabel() }}</div>
        <div class="pomodoro-time">{{ formatTime() }}</div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 24px;
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

      :host-context(.dark) .title {
        color: #f3f4f6 !important;
      }

      .subtitle {
        font-size: 15px;
        color: #6b7280;
        font-weight: 500;
      }

      :host-context(.dark) .subtitle {
        color: #9ca3af !important;
      }

      .toolbar {
        display: flex;
        gap: 16px;
        margin-bottom: 32px;
        align-items: center;
        flex-wrap: wrap;
      }

      .search-box {
        flex: 1;
        min-width: 250px;
        position: relative;
      }

      .search-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 18px;
        opacity: 0.5;
      }

      .search-input {
        width: 100%;
        padding: 12px 16px 12px 48px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 500;
        transition: all 0.2s;
      }

      :host-context(.dark) .search-input {
        background: #252b3b !important;
        border: 2px solid #2d3748 !important;
        color: #d1d5db !important;
      }

      .search-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      :host-context(.dark) .search-input:focus {
        border-color: #7066e0 !important;
        box-shadow: 0 0 0 3px rgba(112, 102, 224, 0.2) !important;
      }

      .category-filter {
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        background: white;
      }

      :host-context(.dark) .category-filter {
        background: #252b3b !important;
        border: 2px solid #2d3748 !important;
        color: #d1d5db !important;
      }

      .category-filter:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      :host-context(.dark) .category-filter:focus {
        border-color: #7066e0 !important;
        box-shadow: 0 0 0 3px rgba(112, 102, 224, 0.2) !important;
      }

      .btn-new {
        padding: 12px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        white-space: nowrap;
      }

      .btn-new:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      .form-card {
        background: white;
        border-radius: 20px;
        padding: 28px;
        margin-bottom: 32px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #f3f4f6;
      }

      :host-context(.dark) .form-card {
        background: #1e2433 !important;
        border: 1px solid #2d3748 !important;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3) !important;
      }

      .form-header {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 20px;
        text-align: center;
      }

      :host-context(.dark) .form-header {
        color: #d1d5db !important;
      }

      .input-title {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 16px;
        transition: all 0.2s;
      }

      :host-context(.dark) .input-title {
        background: #252b3b !important;
        border: 2px solid #2d3748 !important;
        color: #d1d5db !important;
      }

      .input-title:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      :host-context(.dark) .input-title:focus {
        border-color: #7066e0 !important;
        box-shadow: 0 0 0 3px rgba(112, 102, 224, 0.2) !important;
      }

      .input-content {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 15px;
        line-height: 1.6;
        color: #374151;
        margin-bottom: 16px;
        font-family: inherit;
        resize: vertical;
        transition: all 0.2s;
      }

      :host-context(.dark) .input-content {
        background: #252b3b !important;
        border: 2px solid #2d3748 !important;
        color: #d1d5db !important;
      }

      .input-content:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      :host-context(.dark) .input-content:focus {
        border-color: #7066e0 !important;
        box-shadow: 0 0 0 3px rgba(112, 102, 224, 0.2) !important;
      }

      .category-select {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        margin-bottom: 20px;
        transition: all 0.2s;
      }

      :host-context(.dark) .category-select {
        background: #252b3b !important;
        border: 2px solid #2d3748 !important;
        color: #d1d5db !important;
      }

      .category-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      :host-context(.dark) .category-select:focus {
        border-color: #7066e0 !important;
        box-shadow: 0 0 0 3px rgba(112, 102, 224, 0.2) !important;
      }

      .form-actions {
        display: flex;
        gap: 12px;
      }

      .btn-save {
        flex: 1;
        padding: 14px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
      }

      .btn-save:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }

      .btn-cancel {
        flex: 1;
        padding: 14px;
        background: #f3f4f6;
        color: #6b7280;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
      }

      :host-context(.dark) .btn-cancel {
        background: #252b3b !important;
        color: #9ca3af !important;
      }

      .btn-cancel:hover {
        background: #e5e7eb;
      }

      :host-context(.dark) .btn-cancel:hover {
        background: #2d3748 !important;
      }

      .notes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 20px;
      }

      .note-card {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #f3f4f6;
        transition: all 0.3s;
        cursor: pointer;
      }

      :host-context(.dark) .note-card {
        background: #1e2433 !important;
        border: 1px solid #2d3748 !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
      }

      .note-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      :host-context(.dark) .note-card:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
      }

      .note-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .note-category {
        font-size: 12px;
        font-weight: 700;
        color: #667eea;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .note-actions {
        display: flex;
        gap: 8px;
      }

      .btn-icon {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        opacity: 0.6;
        transition: all 0.2s;
      }

      .btn-icon:hover {
        opacity: 1;
        transform: scale(1.1);
      }

      .note-title {
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 12px;
        line-height: 1.3;
      }

      :host-context(.dark) .note-title {
        color: #e5e7eb !important;
      }

      .note-content {
        font-size: 14px;
        color: #6b7280;
        line-height: 1.6;
        margin-bottom: 16px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      :host-context(.dark) .note-content {
        color: #9ca3af !important;
      }

      .note-date {
        font-size: 12px;
        color: #9ca3af;
        font-weight: 500;
      }

      :host-context(.dark) .note-date {
        color: #6b7280 !important;
      }

      .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 80px 20px;
      }

      .empty-icon {
        font-size: 64px;
        opacity: 0.3;
        margin-bottom: 20px;
      }

      .empty-title {
        font-size: 20px;
        font-weight: 700;
        color: #374151;
        margin-bottom: 8px;
      }

      :host-context(.dark) .empty-title {
        color: #d1d5db !important;
      }

      .empty-text {
        font-size: 14px;
        color: #9ca3af;
        margin-bottom: 24px;
      }

      :host-context(.dark) .empty-text {
        color: #6b7280 !important;
      }

      .btn-empty {
        padding: 14px 32px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .btn-empty:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      .pomodoro-widget {
        position: fixed;
        bottom: 40px;
        right: 40px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px);
        padding: 20px 32px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        z-index: 10;
        transition: all 0.3s ease;
      }

      .pomodoro-widget:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
      }

      .pomodoro-label {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .pomodoro-time {
        font-size: 36px;
        font-weight: 900;
        color: white;
        font-variant-numeric: tabular-nums;
        letter-spacing: -1px;
        text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      @media (max-width: 768px) {
        .container {
          padding: 24px 16px;
        }

        .toolbar {
          flex-direction: column;
          align-items: stretch;
        }

        .search-box {
          min-width: 100%;
        }

        .category-filter {
          width: 100%;
        }

        .btn-new {
          width: 100%;
        }

        .notes-grid {
          grid-template-columns: 1fr;
        }

        .pomodoro-widget {
          bottom: 24px;
          right: 24px;
          padding: 16px 24px;
        }

        .pomodoro-label {
          font-size: 12px;
        }

        .pomodoro-time {
          font-size: 28px;
        }
      }

      @media (max-width: 576px) {
        .pomodoro-widget {
          bottom: 16px;
          right: 16px;
          padding: 12px 20px;
        }

        .pomodoro-label {
          font-size: 11px;
          margin-bottom: 4px;
        }

        .pomodoro-time {
          font-size: 24px;
        }
      }
    `,
  ],
})
export class NotesComponent {
  protected service = inject(NotesService);
  pomodoroService = inject(PomodoroService);

  showForm = signal(false);
  editingId = signal<string | null>(null);
  form = {
    title: '',
    content: '',
    category: 'Personal',
  };

  async openForm(): Promise<void> {
    const isDark = document.documentElement.classList.contains('dark');

    const { value: formValues } = await Swal.fire({
      title: '📝 Nueva Nota',
      html: `
        <style>
          * {
            box-sizing: border-box;
          }
          .swal2-html-container {
            overflow-x: hidden !important;
            max-width: 100%;
          }
          @media (max-width: 640px) {
            .modal-container {
              padding: 12px !important;
              max-width: 100% !important;
              overflow-x: hidden !important;
            }
            .swal2-input, .swal2-textarea {
              padding: 10px 12px !important;
              font-size: 14px !important;
            }
            .modal-label {
              font-size: 14px !important;
            }
          }
        </style>
        <div class="modal-container" style="padding: 16px; max-width: 100%; margin: 0 auto; overflow-x: hidden;">
          <div style="margin-bottom: 16px;">
            <label class="modal-label" style="
              display: block;
              font-size: 15px;
              font-weight: 700;
              color: ${isDark ? '#ffffff' : '#111827'};
              margin-bottom: 8px;
              letter-spacing: 0.3px;
            ">Título</label>
            <input
              id="noteTitle"
              class="swal2-input"
              placeholder="Título de la nota"
              autofocus
              style="
                width: 100%;
                margin: 0;
                padding: 12px 14px;
                font-size: 15px;
                border-radius: 8px;
                box-sizing: border-box;
              "
            >
          </div>

          <div style="margin-bottom: 16px;">
            <label class="modal-label" style="
              display: block;
              font-size: 15px;
              font-weight: 700;
              color: ${isDark ? '#ffffff' : '#111827'};
              margin-bottom: 8px;
              letter-spacing: 0.3px;
            ">Contenido</label>
            <textarea
              id="noteContent"
              class="swal2-textarea"
              placeholder="Escribe el contenido de tu nota..."
              rows="6"
              style="
                width: 100%;
                margin: 0;
                padding: 12px 14px;
                font-size: 15px;
                border-radius: 8px;
                box-sizing: border-box;
                resize: vertical;
                line-height: 1.6;
              "
            ></textarea>
          </div>

          <div style="margin-bottom: 16px;">
            <label class="modal-label" style="
              display: block;
              font-size: 15px;
              font-weight: 700;
              color: ${isDark ? '#ffffff' : '#111827'};
              margin-bottom: 8px;
              letter-spacing: 0.3px;
            ">Categoría</label>
            <select
              id="noteCategory"
              class="swal2-select"
              style="
                width: 100%;
                margin: 0;
                padding: 12px 14px;
                font-size: 15px;
                border-radius: 8px;
                box-sizing: border-box;
              "
            >
              <option value="Personal">👤 Personal</option>
              <option value="Trabajo">💼 Trabajo</option>
              <option value="Estudio">📚 Estudio</option>
              <option value="Ideas">💡 Ideas</option>
              <option value="Pendientes">✅ Pendientes</option>
              <option value="Otros">📌 Otros</option>
            </select>
          </div>
        </div>
      `,
      width: window.innerWidth < 640 ? '95vw' : '580px',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '✓ Guardar',
      cancelButtonText: '✕ Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'swal-planner-modal',
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel',
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const titleInput = document.getElementById('noteTitle') as HTMLInputElement;
        const contentInput = document.getElementById('noteContent') as HTMLTextAreaElement;

        const validateForm = () => {
          const hasTitle = titleInput.value.trim() !== '';
          const hasContent = contentInput.value.trim() !== '';
          const isValid = hasTitle && hasContent;

          if (confirmButton) {
            confirmButton.disabled = !isValid;
            confirmButton.style.opacity = isValid ? '1' : '0.5';
            confirmButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
          }
        };

        titleInput.addEventListener('input', validateForm);
        contentInput.addEventListener('input', validateForm);
        validateForm();
      },
      preConfirm: () => {
        const title = (document.getElementById('noteTitle') as HTMLInputElement).value;
        const content = (document.getElementById('noteContent') as HTMLTextAreaElement).value;
        const category = (document.getElementById('noteCategory') as HTMLSelectElement).value;

        if (!title.trim() || !content.trim()) {
          Swal.showValidationMessage('Por favor completa todos los campos');
          return false;
        }

        return { title, content, category };
      },
    });

    if (formValues) {
      this.service.addNote(formValues.title, formValues.content, formValues.category);

      await Swal.fire({
        icon: 'success',
        title: '¡Nota creada!',
        text: 'La nota se ha agregado correctamente',
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1e2433' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#111827',
      });
    }
  }

  async editNote(id: string): Promise<void> {
    const note = this.service.getNoteById(id);
    if (!note) return;

    const isDark = document.documentElement.classList.contains('dark');

    const { value: formValues } = await Swal.fire({
      title: '✏️ Editar Nota',
      html: `
        <style>
          * {
            box-sizing: border-box;
          }
          .swal2-html-container {
            overflow-x: hidden !important;
            max-width: 100%;
          }
          @media (max-width: 640px) {
            .modal-container {
              padding: 12px !important;
              max-width: 100% !important;
              overflow-x: hidden !important;
            }
            .swal2-input, .swal2-textarea {
              padding: 10px 12px !important;
              font-size: 14px !important;
            }
            .modal-label {
              font-size: 14px !important;
            }
          }
        </style>
        <div class="modal-container" style="padding: 16px; max-width: 100%; margin: 0 auto; overflow-x: hidden;">
          <div style="margin-bottom: 16px;">
            <label class="modal-label" style="
              display: block;
              font-size: 15px;
              font-weight: 700;
              color: ${isDark ? '#ffffff' : '#111827'};
              margin-bottom: 8px;
              letter-spacing: 0.3px;
            ">Título</label>
            <input
              id="noteTitle"
              class="swal2-input"
              placeholder="Título de la nota"
              value="${note.title}"
              autofocus
              style="
                width: 100%;
                margin: 0;
                padding: 12px 14px;
                font-size: 15px;
                border-radius: 8px;
                box-sizing: border-box;
              "
            >
          </div>

          <div style="margin-bottom: 16px;">
            <label class="modal-label" style="
              display: block;
              font-size: 15px;
              font-weight: 700;
              color: ${isDark ? '#ffffff' : '#111827'};
              margin-bottom: 8px;
              letter-spacing: 0.3px;
            ">Contenido</label>
            <textarea
              id="noteContent"
              class="swal2-textarea"
              placeholder="Escribe el contenido de tu nota..."
              rows="6"
              style="
                width: 100%;
                margin: 0;
                padding: 12px 14px;
                font-size: 15px;
                border-radius: 8px;
                box-sizing: border-box;
                resize: vertical;
                line-height: 1.6;
              "
            >${note.content}</textarea>
          </div>

          <div style="margin-bottom: 16px;">
            <label class="modal-label" style="
              display: block;
              font-size: 15px;
              font-weight: 700;
              color: ${isDark ? '#ffffff' : '#111827'};
              margin-bottom: 8px;
              letter-spacing: 0.3px;
            ">Categoría</label>
            <select
              id="noteCategory"
              class="swal2-select"
              style="
                width: 100%;
                margin: 0;
                padding: 12px 14px;
                font-size: 15px;
                border-radius: 8px;
                box-sizing: border-box;
              "
            >
              <option value="Personal" ${
                note.category === 'Personal' ? 'selected' : ''
              }>👤 Personal</option>
              <option value="Trabajo" ${
                note.category === 'Trabajo' ? 'selected' : ''
              }>💼 Trabajo</option>
              <option value="Estudio" ${
                note.category === 'Estudio' ? 'selected' : ''
              }>📚 Estudio</option>
              <option value="Ideas" ${note.category === 'Ideas' ? 'selected' : ''}>💡 Ideas</option>
              <option value="Pendientes" ${
                note.category === 'Pendientes' ? 'selected' : ''
              }>✅ Pendientes</option>
              <option value="Otros" ${note.category === 'Otros' ? 'selected' : ''}>📌 Otros</option>
            </select>
          </div>
        </div>
      `,
      width: window.innerWidth < 640 ? '95vw' : '580px',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '✓ Guardar',
      cancelButtonText: '✕ Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'swal-planner-modal',
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel',
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const titleInput = document.getElementById('noteTitle') as HTMLInputElement;
        const contentInput = document.getElementById('noteContent') as HTMLTextAreaElement;

        const validateForm = () => {
          const hasTitle = titleInput.value.trim() !== '';
          const hasContent = contentInput.value.trim() !== '';
          const isValid = hasTitle && hasContent;

          if (confirmButton) {
            confirmButton.disabled = !isValid;
            confirmButton.style.opacity = isValid ? '1' : '0.5';
            confirmButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
          }
        };

        titleInput.addEventListener('input', validateForm);
        contentInput.addEventListener('input', validateForm);
        validateForm();
      },
      preConfirm: () => {
        const title = (document.getElementById('noteTitle') as HTMLInputElement).value;
        const content = (document.getElementById('noteContent') as HTMLTextAreaElement).value;
        const category = (document.getElementById('noteCategory') as HTMLSelectElement).value;

        if (!title.trim() || !content.trim()) {
          Swal.showValidationMessage('Por favor completa todos los campos');
          return false;
        }

        return { title, content, category };
      },
    });

    if (formValues) {
      this.service.updateNote(id, formValues.title, formValues.content, formValues.category);

      await Swal.fire({
        icon: 'success',
        title: '¡Nota actualizada!',
        text: 'Los cambios se han guardado correctamente',
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1e2433' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#111827',
      });
    }
  }

  saveNote(): void {
    if (!this.form.title.trim()) return;

    const editId = this.editingId();
    if (editId) {
      this.service.updateNote(editId, this.form.title, this.form.content, this.form.category);
    } else {
      this.service.addNote(this.form.title, this.form.content, this.form.category);
    }

    this.cancelForm();
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  async deleteNote(id: string): Promise<void> {
    const result = await Swal.fire({
      title: '¿Eliminar nota?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '✓ Eliminar',
      cancelButtonText: '✕ Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: document.documentElement.classList.contains('dark') ? '#1e2433' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#111827',
    });

    if (result.isConfirmed) {
      this.service.deleteNote(id);

      await Swal.fire({
        icon: 'success',
        title: '¡Nota eliminada!',
        timer: 1500,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1e2433' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#111827',
      });
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      Personal: '👤',
      Trabajo: '💼',
      Estudio: '📚',
      Ideas: '💡',
      Pendientes: '✅',
      Otros: '📌',
    };
    return icons[category] || '📌';
  }

  getPhaseLabel(): string {
    const state = this.pomodoroService.state();
    if (state === 'RUNNING_FOCUS') {
      return 'Enfoque';
    } else if (state === 'RUNNING_SHORT_BREAK' || state === 'RUNNING_LONG_BREAK') {
      return 'Descanso';
    }
    return '';
  }

  formatTime(): string {
    const seconds = this.pomodoroService.secondsLeft();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
