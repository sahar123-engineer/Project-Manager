import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<any[]>([
    {
      name: 'Projet 1',
      description: 'Description 1',
      status: 'En cours',
      createdAt: new Date(2025, 0, 15),
      tasks: [
        { title: 'Tâche 1', priority: 'Haute', status: 'En attente' },
        { title: 'Tâche 2', priority: 'Moyenne', status: 'En cours' }
      ]
    },
    {
      name: 'Projet 2',
      description: 'Description 2',
      status: 'Terminé',
      createdAt: new Date(2025, 2, 10),
      tasks: [
        { title: 'Tâche 1', priority: 'Basse', status: 'Terminé' }
      ]
    }
  ]);

  projects$ = this.projectsSubject.asObservable();

  constructor() {
    console.log('🏗️ ProjectService créé avec', this.projectsSubject.value.length, 'projets');
  }

  addProject(project: any): void {
    console.log('🚀 ProjectService.addProject appelé avec:', project);
    const currentProjects = this.projectsSubject.value;
    console.log('📋 Projets AVANT ajout:', currentProjects.length, currentProjects);
    const newList = [...currentProjects, project];
    console.log('📋 Nouvelle liste:', newList.length, newList);
    this.projectsSubject.next(newList);
    console.log('✅ BehaviorSubject.next() appelé');
    console.log('📋 Projets APRÈS dans le subject:', this.projectsSubject.value.length);
  }

  getProjects(): any[] {
    return this.projectsSubject.value;
  }

  updateProject(index: number, project: any): void {
    const projects = this.projectsSubject.value;
    projects[index] = project;
    this.projectsSubject.next([...projects]);
  }

  deleteProject(project: any): void {
    const projects = this.projectsSubject.value.filter(p => p !== project);
    this.projectsSubject.next(projects);
  }
}
