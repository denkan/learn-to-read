import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DirectiveModule } from '../shared/directives';
import { MaterialModule } from '../shared/material/material.module';

import { HomeComponent } from './home.component';
import { LanguageSelectorComponent } from './language-selector.component';
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
    TranslateModule.forChild(),
  ],
  exports: [],
  declarations: [
    HomeComponent,
    WordsetFormComponent,
    LanguageSelectorComponent,
  ],
  providers: [],
})
export class HomeModule {}
