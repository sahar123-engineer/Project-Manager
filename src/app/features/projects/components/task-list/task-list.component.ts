import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { HighlightStatusDirective } from '../../directives/highlight-status.directive';
import { PriorityColorPipe } from '../../pipes/priority-color.pipe';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgClass, HighlightStatusDirective, PriorityColorPipe],
  animations: [
    trigger('itemAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-6px)' }),
        animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('160ms ease-in', style({ opacity: 0, transform: 'translateY(-6px)' }))
      ])
    ])
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  @Input() tasks: any[] = [];
  @Output() removeTask = new EventEmitter<any>();
  @Output() statusChange = new EventEmitter<{ task: any; status: string }>();
  
  taskIcon = '📋';
  
  // Methods pour Event Binding
  onTaskClick(task: any): void {
    alert(`Tâche cliquée: ${task.title}`);
  }
  
  
  onTaskHover(task: any): void {
    console.log('Survol de: ' + task.title);
  }

  changeStatus(task: any): void {
    const order = ['En attente', 'En cours', 'Terminé'];
    const idx = order.indexOf(task.status || 'En attente');
    const next = order[(idx + 1) % order.length];
    // Emit the intended new status; parent will update the model
    this.statusChange.emit({ task, status: next });
  }

  getStatusEmoji(status: string | null | undefined): string {
    const s = (status || '').toLowerCase();
    if (s.includes('term')) return '✅';
    if (s.includes('cours')) return '🔄';
    if (s.includes('att')) return '⏳';
    return '❔';
  }
  
  getBorderClass(status: string): string {
    switch (status) {
      case 'En attente': return 'border-yellow-400';
      case 'En cours':   return 'border-blue-400';
      case 'Terminé':    return 'border-green-400';
      default:           return 'border-gray-300';
    }
  }

  // Ajoute une couleur de fond à toute la section selon le statut
  getBackgroundClass(status: string): string {
    switch (status) {
      case 'En attente': return 'bg-yellow-50';
      case 'En cours':   return 'bg-blue-50';
      case 'Terminé':    return 'bg-green-50';
      default:           return 'bg-gray-50';
    }
  }
}
