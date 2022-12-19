import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material/material.module';

import { StarComponent } from './star.component';
import { StarsComponent } from './stars.component';

const sharedComps = [StarComponent, StarsComponent];

@NgModule({
  imports: [CommonModule, MaterialModule],
  exports: [...sharedComps],
  declarations: [...sharedComps],
  providers: [],
})
export class StarsModule {}
