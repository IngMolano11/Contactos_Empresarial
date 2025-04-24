import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authForm: FormGroup;
  isSignup = false;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleMode(signup: boolean) {
    this.isSignup = signup;
    this.error = null;
    if (signup) {
      this.authForm.get('username')?.setValidators(Validators.required);
    } else {
      this.authForm.get('username')?.clearValidators();
    }
    this.authForm.get('username')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.loading = true;
      this.error = null;

      const credentials = this.authForm.value;
      const request$ = this.isSignup
        ? this.authService.signup(credentials)
        : this.authService.login(credentials);

      request$.subscribe({
        next: () => {
          this.router.navigate(['/contactos']);
        },
        error: (err) => {
          this.error = err.error?.detail || 'Error en la autenticación';
          this.loading = false;
        }
      });
    }
  }
}
