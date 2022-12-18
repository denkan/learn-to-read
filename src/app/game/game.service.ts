import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs';
import { StoreService } from '../core/store.service';
import { isEqualJSON } from '../shared/utils/misc.utils';
import { Game, GameInfo, SubGame, SubGameType } from './game.types';

@Injectable()
export class GameService {
  constructor(private store: StoreService) {}

  readonly game$ = new BehaviorSubject<Game | null>(null);
  readonly wordsetId$ = this.game$.pipe(map((game) => game?.wordsetId));

  readonly wordset$ = combineLatest([
    this.store.wordSets$,
    this.wordsetId$,
  ]).pipe(map(([allWordsets, id]) => allWordsets.find((ws) => ws.id === id)));

  private readonly _subGameIndex$ = new BehaviorSubject(0);
  readonly subGameIndex$ = this._subGameIndex$.asObservable();
  readonly subGame$ = combineLatest([this.subGameIndex$, this.game$]).pipe(
    map(([subGameIndex, game]) => game?.subGames[subGameIndex])
  );

  readonly gameInfo$ = combineLatest([
    this.game$,
    this.wordset$,
    this.subGameIndex$,
  ]).pipe(
    distinctUntilChanged(isEqualJSON),
    filter(([game, wordset]) => !!(game && wordset)),
    map(([game, wordset, subGameIndex]) => {
      const subGames = (game?.subGames || []).map((sg, index) => ({
        index,
        ...sg,
      }));
      const gameInfo: GameInfo = {
        ...game!,
        wordset: wordset!,
        subGames,
        subGame: {
          curr: subGames[subGameIndex],
          prev: subGames[subGameIndex - 1],
          next: subGames[subGameIndex + 1],
        },
      };
      return gameInfo;
    })
  );

  init(wordsetId: string, subGameTypes: SubGameType[]): Game {
    const allSubGameTypes = Object.values(SubGameType).filter(
      (x) => typeof x === 'number'
    ) as SubGameType[];

    if (!subGameTypes) {
      subGameTypes = allSubGameTypes;
    }
    const validSubGames = subGameTypes!.filter((sg) =>
      allSubGameTypes.includes(parseInt(sg.toString()))
    );
    const game: Game = {
      wordsetId,
      subGames: validSubGames.map((type) => ({ type })),
    };
    this.game$.next(game);
    return game;
  }

  setSubGameIndex(subGameIndex?: number) {
    if (subGameIndex == null) {
      // set next unfinished subgame
      subGameIndex = (this.game$.value?.subGames || []).findIndex(
        (sg) => !!sg.endedAt
      );
    }
    if (
      subGameIndex < 0 ||
      subGameIndex >= (this.game$.value?.subGames || []).length
    ) {
      subGameIndex = 0;
    }
    this._subGameIndex$.next(subGameIndex);
  }

  async patchSubGame(subGame: Partial<SubGame>) {
    const currGame = this.game$.value;
    if (!currGame || !currGame.subGames) {
      return;
    }
    const currSubGame = currGame.subGames[this._subGameIndex$.value];
    const nextSubGame = { ...currSubGame, ...subGame };

    const nextGame = { ...currGame, subGames: [...currGame.subGames] };
    nextGame.subGames[this._subGameIndex$.value] = nextSubGame;

    this.game$.next(nextGame);
    return nextGame;
  }
}
