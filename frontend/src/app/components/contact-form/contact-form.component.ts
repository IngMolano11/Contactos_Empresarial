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

  @Input() contacto?: Contacto;             // recibe datos del padre :contentReference[oaicite:0]{index=0}
  @Output() saved = new EventEmitter<void>(); // emite evento al padre :contentReference[oaicite:1]{index=1}

  constructor(
    private fb: FormBuilder,
    private service: ContactService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.email]],
      direccion: [''],
      lugar: [''],
      parentesco: ['Amigo'],
      categoria: ['Profesional']
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
      const request$ = this.contacto
        ? this.service.update(this.contacto.id!, this.form.value)
        : this.service.create(this.form.value);

      request$.subscribe({
        next: () => {
          // Emitimos al padre y limpiamos
          this.saved.emit();
          this.form.reset();
        },
        error: err => {
          console.error('Error al guardar contacto:', err);
        }
      });
    }
  }
}
