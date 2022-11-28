import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';

const sharedModules = [CommonModule, MaterialModule];

@NgModule({
  imports: [...sharedModules],
  exports: [...sharedModules],
  declarations: [],
  providers: [],
})
export class CoreModule {}
