import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../shared/material/material.module';
import { GameType } from './game-types';
import { GameComponent } from './game.component';
import { GameService } from './game.service';
import { MapLowerUpperWordsComponent } from './map-lower-upper-words/map-lower-upper-words.component';
import { WordComponent } from './_components/word.component';

const routes: Routes = [
  {
    path: ':wordsetIndex',
    component: GameComponent,
    children: [
      {
        path: GameType.MapLowerUpperWords,
        component: MapLowerUpperWordsComponent,
      },
      { path: '**', redirectTo: GameType.MapLowerUpperWords },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule],
  declarations: [GameComponent, WordComponent, MapLowerUpperWordsComponent],
  providers: [GameService],
})
export class GameModule {}
