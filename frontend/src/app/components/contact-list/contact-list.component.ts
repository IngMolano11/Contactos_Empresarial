// src/app/components/contact-list/contact-list.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Contacto, FilterCriteria } from '../../models/contacto.model';
import { ContactService } from '../../services/contact.service';
import { ContactFilterComponent } from '../contact-filter/contact-filter.component';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContactFilterComponent,
    ContactDetailsComponent
  ],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  animations: [
    trigger('filterAnimation', [
      state('hidden', style({
        opacity: 0,
        height: '0px',
        padding: '0px'
      })),
      state('visible', style({
        opacity: 1,
        height: '*'
      })),
      transition('hidden => visible', [
        animate('300ms ease-out')
      ]),
      transition('visible => hidden', [
        animate('200ms ease-in')
      ])
    ])
  ]
})
export class ContactListComponent implements OnInit {
  contacts: Contacto[] = [];
  filteredContacts: Contacto[] = [];
  showFilters: boolean = false;
  selectedContact?: Contacto;
  showDetails = false;
  successMessage: string | null = null;

  constructor(
    private service: ContactService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    console.log('Iniciando carga de contactos...');
    this.service.getAll().subscribe({
      next: (contacts: Contacto[]) => {
        console.log('Contactos recibidos:', contacts);
        this.contacts = contacts;
        this.filteredContacts = contacts;
      },
      error: (error: any) => {
        console.error('Error al cargar contactos:', error);
      }
    });
  }

  onDelete(id: number) {
    const confirmation = confirm('¿Estás seguro que deseas eliminar este contacto? Esta acción no se puede deshacer.');
    if (confirmation) {
      this.service.delete(id).subscribe({
        next: () => {
          this.loadContacts();
          this.showSuccessNotification('Contacto eliminado correctamente');
        },
        error: (error: any) => {
          console.error('Error al eliminar el contacto:', error);
          this.showErrorMessage('No se pudo eliminar el contacto');
        }
      });
    }
  }

  onEdit(id: number) {
    this.router.navigate(['/contactos/editar', id]);
  }

  onSearch(term: string) {
    if (!term) {
      this.filteredContacts = this.contacts;
    } else {
      this.filteredContacts = this.contacts.filter(contact =>
        contact.nombre.toLowerCase().includes(term.toLowerCase()) ||
        contact.email?.toLowerCase().includes(term.toLowerCase()) ||
        contact.telefono.toLowerCase().includes(term.toLowerCase())
      );
    }
  }

  onFilterChange(criteria: FilterCriteria) {
    this.filteredContacts = this.contacts.filter(contact => {
      const matchesSearch = !criteria.searchTerm ||
        contact.nombre.toLowerCase().includes(criteria.searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(criteria.searchTerm.toLowerCase()) ||
        contact.telefono.toLowerCase().includes(criteria.searchTerm.toLowerCase());

      const matchesTipoContacto = !criteria.tipoContacto ||
        contact.tipo_contacto === criteria.tipoContacto;

      const matchesDetalleTipo = !criteria.detalleTipo ||
        contact.detalle_tipo === criteria.detalleTipo;

      return matchesSearch && matchesTipoContacto && matchesDetalleTipo;
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onOpen(id: number) {
    const contact = this.contacts.find(c => c.id === id);
    if (contact) {
      this.selectedContact = contact;
      this.showDetails = true;
    }
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedContact = undefined;
  }

  downloadCSV(): void {
    if (this.filteredContacts.length === 0) {
      this.showErrorMessage('No hay contactos para exportar');
      return;
    }

    try {
      this.service.exportToCSV(this.filteredContacts);
      this.showSuccessNotification('¡Descarga completada!');
    } catch (error) {
      console.error('Error al exportar contactos:', error);
      this.showErrorMessage('Error al descargar el archivo CSV');
    }
  }

  private showSuccessNotification(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  private showErrorMessage(message: string): void {
    alert(message);
  }
}
