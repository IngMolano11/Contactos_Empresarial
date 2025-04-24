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
  parentescoOptions = ['Familiar', 'Amoroso', 'Amistad', 'Laboral', 'Educativo', 'Otro'];
  categoriaOptions = ['Personal', 'Profesional', 'Educativo', 'Social', 'Salud', 'Financiero', 'Emergencia', 'Otro'];

  @Input() contacto?: Contacto;             // recibe datos del padre :contentReference[oaicite:0]{index=0}
  @Output() saved = new EventEmitter<void>(); // emite evento al padre :contentReference[oaicite:1]{index=1}

  constructor(
    private fb: FormBuilder,
    private service: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
      email: ['', [Validators.email]],
      direccion: [''],
      lugar: [''],
      parentesco: [''],
      parentescoOtro: [''],
      categoria: [''],
      categoriaOtro: ['']
    });

    // Observar cambios en parentesco
    this.form.get('parentesco')?.valueChanges.subscribe(value => {
      const otroControl = this.form.get('parentescoOtro');
      if (value === 'Otro') {
        otroControl?.setValidators(Validators.required);
      } else {
        otroControl?.clearValidators();
        otroControl?.setValue('');
      }
      otroControl?.updateValueAndValidity();
    });

    // Observar cambios en categoria
    this.form.get('categoria')?.valueChanges.subscribe(value => {
      const otroControl = this.form.get('categoriaOtro');
      if (value === 'Otro') {
        otroControl?.setValidators(Validators.required);
      } else {
        otroControl?.clearValidators();
        otroControl?.setValue('');
      }
      otroControl?.updateValueAndValidity();
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
      console.log('Formulario a enviar:', this.form.value);
      this.loading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const contactData = {
        nombre: this.form.value.nombre,
        telefono: this.form.value.telefono,
        email: this.form.value.email || null,
        direccion: this.form.value.direccion || null,
        lugar: this.form.value.lugar || null,
        parentesco: this.form.value.parentesco || null,
        parentescoOtro: this.form.value.parentescoOtro || null,
        categoria: this.form.value.categoria || null,
        categoriaOtro: this.form.value.categoriaOtro || null
      };

      // Determinar si estamos creando o actualizando
      const request$ = this.isEditing && this.contactId
        ? this.service.update(this.contactId, contactData)
        : this.service.create(contactData);

      request$.subscribe({
        next: (response) => {
          console.log('Contacto guardado:', response);
          this.successMessage = `Contacto ${this.isEditing ? 'actualizado' : 'creado'} exitosamente`;
          this.loading = false;
          // Navegar de vuelta a la lista después de un breve delay
          setTimeout(() => this.router.navigate(['/contactos']), 1500);
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage = error.error?.detail || `Error al ${this.isEditing ? 'actualizar' : 'crear'} el contacto`;
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/contactos']);
  }
}
