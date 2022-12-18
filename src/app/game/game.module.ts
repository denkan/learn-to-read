import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../shared/material/material.module';
import { GameEndedComponent } from './game-ended/game-ended.component';
import { GameComponent } from './game.component';
import { GameGuard } from './game.guard';
import { GameService } from './game.service';
import { MapLowerUpperWordsComponent } from './map-lower-upper-words/map-lower-upper-words.component';
import { WordComponent } from './_components/word.component';

const routes: Routes = [
  {
    path: ':wordsetId',
    component: GameComponent,
    canActivate: [GameGuard],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule],
  declarations: [
    GameComponent,
    WordComponent,
    GameEndedComponent,
    MapLowerUpperWordsComponent,
  ],
  providers: [GameService, GameGuard],
})
export class GameModule {}
