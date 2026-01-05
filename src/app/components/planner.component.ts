import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Block, PlannerService } from '../services/planner.service';

@Component({
  selector: 'app-planner',
  imports: [FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <div class="title-row">
          <div class="title">📅 Planner</div>
          <input type="date" [(ngModel)]="selectedDate" class="date-picker" />
        </div>
        <button class="btn-add" (click)="openForm()">+ Nuevo Bloque</button>
      </div>

      @if (showForm()) {
      <div class="form-card">
        <div class="form-header">{{ editingId() ? 'Editar' : 'Nuevo' }} Bloque</div>

        <input
          type="text"
          placeholder="Título del bloque"
          [(ngModel)]="form.title"
          class="input-title"
        />

        <div class="time-row">
          <div class="time-input">
            <label>Inicio</label>
            <input type="time" [(ngModel)]="form.startTime" />
          </div>
          <div class="time-input">
            <label>Fin</label>
            <input type="time" [(ngModel)]="form.endTime" />
          </div>
        </div>

        <select [(ngModel)]="form.category" class="category-select">
          <option value="Focus">🎯 Focus</option>
          <option value="Break">☕ Break</option>
          <option value="Gym">💪 Gym</option>
          <option value="Personal">👤 Personal</option>
        </select>

        <div class="form-actions">
          <button class="btn-save" (click)="saveBlock()">✓ Guardar</button>
          <button class="btn-cancel" (click)="cancelForm()">✕ Cancelar</button>
        </div>
      </div>
      }

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
            <button class="btn-icon success" (click)="service.markDone(block.id)" title="Completar">
              ✓
            </button>
            <button class="btn-icon warning" (click)="service.markSkipped(block.id)" title="Omitir">
              ✕
            </button>
            }
            <button class="btn-icon edit" (click)="editBlock(block)" title="Editar">✎</button>
            <button
              class="btn-icon delete"
              (click)="service.deleteBlock(block.id)"
              title="Eliminar"
            >
              🗑
            </button>
          </div>

          @if (block.status === 'DONE') {
          <div class="status-badge done">✓ Completado</div>
          } @else if (block.status === 'SKIPPED') {
          <div class="status-badge skipped">⊘ Omitido</div>
          }
        </div>
        } @empty {
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <div class="empty-title">Sin bloques para este día</div>
          <div class="empty-text">Crea tu primer bloque para organizar tu jornada</div>
          <button class="btn-empty" (click)="openForm()">+ Crear Bloque</button>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px 24px;
      }

      .header {
        margin-bottom: 32px;
      }

      .title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 16px;
      }

      .title {
        font-size: 32px;
        font-weight: 700;
        color: #111827;
        letter-spacing: -0.5px;
      }

      .date-picker {
        padding: 10px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        color: #111827;
        cursor: pointer;
        transition: all 0.2s;
      }

      .date-picker:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .btn-add {
        width: 100%;
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
      }

      .btn-add:hover {
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

      .form-header {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 20px;
        text-align: center;
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

      .input-title:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .time-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;
      }

      .time-input label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: #6b7280;
        margin-bottom: 8px;
      }

      .time-input input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 600;
        color: #111827;
        transition: all 0.2s;
      }

      .time-input input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .category-select {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 20px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .category-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .form-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .btn-save,
      .btn-cancel {
        padding: 14px;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-save {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .btn-save:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      .btn-cancel {
        background: #f3f4f6;
        color: #6b7280;
      }

      .btn-cancel:hover {
        background: #e5e7eb;
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

      .block-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      }

      .block-card.done {
        background: #f0fdf4;
        border-color: #86efac;
      }

      .block-card.skipped {
        background: #fffbeb;
        border-color: #fde047;
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

      .block-category {
        font-size: 13px;
        font-weight: 600;
        color: #6b7280;
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

      .status-badge {
        position: absolute;
        top: -10px;
        right: 20px;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .status-badge.done {
        background: #22c55e;
        color: white;
      }

      .status-badge.skipped {
        background: #eab308;
        color: white;
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        border: 1px solid #f3f4f6;
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

      .empty-text {
        font-size: 14px;
        color: #9ca3af;
        margin-bottom: 24px;
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
  selectedDate = signal(new Date().toISOString().split('T')[0]);
  showForm = signal(false);
  editingId = signal<string | null>(null);
  form = { title: '', startTime: '', endTime: '', category: 'Focus' as any };

  constructor(protected service: PlannerService) {}

  todayBlocks = computed(() => this.service.getBlocksForDate(this.selectedDate()));

  openForm(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.form = { title: '', startTime: '', endTime: '', category: 'Focus' };
  }

  editBlock(block: Block): void {
    this.showForm.set(true);
    this.editingId.set(block.id);
    this.form = {
      title: block.title,
      startTime: block.startTime,
      endTime: block.endTime,
      category: block.category,
    };
  }

  saveBlock(): void {
    if (this.editingId()) {
      this.service.updateBlock(this.editingId()!, this.form);
    } else {
      this.service.addBlock({ ...this.form, date: this.selectedDate(), status: 'PLANNED' });
    }
    this.cancelForm();
  }

  cancelForm(): void {
    this.showForm.set(false);
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
