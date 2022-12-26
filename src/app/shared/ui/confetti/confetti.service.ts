import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({ providedIn: 'root' })
export class ConfettiService {
  readonly fn = confetti;

  readonly defaultOptions: confetti.Options = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.7 },
  };

  getOptions(opts?: Partial<confetti.Options>) {
    return Object.assign({}, this.defaultOptions, opts ?? {});
  }

  run(opts?: Partial<confetti.Options>) {
    const options = this.getOptions(opts);
    return this.fn(options);
  }

  runDelay(delayInMs: number = 0, opts?: Partial<confetti.Options>) {
    return setTimeout(() => this.run(opts), delayInMs ?? 0);
  }
}
