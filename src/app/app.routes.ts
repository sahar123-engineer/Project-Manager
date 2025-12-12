import { Routes } from '@angular/router';
import { DynamicFormComponent } from './features/projects/components/dynamic-form/dynamic-form.component';
import { UserFormComponent } from './features/projects/components/user-form/user-form.component';
import { ContactFormComponent } from './features/projects/components/contact-form/contact-form.component';
import { ProjectListComponent } from './features/projects/components/project-list/project-list.component';
import { NestedFormComponent } from './features/projects/components/nested-form/nested-form.component';
import { LoginComponent } from './features/auth/components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'contact', component: ContactFormComponent },
  { path: 'user-form', component: UserFormComponent },
  { path: 'dynamic-form', component: DynamicFormComponent },
  { path: 'nested-form', component: NestedFormComponent }
];
