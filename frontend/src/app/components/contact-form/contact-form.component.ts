import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { Contacto } from '../../models/contacto.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  form: FormGroup;
  @Input() contacto?: Contacto;
  @Output() saved = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private service: ContactService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.email]],
      direccion: ['', Validators.required],
      lugar: ['', Validators.required],
      parentesco: ['Amigo', Validators.required],
      categoria: ['Profesional', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.contacto) {
      this.form.patchValue(this.contacto);
    }
  }

  onSubmit(): void {
    const fn = this.contacto
      ? this.service.update(this.contacto.id!, this.form.value)
      : this.service.create(this.form.value);

    fn.subscribe(() => this.saved.emit());
  }
}
