import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-language-selector',
  template: `
    <ul class="language-selector">
      <li *ngFor="let l of languages" [class.current]="l.id === current">
        <button
          (click)="change.emit(l.id)"
          [attr.aria-label]="l.text"
          [attr.title]="l.text"
        >
          <img
            src="https://flagicons.lipis.dev/flags/4x3/{{ l.flag }}.svg"
            [alt]="l.text"
          />
        </button>
      </li>
    </ul>
  `,
  styles: [
    `
      ul.language-selector {
        &,
        li {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        & {
          padding: 0.25em;
        }

        li {
          opacity: 0.5;
          &:hover {
            opacity: 0.75;
          }

          &.current {
            opacity: 1;
          }
        }

        button {
          font-size: 1em;
          padding: 0.25em;
          margin: 0;
          border: 0;
          background: transparent;
          border: 2px solid transparent;
          cursor: pointer;

          img {
            width: 2em;
            height: 1.5em;
          }
        }
      }
    `,
  ],
})
export class LanguageSelectorComponent {
  @Input() current?: string;
  @Output() change = new EventEmitter<string>();

  constructor() {}

  readonly languages = [
    {
      id: 'sv',
      flag: 'se',
      text: 'Svenska',
    },
    {
      id: 'en',
      flag: 'gb',
      text: 'English',
    },
  ];
}
