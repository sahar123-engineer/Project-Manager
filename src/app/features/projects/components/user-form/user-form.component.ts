import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Composant de formulaire utilisateur démontrant l'utilisation de FormBuilder
 * 
 * Avantages de FormBuilder par rapport à new FormGroup() :
 * 1. Syntaxe plus concise et lisible
 * 2. Moins de code répétitif (pas besoin d'instancier new FormControl à chaque fois)
 * 3. Structure plus claire et maintenable
 * 4. Facilite la lecture et la compréhension du code
 * 5. Réduit les risques d'erreurs de syntaxe
 * 
 * Exemple de comparaison :
 * 
 * SANS FormBuilder (verbeux) :
 * this.form = new FormGroup({
 *   nom: new FormControl('', [Validators.required]),
 *   email: new FormControl('', [Validators.required, Validators.email])
 * });
 * 
 * AVEC FormBuilder (concis) :
 * this.form = this.fb.group({
 *   nom: ['', [Validators.required]],
 *   email: ['', [Validators.required, Validators.email]]
 * });
 */
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  formSubmitted = false;

  /**
   * Injection de FormBuilder dans le constructeur
   * Le modificateur 'private' le rend disponible dans toute la classe
   */
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Création du FormGroup avec FormBuilder - Syntaxe concise et lisible
    this.userForm = this.fb.group({
      nom: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      prenom: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      age: ['', [
        Validators.required,
        Validators.min(18),
        Validators.max(100)
      ]],
      ville: ['', [
        Validators.required,
        Validators.minLength(2)
      ]]
    });
  }

  // ===== GETTERS pour faciliter l'accès aux contrôles =====
  // Avantages : Code plus propre dans le template, autocomplétion IDE, refactoring facile

  /**
   * Getter pour le contrôle 'nom'
   * Utilisation dans le template : nom?.value, nom?.invalid, etc.
   */
  get nom() {
    return this.userForm.get('nom');
  }

  /**
   * Getter pour le contrôle 'prenom'
   */
  get prenom() {
    return this.userForm.get('prenom');
  }

  /**
   * Getter pour le contrôle 'email'
   */
  get email() {
    return this.userForm.get('email');
  }

  /**
   * Getter pour le contrôle 'age'
   */
  get age() {
    return this.userForm.get('age');
  }

  /**
   * Getter pour le contrôle 'ville'
   */
  get ville() {
    return this.userForm.get('ville');
  }

  // ===== MÉTHODES UTILITAIRES =====

  /**
   * Marque tous les contrôles du formulaire comme "touched"
   * Utile pour afficher toutes les erreurs lorsque l'utilisateur tente de soumettre un formulaire invalide
   */
  markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();

      // Si le contrôle est un FormGroup imbriqué, appeler récursivement
      if (control instanceof FormGroup) {
        this.markFormGroupTouched();
      }
    });
  }

  /**
   * Réinitialise le formulaire à son état initial
   * Efface toutes les valeurs et remet tous les états (touched, dirty, etc.) à leur valeur par défaut
   */
  resetForm(): void {
    this.userForm.reset();
    this.formSubmitted = false;
    console.log('✅ Formulaire réinitialisé');
  }

  /**
   * Gestion de la soumission du formulaire
   */
  onSubmit(): void {
    console.log('🚀 Tentative de soumission du formulaire...');

    // Si le formulaire est invalide, marquer tous les champs comme touched pour afficher les erreurs
    if (this.userForm.invalid) {
      console.warn('⚠️ Formulaire invalide');
      this.markFormGroupTouched();
      return;
    }

    // Si le formulaire est valide, traiter les données
    console.log('✅ Formulaire valide !');
    console.log('📋 Données du formulaire :', this.userForm.value);
    this.formSubmitted = true;

    // Simuler un traitement asynchrone
    setTimeout(() => {
      alert(`Utilisateur créé avec succès !\n\nNom: ${this.nom?.value}\nPrénom: ${this.prenom?.value}\nEmail: ${this.email?.value}\nÂge: ${this.age?.value}\nVille: ${this.ville?.value}`);
      this.resetForm();
    }, 500);
  }

  /**
   * Remplir le formulaire avec des données de test
   * Utile pour le développement et les tests
   */
  fillTestData(): void {
    this.userForm.patchValue({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      age: 25,
      ville: 'Paris'
    });
    console.log('✅ Données de test chargées');
  }

  /**
   * Afficher l'état du formulaire dans la console (pour debug)
   */
  logFormState(): void {
    console.log('📊 État du formulaire :');
    console.log('Valid:', this.userForm.valid);
    console.log('Invalid:', this.userForm.invalid);
    console.log('Touched:', this.userForm.touched);
    console.log('Dirty:', this.userForm.dirty);
    console.log('Pristine:', this.userForm.pristine);
    console.log('Value:', this.userForm.value);
    console.log('Errors:', this.userForm.errors);
  }
}
