import { CdkDragDrop, CdkDragEnter } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { ConfettiService } from 'src/app/shared/ui/confetti/confetti.service';
import { WordState } from '../../_components/word.component';
import { SubGameBase } from '../sub-game.base';

@Component({
  selector: 'app-map-lower-upper-words',
  templateUrl: './map-lower-upper-words.component.html',
  styleUrls: ['./map-lower-upper-words.component.scss'],
})
export class MapLowerUpperWordsComponent extends SubGameBase implements OnInit {
  @Input() inversed?: boolean;

  constructor(private confetti: ConfettiService) {
    super();
  }

  useSpeechLock = true;

  wordsDone: string[] = [];
  currWord?: string;
  isCurrWordLocked = true;
  wrongWord?: string;
  hoverWord?: string;
  wrongMoves: { from: string; to: string }[] = [];

  ngOnInit() {
    const startedAt = Date.now();
    this.patch.emit({ startedAt });
    this.randomWord();
  }

  getStats() {
    const allWords = this.gameInfo?.wordset.words || [];
    const wordsDone = this.wordsDone;
    const wordsLeft = allWords.filter((w) => !this.wordsDone.includes(w));
    const done = this.wordsDone.length;
    const left = wordsLeft.length;
    const wrong = this.wrongMoves.length;
    const total = done + wrong;
    const scoreRatio = total > 0 ? done / total : 0;
    return {
      allWords,
      wordsLeft,
      wordsDone,
      done,
      left,
      wrong,
      total,
      scoreRatio,
    };
  }

  sendStats() {
    const { scoreRatio, left } = this.getStats();
    const endedAt = left <= 0 ? Date.now() : undefined;
    this.patch.emit({ scoreRatio, endedAt });
  }

  async randomWord() {
    // set to blank real quick to re-render UI
    this.currWord = undefined;
    await new Promise((r) => setTimeout(r, 100));
    // ranomize new word
    const { wordsLeft } = this.getStats();
    const i = Math.floor(Math.random() * wordsLeft.length);
    this.currWord = wordsLeft[i];
  }

  trackByValue(_index: number, value: string) {
    return value;
  }

  formatWord(word: string, isCurr: boolean) {
    const useUpper = (isCurr && !this.inversed) || (!!this.inversed && !isCurr);
    const toCase = useUpper ? 'toLocaleUpperCase' : 'toLocaleLowerCase';
    return word[toCase]();
  }

  resetUI() {
    this.hoverWord = undefined;
    this.wrongWord = undefined;
  }

  private _aniTimer?: NodeJS.Timeout;
  async onDragDrop(e: CdkDragDrop<string, string, string>) {
    const from = e.item.data;
    const to = e.container.data;
    const isCorrectWord = from === to;
    if (isCorrectWord) {
      this.wordsDone.push(from);
      this.randomWord();
      this.confettiByEvent(e.event);
    } else {
      this.resetUI();
      if (to && !e.container.disabled) {
        this.wrongMoves.push({ from, to });
        this.wrongWord = to;
        clearTimeout(this._aniTimer);
        this._aniTimer = setTimeout(() => this.resetUI(), 1200);
      }
    }
    this.sendStats();
  }
  onDragEnter(e: CdkDragEnter<string>) {
    this.resetUI();
    this.hoverWord = e.container.data;
  }

  wordState(word: string): WordState {
    if (this.wordsDone.includes(word)) {
      return WordState.Correct;
    }
    if (this.hoverWord === word) {
      return WordState.Hover;
    }
    if (this.wrongWord === word) {
      return WordState.Wrong;
    }
    return WordState.Idle;
  }

  confettiByEvent(e: MouseEvent | TouchEvent) {
    const { clientX: x, clientY: y } =
      (e as TouchEvent).changedTouches?.[0] || (e as MouseEvent);
    const origin = this.confetti.getOriginByCoord({ x, y });
    this.confetti.run({
      origin,
      particleCount: 12,
      spread: 70,
      startVelocity: 15,
    });
  }
}
