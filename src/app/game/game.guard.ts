import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GameService } from './game.service';

@Injectable()
export class GameGuard implements CanActivate {
  constructor(private game: GameService) {}

  /** Resolve current game or initialize new */
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const wordsetId = route.params['wordsetId'];
    const subGames = route.queryParams['subGames']?.split(',');
    const game = await firstValueFrom(this.game.game$);
    return !!(game ?? this.game.init(wordsetId, subGames));
  }
}
