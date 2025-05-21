import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contacto } from '../../models/contacto.model';
import { environment } from '../../../environments/environment';

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

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '';
    // Remover el /api/contactos de la ruta
    return imageUrl.startsWith('http') ? 
      imageUrl : 
      `${environment.apiUrl.replace('/api/contactos', '')}${imageUrl}`;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/default-avatar.png'; // Imagen por defecto
    console.error('Error al cargar la imagen:', event);
  }
}
