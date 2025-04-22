// src/app/components/contact-list/contact-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contacto } from '../../models/contacto.model';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contacto[] = [];

  constructor(private service: ContactService) {}

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
}
