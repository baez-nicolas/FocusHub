import { Routes } from '@angular/router';
import { CalculatorComponent } from './components/calculator.component';
import { DashboardComponent } from './components/dashboard.component';
import { GymComponent } from './components/gym.component';
import { NotesComponent } from './components/notes.component';
import { PlannerComponent } from './components/planner.component';
import { PomodoroComponent } from './components/pomodoro.component';
import { SetupComponent } from './components/setup.component';
import { StatsComponent } from './components/stats.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'pomodoro', component: PomodoroComponent },
  { path: 'planner', component: PlannerComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'gym', component: GymComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'setup', component: SetupComponent },
];
