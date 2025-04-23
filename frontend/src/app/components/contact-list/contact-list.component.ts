// src/app/components/contact-list/contact-list.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Contacto } from '../../models/contacto.model';
import { ContactService } from '../../services/contact.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contacto[] = [];

  constructor(
    private service: ContactService,
    private router: Router
  ) {}

  ngOnInit() {
    this.service.getAll()
      .subscribe((data: Contacto[]) => this.contacts = data);
  }

  onDelete(id: number) {
    if (confirm('¿Eliminar contacto?')) {
      this.service.delete(id)
        .subscribe(() =>
          this.contacts = this.contacts.filter(c => c.id !== id)
        );
    }
  }

  onEdit(id: number) {
    this.router.navigate(['/contactos/editar', id]);
  }
}
