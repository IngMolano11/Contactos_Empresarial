import { Routes } from '@angular/router';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'contactos', pathMatch: 'full' },
  { path: 'contactos', component: ContactListComponent },
  { path: 'contactos/nuevo', component: ContactFormComponent },
  { path: 'contactos/editar/:id', component: ContactFormComponent },
];
