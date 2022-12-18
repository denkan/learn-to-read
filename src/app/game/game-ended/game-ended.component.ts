import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubGame } from '../game.types';

@Component({
  selector: 'app-game-ended',
  template: `
    <div *ngIf="show" class="modal-wrapper">
      <div class="modal-box">
        <header class="p-1 text-center">
          <h1 class="m-0">Nice job!</h1>
        </header>
        <div class="px-1 flex-center">
          <div>
            <mat-icon>star</mat-icon>
            <mat-icon>star</mat-icon>
            <mat-icon>star</mat-icon>
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
})
export class GameEndedComponent {
  @Input() currSubGame?: SubGame;
  @Input() nextSubGame?: SubGame;
  @Output() close = new EventEmitter();

  get show() {
    return !!(this.currSubGame?.endedAt && this.currSubGame.scoreRatio);
  }
}
