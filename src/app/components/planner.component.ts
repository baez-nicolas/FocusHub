import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LangService } from '../services/lang.service';
import { Block, PlannerService } from '../services/planner.service';

@Component({
  selector: 'app-planner',
  imports: [FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1 class="page-title"><i class="bi bi-calendar3"></i>{{ tx().title }}</h1>
        <p class="page-subtitle">{{ tx().subtitle }}</p>
      </div>

      <div class="controls">
        <input type="date" [(ngModel)]="selectedDate" class="date-picker" />
        <button class="btn-add" (click)="openForm()">{{ tx().newBlock }}</button>
      </div>

      <div class="blocks-list">
        @for (block of todayBlocks(); track block.id) {
          <div
            class="block-card"
            [class.done]="block.status === 'DONE'"
            [class.skipped]="block.status === 'SKIPPED'"
          >
            <div class="block-time">
              <div class="time">{{ block.startTime }}</div>
              <div class="separator">—</div>
              <div class="time">{{ block.endTime }}</div>
            </div>

            <div class="block-content">
              <div class="block-title">{{ block.title }}</div>
              <div class="block-category">
                {{ getCategoryIcon(block.category) }} {{ block.category }}
              </div>
            </div>

            <div class="block-actions">
              @if (block.status === 'PLANNED') {
                <button
                  class="btn-icon success"
                  (click)="service.markDone(block.id)"
                  title="{{ tx().complete }}"
                >
                  ✓
                </button>
                <button
                  class="btn-icon warning"
                  (click)="service.markSkipped(block.id)"
                  title="{{ tx().skip }}"
                >
                  ✕
                </button>
              } @else {
                <button
                  class="btn-icon reset"
                  (click)="service.resetStatus(block.id)"
                  title="{{ tx().reset }}"
                >
                  ↺
                </button>
              }
              <button class="btn-icon edit" (click)="editBlock(block)" title="{{ tx().edit }}">
                &#9998;
              </button>
              <button
                class="btn-icon delete"
                (click)="service.deleteBlock(block.id)"
                title="{{ tx().delete }}"
              >
                🗑
              </button>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <div class="empty-title">{{ tx().noBlocks }}</div>
            <div class="empty-text">{{ tx().createFirstBlock }}</div>
            <button class="btn-empty" (click)="openForm()">{{ tx().createBlockBtn }}</button>
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

      @media (max-width: 767px) {
        .container {
          padding: 24px 16px;
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

      .controls {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 32px;
      }

      .date-picker {
        flex: 1;
        padding: 10px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        color: #111827;
        cursor: pointer;
        transition: all 0.2s;
      }

      :host-context(.dark) .date-picker {
        background: #252b3b !important;
        border: 2px solid #2d3748 !important;
        color: #d1d5db !important;
      }

      .date-picker:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      :host-context(.dark) .date-picker:focus {
        border-color: #7066e0 !important;
        box-shadow: 0 0 0 3px rgba(112, 102, 224, 0.2) !important;
      }

      .btn-add {
        flex: 1;
        padding: 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        white-space: nowrap;
      }

      :host-context(.dark) .btn-add {
        background: linear-gradient(135deg, #5b5fc7 0%, #6b46a8 100%);
        box-shadow: 0 4px 12px rgba(91, 95, 199, 0.4);
      }

      .btn-add:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      :host-context(.dark) .btn-add:hover {
        box-shadow: 0 6px 20px rgba(91, 95, 199, 0.5);
      }

      :host ::ng-deep .swal-planner-modal {
        border-radius: 20px !important;
        padding: 20px !important;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
      }

      :host ::ng-deep .swal-planner-modal .swal2-title {
        font-size: 24px !important;
        font-weight: 700 !important;
        margin-bottom: 24px !important;
      }

      :host ::ng-deep .swal-planner-modal .swal2-html-container {
        margin: 0 !important;
      }

      :host ::ng-deep .swal2-input {
        border-radius: 12px !important;
        font-size: 15px !important;
        padding: 14px 16px !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
      }

      :host ::ng-deep .swal2-input:focus {
        outline: none !important;
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15) !important;
      }

      :host ::ng-deep .swal2-input::placeholder {
        color: #9ca3af !important;
      }

      :host ::ng-deep .swal-btn-confirm {
        border-radius: 12px !important;
        font-weight: 700 !important;
        padding: 14px 32px !important;
        font-size: 16px !important;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
        transition: all 0.3s ease !important;
      }

      :host ::ng-deep .swal-btn-confirm:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
      }

      :host ::ng-deep .swal-btn-cancel {
        border-radius: 12px !important;
        font-weight: 700 !important;
        padding: 14px 32px !important;
        font-size: 16px !important;
        transition: all 0.2s ease !important;
      }

      :host ::ng-deep .swal-btn-cancel:hover {
        background: #9ca3af !important;
      }

      :host ::ng-deep .swal2-actions {
        gap: 12px !important;
        margin-top: 24px !important;
      }

      .blocks-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .block-card {
        background: white;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #f3f4f6;
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 20px;
        align-items: center;
        transition: all 0.3s;
        position: relative;
      }

      :host-context(.dark) .block-card {
        background: #1e2433 !important;
        border: 1px solid #2d3748 !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
      }

      .block-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      }

      :host-context(.dark) .block-card:hover {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
      }

      .block-card.done {
        background: #f0fdf4;
        border-color: #86efac;
        border-left: 4px solid #22c55e;
      }

      :host-context(.dark) .block-card.done {
        background: #1a2e23 !important;
        border-color: #15803d !important;
      }

      .block-card.skipped {
        background: #fffbeb;
        border-color: #fde047;
        border-left: 4px solid #eab308;
      }

      :host-context(.dark) .block-card.skipped {
        background: #2e2a1a !important;
        border-color: #a16207 !important;
      }

      .block-time {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .block-time .time {
        font-size: 14px;
        font-weight: 700;
        color: #1f2937;
        background: #f9fafb;
        padding: 6px 12px;
        border-radius: 8px;
      }

      :host-context(.dark) .block-time .time {
        background: #252b3b !important;
        color: #d1d5db !important;
      }

      .block-time .separator {
        font-size: 12px;
        color: #9ca3af;
      }

      .block-content {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .block-title {
        font-size: 17px;
        font-weight: 700;
        color: #111827;
      }

      :host-context(.dark) .block-title {
        color: #e5e7eb !important;
      }

      .block-category {
        font-size: 13px;
        font-weight: 600;
        color: #6b7280;
      }

      :host-context(.dark) .block-category {
        color: #9ca3af !important;
      }

      .block-actions {
        display: flex;
        gap: 8px;
      }

      .btn-icon {
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-icon.success {
        background: #d1fae5;
        color: #065f46;
      }

      .btn-icon.success:hover {
        background: #a7f3d0;
      }

      .btn-icon.warning {
        background: #fef3c7;
        color: #92400e;
      }

      .btn-icon.warning:hover {
        background: #fde68a;
      }

      .btn-icon.edit {
        background: #dbeafe;
        color: #1e40af;
      }

      .btn-icon.edit:hover {
        background: #bfdbfe;
      }

      .btn-icon.delete {
        background: #fee2e2;
        color: #991b1b;
      }

      .btn-icon.delete:hover {
        background: #fecaca;
      }

      .btn-icon.reset {
        background: #e0e7ff;
        color: #4338ca;
      }

      .btn-icon.reset:hover {
        background: #c7d2fe;
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        border: 1px solid #f3f4f6;
      }

      :host-context(.dark) .empty-state {
        background: #1e2433 !important;
        border: 1px solid #2d3748 !important;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3) !important;
      }

      .empty-icon {
        font-size: 64px;
        opacity: 0.3;
        margin-bottom: 16px;
      }

      .empty-title {
        font-size: 20px;
        font-weight: 700;
        color: #1f2937;
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
        padding: 12px 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        transition: all 0.3s;
      }

      .btn-empty:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      @media (max-width: 768px) {
        .container {
          padding: 24px 16px;
        }

        .title {
          font-size: 28px;
        }

        .block-card {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .block-time {
          flex-direction: row;
          justify-content: center;
        }

        .block-time .separator {
          padding: 0 8px;
        }

        .block-actions {
          justify-content: center;
        }
      }
    `,
  ],
})
export class PlannerComponent {
  private router = inject(Router);
  private langService = inject(LangService);
  selectedDate = signal(new Date().toISOString().split('T')[0]);

  constructor(protected service: PlannerService) {}

  readonly tx = computed(() => {
    const es = this.langService.lang() === 'es';
    return {
      title: es ? 'Planificador' : 'Planner',
      subtitle: es ? 'Organiza tu día' : 'Organize your day',
      newBlock: es ? '+ Nuevo Bloque' : '+ New Block',
      complete: es ? 'Completar' : 'Complete',
      skip: es ? 'Omitir' : 'Skip',
      reset: es ? 'Restablecer' : 'Reset',
      edit: es ? 'Editar' : 'Edit',
      delete: es ? 'Eliminar' : 'Delete',
      noBlocks: es ? 'Sin bloques para este día' : 'No blocks for this day',
      createFirstBlock: es
        ? 'Crea tu primer bloque para organizar tu día'
        : 'Create your first block to organize your day',
      createBlockBtn: es ? '+ Crear Bloque' : '+ Create Block',
      swalNewTitle: es ? '📅 Nuevo Bloque' : '📅 New Block',
      swalEditTitle: es ? '✎ Editar Bloque' : '✎ Edit Block',
      swalBlockTitle: es ? 'Título del bloque' : 'Block title',
      swalBlockPh: es ? 'Ej.: Estudiar Angular' : 'E.g.: Study Angular',
      swalStartTime: es ? 'Hora inicio' : 'Start time',
      swalEndTime: es ? 'Hora fin' : 'End time',
      swalCategory: es ? 'Categoría' : 'Category',
      swalSave: es ? '✓ Guardar' : '✓ Save',
      swalCancel: es ? '✕ Cancelar' : '✕ Cancel',
      swalFillAll: es ? 'Por favor completa todos los campos' : 'Please fill in all fields',
      swalBlockCreated: es ? '¡Bloque creado!' : 'Block created!',
      swalBlockAdded: es
        ? 'El bloque fue agregado exitosamente'
        : 'The block has been added successfully',
      swalBlockUpdated: es ? '¡Bloque actualizado!' : 'Block updated!',
      swalChangesSaved: es
        ? 'Los cambios se guardaron exitosamente'
        : 'Changes have been saved successfully',
    };
  });

  todayBlocks = computed(() => this.service.getBlocksForDate(this.selectedDate()));

  async openForm(): Promise<void> {
    const isDark = document.documentElement.classList.contains('dark');
    const t = this.tx();

    const { value: formValues } = await Swal.fire({
      title: t.swalNewTitle,
      html: `
        <style>
          @media (max-width: 640px) {
            .modal-container { padding: 12px !important; }
            .modal-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
            .swal2-input { padding: 10px 12px !important; font-size: 14px !important; }
            .modal-label { font-size: 14px !important; }
          }
        </style>
        <div class="modal-container" style="padding: 16px; max-width: 480px; margin: 0 auto;">
          <div style="margin-bottom: 16px;">
            <label class="modal-label" style="
              display: block;
              font-size: 15px;
              font-weight: 700;
              color: ${isDark ? '#ffffff' : '#111827'};
              margin-bottom: 8px;
              letter-spacing: 0.3px;
            ">${t.swalBlockTitle}</label>
            <input
              id="title"
              class="swal2-input"
              placeholder="${t.swalBlockPh}"
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

          <div class="modal-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
            <div>
              <label class="modal-label" style="
                display: block;
                font-size: 15px;
                font-weight: 700;
                color: ${isDark ? '#ffffff' : '#111827'};
                margin-bottom: 8px;
                letter-spacing: 0.3px;
              ">${t.swalStartTime}</label>
              <input
                id="startTime"
                type="time"
                class="swal2-input"
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
            <div>
              <label class="modal-label" style="
                display: block;
                font-size: 15px;
                font-weight: 700;
                color: ${isDark ? '#ffffff' : '#111827'};
                margin-bottom: 8px;
                letter-spacing: 0.3px;
              ">${t.swalEndTime}</label>
              <input
                id="endTime"
                type="time"
                class="swal2-input"
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
          </div>

          <div>
            <label class="modal-label" style="
              display: block;
              font-size: 15px;
              font-weight: 700;
              color: ${isDark ? '#ffffff' : '#111827'};
              margin-bottom: 8px;
              letter-spacing: 0.3px;
            ">${t.swalCategory}</label>
            <select
              id="category"
              class="swal2-input"
              style="
                width: 100%;
                margin: 0;
                padding: 12px 14px;
                font-size: 15px;
                border-radius: 8px;
                box-sizing: border-box;
                height: 48px;
                cursor: pointer;
              "
            >
              <option value="Focus">🎯 Focus</option>
              <option value="Break">☕ Break</option>
              <option value="Gym">💪 Gym</option>
              <option value="Personal">👤 Personal</option>
            </select>
          </div>
        </div>
      `,
      width: window.innerWidth < 640 ? '95vw' : '560px',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: t.swalSave,
      cancelButtonText: t.swalCancel,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'swal-planner-modal',
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel',
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const startTimeInput = document.getElementById('startTime') as HTMLInputElement;
        const endTimeInput = document.getElementById('endTime') as HTMLInputElement;

        const validateForm = () => {
          const isValid =
            titleInput.value.trim() !== '' &&
            startTimeInput.value !== '' &&
            endTimeInput.value !== '';

          if (confirmButton) {
            confirmButton.disabled = !isValid;
            confirmButton.style.opacity = isValid ? '1' : '0.5';
            confirmButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
          }
        };

        validateForm();

        titleInput.addEventListener('input', validateForm);
        startTimeInput.addEventListener('change', validateForm);
        endTimeInput.addEventListener('change', validateForm);
      },
      preConfirm: () => {
        const title = (document.getElementById('title') as HTMLInputElement).value;
        const startTime = (document.getElementById('startTime') as HTMLInputElement).value;
        const endTime = (document.getElementById('endTime') as HTMLInputElement).value;
        const category = (document.getElementById('category') as HTMLSelectElement).value;

        if (!title || !startTime || !endTime) {
          Swal.showValidationMessage(t.swalFillAll);
          return false;
        }

        return { title, startTime, endTime, category };
      },
    });

    if (formValues) {
      this.service.addBlock({
        ...formValues,
        date: this.selectedDate(),
        status: 'PLANNED',
      });

      await Swal.fire({
        icon: 'success',
        title: t.swalBlockCreated,
        text: t.swalBlockAdded,
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1e2433' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#111827',
      });
    }
  }

  async editBlock(block: Block): Promise<void> {
    const isDark = document.documentElement.classList.contains('dark');
    const t = this.tx();

    const { value: formValues } = await Swal.fire({
      title: t.swalEditTitle,
      html: `
        <style>
          @media (max-width: 640px) {
            .modal-container { padding: 12px !important; }
            .modal-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
            .swal2-input { padding: 10px 12px !important; font-size: 14px !important; }
            .modal-label { font-size: 14px !important; }
          }
        </style>
        <div class="modal-container" style="padding: 16px; max-width: 480px; margin: 0 auto;">
          <div style="margin-bottom: 16px;">
            <label class="modal-label" style="
              display: block;
              font-size: 15px;
              font-weight: 700;
              color: ${isDark ? '#ffffff' : '#111827'};
              margin-bottom: 8px;
              letter-spacing: 0.3px;
            ">${t.swalBlockTitle}</label>
            <input
              id="title"
              class="swal2-input"
              placeholder="${t.swalBlockPh}"
              value="${block.title}"
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

          <div class="modal-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
            <div>
              <label class="modal-label" style="
                display: block;
                font-size: 15px;
                font-weight: 700;
                color: ${isDark ? '#ffffff' : '#111827'};
                margin-bottom: 8px;
                letter-spacing: 0.3px;
              ">${t.swalStartTime}</label>
              <input
                id="startTime"
                type="time"
                class="swal2-input"
                value="${block.startTime}"
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
            <div>
              <label class="modal-label" style="
                display: block;
                font-size: 15px;
                font-weight: 700;
                color: ${isDark ? '#ffffff' : '#111827'};
                margin-bottom: 8px;
                letter-spacing: 0.3px;
              ">${t.swalEndTime}</label>
              <input
                id="endTime"
                type="time"
                class="swal2-input"
                value="${block.endTime}"
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
          </div>

          <div>
            <label class="modal-label" style="
              display: block;
              font-size: 15px;
              font-weight: 700;
              color: ${isDark ? '#ffffff' : '#111827'};
              margin-bottom: 8px;
              letter-spacing: 0.3px;
            ">${t.swalCategory}</label>
            <select
              id="category"
              class="swal2-input"
              style="
                width: 100%;
                margin: 0;
                padding: 12px 14px;
                font-size: 15px;
                border-radius: 8px;
                box-sizing: border-box;
                height: 48px;
                cursor: pointer;
              "
            >
              <option value="Focus" ${
                block.category === 'Focus' ? 'selected' : ''
              }>🎯 Focus</option>
              <option value="Break" ${
                block.category === 'Break' ? 'selected' : ''
              }>☕ Break</option>
              <option value="Gym" ${block.category === 'Gym' ? 'selected' : ''}>💪 Gym</option>
              <option value="Personal" ${
                block.category === 'Personal' ? 'selected' : ''
              }>👤 Personal</option>
            </select>
          </div>
        </div>
      `,
      width: window.innerWidth < 640 ? '95vw' : '560px',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: t.swalSave,
      cancelButtonText: t.swalCancel,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'swal-planner-modal',
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel',
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const startTimeInput = document.getElementById('startTime') as HTMLInputElement;
        const endTimeInput = document.getElementById('endTime') as HTMLInputElement;

        const validateForm = () => {
          const isValid =
            titleInput.value.trim() !== '' &&
            startTimeInput.value !== '' &&
            endTimeInput.value !== '';

          if (confirmButton) {
            confirmButton.disabled = !isValid;
            confirmButton.style.opacity = isValid ? '1' : '0.5';
            confirmButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
          }
        };

        validateForm();

        titleInput.addEventListener('input', validateForm);
        startTimeInput.addEventListener('change', validateForm);
        endTimeInput.addEventListener('change', validateForm);
      },
      preConfirm: () => {
        const title = (document.getElementById('title') as HTMLInputElement).value;
        const startTime = (document.getElementById('startTime') as HTMLInputElement).value;
        const endTime = (document.getElementById('endTime') as HTMLInputElement).value;
        const category = (document.getElementById('category') as HTMLSelectElement).value;

        if (!title || !startTime || !endTime) {
          Swal.showValidationMessage(t.swalFillAll);
          return false;
        }

        return { title, startTime, endTime, category };
      },
    });

    if (formValues) {
      this.service.updateBlock(block.id, formValues);

      await Swal.fire({
        icon: 'success',
        title: t.swalBlockUpdated,
        text: t.swalChangesSaved,
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains('dark') ? '#1e2433' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#111827',
      });
    }
  }

  getCategoryClass(category: string): string {
    const classes: any = {
      Focus: 'bg-primary',
      Break: 'bg-info',
      Gym: 'bg-danger',
      Personal: 'bg-secondary',
    };
    return classes[category] || 'bg-secondary';
  }

  getCategoryIcon(category: string): string {
    const icons: any = {
      Focus: '🎯',
      Break: '☕',
      Gym: '💪',
      Personal: '👤',
    };
    return icons[category] || '📌';
  }
}
