import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

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
  audioContext = new AudioContext();
  audioStream?: MediaStream;
  recognition?: SpeechRecognition;

  constructor(private translate: TranslateService) {}

  get isSupported() {
    return !!SpeechRecognition;
  }

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

  private _audioSignal$ = new BehaviorSubject<{
    diff: number;
    data: Uint8Array;
  }>({ diff: 0, data: Uint8Array.of(0) });
  readonly audioSignal$ = this._audioSignal$.asObservable();
  get audioSignal() {
    return this._audioSignal$.value;
  }

  async enableMicrophone() {
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      await new Promise((r) => setTimeout(r, 100));
      this.trackVoiceSignals();
      return true;
    } catch (err) {
      console.warn(err);
      this._status$.next('not-allowed');
      return false;
    }
  }

  async start(options?: SpeechRecognitionOptions) {
    await this.enableMicrophone();

    const defaultOptions: SpeechRecognitionOptions = {
      continuous: true,
      lang: this.translate.instant('SPEECHCODE'), // 'sv-SE' / 'en-US'
      interimResults: true,
      maxAlternatives: 5,
    };

    this.stop();

    this._words$.next([]);

    this.recognition = new SpeechRecognition();
    const recognition = this.recognition!;
    Object.assign(recognition, defaultOptions, options || {});

    recognition.addEventListener('result', (e: any) => {
      const words: string[] = [];
      for (const r of e.results) {
        for (const w of r) {
          const foundWords = (w.transcript || '').trim().split(' ');
          foundWords.forEach((fw: string) => words.push(fw));
        }
      }
      this._words$.next(words);
    });
    recognition.addEventListener('error', (e: Event & { error?: string }) =>
      this._status$.next(e.error === 'not-allowed' ? 'not-allowed' : 'error')
    );
    recognition.addEventListener('start', () => this._status$.next('started'));
    recognition.addEventListener('end', () => this._status$.next('stopped'));

    recognition.start();
    return { words$: this.words$ };
  }

  stop() {
    if (this.recognition && typeof this.recognition.stop === 'function') {
      this.recognition.stop();
      delete this.audioStream;
      delete this.recognition;
    } else {
      this._status$.next('stopped');
    }
  }

  trackVoiceSignals(source = this.audioStream, context = this.audioContext) {
    if (!source || !context) return;

    const src = context.createMediaStreamSource(source);
    var analyser = context.createAnalyser();
    var listen = context.createGain();

    src.connect(listen);
    listen.connect(analyser);
    analyser.fftSize = 2 ** 12;

    // -- calcSignal() start
    const calcSignal = () => {
      requestAnimationFrame(calcSignal);
      // setTimeout(calcSignal, 300);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyser.smoothingTimeConstant = 0.5;
      listen.gain.setValueAtTime(1, context.currentTime);

      analyser.getByteFrequencyData(dataArray);
      analyser.getByteTimeDomainData(dataArray);

      let min = 1;
      let max = 0;
      for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        min = Math.min(min, v);
        max = Math.max(min, v);
      }
      const diff = max - min;
      this._audioSignal$.next({ diff, data: dataArray });
    };
    // -- trackSignal() end

    calcSignal();
  }
}
