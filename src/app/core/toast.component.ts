import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from './toast.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50 space-y-2">
      <div *ngFor="let msg of toasts" [@toastAnim] class="px-4 py-2 rounded shadow-lg max-w-xs break-words"
           [ngClass]="getBg(msg.type)">
        {{ msg.text }}
      </div>
    </div>
  `,
  animations: [
    trigger('toastAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(6px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(6px)' }))
      ])
    ])
  ]
})
export class ToastComponent implements OnDestroy {
  toasts: ToastMessage[] = [];
  sub: Subscription;

  constructor(private toast: ToastService) {
    this.sub = this.toast.toasts$.subscribe(list => (this.toasts = list));
  }

  getBg(type: ToastMessage['type'] | undefined) {
    switch (type) {
      case 'success': return 'bg-green-600 text-white';
      case 'error': return 'bg-red-600 text-white';
      case 'warn': return 'bg-yellow-600 text-black';
      default: return 'bg-gray-800 text-white';
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
