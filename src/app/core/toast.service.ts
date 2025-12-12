import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';

export interface ToastMessage {
  id: number;
  text: string;
  type?: 'info' | 'success' | 'error' | 'warn';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private subject = new BehaviorSubject<ToastMessage[]>([]);

  get toasts$(): Observable<ToastMessage[]> {
    return this.subject.asObservable();
  }

  show(text: string, ms = 3000, type: ToastMessage['type'] = 'info') {
    const id = ++this.counter;
    const msg: ToastMessage = { id, text, type };
    const list = [...this.subject.getValue(), msg];
    this.subject.next(list);
    // Auto-remove after ms
    timer(ms).subscribe(() => this.remove(id));
  }

  remove(id: number) {
    const list = this.subject.getValue().filter(m => m.id !== id);
    this.subject.next(list);
  }

  clearAll() {
    this.subject.next([]);
  }
}
