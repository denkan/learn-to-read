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
import {
  BehaviorSubject,
  combineLatest,
  filter,
  first,
  map,
  pairwise,
  throttleTime,
} from 'rxjs';
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
      <ng-container *ngIf="shakePos$ | async as shake">
        <div
          class="box"
          [style.--shake-x]="shake.x"
          [style.--shake-y]="shake.y"
        >
          <span class="icon" #iconRef (click)="iconClick.emit()">
            <mat-icon>{{ locked ? 'lock' : 'mood' }}</mat-icon>
          </span>
          <app-audio-visualizer
            [audioData]="audioData$ | async"
          ></app-audio-visualizer>
        </div>
      </ng-container>
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
            z-index: 4;
            left: 50%;
            bottom: 0;
            transform: translate(-50%, 50%);
            background: var(--color-bg);
            border-radius: 50%;
            > * {
              font-size: 125%;
            }
          }
          app-audio-visualizer {
            display: none;
            width: calc(100% - 1em);
            height: 2em;
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translate(-50%, 50%);
            z-index: 3;
          }
        }

        &.locked .box {
          animation: none;
        }
        &.listening {
          .box {
            .icon {
              animation: 1s listening ease-in-out infinite;
              transition: 0.1s;
              transform: translate(
                calc(-50% + (var(--shake-x) * 0.2em)),
                calc(50% + (var(--shake-y) * 0.2em))
              );
            }
            app-audio-visualizer {
              display: inline-block;
            }
          }
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
  @Output() iconClick = new EventEmitter<void>();

  constructor(
    public speech: SpeechService,
    private confetti: ConfettiService
  ) {}

  @ViewChild('iconRef') iconRef?: ElementRef<HTMLSpanElement>;

  private _locked$ = new BehaviorSubject<boolean>(false);
  readonly locked$ = this._locked$.asObservable();

  readonly shakePos$ = this.speech.audioSignal$.pipe(
    throttleTime(50),
    pairwise(),
    map(([n1, n2]) => {
      const randomNegative = (n: number) =>
        (Math.round(Math.random()) ? -1 : 1) * n;
      const x = randomNegative(n1.diff);
      const y = randomNegative(n2.diff);
      return { x, y };
    })
  );
  readonly audioData$ = this.speech.audioSignal$.pipe(
    filter((x) => !!x),
    map((x) => x.data)
  );

  @HostBinding('class.locked')
  get locked() {
    return this._locked$.value && this.isListening;
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
    combineLatest([this.locked$, this.speech.status$])
      .pipe(untilDestroyed(this))
      .subscribe(([locked, status]) => {
        const isLocked = locked && status === 'started' && !this.disabled;
        this.lockedChanged.emit(isLocked);
      });

    if (!this.disabled) {
      this.start();
    }

    this._initted = true;
  }

  ngOnDestroy() {
    this.stop();
  }

  async start() {
    if (!this.speech.isSupported) {
      this._locked$.next(false);
      return;
    }

    this._locked$.next(true);

    const { words$ } = await this.speech.start();
    const correctWord$ = words$.pipe(
      untilDestroyed(this),
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
