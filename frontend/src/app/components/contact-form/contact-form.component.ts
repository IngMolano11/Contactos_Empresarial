// src/app/components/contact-form/contact-form.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  isEditing = false;
  contactId?: number;

  @Input() contacto?: Contacto;             // recibe datos del padre :contentReference[oaicite:0]{index=0}
  @Output() saved = new EventEmitter<void>(); // emite evento al padre :contentReference[oaicite:1]{index=1}

  constructor(
    private fb: FormBuilder,
    private service: ContactService,
    private route: ActivatedRoute,
    private router: Router
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
    // Obtener el ID del contacto de la URL si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.contactId = +id;
      this.loadContact(this.contactId);
    } else if (this.contacto) {
      this.form.patchValue(this.contacto);
    }
  }

  loadContact(id: number) {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: (contacto) => {
        this.form.patchValue(contacto);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar contacto:', error);
        this.errorMessage = 'Error al cargar el contacto';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const request$ = this.isEditing && this.contactId
        ? this.service.update(this.contactId, this.form.value)
        : this.service.create(this.form.value);

      request$.subscribe({
        next: () => {
          this.successMessage = 'Contacto guardado exitosamente';
          this.loading = false;
          // Redirigir a la lista después de guardar
          setTimeout(() => this.router.navigate(['/contactos']), 1500);
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = `Error al ${this.isEditing ? 'actualizar' : 'crear'} el contacto`;
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
      this.successMessage = null;
    }
  }

  onCancel(): void {
    this.router.navigate(['/contactos']);
  }
}
