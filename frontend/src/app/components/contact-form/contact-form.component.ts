// src/app/components/contact-form/contact-form.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { Contacto } from '../../models/contacto.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule  // para [formGroup] en la plantilla
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  @Input() contacto?: Contacto;             // recibe datos del padre :contentReference[oaicite:0]{index=0}
  @Output() saved = new EventEmitter<void>(); // emite evento al padre :contentReference[oaicite:1]{index=1}

  constructor(
    private fb: FormBuilder,
    private service: ContactService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: [''],
      lugar: [''],
      parentesco: [''],
      categoria: ['']
    });
  }

  ngOnInit(): void {
    // Si viene un contacto, rellenamos el formulario
    if (this.contacto) {
      this.form.patchValue(this.contacto);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulario válido, datos:', this.form.value); // Debug
      this.loading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const request$ = this.contacto
        ? this.service.update(this.contacto.id!, this.form.value)
        : this.service.create(this.form.value);

      request$.subscribe({
        next: (response) => {
          console.log('Respuesta exitosa:', response); // Debug
          this.successMessage = 'Contacto guardado exitosamente';
          this.loading = false;
          this.saved.emit();
          this.form.reset();
        },
        error: (err) => {
          console.error('Error detallado:', err); // Debug mejorado
          this.errorMessage = `Error al guardar el contacto: ${err.message}`;
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
      this.successMessage = null;
    }
  }

  onCancel(): void {
    this.form.reset();
    this.errorMessage = null;
    this.successMessage = null;
  }
}
