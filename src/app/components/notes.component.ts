import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { LangService } from '../services/lang.service';
import { Note, NotesService } from '../services/notes.service';

@Component({
  selector: 'app-notes',
  imports: [FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1 class="page-title"><i class="bi bi-journal-text"></i>{{ tx().title }}</h1>
        <p class="page-subtitle">{{ tx().subtitle }}</p>
      </div>

      <div class="toolbar">
        <div class="search-box">
          <i class="bi bi-search search-icon"></i>
          <input
            type="text"
            [(ngModel)]="service.searchQuery"
            [placeholder]="tx().searchPh"
            class="search-input"
          />
        </div>

        <select [(ngModel)]="service.selectedCategory" class="category-filter">
          <option value="all">{{ tx().allCat }}</option>
          @for (cat of service.categories(); track cat) {
            <option [value]="cat">{{ getCategoryIcon(cat) }} {{ getCategoryLabel(cat) }}</option>
          }
        </select>

        <button class="btn-new" (click)="openForm()">
          <span class="btn-plus">+ </span>{{ tx().newNote }}
        </button>
      </div>

      <div class="notes-grid">
        @for (note of service.filteredNotes(); track note.id) {
          <div class="note-card" (click)="viewNote(note)">
            <div class="note-header">
              <div class="note-category">
                {{ getCategoryIcon(note.category) }} {{ getCategoryLabel(note.category) }}
              </div>
              <div class="note-actions">
                <button class="btn-icon" (click)="$event.stopPropagation(); editNote(note.id)">
                  ✏️
                </button>
                <button class="btn-icon" (click)="$event.stopPropagation(); deleteNote(note.id)">
                  🗑️
                </button>
              </div>
            </div>
            <div class="note-title">{{ note.title }}</div>
            <div class="note-content">{{ note.content }}</div>
            <div class="note-date">{{ formatDate(note.updatedAt) }}</div>
          </div>
        } @empty {
          <div class="empty-state">
            <div class="empty-icon">📝</div>
            <div class="empty-title">{{ tx().noNotes }}</div>
            <div class="empty-text">{{ tx().createFirst }}</div>
            <button class="btn-empty" (click)="openForm()">
              <span class="btn-plus">+ </span>{{ tx().createNote }}
            </button>
          </div>
        }
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
        border-radius: 24px;
        overflow: hidden;
      }

      .search-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        color: #9ca3af;
      }

      .search-input {
        width: 100%;
        padding: 12px 16px 12px 44px;
        border: 2px solid #e5e7eb;
        border-radius: 24px;
        font-size: 15px;
        font-weight: 500;
        transition: all 0.2s;
        outline: none;
        -webkit-appearance: none;
        appearance: none;
        background-clip: padding-box;
      }

      :host-context(.dark) .search-input {
        background: #2d3448 !important;
        border: 2px solid #5a6480 !important;
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

      :host-context(.dark) .btn-new {
        background: linear-gradient(135deg, #5b5fc7 0%, #6b46a8 100%);
        box-shadow: 0 4px 12px rgba(91, 95, 199, 0.4);
      }

      .btn-new:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      :host-context(.dark) .btn-new:hover {
        box-shadow: 0 6px 20px rgba(91, 95, 199, 0.5);
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
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #f3f4f6;
        transition: all 0.3s;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        min-height: 180px;
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
        font-size: 16px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 8px;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      :host-context(.dark) .note-title {
        color: #e5e7eb !important;
      }

      .note-content {
        font-size: 13px;
        color: #6b7280;
        line-height: 1.6;
        flex: 1;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      :host-context(.dark) .note-content {
        color: #9ca3af !important;
      }

      .note-date {
        font-size: 11px;
        color: #9ca3af;
        font-weight: 500;
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid #f3f4f6;
      }

      :host-context(.dark) .note-date {
        color: #6b7280 !important;
        border-top-color: #2d3748 !important;
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

      @media (max-width: 768px) {
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

        .btn-plus {
          display: none;
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
      }
    `,
  ],
})
export class NotesComponent {
  protected service = inject(NotesService);
  private langService = inject(LangService);

  readonly tx = computed(() => {
    const es = this.langService.lang() === 'es';
    return {
      title: es ? 'Notas' : 'Notes',
      subtitle: es ? 'Organiza tus ideas y pensamientos' : 'Organize your ideas and thoughts',
      searchPh: es ? 'Buscar notas...' : 'Search notes...',
      allCat: es ? '📁 Todo' : '📁 All',
      newNote: es ? 'Nueva Nota' : 'New Note',
      noNotes: es ? 'Sin notas' : 'No notes',
      createFirst: es
        ? 'Crea tu primera nota para empezar'
        : 'Create your first note to get started',
      createNote: es ? 'Crear Nota' : 'Create Note',
      catLabels: {
        Personal: 'Personal',
        Work: es ? 'Trabajo' : 'Work',
        Study: es ? 'Estudio' : 'Study',
        Ideas: 'Ideas',
        Pending: es ? 'Pendiente' : 'Pending',
        Other: es ? 'Otro' : 'Other',
      } as Record<string, string>,
      swalNewTitle: es ? 'Nueva Nota' : 'New Note',
      swalEditTitle: es ? 'Editar Nota' : 'Edit Note',
      swalLabelTitle: es ? 'Título' : 'Title',
      swalTitlePh: es ? 'Título de la nota' : 'Note title',
      swalLabelContent: es ? 'Contenido' : 'Content',
      swalContentPh: es ? 'Escribe el contenido de tu nota...' : 'Write your note...',
      swalLabelCategory: es ? 'Categoría' : 'Category',
      swalSave: es ? 'Guardar' : 'Save',
      swalCancel: es ? 'Cancelar' : 'Cancel',
      swalFillAll: es ? 'Por favor completa todos los campos' : 'Please fill in all fields',
      swalCreated: es ? '¡Nota creada!' : 'Note created!',
      swalCreatedText: es
        ? 'La nota se ha agregado exitosamente'
        : 'The note has been added successfully',
      swalUpdated: es ? '¡Nota actualizada!' : 'Note updated!',
      swalUpdatedText: es
        ? 'Los cambios se han guardado correctamente'
        : 'Changes have been saved successfully',
      swalDeleteTitle: es ? '¿Eliminar nota?' : 'Delete note?',
      swalDeleteText: es ? 'Esta acción no se puede deshacer' : 'This action cannot be undone',
      swalDeleteBtn: es ? 'Eliminar' : 'Delete',
      swalDeleted: es ? '¡Nota eliminada!' : 'Note deleted!',
      justNow: es ? 'Ahora mismo' : 'Just now',
      locale: es ? 'es-ES' : 'en-US',
    };
  });

  showForm = signal(false);
  editingId = signal<string | null>(null);
  form = {
    title: '',
    content: '',
    category: 'Personal',
  };

  async openForm(): Promise<void> {
    const isDark = document.documentElement.classList.contains('dark');
    const t = this.tx();

    const { value: formValues } = await Swal.fire({
      title: t.swalNewTitle,
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
            ">${t.swalLabelTitle}</label>
            <input
              id="noteTitle"
              class="swal2-input"
              placeholder="${t.swalTitlePh}"
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
            ">${t.swalLabelContent}</label>
            <textarea
              id="noteContent"
              class="swal2-textarea"
              placeholder="${t.swalContentPh}"
              rows="6"
              style="
                width: 100%;
                margin: 0;
                padding: 12px 14px;
                font-size: 15px;
                border-radius: 8px;
                box-sizing: border-box;
                resize: none;
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
            ">${t.swalLabelCategory}</label>
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
              <option value="Personal">👤 ${t.catLabels['Personal']}</option>
              <option value="Work">💼 ${t.catLabels['Work']}</option>
              <option value="Study">📚 ${t.catLabels['Study']}</option>
              <option value="Ideas">💡 ${t.catLabels['Ideas']}</option>
              <option value="Pending">✅ ${t.catLabels['Pending']}</option>
              <option value="Other">📌 ${t.catLabels['Other']}</option>
            </select>
          </div>
        </div>
      `,
      width: window.innerWidth < 640 ? '95vw' : '580px',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: t.swalSave,
      cancelButtonText: t.swalCancel,
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
          const isValid = hasTitle;

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

        if (!title.trim()) {
          Swal.showValidationMessage(t.swalFillAll);
          return false;
        }

        return { title, content, category };
      },
    });

    if (formValues) {
      this.service.addNote(formValues.title, formValues.content, formValues.category);

      await Swal.fire({
        icon: 'success',
        title: t.swalCreated,
        text: t.swalCreatedText,
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
    const t = this.tx();

    const { value: formValues } = await Swal.fire({
      title: t.swalEditTitle,
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
            ">${t.swalLabelTitle}</label>
            <input
              id="noteTitle"
              class="swal2-input"
              placeholder="${t.swalTitlePh}"
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
            ">${t.swalLabelContent}</label>
            <textarea
              id="noteContent"
              class="swal2-textarea"
              placeholder="${t.swalContentPh}"
              rows="6"
              style="
                width: 100%;
                margin: 0;
                padding: 12px 14px;
                font-size: 15px;
                border-radius: 8px;
                box-sizing: border-box;
                resize: none;
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
            ">${t.swalLabelCategory}</label>
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
              }>👤 ${t.catLabels['Personal']}</option>
              <option value="Work" ${note.category === 'Work' ? 'selected' : ''}>💼 ${t.catLabels['Work']}</option>
              <option value="Study" ${note.category === 'Study' ? 'selected' : ''}>📚 ${t.catLabels['Study']}</option>
              <option value="Ideas" ${note.category === 'Ideas' ? 'selected' : ''}>💡 ${t.catLabels['Ideas']}</option>
              <option value="Pending" ${
                note.category === 'Pending' ? 'selected' : ''
              }>✅ ${t.catLabels['Pending']}</option>
              <option value="Other" ${note.category === 'Other' ? 'selected' : ''}>📌 ${t.catLabels['Other']}</option>
            </select>
          </div>
        </div>
      `,
      width: window.innerWidth < 640 ? '95vw' : '580px',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: t.swalSave,
      cancelButtonText: t.swalCancel,
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
          const isValid = hasTitle;

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

        if (!title.trim()) {
          Swal.showValidationMessage(t.swalFillAll);
          return false;
        }

        return { title, content, category };
      },
    });

    if (formValues) {
      this.service.updateNote(id, formValues.title, formValues.content, formValues.category);

      await Swal.fire({
        icon: 'success',
        title: t.swalUpdated,
        text: t.swalUpdatedText,
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
    const t = this.tx();
    const result = await Swal.fire({
      title: t.swalDeleteTitle,
      text: t.swalDeleteText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t.swalDeleteBtn,
      cancelButtonText: t.swalCancel,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: document.documentElement.classList.contains('dark') ? '#1e2433' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#111827',
    });

    if (result.isConfirmed) {
      this.service.deleteNote(id);

      await Swal.fire({
        icon: 'success',
        title: t.swalDeleted,
        timer: 1500,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1e2433' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#111827',
      });
    }
  }

  async viewNote(note: Note): Promise<void> {
    const t = this.tx();
    const isDark = document.documentElement.classList.contains('dark');
    const es = this.langService.lang() === 'es';
    const categoryIcon = this.getCategoryIcon(note.category);
    const categoryLabel = this.getCategoryLabel(note.category);
    const fullDate = this.formatFullDate(note.createdAt);
    const safeContent = note.content
      ? note.content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\n/g, '<br>')
      : null;

    await Swal.fire({
      title: note.title,
      html: `
        <style>
          .nm-cat {
            display: inline-flex; align-items: center; gap: 6px;
            background: ${isDark ? '#2d3748' : '#eef2ff'};
            color: ${isDark ? '#a5b4fc' : '#4f46e5'};
            padding: 4px 14px; border-radius: 20px;
            font-size: 13px; font-weight: 700; margin-bottom: 16px;
          }
          .nm-body {
            text-align: left; font-size: 15px; line-height: 1.7;
            color: ${isDark ? '#d1d5db' : '#374151'};
            max-height: 280px; overflow-y: auto;
            padding: 14px 16px;
            background: ${isDark ? '#252b3b' : '#f9fafb'};
            border-radius: 10px; margin-bottom: 14px;
            word-break: break-word;
          }
          .nm-empty {
            font-size: 14px; color: ${isDark ? '#6b7280' : '#9ca3af'};
            font-style: italic; padding: 20px; text-align: center;
          }
          .nm-date {
            font-size: 12px; color: ${isDark ? '#6b7280' : '#9ca3af'};
            text-align: right;
          }
        </style>
        <div class="nm-cat">${categoryIcon} ${categoryLabel}</div>
        ${
          safeContent
            ? `<div class="nm-body">${safeContent}</div>`
            : `<div class="nm-empty">${es ? 'Sin contenido' : 'No content'}</div>`
        }
        <div class="nm-date">${fullDate}</div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { popup: 'swal-planner-modal' },
      background: isDark ? '#1e2433' : '#ffffff',
      color: isDark ? '#f1f5f9' : '#111827',
      width: window.innerWidth < 640 ? '95vw' : '560px',
    });
  }

  formatFullDate(dateStr: string): string {
    const date = new Date(dateStr);
    const es = this.langService.lang() === 'es';
    return date.toLocaleDateString(es ? 'es-ES' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const es = this.langService.lang() === 'es';

    if (diffMins < 1) return es ? 'Ahora mismo' : 'Just now';
    if (diffMins < 60) return es ? `hace ${diffMins}m` : `${diffMins}m ago`;
    if (diffHours < 24) return es ? `hace ${diffHours}h` : `${diffHours}h ago`;
    if (diffDays < 7) return es ? `hace ${diffDays}d` : `${diffDays}d ago`;
    return date.toLocaleDateString(es ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' });
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      Personal: '👤',
      Work: '💼',
      Study: '📚',
      Ideas: '💡',
      Pending: '✅',
      Other: '📌',
    };
    return icons[category] || '📌';
  }

  getCategoryLabel(category: string): string {
    return this.tx().catLabels[category] ?? category;
  }
}
