import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { StatusBadgeComponent } from '../../../../shared/status-badge.component';
import { FriendlyDatePipe } from '../../../../shared/friendly-date.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [NgIf, StatusBadgeComponent, FriendlyDatePipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent {
  @Input() project: any | null = null;

  getProgress(): number {
    const p = this.project;
    if (!p || !Array.isArray(p.tasks) || p.tasks.length === 0) return 0;
    const done = p.tasks.filter((t: any) => (t?.status || '') === 'Terminé').length;
    return Math.round((done / p.tasks.length) * 100);
  }
}
