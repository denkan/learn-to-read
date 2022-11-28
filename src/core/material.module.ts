import { NgModule } from '@angular/core';

import { MatRippleModule } from '@angular/material/core';

const modules = [MatRippleModule];

@NgModule({
  imports: [...modules],
  exports: [...modules],
  declarations: [],
  providers: [],
})
export class MaterialModule {}
