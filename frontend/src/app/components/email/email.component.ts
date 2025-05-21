import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { Contacto } from '../../models/contacto.model';
import { ContactSelectorComponent } from '../contact-selector/contact-selector.component';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContactSelectorComponent
  ],
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  emailForm: FormGroup;
  selectedRecipients: string[] = [];
  showContactSelector = false;
  selectedFiles: File[] = [];
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.emailForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Código para ejecutar al inicializar el componente
  }

  onFilesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
  }

  addRecipient(email: string): void {
    if (!this.selectedRecipients.includes(email)) {
      this.selectedRecipients.push(email);
    }
    this.toggleContactSelector(); // Cerrar el selector después de añadir
  }

  removeRecipient(email: string): void {
    this.selectedRecipients = this.selectedRecipients.filter(e => e !== email);
  }

  toggleContactSelector(): void {
    this.showContactSelector = !this.showContactSelector;
  }

  onSubmit(): void {
    if (this.emailForm.valid && this.selectedRecipients.length > 0) {
      this.loading = true;
      this.errorMessage = null;

      const formData = new FormData();
      formData.append('subject', this.emailForm.get('subject')?.value);
      formData.append('message', this.emailForm.get('message')?.value);
      formData.append('recipients', JSON.stringify(this.selectedRecipients));

      this.selectedFiles.forEach((file, index) => {
        formData.append(`attachments`, file);
      });

      // TODO: Implementar el servicio de email
      console.log('Enviando email:', formData);

      // Simulación de envío exitoso
      setTimeout(() => {
        this.loading = false;
        this.successMessage = 'Email enviado correctamente';
        this.emailForm.reset();
        this.selectedRecipients = [];
        this.selectedFiles = [];
      }, 2000);
    } else {
      this.errorMessage = 'Por favor complete todos los campos requeridos y añada al menos un destinatario';
    }
  }
}
