import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  /**
   * Retourne le message d'erreur approprié pour un contrôle
   */
  getErrorMessage(control: AbstractControl | null): string {
    if (!control || !control.errors) {
      return '';
    }

    const errors = control.errors;

    // Messages pour les validateurs standard
    if (errors['required']) {
      return 'Ce champ est requis';
    }
    
    if (errors['email']) {
      return 'Email invalide';
    }
    
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `Minimum ${requiredLength} caractères requis`;
    }
    
    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      return `Maximum ${requiredLength} caractères autorisés`;
    }
    
    if (errors['min']) {
      const min = errors['min'].min;
      return `La valeur minimale est ${min}`;
    }
    
    if (errors['max']) {
      const max = errors['max'].max;
      return `La valeur maximale est ${max}`;
    }
    
    if (errors['pattern']) {
      return 'Format invalide';
    }

    // Messages pour les validateurs personnalisés
    if (errors['passwordStrength']) {
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial';
    }
    
    if (errors['mustMatch']) {
      return 'Les mots de passe ne correspondent pas';
    }
    
    if (errors['emailExists']) {
      return 'Cet email existe déjà';
    }

    if (errors['minAddresses']) {
      return 'Au moins une adresse est requise';
    }

    // Message par défaut si l'erreur n'est pas reconnue
    return 'Valeur invalide';
  }

  /**
   * Vérifie si un contrôle a une erreur spécifique et est touché
   */
  hasError(control: AbstractControl | null, errorType: string): boolean {
    if (!control) {
      return false;
    }
    return control.hasError(errorType) && (control.touched || control.dirty);
  }

  /**
   * Vérifie si un contrôle doit afficher une erreur (touché ou soumis)
   */
  shouldShowError(control: AbstractControl | null, submitted: boolean = false): boolean {
    if (!control) {
      return false;
    }
    return control.invalid && (control.touched || submitted);
  }

  /**
   * Retourne le nombre d'erreurs sur un contrôle
   */
  getErrorCount(control: AbstractControl | null): number {
    if (!control || !control.errors) {
      return 0;
    }
    return Object.keys(control.errors).length;
  }

  /**
   * Retourne tous les messages d'erreur pour un contrôle
   */
  getAllErrorMessages(control: AbstractControl | null): string[] {
    if (!control || !control.errors) {
      return [];
    }

    const messages: string[] = [];
    const errors = Object.keys(control.errors);

    errors.forEach(errorType => {
      const tempControl = { errors: { [errorType]: control.errors![errorType] } } as AbstractControl;
      messages.push(this.getErrorMessage(tempControl));
    });

    return messages;
  }

  /**
   * Permet d'étendre le service avec des messages d'erreur personnalisés
   */
  private customErrorMessages: { [key: string]: (error: any) => string } = {};

  setErrorMessage(errorType: string, messageFn: (error: any) => string): void {
    this.customErrorMessages[errorType] = messageFn;
  }
}
