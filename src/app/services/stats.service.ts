import { Injectable, computed } from '@angular/core';
import { PlannerService } from './planner.service';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private planner: PlannerService) {}

  focusMinutesToday = computed(() => 0);

  focusMinutesThisWeek = computed(() => 0);

  streak = computed(() => 0);

  plannerCompletion = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    const blocks = this.planner.getBlocksForDate(today);
    if (blocks.length === 0) return 0;
    const done = blocks.filter((b) => b.status === 'DONE').length;
    return Math.round((done / blocks.length) * 100);
  });

  getLastSevenDays(): { date: string; minutes: number }[] {
    const result: { date: string; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push({ date: d.toISOString().split('T')[0], minutes: 0 });
    }
    return result;
  }
}
