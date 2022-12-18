import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GameService } from './game.service';

@Injectable()
export class CreateGameGuard implements CanActivate {
  constructor(private game: GameService, private router: Router) {}

  /** Resolve current game or initialize new */
  async canActivate(route: ActivatedRouteSnapshot) {
    const wordsetId = route.params['wordsetId'];
    const subGames = route.queryParams['subGames']?.split(',');
    const game = this.game.init(wordsetId, subGames);
    const createdGameUrlTree = this.router.createUrlTree([
      '/game',
      game.wordsetId,
    ]);
    return createdGameUrlTree;
  }
}

@Injectable()
export class RequireGameGuard implements CanActivate {
  constructor(private game: GameService, private router: Router) {}

  /** Resolve current game or initialize new */
  async canActivate(route: ActivatedRouteSnapshot) {
    const wordsetId = route.params['wordsetId'];
    const game = await firstValueFrom(this.game.game$);
    const createGameUrlTree = this.router.createUrlTree([
      '/game',
      wordsetId,
      'new',
    ]);
    return !!game || createGameUrlTree;
  }
}
