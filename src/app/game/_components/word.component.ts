import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-word',
  template: `<span><ng-content></ng-content></span>`,
  styles: [
    `
      @import 'mixins';
      :host {
        display: block;
        color: var(--color-fg);
        position: relative;
        border: 0.1em solid var(--color-fg-op-75);

        &:before {
          display: block;
          content: ' ';
          background: var(--word-bg);
          opacity: 1;
          @include full-fill;
        }

        > span {
          display: block;
          padding: 0.5em;
          position: relative;
        }
      }
    `,
  ],
})
export class WordComponent {
  @HostBinding('style.--word-bg')
  @Input()
  bgColor: string = 'SkyBlue';
}
