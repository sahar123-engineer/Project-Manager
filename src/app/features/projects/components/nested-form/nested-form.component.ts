import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidationService } from '../../../../core/validation.service';
import { ShowErrorDirective } from '../../../../core/show-error.directive';

/**
 * Validateur personnalisé pour vérifier qu'au moins une adresse est présente
 */
function minAddressesValidator(control: AbstractControl): ValidationErrors | null {
  const formArray = control as FormArray;
  return formArray.length >= 1 ? null : { minAddresses: true };
}

@Component({
  selector: 'app-nested-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ShowErrorDirective],
  templateUrl: './nested-form.component.html',
  styleUrl: './nested-form.component.css'
})
export class NestedFormComponent implements OnInit {
  userForm!: FormGroup;
  submitted = false;

  // Types d'adresses disponibles
  addressTypes = [
    { value: 'domicile', label: 'Domicile', icon: '' },
    { value: 'travail', label: 'Travail', icon: '' },
    { value: 'autre', label: 'Autre', icon: '' }
  ];

  constructor(
    private fb: FormBuilder,
    public validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialise le formulaire avec FormGroup imbriqué ET FormArray d'adresses
   * Combine Question 1 (FormGroup imbriqué) et Question 2 (FormArray)
   */
  private initForm(): void {
    this.userForm = this.fb.group({
      // Informations personnelles
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      
      // FormArray d'adresses (Question 2)
      // Chaque adresse est un FormGroup avec type, rue, codePostal, ville
      adresses: this.fb.array(
        [this.createAddressGroup()],
        [minAddressesValidator]
      )
    });
  }

  /**
   * Crée un nouveau FormGroup pour une adresse
   */
  createAddressGroup(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      rue: ['', [Validators.required, Validators.minLength(5)]],
      codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      ville: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  // ==================== GETTERS ====================

  /**
   * Getter pour accéder au FormControl "nom"
   */
  get nom() {
    return this.userForm.get('nom');
  }

  /**
   * Getter pour accéder au FormControl "prenom"
   */
  get prenom() {
    return this.userForm.get('prenom');
  }

  /**
   * Getter pour accéder au FormControl "email"
   */
  get email() {
    return this.userForm.get('email');
  }

  /**
   * Getter pour accéder au FormArray "adresses"
   * IMPORTANT: Cast avec "as FormArray"
   */
  get adresses(): FormArray {
    return this.userForm.get('adresses') as FormArray;
  }

  /**
   * Récupère un FormGroup d'adresse spécifique par index
   */
  getAddressGroup(index: number): FormGroup {
    return this.adresses.at(index) as FormGroup;
  }

  /**
   * Récupère l'icône correspondant au type d'adresse
   */
  getAddressIcon(index: number): string {
    const addressGroup = this.getAddressGroup(index);
    const type = addressGroup.get('type')?.value;
    const addressType = this.addressTypes.find(t => t.value === type);
    return addressType?.icon || '';
  }

  // ==================== MÉTHODES POUR FORMARRAY ====================

  /**
   * Ajoute une nouvelle adresse au FormArray
   */
  addAddress(): void {
    this.adresses.push(this.createAddressGroup());
  }

  /**
   * Supprime une adresse du FormArray
   */
  removeAddress(index: number): void {
    if (this.adresses.length > 1) {
      this.adresses.removeAt(index);
    }
  }

  /**
   * Vérifie si on peut supprimer une adresse
   * (au moins une adresse doit rester)
   */
  canRemoveAddress(): boolean {
    return this.adresses.length > 1;
  }

  // ==================== MÉTHODES ====================

  /**
   * Soumet le formulaire
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    console.log('Formulaire soumis:', this.userForm.value);
    
    // Affichage formaté des données
    const data = this.userForm.value;
    let message = `Formulaire valide!\n\n` +
                  `Utilisateur: ${data.nom} ${data.prenom}\n` +
                  `Email: ${data.email}\n\n` +
                  `${data.adresses.length} adresse(s):\n\n`;
    
    data.adresses.forEach((addr: any, index: number) => {
      const typeLabel = this.addressTypes.find(t => t.value === addr.type)?.label || 'Autre';
      message += `Adresse ${index + 1} (${typeLabel}):\n`;
      message += `${addr.rue}\n`;
      message += `${addr.codePostal} ${addr.ville}\n\n`;
    });

    alert(message);
  }

  /**
   * Réinitialise le formulaire
   */
  resetForm(): void {
    this.submitted = false;
    this.userForm.reset();
    
    // Réinitialise le FormArray avec une seule adresse
    while (this.adresses.length > 0) {
      this.adresses.removeAt(0);
    }
    this.adresses.push(this.createAddressGroup());
  }

  /**
   * Remplit le formulaire avec des données de test
   */
  fillTestData(): void {
    // Réinitialise d'abord le FormArray
    while (this.adresses.length > 0) {
      this.adresses.removeAt(0);
    }

    // Données personnelles
    this.userForm.patchValue({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com'
    });

    // Adresse 1: Domicile
    const address1 = this.createAddressGroup();
    address1.patchValue({
      type: 'domicile',
      rue: '123 Avenue des Champs-Élysées',
      codePostal: '75008',
      ville: 'Paris'
    });
    this.adresses.push(address1);

    // Adresse 2: Travail
    const address2 = this.createAddressGroup();
    address2.patchValue({
      type: 'travail',
      rue: '45 Rue de la République',
      codePostal: '69002',
      ville: 'Lyon'
    });
    this.adresses.push(address2);
  }

  /**
   * Marque tous les champs du FormGroup comme touchés
   * Utile pour afficher les erreurs de validation
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          }
        });
      }
    });
  }

  /**
   * Vérifie si un champ doit afficher une erreur
   */
  shouldShowError(controlName: string, parentGroup?: FormGroup): boolean {
    const group = parentGroup || this.userForm;
    const control = group.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  /**
   * Récupère le message d'erreur pour un champ
   */
  getErrorMessage(controlName: string, parentGroup?: FormGroup): string {
    const group = parentGroup || this.userForm;
    const control = group.get(controlName);
    
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Ce champ est requis';
    if (control.errors['email']) return 'Email invalide';
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    }
    if (control.errors['pattern']) {
      if (controlName === 'codePostal') return 'Code postal invalide (5 chiffres)';
    }

    return 'Champ invalide';
  }
}
