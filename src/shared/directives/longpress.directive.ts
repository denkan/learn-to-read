import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({ selector: '[longpress]' })
export class LongPressDirective {
  @Output('longpress') longPress = new EventEmitter<MouseEvent | TouchEvent>();
  @Output('longpressEnd') longPressEnd = new EventEmitter<
    MouseEvent | TouchEvent
  >();
  @Input('longpressTime') time = 1000;

  private _timer?: NodeJS.Timeout;
  private _didSend = false;

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onStart(e: MouseEvent | TouchEvent) {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.longPress.emit(e);
      this._didSend = true;
    }, this.time);
  }

  @HostListener('window:touchend', ['$event'])
  @HostListener('window:mouseup', ['$event'])
  onAbort(e: MouseEvent | TouchEvent) {
    clearTimeout(this._timer);
    if (this._didSend) {
      this.longPressEnd.emit(e);
    }
    this._didSend = false;
  }
}
