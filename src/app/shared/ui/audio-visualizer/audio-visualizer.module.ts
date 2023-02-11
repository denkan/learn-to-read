import { NgModule } from '@angular/core';
import { CanvasAutoSizeModule } from '../../directives/canvas-auto-size.directive';

import { AudioVisualizerComponent } from './audio-visualizer.component';

const shared = [AudioVisualizerComponent];

@NgModule({
  imports: [CanvasAutoSizeModule],
  declarations: [...shared],
  exports: [...shared],
  providers: [],
})
export class AudioVisualizerModule {}
