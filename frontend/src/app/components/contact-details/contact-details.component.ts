import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contacto } from '../../models/contacto.model';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent {
  @Input() contact?: Contacto;
  @Input() onClose: () => void = () => {};
}
