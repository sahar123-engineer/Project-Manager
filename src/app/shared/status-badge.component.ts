import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span [ngClass]="classes" class="px-2 py-0.5 rounded-full text-xs font-semibold">
      {{ status }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status: string = '';

  get classes(): string {
    const s = (this.status || '').toLowerCase();
    if (s.includes('term')) return 'bg-green-100 text-green-800 border border-green-200';
    if (s.includes('cours')) return 'bg-blue-100 text-blue-800 border border-blue-200';
    if (s.includes('att')) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
}
