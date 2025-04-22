import { Routes } from '@angular/router';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

export const appRoutes: Routes = [
  // Redirige la raíz hacia /contactos
  { path: '', redirectTo: 'contactos', pathMatch: 'full' },

  // Listar contactos
  { path: 'contactos', component: ContactListComponent },

  // Crear contacto
  { path: 'contactos/nuevo', component: ContactFormComponent },

  // Editar contacto (reusa el mismo form)
  { path: 'contactos/editar/:id', component: ContactFormComponent },

  // Cualquier otra ruta → redirigir a /contactos
  { path: '**', redirectTo: 'contactos' },
];
