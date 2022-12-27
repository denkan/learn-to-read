import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameInfo, SubGame } from '../game.types';

@Component({ template: '' })
export abstract class SubGameBase<T = unknown> {
  @Input() gameInfo?: GameInfo;
  @Output() patch = new EventEmitter<Partial<SubGame<T>>>();
}
