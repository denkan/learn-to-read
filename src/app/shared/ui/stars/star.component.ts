import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star',
  template: `<mat-icon
    [style.color]="fill ? fillColor : 'var(--color-fg-op-50)'"
    >star</mat-icon
  >`,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class StarComponent {
  @Input() fill = false;
  @Input() fillColor = 'var(--color-accent)';
}
