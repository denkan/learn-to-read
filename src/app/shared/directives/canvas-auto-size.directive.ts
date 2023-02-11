import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  NgModule,
  OnInit,
  Output,
} from '@angular/core';

@Directive({ selector: 'canvas[auto-size]' })
export class CanvasAutoSizeDirective implements OnInit {
  @Output() resized = new EventEmitter<{ width: number; height: number }>();

  constructor(private elemRef: ElementRef<HTMLCanvasElement>) {}

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.resize();
  }

  ngOnInit() {
    this.resize();
    setTimeout(() => this.resize(), 200);
  }

  resize(emit = true) {
    const width = (this.elemRef.nativeElement.width =
      this.elemRef.nativeElement.clientWidth);
    const height = (this.elemRef.nativeElement.height =
      this.elemRef.nativeElement.clientHeight);

    if (emit) {
      this.resized.emit({ width, height });
    }
  }
}

@NgModule({
  imports: [],
  exports: [CanvasAutoSizeDirective],
  declarations: [CanvasAutoSizeDirective],
  providers: [],
})
export class CanvasAutoSizeModule {}
