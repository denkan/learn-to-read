import {
  animate,
  group,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubGame } from '../game.types';

const easing = 'cubic-bezier(.5,0,.5,2.2)';
const delay = '0.5s';
const ani = `${delay} ${easing}`;

@Component({
  selector: 'app-game-ended',
  template: `
    <div *ngIf="show" @showModalAnimation class="modal-wrapper">
      <div class="modal-box" [confetti]="{ delay: 2000 }">
        <header class="p-1 text-center">
          <h1 class="m-0">Nice job!</h1>
        </header>
        <div class="px-1 flex-center">
          <div class="ts-300p lh-80">
            <app-stars
              class="d-block"
              [ratio]="currSubGame?.scoreRatio"
              [warped]="0.3"
            ></app-stars>
          </div>
        </div>
        <footer class="p-1 text-center">
          <button mat-raised-button color="primary" (click)="close.emit()">
            <span *ngIf="!nextSubGame">Next</span>
            <span *ngIf="nextSubGame">Close</span>
          </button>
        </footer>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-box {
        min-width: 16em;
      }
    `,
  ],
  animations: [
    trigger('showModalAnimation', [
      transition(':enter', [
        group([
          query('.modal-box', style({ transform: 'scale(0)' })),
          query('.modal-box h1', style({ transform: 'scale(0)' })),
          query(
            'app-stars app-star',
            style({ transform: 'scale(0) rotate(-180deg)' })
          ),
          query(':self', [
            style({ opacity: 0 }),
            animate(ani, style({ opacity: 1 })),
          ]),
          query('.modal-box', animate(ani, style({ transform: 'scale(1)' }))),
        ]),
        query('.modal-box h1', animate(ani, style({ transform: 'scale(1)' }))),
        query(
          'app-stars app-star',
          stagger(
            '0.3s',
            animate(ani, style({ transform: 'scale(1) rotate(0deg)' }))
          )
        ),
      ]),
      transition(':leave', [
        group([
          query('.modal-box', animate(ani, style({ transform: 'scale(0)' }))),
          query(':self', [
            style({ opacity: 1 }),
            animate(ani, style({ opacity: 0 })),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class GameEndedComponent {
  @Input() currSubGame?: SubGame;
  @Input() nextSubGame?: SubGame;
  @Output() close = new EventEmitter();

  get show() {
    return !!(this.currSubGame?.endedAt && this.currSubGame.scoreRatio);
  }
}
