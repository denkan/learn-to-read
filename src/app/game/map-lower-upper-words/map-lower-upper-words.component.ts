import { CdkDragDrop, CdkDragEnter } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs';
import { isEqualJSON } from 'src/app/shared/utils/misc.utils';
import { GameService } from '../game.service';
import { WordState } from '../_components/word.component';

interface WordStatus {
  word: string;
  done: boolean;
}

@UntilDestroy()
@Component({
  selector: 'app-map-lower-upper-words',
  templateUrl: './map-lower-upper-words.component.html',
  styleUrls: ['./map-lower-upper-words.component.scss'],
})
export class MapLowerUpperWordsComponent implements OnInit {
  @Input() inversed?: boolean;

  constructor(public game: GameService) {}

  readonly wordsDone$ = new BehaviorSubject<string[]>([]);

  readonly wordsStatus$: Observable<WordStatus[]> = combineLatest([
    this.game.wordset$,
    this.wordsDone$,
  ]).pipe(
    map(([wordset, wordsDone]) =>
      (wordset?.words || []).map((word) => ({
        word,
        done: wordsDone.includes(word),
      }))
    )
  );
  readonly wordsLeft$ = this.wordsStatus$.pipe(
    map((wordsStatus) =>
      wordsStatus.filter((ws) => !ws.done).map((ws) => ws.word)
    )
  );
  readonly currWord$ = this.wordsLeft$.pipe(
    map((words) => {
      const i = Math.floor(Math.random() * words.length);
      return words[i];
    })
  );
  readonly hoveredWord$ = new BehaviorSubject<string | undefined>(undefined);
  readonly wrongWord$ = new BehaviorSubject<string | undefined>(undefined);

  readonly wrongMoves$ = new BehaviorSubject<{ from: string; to: string }[]>(
    []
  );

  readonly stats$ = combineLatest([
    this.wordsDone$,
    this.wordsLeft$,
    this.wrongMoves$,
  ]).pipe(
    map(([wordsDone, wordsLeft, wrongMoves]) => {
      const done = wordsDone.length;
      const left = wordsLeft.length;
      const wrong = wrongMoves.length;
      const total = done + wrong;
      const scoreRatio = total > 0 ? done / total : 0;
      return { done, left, wrong, total, scoreRatio };
    })
  );

  readonly $$ = combineLatest([
    this.wordsStatus$,
    this.currWord$,
    this.hoveredWord$,
    this.wrongWord$,
  ]).pipe(
    map(([wordsStatus, currWord, hoveredWord, wrongWord]) => ({
      wordsStatus,
      currWord,
      hoveredWord,
      wrongWord,
    }))
  );

  ngOnInit() {
    const startedAt = Date.now();
    this.game.patchSubGame({ startedAt });

    // track score
    this.stats$
      .pipe(distinctUntilChanged(isEqualJSON), untilDestroyed(this))
      .subscribe((stats) => {
        const { scoreRatio, left } = stats;
        const endedAt = left <= 0 ? Date.now() : undefined;
        this.game.patchSubGame({ scoreRatio, endedAt });
      });
  }

  trackByWord(_index: number, ws: WordStatus) {
    return ws.word;
  }
  formatWord(word: string, isCurr: boolean) {
    const useUpper = (isCurr && !this.inversed) || (!!this.inversed && !isCurr);
    const toCase = useUpper ? 'toLocaleUpperCase' : 'toLocaleLowerCase';
    return word[toCase]();
  }

  addWordDone(word: string) {
    this.wordsDone$.next([...this.wordsDone$.value, word]);
  }

  reset() {
    this.hoveredWord$.next(undefined);
    this.wrongWord$.next(undefined);
  }

  private _aniTimer?: NodeJS.Timeout;
  async onDragDrop(e: CdkDragDrop<WordStatus, WordStatus, string>) {
    const from = e.item.data;
    const to = e.container.data?.word;
    const isCorrectWord = from === to;
    if (isCorrectWord) {
      this.addWordDone(from);
    } else {
      this.reset();
      this.wrongWord$.next(to);
      this.wrongMoves$.next([...this.wrongMoves$.value, { from, to }]);
      clearTimeout(this._aniTimer);
      this._aniTimer = setTimeout(() => this.reset(), 1200);
    }
  }
  onDragEnter(e: CdkDragEnter<WordStatus>) {
    this.reset();
    this.hoveredWord$.next(e.container.data.word);
  }

  wordState(
    ws: WordStatus,
    hoveredWord?: string,
    wrongWord?: string
  ): WordState {
    if (ws.done) {
      return WordState.Correct;
    }
    if (hoveredWord === ws.word) {
      return WordState.Hover;
    }
    if (wrongWord === ws.word) {
      return WordState.Wrong;
    }
    return WordState.Idle;
  }
}
