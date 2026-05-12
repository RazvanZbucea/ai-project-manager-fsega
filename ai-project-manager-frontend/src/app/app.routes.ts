import {Routes} from '@angular/router';
import {LoginComponent} from './features/auth/login/login.component';
import {ProjectsListComponent} from './features/projects/projects-list/projects-list.component';

export const routes: Routes = [{path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'projects', component: ProjectsListComponent},
  {path: '**', redirectTo: 'login'}];
