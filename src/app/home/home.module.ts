import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DirectiveModule } from 'src/shared/directives';
import { MaterialModule } from '../../shared/material/material.module';

import { HomeComponent } from './home.component';
import { WordsetFormComponent } from './wordset-form/wordset-form.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'new', component: WordsetFormComponent },
      { path: 'edit/:id', component: WordsetFormComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    ReactiveFormsModule,
    DirectiveModule,
  ],
  exports: [],
  declarations: [HomeComponent, WordsetFormComponent],
  providers: [],
})
export class HomeModule {}
