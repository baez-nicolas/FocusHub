import { effect, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

type BlockStatus = 'PLANNED' | 'DONE' | 'SKIPPED';
type BlockCategory = 'Focus' | 'Break' | 'Gym' | 'Personal';

export interface Block {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  category: BlockCategory;
  status: BlockStatus;
}

@Injectable({ providedIn: 'root' })
export class PlannerService {
  blocks = signal<Block[]>([]);

  constructor(private storage: StorageService) {
    this.blocks.set(this.storage.get('fh_planner_blocks', []));
    effect(() => {
      this.storage.set('fh_planner_blocks', this.blocks());
    });
  }

  getBlocksForDate(date: string): Block[] {
    return this.blocks()
      .filter((b) => b.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  addBlock(block: Omit<Block, 'id'>): void {
    const newBlock: Block = { ...block, id: crypto.randomUUID() };
    this.blocks.update((bs) => [...bs, newBlock]);
  }

  updateBlock(id: string, updates: Partial<Block>): void {
    this.blocks.update((bs) => bs.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  }

  deleteBlock(id: string): void {
    this.blocks.update((bs) => bs.filter((b) => b.id !== id));
  }

  markDone(id: string): void {
    this.updateBlock(id, { status: 'DONE' });
  }

  markSkipped(id: string): void {
    this.updateBlock(id, { status: 'SKIPPED' });
  }

  resetStatus(id: string): void {
    this.updateBlock(id, { status: 'PLANNED' });
  }
}
