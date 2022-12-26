import { NgModule } from '@angular/core';

import { ConfettiDirective } from './confetti.directive';

const sharedComps = [ConfettiDirective];

@NgModule({
  imports: [],
  exports: [...sharedComps],
  declarations: [...sharedComps],
  providers: [],
})
export class ConfettiModule {}
