import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { StoreService } from '../../core/store.service';

@Injectable()
export class GameService {
  constructor(private store: StoreService) {}

  readonly wordsetIndex$ = new BehaviorSubject<number>(0);

  readonly wordset$ = combineLatest([
    this.store.wordSets$,
    this.wordsetIndex$,
  ]).pipe(map(([allWordsets, index]) => allWordsets[index]));

  readonly words$ = this.wordset$.pipe(map((ws) => ws.words));
}
