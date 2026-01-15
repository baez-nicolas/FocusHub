import { Injectable, computed } from '@angular/core';
import { PlannerService } from './planner.service';
import { PomodoroService } from './pomodoro.service';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private pomodoro: PomodoroService, private planner: PlannerService) {}

  focusMinutesToday = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.pomodoro
      .getSessions()
      .filter((s) => s.date === today)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  });

  focusMinutesThisWeek = computed(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startStr = startOfWeek.toISOString().split('T')[0];
    return this.pomodoro
      .getSessions()
      .filter((s) => s.date >= startStr)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  });

  streak = computed(() => {
    const sessions = this.pomodoro.getSessions();
    const dateMap = new Map<string, number>();
    sessions.forEach((s) => {
      dateMap.set(s.date, (dateMap.get(s.date) || 0) + s.durationMinutes);
    });

    let streak = 0;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayMinutes = dateMap.get(todayStr) || 0;

    let current = new Date();
    if (todayMinutes < 25) {
      current.setDate(current.getDate() - 1);
    }

    while (true) {
      const dateStr = current.toISOString().split('T')[0];
      const mins = dateMap.get(dateStr) || 0;
      if (mins >= 25) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  });

  plannerCompletion = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    const blocks = this.planner.getBlocksForDate(today);
    if (blocks.length === 0) return 0;
    const done = blocks.filter((b) => b.status === 'DONE').length;
    return Math.round((done / blocks.length) * 100);
  });

  getLastSevenDays(): { date: string; minutes: number }[] {
    const result: { date: string; minutes: number }[] = [];
    const sessions = this.pomodoro.getSessions();
    const dateMap = new Map<string, number>();
    sessions.forEach((s) => {
      dateMap.set(s.date, (dateMap.get(s.date) || 0) + s.durationMinutes);
    });

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      result.push({ date: dateStr, minutes: dateMap.get(dateStr) || 0 });
    }
    return result;
  }
}
