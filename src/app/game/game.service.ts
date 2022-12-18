import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { StoreService } from '../core/store.service';

@Injectable()
export class GameService {
  constructor(private store: StoreService) {}

  readonly wordsetId$ = new BehaviorSubject<string | null>(null);

  readonly wordset$ = combineLatest([
    this.store.wordSets$,
    this.wordsetId$,
  ]).pipe(map(([allWordsets, id]) => allWordsets.find((ws) => ws.id === id)));

  readonly words$ = this.wordset$.pipe(map((ws) => ws?.words || []));
}
