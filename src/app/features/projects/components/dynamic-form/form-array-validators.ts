import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validateur personnalisé pour vérifier qu'au moins 3 compétences sont présentes
 * si au moins une compétence a été ajoutée
 */
export function minCompetencesValidator(min: number = 3): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    const competences = formArray.value;

    // Si aucune compétence n'a été ajoutée, pas d'erreur
    if (!competences || competences.length === 0) {
      return null;
    }

    // Si au moins une compétence existe, vérifier qu'il y en a au moins 'min'
    if (competences.length < min) {
      return {
        minCompetences: {
          required: min,
          current: competences.length
        }
      };
    }

    return null;
  };
}
