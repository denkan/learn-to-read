import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs';
import { GameService } from './game.service';

@UntilDestroy()
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  constructor(public game: GameService, private route: ActivatedRoute) {
    this.route.params
      .pipe(
        map((p) => p['wordsetIndex'] || 0),
        untilDestroyed(this)
      )
      .subscribe((index) => this.game.wordsetId$.next(index));
  }
}
