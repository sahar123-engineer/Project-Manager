import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { passwordStrengthValidator, matchPasswordValidator, emailExistsValidator } from './custom-validators';
import { UserService } from '../../../../core/user.service';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  existingEmails: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    // Récupérer la liste des emails existants pour info
    this.existingEmails = this.userService.getExistingEmails();
  }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      nom: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      prenom: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      email: ['', 
        [
          Validators.required,
          Validators.email
        ],
        [
          emailExistsValidator(this.userService) // Validateur asynchrone
        ]
      ],
      telephone: ['', [
        Validators.pattern(/^0[1-9][0-9]{8}$/)
      ]],
      password: ['', [
        Validators.required,
        passwordStrengthValidator()
      ]],
      confirmPassword: ['', [
        Validators.required
      ]],
      message: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
    }, {
      validators: matchPasswordValidator('password', 'confirmPassword')
    });
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get nom() {
    return this.contactForm.get('nom');
  }

  get prenom() {
    return this.contactForm.get('prenom');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get telephone() {
    return this.contactForm.get('telephone');
  }

  get password() {
    return this.contactForm.get('password');
  }

  get confirmPassword() {
    return this.contactForm.get('confirmPassword');
  }

  get message() {
    return this.contactForm.get('message');
  }

  // Méthodes pour basculer la visibilité des mots de passe
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Formulaire soumis:', this.contactForm.value);
      // Réinitialiser le formulaire après soumission
      this.contactForm.reset();
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
}
