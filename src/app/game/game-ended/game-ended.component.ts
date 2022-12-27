import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubGame } from '../game.types';

@Component({
  selector: 'app-game-ended',
  template: `
    <div *ngIf="show" class="modal-wrapper fadeIn">
      <div class="modal-box scaleUp" [confetti]="{ delay: 2000 }">
        <header class="p-1 text-center">
          <h1 class="m-0 scaleUp">Nice job!</h1>
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
      .fadeIn {
        opacity: 0;
        animation: 0.5s fadeIn forwards;
      }
      .scaleUp {
        transform: scale(0);
        animation: 0.5s scaleUp cubic-bezier(0.5, 0, 0.5, 2.2) forwards;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes scaleUp {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }

      .modal-box {
        min-width: 16em;

        &.scaleUp {
          animation-delay: 0.3s;
        }

        h1.scaleUp {
          animation-delay: 0.8s;
        }
      }

      :host ::ng-deep {
        @keyframes scaleUpSpin {
          from {
            transform: scale(0) rotate(-180deg);
          }
          to {
            transform: scale(1) rotate(0deg);
          }
        }
        app-stars {
          .star-wrapper {
            app-star {
              transform: scale(0) rotate(-180deg);
              animation: 0.7s scaleUpSpin cubic-bezier(0.5, 0, 0.5, 2.2)
                forwards;
            }

            &:nth-of-type(1) app-star {
              animation-delay: 1s;
            }
            &:nth-of-type(2) app-star {
              animation-delay: 1.2s;
            }
            &:nth-of-type(3) app-star {
              animation-delay: 1.4s;
            }
          }
        }
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
