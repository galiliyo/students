import { Routes } from '@angular/router';
import { DataComponent } from './data/data.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { MonitorComponent } from './monitor/monitor.component';

export const routes: Routes = [
  { path: 'data', component: DataComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: 'monitor', component: MonitorComponent },
  // default route
  { path: '', redirectTo: '/averages', pathMatch: 'full' },
  // wildcard route for handling unknown routes
  { path: '**', redirectTo: '/averages' },
];
