import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'friendlyDate', standalone: true })
export class FriendlyDatePipe implements PipeTransform {
  transform(value: Date | string | number | undefined | null): string {
    if (!value) return '';
    const d = new Date(value);
    const now = new Date();
    const diffMs = now.setHours(0,0,0,0) - d.setHours(0,0,0,0);
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    return `Il y a ${Math.abs(days)} jours`;
  }
}
