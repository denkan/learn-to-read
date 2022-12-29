import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface SpeechRecognitionOptions {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
}

export type SpeechStatus =
  | 'detecting'
  | 'not-allowed'
  | 'error'
  | 'started'
  | 'stopped';

interface SpeechRecognition extends SpeechRecognitionOptions {
  start: () => void;
  stop: () => void;
  addEventListener: (eventName: string, callback: (e: Event) => void) => void;
}

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

@Injectable({ providedIn: 'root' })
export class SpeechService {
  private _recognition: SpeechRecognition = new SpeechRecognition();

  private _status$ = new BehaviorSubject<SpeechStatus>('detecting');
  readonly status$ = this._status$.asObservable();
  get status() {
    return this._status$.value;
  }

  private _words$ = new BehaviorSubject<string[]>([]);
  readonly words$ = this._words$.asObservable();
  get words() {
    return this._words$.value;
  }

  private _stopped$ = new Subject<void>();

  start(options?: SpeechRecognitionOptions) {
    const defaultOptions: SpeechRecognitionOptions = {
      continuous: true,
      // lang: 'en-US',
      lang: 'sv-SE',
      interimResults: true,
      maxAlternatives: 5,
    };

    this.stop();

    this._words$.next([]);

    this._recognition = new SpeechRecognition();
    Object.assign(this._recognition, defaultOptions, options || {});

    this._recognition.addEventListener('result', (e: any) => {
      const words: string[] = [];
      for (const r of e.results) {
        for (const w of r) {
          const foundWords = (w.transcript || '').trim().split(' ');
          foundWords.forEach((fw: string) => words.push(fw));
        }
      }
      this._words$.next(words);
    });
    this._recognition.addEventListener(
      'error',
      (e: Event & { error?: string }) =>
        this._status$.next(e.error === 'not-allowed' ? 'not-allowed' : 'error')
    );
    this._recognition.addEventListener('start', () =>
      this._status$.next('started')
    );
    this._recognition.addEventListener('end', () =>
      this._status$.next('stopped')
    );

    this._recognition.start();
    return { words$: this.words$ };
  }

  stop() {
    if (this._recognition && typeof this._recognition.stop === 'function') {
      this._recognition.stop();
    } else {
      this._status$.next('stopped');
    }
  }
}
