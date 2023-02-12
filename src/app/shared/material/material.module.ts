import { NgModule } from '@angular/core';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const modules = [
  LayoutModule,
  DragDropModule,
  ClipboardModule,
  MatButtonModule,
  MatRippleModule,
  MatFormFieldModule,
  MatInputModule,
  MatChipsModule,
  MatIconModule,
  MatCheckboxModule,
  MatSnackBarModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
  declarations: [],
  providers: [],
})
export class MaterialModule {}
