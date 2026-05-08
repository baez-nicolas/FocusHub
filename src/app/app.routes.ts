import { Routes } from '@angular/router';
import { CalculatorComponent } from './components/calculator.component';
import { DashboardComponent } from './components/dashboard.component';
import { GymComponent } from './components/gym.component';
import { MoreComponent } from './components/more.component';
import { MusicComponent } from './components/music.component';
import { NewsComponent } from './components/news.component';
import { NotesComponent } from './components/notes.component';
import { PlannerComponent } from './components/planner.component';
import { SpotifyCallbackComponent } from './components/spotify-callback.component';
import { StatsComponent } from './components/stats.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'planner', component: PlannerComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'gym', component: GymComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'news', component: NewsComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'music', component: MusicComponent },
  { path: 'spotify-callback', component: SpotifyCallbackComponent },
  { path: 'more', component: MoreComponent },
];
