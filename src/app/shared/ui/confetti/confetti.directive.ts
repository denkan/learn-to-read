import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import confetti from 'canvas-confetti';
import { ConfettiService } from './confetti.service';

export interface ConfettiOptions extends confetti.Options {
  delay?: number;
}

@Directive({ selector: '[confetti]', exportAs: 'confetti' })
export class ConfettiDirective implements OnInit, OnDestroy {
  constructor(public confetti: ConfettiService) {}

  private _options: ConfettiOptions = { ...this.confetti.defaultOptions };
  @Input('confetti') set options(value: Partial<ConfettiOptions> | undefined) {
    this._options = this.confetti.getOptions(value);
  }

  get options(): ConfettiOptions {
    return this._options;
  }

  private timer?: NodeJS.Timeout;

  ngOnInit(): void {
    clearTimeout(this.timer);
    this.timer = this.confetti.runDelay(this.options.delay, this.options);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
