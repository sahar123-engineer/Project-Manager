import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../core/toast.service';
import { ProjectService } from '../../../../core/project.service';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {
  @Output() projectAdded = new EventEmitter<any>();

  private toast = inject(ToastService);
  private projectService = inject(ProjectService);

  project = {
    name: '',
    description: '',
    status: '',
    category: '',
    subCategory: ''
  };

  // Catégories et sous-catégories
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
    const category = this.categories.find(c => c.name === this.project.category);
    return category ? category.subCategories : [];
  }

  // Reset sous-catégorie quand la catégorie change
  onCategoryChange(): void {
    this.project.subCategory = '';
  }

  onSubmit(form: any): void {
    console.log('🎯 onSubmit appelé');
    
    if (form.valid) {
      console.log('✅ Formulaire valide');
      
      const newProject = {
        name: this.project.name,
        description: this.project.description,
        status: this.project.status,
        category: this.project.category,
        subCategory: this.project.subCategory,
        createdAt: new Date(),
        tasks: []
      };
      
      console.log('📦 Nouveau projet:', newProject);
      
      this.projectService.addProject(newProject);
      this.projectAdded.emit(newProject);
      
      this.toast.show(`Le projet "${this.project.name}" a été créé avec succès !`, 3000, 'success');
      
      form.reset();
      this.project = { name: '', description: '', status: '', category: '', subCategory: '' };
    } else {
      console.error('❌ Formulaire invalide');
    }
  }

  onReset(form: any): void {
    form.reset();
    this.project = { name: '', description: '', status: '', category: '', subCategory: '' };
  }
}
