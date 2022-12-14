import { Component, Input } from '@angular/core';

export enum WordState {
  Idle = 'idle',
  Hover = 'hover',
  Wrong = 'wrong',
  Correct = 'correct',
}

@Component({
  selector: 'app-word',
  template: `
    <span
      class="state-{{ state }}"
      [style.backgroundColor]="bgcolor"
      [ngClass]="innerClass"
      [ngStyle]="innerStyle"
    >
      <ng-content></ng-content>
    </span>
  `,
  styles: [
    `
      @import 'mixins';
      :host > span {
        display: block;
        position: relative;
        padding: 0.5em;
        color: var(--color-fg);
        background: var(--color-bg);
        border: 0.1em solid var(--color-fg-op-75);
        border-radius: 0.5em;
        transition: 0.2s;

        &.state-idle,
        &.state-hover {
          background: lightyellow;
        }
        &.state-hover {
          transform: scale(1.15);
        }
        &.state-wrong {
          background: salmon !important;
          animation: 0.5s 0.2s wrong ease-in-out 1;
        }
        &.state-correct {
          background: palegreen !important;
          animation: 1.5s 0.1s correct ease-in-out 1 forwards;
        }
      }

      @keyframes wrong {
        0%,
        100% {
          transform: translateX(0);
        }
        15%,
        45%,
        75% {
          transform: translateX(-0.5em);
        }
        30%,
        60%,
        90% {
          transform: translateX(0.5em);
        }
      }
      @keyframes correct {
        0%,
        10%,
        30%,
        50% {
          transform: scale(1);
        }
        20%,
        40% {
          transform: scale(1.15);
        }
        0%,
        80% {
          opacity: 1;
        }
        100% {
          opacity: 0.5;
        }
      }
    `,
  ],
})
export class WordComponent {
  @Input() state = WordState.Idle;
  @Input() bgcolor?: string;
  @Input() innerStyle?: { [prop: string]: string | number };
  @Input() innerClass?: string;
}
