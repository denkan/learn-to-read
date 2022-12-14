import { CdkDragDrop, CdkDragEnter } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { GameService } from '../game.service';
import { WordState } from '../_components/word.component';

interface WordStatus {
  word: string;
  done: boolean;
}

@Component({
  selector: 'app-map-lower-upper-words',
  templateUrl: './map-lower-upper-words.component.html',
  styleUrls: ['./map-lower-upper-words.component.scss'],
})
export class MapLowerUpperWordsComponent {
  constructor(public game: GameService) {}

  readonly wordsDone$ = new BehaviorSubject<string[]>([]);

  readonly wordsStatus$: Observable<WordStatus[]> = combineLatest([
    this.game.words$,
    this.wordsDone$,
  ]).pipe(
    map(([words, wordsDone]) =>
      words.map((word) => ({
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

  trackByWord(_index: number, ws: WordStatus) {
    return ws.word;
  }
  formatWord(word: string, isCurr: boolean) {
    const inversed = false; // TODO: game option to inverse upper/lower?
    const useUpper = isCurr || inversed;
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
    const isCorrectWord = e.item.data === e.container.data?.word;
    if (isCorrectWord) {
      this.addWordDone(e.item.data);
    } else {
      this.reset();
      this.wrongWord$.next(e.container.data?.word);
      clearTimeout(this._aniTimer);
      this._aniTimer = setTimeout(() => this.reset(), 2000);
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
