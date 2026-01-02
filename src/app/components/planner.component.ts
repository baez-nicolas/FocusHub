import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Block, PlannerService } from '../services/planner.service';

@Component({
  selector: 'app-planner',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row mb-4 align-items-center">
        <div class="col-md-6">
          <h2 class="fw-bold mb-1">
            <i class="bi bi-calendar-check text-primary me-2"></i>Planner
          </h2>
          <p class="text-muted mb-0">Organiza tu día con time blocking</p>
        </div>
        <div class="col-md-6 text-md-end mt-3 mt-md-0">
          <input
            type="date"
            class="form-control form-control-lg d-inline-block w-auto"
            [(ngModel)]="selectedDate"
          />
          <button class="btn btn-primary btn-lg ms-2" (click)="openForm()">
            <i class="bi bi-plus-lg me-2"></i>Nuevo Bloque
          </button>
        </div>
      </div>

      @if (showForm()) {
      <div class="card shadow-sm border-0 mb-4">
        <div class="card-header bg-primary text-white">
          <h6 class="mb-0">
            <i class="bi bi-pencil-square me-2"></i>{{ editingId() ? 'Editar' : 'Nuevo' }} Bloque
          </h6>
        </div>
        <div class="card-body p-4">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label fw-bold">Título</label>
              <input
                type="text"
                class="form-control form-control-lg"
                placeholder="Ej: Programar proyecto"
                [(ngModel)]="form.title"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">Hora de inicio</label>
              <input
                type="time"
                class="form-control form-control-lg"
                [(ngModel)]="form.startTime"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">Hora de fin</label>
              <input type="time" class="form-control form-control-lg" [(ngModel)]="form.endTime" />
            </div>
            <div class="col-12">
              <label class="form-label fw-bold">Categoría</label>
              <select class="form-select form-select-lg" [(ngModel)]="form.category">
                <option value="Focus">🎯 Focus</option>
                <option value="Break">☕ Break</option>
                <option value="Gym">💪 Gym</option>
                <option value="Personal">👤 Personal</option>
              </select>
            </div>
          </div>
          <div class="d-flex gap-2 mt-4">
            <button class="btn btn-primary btn-lg" (click)="saveBlock()">
              <i class="bi bi-check-lg me-2"></i>Guardar
            </button>
            <button class="btn btn-outline-secondary btn-lg" (click)="cancelForm()">
              <i class="bi bi-x-lg me-2"></i>Cancelar
            </button>
          </div>
        </div>
      </div>
      }

      <div class="row g-3">
        @for (block of todayBlocks(); track block.id) {
        <div class="col-12">
          <div
            class="card shadow-sm border-0 block-card"
            [class.block-done]="block.status === 'DONE'"
            [class.block-skipped]="block.status === 'SKIPPED'"
          >
            <div class="card-body p-3">
              <div class="row align-items-center">
                <div class="col-auto">
                  <div class="time-badge">
                    <i class="bi bi-clock me-1"></i>
                    {{ block.startTime }}
                  </div>
                  <div class="text-muted small text-center mt-1">—</div>
                  <div class="time-badge">
                    {{ block.endTime }}
                  </div>
                </div>
                <div class="col">
                  <div class="d-flex align-items-start justify-content-between">
                    <div>
                      <h5 class="mb-1 fw-bold">{{ block.title }}</h5>
                      <span class="badge" [class]="getCategoryClass(block.category)">
                        {{ getCategoryIcon(block.category) }} {{ block.category }}
                      </span>
                    </div>
                    @if (block.status === 'DONE') {
                    <span class="badge bg-success fs-6">
                      <i class="bi bi-check-circle-fill"></i> Completado
                    </span>
                    } @else if (block.status === 'SKIPPED') {
                    <span class="badge bg-warning fs-6">
                      <i class="bi bi-x-circle-fill"></i> Omitido
                    </span>
                    }
                  </div>
                </div>
                <div class="col-auto">
                  <div class="btn-group">
                    @if (block.status === 'PLANNED') {
                    <button
                      class="btn btn-sm btn-outline-success"
                      (click)="service.markDone(block.id)"
                      title="Marcar como hecho"
                    >
                      <i class="bi bi-check-lg"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-warning"
                      (click)="service.markSkipped(block.id)"
                      title="Omitir"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                    }
                    <button
                      class="btn btn-sm btn-outline-primary"
                      (click)="editBlock(block)"
                      title="Editar"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      (click)="service.deleteBlock(block.id)"
                      title="Eliminar"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        } @empty {
        <div class="col-12">
          <div class="card shadow-sm border-0">
            <div class="card-body text-center py-5">
              <i class="bi bi-calendar-x display-1 text-muted opacity-25"></i>
              <h5 class="text-muted mt-3">Sin bloques para este día</h5>
              <p class="text-muted">Crea tu primer bloque para organizar tu jornada</p>
              <button class="btn btn-primary" (click)="openForm()">
                <i class="bi bi-plus-lg me-2"></i>Crear Bloque
              </button>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .block-card {
        transition: all 0.2s ease;
        border-left: 4px solid #6c757d;
      }

      .block-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      }

      .block-done {
        border-left-color: #198754;
        background: #f8fdf9;
      }

      .block-skipped {
        border-left-color: #ffc107;
        background: #fffbf0;
      }

      .time-badge {
        background: #f8f9fa;
        padding: 6px 12px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        white-space: nowrap;
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
