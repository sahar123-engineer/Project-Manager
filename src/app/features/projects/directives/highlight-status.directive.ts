import { Directive, ElementRef, Input, OnChanges, Renderer2, inject } from '@angular/core';

/**
 * HighlightStatusDirective
 * - Standalone attribute directive
 * - Usage: <div appHighlightStatus="{{ task.status }}"></div>
 * - Accepts French statuses: 'En attente' | 'En cours' | 'Terminé'
 * - Applies a Tailwind background color utility to host element
 */
@Directive({
  selector: '[appHighlightStatus]',
  standalone: true,
})
export class HighlightStatusDirective implements OnChanges {
  /** Status value passed from template */
  @Input() appHighlightStatus: string | null | undefined;

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  ngOnChanges(): void {
    this.applyBackground();
  }

  private applyBackground(): void {
    const host = this.el.nativeElement;

    // Remove any previous bg-* classes we added
    this.removePreviousBgClasses(host);

    // Map status to Tailwind background class
    const raw = (this.appHighlightStatus ?? '').trim();
    // Remove diacritics and lowercase for tolerant matching
    const status = raw.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    let bgClass = 'bg-gray-50';

    if (status === 'en attente') {
      bgClass = 'bg-yellow-50';
    } else if (status === 'en cours') {
      bgClass = 'bg-blue-50';
    } else if (status === 'termine' || status === 'termine') {
      bgClass = 'bg-green-50';
    }

    this.renderer.addClass(host, bgClass);
  }

  private removePreviousBgClasses(host: HTMLElement): void {
    const bgPrefixes = ['bg-yellow-50', 'bg-blue-50', 'bg-green-50', 'bg-gray-50'];
    for (const cls of bgPrefixes) {
      this.renderer.removeClass(host, cls);
    }
  }
}
