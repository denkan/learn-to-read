import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { MapLowerUpperWordsComponent } from './map-lower-upper-words/map-lower-upper-words.component';
import { RouterModule, Routes } from '@angular/router';
import { GameType } from './game-types';
import { GameService } from './game.service';
import { WordComponent } from './_components/word.component';
import { MaterialModule } from 'src/shared/material/material.module';

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
