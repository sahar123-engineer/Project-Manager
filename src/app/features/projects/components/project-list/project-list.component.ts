import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TaskListComponent } from '../task-list/task-list.component';
import { ProjectDetailComponent } from '../project-detail/project-detail.component';
import { AddProjectComponent } from '../add-project/add-project.component';
import { EditProjectComponent } from '../edit-project/edit-project.component';
import { DashboardComponent } from '../../../dashboard/dashboard.component';
import { ToastService } from '../../../../core/toast.service';
import { ProjectService } from '../../../../core/project.service';
import { AuthService } from '../../../auth/services/auth.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, DashboardComponent, TaskListComponent, ProjectDetailComponent, AddProjectComponent, EditProjectComponent, FormsModule],
  animations: [
    trigger('listAnim', [
      transition(':enter', [
        query('@itemAnim, .project-card', [
          style({ opacity: 0, transform: 'translateY(-6px)' }),
          stagger(60, [
            animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
      ,
      transition(':leave', [
        animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(-6px)' }))
      ])
    ])
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit, OnDestroy {
  title = 'Gestionnaire de Projets'; // Pour interpolation
  currentDate = new Date();
  get currentDateStr() {
    return this.currentDate.toLocaleString();
  }
  totalProjects = 0;
  // Selection pour afficher les détails
  selectedProject: any | null = null;
  
  // Property pour Two-Way Binding
  searchTerm = '';
  selectedPriority = 'All';
  showAddForm = false; // Toggle pour afficher/masquer le formulaire
  showEditForm = false; // Toggle pour afficher/masquer le formulaire d'édition
  projectToEdit: any = null; // Projet en cours d'édition
  isAdmin = false; // Pour vérifier si l'utilisateur est admin
  
  projects: any[] = []; // Liste des projets (maintenant gérée par le service)
  private projectsSub?: Subscription;
  
  // Methods pour Event Binding
  constructor(
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements de la liste des projets
    this.projectsSub = this.projectService.projects$.subscribe(projects => {
      console.log('🔔 Mise à jour de la liste des projets:', projects.length);
      this.projects = projects;
      this.cdr.detectChanges();
    });
    
    // Vérifier le rôle de l'utilisateur
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.role === 'admin';
    });
  }

  ngOnDestroy(): void {
    this.projectsSub?.unsubscribe();
  }

  // Méthode appelée quand un projet est ajouté depuis le formulaire
  onProjectAdded(newProject: any): void {
    console.log('🎯 onProjectAdded appelée avec:', newProject);
    // Le projet est déjà ajouté dans add-project.component.ts
    // Pas besoin de l'ajouter une deuxième fois ici !
    this.showAddForm = false; // Fermer le formulaire après ajout
  }

  // Édition de projet
  editProject(project: any, event?: Event): void {
    if (event) { event.stopPropagation(); }
    this.projectToEdit = project;
    this.showEditForm = true;
    this.showAddForm = false; // Fermer le formulaire d'ajout si ouvert
  }

  onProjectUpdated(updatedProject: any): void {
    console.log('✅ Projet modifié:', updatedProject);
    // Trouver l'index du projet dans la liste
    const index = this.projects.findIndex(p => p === this.projectToEdit);
    if (index > -1) {
      // Mettre à jour le projet
      this.projects[index] = { ...this.projects[index], ...updatedProject };
      this.projectService.updateProject(index, this.projects[index]);
    }
    this.toast.show(`Le projet "${updatedProject.name}" a été modifié avec succès !`, 3000, 'success');
    this.showEditForm = false;
    this.projectToEdit = null;
  }

  onEditCancelled(): void {
    console.log('❌ Édition annulée');
    this.showEditForm = false;
    this.projectToEdit = null;
  }
  
  // Filtrage effectué directement dans le template via searchTerm
  get filteredProjects() {
    const term = (this.searchTerm || '').toLowerCase().trim();
    if (!term) return this.projects;
    return this.projects.filter(p => (p?.name || '').toLowerCase().includes(term));
  }
  
  onProjectClick(project: any): void {
    console.log('Projet sélectionné:', project.name);
  }

  // Event binding: mettre à jour le projet sélectionné
  viewDetails(project: any, event?: Event): void {
    // Empêcher que le clic sur le bouton déclenche aussi le clic sur la carte
    if (event) { event.stopPropagation(); }
    this.selectedProject = project;
  }

  // Ajouter une tâche à un projet
  addTask(project: any, title: string): void {
    const t = (title || '').trim();
    if (!t) return;
    project.tasks.push({ title: t, priority: 'Moyenne', status: 'En attente' });
  this.toast.show('Tâche ajoutée', 3000, 'success');
  }

  removeTask(project: any, task: any): void {
    const idx = project.tasks.indexOf(task);
    if (idx > -1) {
      project.tasks.splice(idx, 1);
  this.toast.show('Tâche supprimée', 3000, 'success');
    }
  }

  removeProject(project: any): void {
    const idx = this.projects.indexOf(project);
    if (idx > -1) {
      this.projects.splice(idx, 1);
  this.toast.show('Projet supprimé', 3000, 'success');
    }
  }

  changeTaskStatus(project: any, payload: { task: any; status: string }): void {
    const { task, status } = payload;
    const t = project.tasks.find((x: any) => x === task);
    if (t) {
      t.status = status;
  this.toast.show(`Statut changé en "${status}"`, 3000, 'info');
    }
  }

  getTasksByPriority(project: any) {
    if (!project || !Array.isArray(project.tasks)) return [];
    if (!this.selectedPriority || this.selectedPriority === 'All') return project.tasks;
    return project.tasks.filter((t: any) => t.priority === this.selectedPriority);
  }

  // Dashboard helpers
  get totalProjectsCount() { return this.projects.length; }
  get totalTasksCount() { return this.projects.reduce((s, p) => s + (p.tasks?.length || 0), 0); }
  get globalProgress() {
    const allTasks = this.projects.flatMap(p => p.tasks || []);
    if (allTasks.length === 0) return 0;
    const done = allTasks.filter((t: any) => t.status === 'Terminé').length;
    return Math.round((done / allTasks.length) * 100);
  }
}
