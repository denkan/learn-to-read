import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-stars',
  template: `
    <span
      class="star-wrapper"
      *ngFor="let r of ratios; let index = index"
      [style.transform]="warpedStyles[index]"
    >
      <app-star [fill]="ratio != null && ratio >= r"></app-star>
    </span>
  `,
  styles: [
    `
      .star-wrapper {
        display: inline-block;
      }
    `,
  ],
})
export class StarsComponent implements OnChanges {
  @Input() ratio?: number;
  @Input() ratios = [0, 0.5, 0.9];
  @Input() warped?: number;

  warpedStyles: string[] = [];

  ngOnChanges() {
    this.calcWarpedStyles();
  }

  calcWarpedStyles() {
    if (!this.warped) {
      return;
    }
    const val = this.warped!;
    const mid = this.ratios.length / 2;
    const midCeil = Math.ceil(mid);
    const halfArr = new Array(midCeil)
      .fill(0)
      .map((_, i) => val * (i / (midCeil - 1) - val / 2));

    halfArr.push(halfArr[halfArr.length - 1]); // in case of even nums of stars

    this.warpedStyles = this.ratios.map((_, i) => {
      const y = i <= mid ? halfArr[i] : halfArr[mid * 2 - i - 1];
      return `translateY(${-y}em)`;
    });
  }
}
