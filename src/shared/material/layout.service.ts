import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  constructor(public breakpointObserver: BreakpointObserver) {}

  isPortrait() {
    return this.breakpointObserver.isMatched('(orientation: portrait)');
  }
  isLandscape() {
    return !this.isPortrait();
  }

  readonly orientationChanged$ = this.breakpointObserver.observe([
    '(orientation: portrait)',
    '(orientation: landscape)',
  ]);

  readonly isPortrait$ = this.orientationChanged$.pipe(
    map(() => this.isPortrait())
  );
  readonly isLandscape$ = this.orientationChanged$.pipe(
    map(() => this.isLandscape())
  );
}
