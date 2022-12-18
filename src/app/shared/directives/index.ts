import { NgModule } from '@angular/core';

import { LongPressDirective } from './longpress.directive';

const directives = [LongPressDirective];

@NgModule({
  imports: [],
  exports: [...directives],
  declarations: [...directives],
  providers: [],
})
export class DirectiveModule {}
