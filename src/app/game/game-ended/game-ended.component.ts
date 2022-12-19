import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubGame } from '../game.types';

@Component({
  selector: 'app-game-ended',
  template: `
    <div *ngIf="show" @showModalAnimation class="modal-wrapper">
      <div class="modal-box">
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
          query(':self', [
            style({ opacity: 0 }),
            animate('0.2s', style({ opacity: 1 })),
          ]),
          query(
            '.modal-box',
            animate('0.2s', style({ transform: 'scale(1)' }))
          ),
        ]),
      ]),
      transition(':leave', [
        group([
          query(
            '.modal-box',
            animate('0.2s', style({ transform: 'scale(0)' }))
          ),
          query(':self', [
            style({ opacity: 1 }),
            animate('0.2s', style({ opacity: 0 })),
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
