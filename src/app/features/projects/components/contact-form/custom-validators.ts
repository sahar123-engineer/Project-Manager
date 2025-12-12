import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { UserService } from '../../../../core/user.service';

/**
 * Validateur asynchrone pour vérifier si un email existe déjà
 * @param userService - Instance du service UserService
 * @returns AsyncValidatorFn
 */
export function emailExistsValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    // Appeler le service pour vérifier si l'email existe
    return userService.checkEmailExists(control.value).pipe(
      map(exists => {
        // Si l'email existe, retourner une erreur
        return exists ? { emailExists: { value: control.value } } : null;
      })
    );
  };
}

/**
 * Validateur personnalisé pour la force du mot de passe
 * Vérifie que le mot de passe contient :
 * - Au moins une majuscule
 * - Au moins une minuscule
 * - Au moins un chiffre
 * - Au moins un caractère spécial
 * - Minimum 8 caractères
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Ne pas valider si le champ est vide (utiliser Validators.required pour ça)
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinLength = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && hasMinLength;

    if (!passwordValid) {
      return {
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasSpecialChar,
          hasMinLength
        }
      };
    }

    return null;
  };
}

/**
 * Validateur personnalisé pour vérifier que deux champs correspondent
 * (typiquement pour mot de passe et confirmation)
 * @param controlName - Nom du contrôle principal (ex: 'password')
 * @param matchingControlName - Nom du contrôle à comparer (ex: 'confirmPassword')
 */
export function matchPasswordValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    // Retourner null si le contrôle de correspondance a déjà une erreur différente
    if (matchingControl.errors && !matchingControl.errors['passwordMismatch']) {
      return null;
    }

    // Vérifier si les valeurs correspondent
    if (control.value !== matchingControl.value) {
      // Ajouter l'erreur au contrôle de confirmation
      matchingControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Supprimer l'erreur si les mots de passe correspondent
      matchingControl.setErrors(null);
      return null;
    }
  };
}
