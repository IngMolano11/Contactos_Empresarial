// src/app/components/contact-list/contact-list.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Contacto } from '../../models/contacto.model';
import { ContactService } from '../../services/contact.service';
import { Router, RouterModule } from '@angular/router';
import { ContactFilterComponent } from '../contact-filter/contact-filter.component';

interface FilterCriteria {
  searchTerm: string;
  parentesco: string;
  categoria: string;
}

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContactFilterComponent
  ],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contacto[] = [];
  filteredContacts: Contacto[] = [];

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
      next: (data: Contacto[]) => {
        console.log('Contactos recibidos:', data);
        this.contacts = data;
        this.filteredContacts = data;
      },
      error: (error) => {
        console.error('Error al cargar contactos:', error);
      }
    });
  }

  onDelete(id: number) {
    if (confirm('¿Eliminar contacto?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.contacts = this.contacts.filter(c => c.id !== id);
          this.filteredContacts = this.contacts;
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
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

      const matchesParentesco = !criteria.parentesco ||
        contact.parentesco === criteria.parentesco;

      const matchesCategoria = !criteria.categoria ||
        contact.categoria === criteria.categoria;

      return matchesSearch && matchesParentesco && matchesCategoria;
    });
  }
}
