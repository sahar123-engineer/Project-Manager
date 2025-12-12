import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appShowError]',
  standalone: true
})
export class ShowErrorDirective implements OnInit, OnDestroy {
  @Input() appShowError: AbstractControl | null = null;
  @Input() appShowErrorErrorType: string = '';
  
  private statusChangeSubscription?: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.updateView();

    // S'abonner aux changements de statut pour mettre à jour la vue dynamiquement
    if (this.appShowError) {
      this.statusChangeSubscription = this.appShowError.statusChanges.subscribe(() => {
        this.updateView();
      });
    }
  }

  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites mémoire
    if (this.statusChangeSubscription) {
      this.statusChangeSubscription.unsubscribe();
    }
  }

  /**
   * Met à jour la vue en fonction de l'état du contrôle
   */
  private updateView(): void {
    const shouldShow = this.shouldShowError();

    if (shouldShow && this.viewContainer.length === 0) {
      // Afficher le template
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (!shouldShow && this.viewContainer.length > 0) {
      // Cacher le template
      this.viewContainer.clear();
    }
  }

  /**
   * Vérifie si l'erreur doit être affichée
   */
  private shouldShowError(): boolean {
    if (!this.appShowError) {
      return false;
    }

    const hasError = this.appShowErrorErrorType 
      ? this.appShowError.hasError(this.appShowErrorErrorType)
      : this.appShowError.invalid;

    const isTouched = this.appShowError.touched || this.appShowError.dirty;

    return hasError && isTouched;
  }
}
