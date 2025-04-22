import { Component } from '@angular/core';
import { Contacto } from '../../models/contacto.model';
import { ContactService } from '../../services/contact.service';


@Component({
  selector: 'app-contact-list',
  imports: [],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent {

  contacts: Contacto[] = [];
  constructor(private service: ContactService) {}
  ngOnInit() {
    this.service.getAll().subscribe((data: Contacto[]) => {
      this.contacts = data;
    });
  }
  onDelete(id: number) {
    if (confirm('¿Eliminar contacto?')) {
      this.service.delete(id).subscribe(() => this.contacts = this.contacts.filter(c => c.id !== id));
    }
}


}
