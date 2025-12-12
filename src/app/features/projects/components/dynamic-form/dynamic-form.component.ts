import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { minCompetencesValidator } from './form-array-validators';

/**
 * Composant démontrant l'utilisation de FormArray pour gérer des champs dynamiques
 * - Ajout/suppression d'emails dynamiquement
 * - Gestion des compétences avec validation personnalisée
 */
@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.css'
})
export class DynamicFormComponent implements OnInit {
  dynamicForm!: FormGroup;

  // Types d'email disponibles
  emailTypes = ['Personnel', 'Professionnel', 'Autre'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.dynamicForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      
      // FormArray pour les emails
      emails: this.fb.array(
        [this.createEmailControl()], // Au moins un email par défaut
        []
      ),
      
      // FormArray pour les compétences avec validation personnalisée
      competences: this.fb.array(
        [],
        [minCompetencesValidator(3)] // Au moins 3 compétences si au moins une est ajoutée
      )
    });
  }

  // ===== MÉTHODES POUR CRÉER DES CONTRÔLES =====

  /**
   * Crée un nouveau FormGroup pour un email
   * Retourne un FormGroup avec les champs 'email' et 'type'
   */
  createEmailControl(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      type: ['Personnel', [Validators.required]]
    });
  }

  /**
   * Crée un nouveau FormGroup pour une compétence
   * Retourne un FormGroup avec les champs 'nom' et 'niveau'
   */
  createCompetenceControl(): FormGroup {
    return this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      niveau: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  // ===== GETTERS POUR ACCÉDER AUX FORMARRAYS =====

  /**
   * Getter pour accéder au FormArray des emails
   * Utilisation dans le template : emails.controls, emails.length, etc.
   */
  get emails(): FormArray {
    return this.dynamicForm.get('emails') as FormArray;
  }

  /**
   * Getter pour accéder au FormArray des compétences
   */
  get competences(): FormArray {
    return this.dynamicForm.get('competences') as FormArray;
  }

  /**
   * Getter pour le nom
   */
  get nom() {
    return this.dynamicForm.get('nom');
  }

  // ===== MÉTHODES POUR GÉRER LES EMAILS =====

  /**
   * Ajoute un nouveau champ email au FormArray
   */
  addEmail(): void {
    this.emails.push(this.createEmailControl());
    console.log('✅ Email ajouté. Total:', this.emails.length);
  }

  /**
   * Supprime un email du FormArray à l'index spécifié
   * @param index - Index de l'email à supprimer
   */
  removeEmail(index: number): void {
    if (this.emails.length > 1) {
      this.emails.removeAt(index);
      console.log('🗑️ Email supprimé à l\'index', index, '. Total:', this.emails.length);
    } else {
      console.warn('⚠️ Impossible de supprimer le dernier email');
    }
  }

  /**
   * Récupère un FormGroup email à un index donné
   */
  getEmailAt(index: number): FormGroup {
    return this.emails.at(index) as FormGroup;
  }

  // ===== MÉTHODES POUR GÉRER LES COMPÉTENCES =====

  /**
   * Ajoute une nouvelle compétence au FormArray
   */
  addCompetence(): void {
    this.competences.push(this.createCompetenceControl());
    console.log('✅ Compétence ajoutée. Total:', this.competences.length);
  }

  /**
   * Supprime une compétence du FormArray à l'index spécifié
   * @param index - Index de la compétence à supprimer
   */
  removeCompetence(index: number): void {
    this.competences.removeAt(index);
    console.log('🗑️ Compétence supprimée à l\'index', index, '. Total:', this.competences.length);
  }

  /**
   * Récupère un FormGroup compétence à un index donné
   */
  getCompetenceAt(index: number): FormGroup {
    return this.competences.at(index) as FormGroup;
  }

  // ===== MÉTHODES UTILITAIRES =====

  /**
   * Soumet le formulaire
   */
  onSubmit(): void {
    console.log('🚀 Tentative de soumission...');

    if (this.dynamicForm.invalid) {
      console.warn('⚠️ Formulaire invalide');
      this.markFormGroupTouched(this.dynamicForm);
      return;
    }

    console.log('✅ Formulaire valide !');
    console.log('📋 Données:', this.dynamicForm.value);

    alert(`Formulaire soumis avec succès !\n\n` +
          `Nom: ${this.nom?.value}\n` +
          `Emails: ${this.emails.length}\n` +
          `Compétences: ${this.competences.length}`);
  }

  /**
   * Marque tous les contrôles comme touchés (y compris dans les FormArrays)
   */
  markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Réinitialise le formulaire
   */
  resetForm(): void {
    // Vider les FormArrays
    while (this.emails.length > 1) {
      this.emails.removeAt(this.emails.length - 1);
    }
    while (this.competences.length > 0) {
      this.competences.removeAt(0);
    }

    // Réinitialiser le formulaire
    this.dynamicForm.reset({
      nom: '',
      emails: [{ email: '', type: 'Personnel' }]
    });

    console.log('🔄 Formulaire réinitialisé');
  }

  /**
   * Remplit le formulaire avec des données de test
   */
  fillTestData(): void {
    // Remplir le nom
    this.dynamicForm.patchValue({ nom: 'John Doe' });

    // Remplir les emails
    while (this.emails.length > 1) {
      this.emails.removeAt(this.emails.length - 1);
    }
    this.emails.at(0).patchValue({
      email: 'john.doe@personal.com',
      type: 'Personnel'
    });
    this.addEmail();
    this.emails.at(1).patchValue({
      email: 'john.doe@work.com',
      type: 'Professionnel'
    });

    // Remplir les compétences
    while (this.competences.length > 0) {
      this.competences.removeAt(0);
    }
    const testCompetences = [
      { nom: 'JavaScript', niveau: 5 },
      { nom: 'TypeScript', niveau: 4 },
      { nom: 'Angular', niveau: 5 }
    ];
    testCompetences.forEach(comp => {
      const competenceGroup = this.createCompetenceControl();
      competenceGroup.patchValue(comp);
      this.competences.push(competenceGroup);
    });

    console.log('✅ Données de test chargées');
  }

  /**
   * Obtenir le label d'étoiles pour un niveau
   */
  getStarsLabel(niveau: number): string {
    return '⭐'.repeat(niveau);
  }
}
