import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, filter, first, map } from 'rxjs';
import { SpeechService } from 'src/app/core/speech.service';
import { ConfettiService } from 'src/app/shared/ui/confetti/confetti.service';

@UntilDestroy()
@Component({
  selector: 'app-speech-lock',
  template: `
    <div class="content">
      <ng-content></ng-content>
    </div>
    <ng-container *ngIf="!disabled">
      <div class="box">
        <span class="icon" #iconRef>
          <mat-icon>{{ locked ? 'lock' : 'mood' }}</mat-icon>
        </span>
      </div>
    </ng-container>
  `,
  styles: [
    `
      @import 'mixins';
      :host {
        display: inline-block;
        position: relative;
        padding: 1em 1em 1.5em;

        .content {
          position: relative;
          z-index: 2;
        }
        .box {
          @include full-fill;
          z-index: 1;
          @include border-box;
          animation: 0.3s pop ease-in forwards;

          .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            @include border-box;
            width: 2em;
            height: 2em;
            position: absolute;
            z-index: 3;
            left: 50%;
            bottom: 0;
            transform: translate(-50%, 50%);
            background: var(--color-bg);
            border-radius: 50%;
            > * {
              font-size: 125%;
            }
          }
        }

        &.locked .box {
          animation: none;
        }
        &.listening .icon {
          animation: 1s listening ease-in-out infinite;
        }
      }

      @keyframes pop {
        from {
          transform: scale(1);
          opacity: 1;
        }
        to {
          transform: scale(1.5);
          opacity: 0;
        }
      }
      @keyframes listening {
        0%,
        100% {
          border-color: var(--color-fg);
        }
        50% {
          border-color: var(--color-warn);
        }
      }
    `,
  ],
  exportAs: 'speechLock',
})
export class SpeechLockComponent implements OnChanges, OnInit, OnDestroy {
  @Input() word?: string;
  @Input() disabled = false;
  @Output() lockedChanged = new EventEmitter<boolean>();

  constructor(
    public speech: SpeechService,
    private confetti: ConfettiService
  ) {}

  @ViewChild('iconRef') iconRef?: ElementRef<HTMLSpanElement>;

  private _locked$ = new BehaviorSubject<boolean>(true);
  readonly locked$ = this._locked$.asObservable();

  @HostBinding('class.locked')
  get locked() {
    return this._locked$.value;
  }

  @HostBinding('class.listening')
  get isListening() {
    return this.speech.status === 'started';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled']) {
      if (this.disabled && this.speech.status === 'started') {
        this.stop();
      }
      if (!this.disabled && this.speech.status !== 'started' && this._initted) {
        this.start();
      }
    }
  }

  private _initted = false;
  ngOnInit() {
    this.locked$
      .pipe(untilDestroyed(this))
      .subscribe((locked) => this.lockedChanged.emit(locked));

    if (!this.disabled) {
      this.start();
    }

    this._initted = true;
  }

  ngOnDestroy() {
    this.stop();
  }

  start() {
    this._locked$.next(true);

    const { words$ } = this.speech.start();
    const correctWord$ = words$.pipe(
      filter((words) => !!(this.word && words?.length)),
      map((words) =>
        words.find(
          (word) =>
            word.toLocaleLowerCase().trim() ===
            this.word!.toLocaleLowerCase().trim()
        )
      ),
      filter((correctWord) => !!correctWord),
      first()
    );
    correctWord$.subscribe(() => this.breakLock());
  }

  stop() {
    this.speech.stop();
    this._locked$.next(false);
  }

  breakLock() {
    this._locked$.next(false);
    this.speech.stop();

    const rect = this.iconRef?.nativeElement.getBoundingClientRect();
    if (rect) {
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.height / 2;
      const origin = this.confetti.getOriginByCoord({ x, y });
      this.confetti.run({
        origin,
        particleCount: 12,
        spread: 70,
        startVelocity: 15,
      });
    }
  }
}
