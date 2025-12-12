import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Liste simulée d'emails déjà enregistrés
  private existingEmails = [
    'test@example.com',
    'admin@example.com',
    'user@example.com',
    'contact@example.com'
  ];

  constructor() { }

  /**
   * Vérifie si un email existe déjà dans la base de données
   * Simule un appel API avec un délai de 1 seconde
   * @param email - L'email à vérifier
   * @returns Observable<boolean> - true si l'email existe, false sinon
   */
  checkEmailExists(email: string): Observable<boolean> {
    // Normaliser l'email en minuscules pour la comparaison
    const normalizedEmail = email.toLowerCase().trim();
    
    // Vérifier si l'email existe dans la liste
    const exists = this.existingEmails.includes(normalizedEmail);
    
    // Retourner un Observable avec un délai de 1 seconde pour simuler un appel API
    return of(exists).pipe(delay(1000));
  }

  /**
   * Ajouter un email à la liste (pour simulation)
   * @param email - L'email à ajouter
   */
  addEmail(email: string): void {
    const normalizedEmail = email.toLowerCase().trim();
    if (!this.existingEmails.includes(normalizedEmail)) {
      this.existingEmails.push(normalizedEmail);
    }
  }

  /**
   * Obtenir la liste des emails existants (pour debug)
   * @returns string[] - Liste des emails
   */
  getExistingEmails(): string[] {
    return [...this.existingEmails];
  }
}
