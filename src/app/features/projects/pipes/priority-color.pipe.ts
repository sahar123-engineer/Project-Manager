import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityColor',
  standalone: true,
})
export class PriorityColorPipe implements PipeTransform {
  transform(priority: string | null | undefined): string {
    const raw = (priority || '').trim();
    const p = raw.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    switch (p) {
      case 'haute': return 'text-red-500';
      case 'moyenne': return 'text-yellow-500';
      case 'basse': return 'text-green-500';
      default: return 'text-gray-700';
    }
  }
}
