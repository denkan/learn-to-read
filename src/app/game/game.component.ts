import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { GameService } from './game.service';
import { SubGameInfo, SubGameType } from './game.types';

@UntilDestroy()
@Component({
  selector: 'app-game',
  template: `
    <ng-container *ngIf="game.gameInfo$ | async as gi">
      <ng-container [ngSwitch]="gi.subGame.curr.type">
        <app-map-lower-upper-words
          *ngSwitchCase="SubGameType.MapLowerToUpper"
          [gameInfo]="gi"
          (patch)="game.patchSubGame($event)"
        ></app-map-lower-upper-words>
        <app-map-lower-upper-words
          *ngSwitchCase="SubGameType.MapUpperToLower"
          [gameInfo]="gi"
          (patch)="game.patchSubGame($event)"
          [inversed]="true"
        ></app-map-lower-upper-words>
      </ng-container>
      <!-- <pre class="ts-50p">{{ $ | json }}</pre> -->
      <app-game-ended
        [currSubGame]="gi.subGame.curr"
        [nextSubGame]="gi.subGame.next"
        (close)="setNextOrExit(gi.subGame.next)"
      ></app-game-ended>
    </ng-container>
  `,
})
export class GameComponent {
  constructor(public game: GameService, private router: Router) {}

  readonly SubGameType = SubGameType;

  setNextOrExit(nextSubgGame?: SubGameInfo) {
    if (nextSubgGame) {
      this.game.setSubGameIndex(nextSubgGame.index);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
