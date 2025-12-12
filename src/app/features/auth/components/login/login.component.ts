import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialize the login form with validators
   */
  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Getters for form controls
   */
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const credentials: LoginCredentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.successMessage = response.message || 'Connexion réussie!';
          console.log('Login successful:', response);
          // Navigate to projects page
          setTimeout(() => {
            this.router.navigate(['/projects']);
          }, 500);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Email ou mot de passe incorrect';
        console.error('Login error:', error);
      }
    });
  }

  /**
   * Check if a field should show error
   */
  shouldShowError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
