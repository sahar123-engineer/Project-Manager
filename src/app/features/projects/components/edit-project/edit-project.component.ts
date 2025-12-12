import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent implements OnChanges {
  @Input() project: any = null; // Projet à modifier
  @Output() projectUpdated = new EventEmitter<any>(); // Émettre quand terminé
  @Output() cancelled = new EventEmitter<void>(); // Émettre quand annulé

  // Copie locale pour Two-Way Data Binding sans modifier l'original directement
  editedProject: any = {};

  // Catégories et sous-catégories (même structure que add-project)
  categories = [
    {
      name: 'Développement',
      subCategories: ['Application Web', 'Application Mobile', 'API/Backend', 'Desktop']
    },
    {
      name: 'Design',
      subCategories: ['UI/UX', 'Branding', 'Illustration', 'Motion Design']
    },
    {
      name: 'Marketing',
      subCategories: ['SEO', 'Réseaux Sociaux', 'Email Marketing', 'Publicité']
    },
    {
      name: 'Business',
      subCategories: ['Stratégie', 'Finance', 'Ventes', 'Ressources Humaines']
    }
  ];

  // Sous-catégories filtrées selon la catégorie sélectionnée
  get filteredSubCategories(): string[] {
    const category = this.categories.find(c => c.name === this.editedProject.category);
    return category ? category.subCategories : [];
  }

  // Reset sous-catégorie quand la catégorie change
  onCategoryChange(): void {
    this.editedProject.subCategory = '';
  }

  ngOnChanges(): void {
    // Quand le projet change, créer une copie pour l'édition
    if (this.project) {
      this.editedProject = { ...this.project };
    }
  }

  onSubmit(form: any): void {
    if (form.valid) {
      // Émettre le projet modifié
      this.projectUpdated.emit(this.editedProject);
    }
  }

  onCancel(): void {
    // Émettre l'événement d'annulation
    this.cancelled.emit();
  }
}
