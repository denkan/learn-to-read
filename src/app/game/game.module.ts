import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../shared/material/material.module';
import { ConfettiModule } from '../shared/ui/confetti/confetti.module';
import { StarsModule } from '../shared/ui/stars';
import { GameEndedComponent } from './game-ended/game-ended.component';
import { GameComponent } from './game.component';
import { CreateGameGuard, RequireGameGuard } from './game.guards';
import { GameService } from './game.service';
import { MapLowerUpperWordsComponent } from './sub-games/map-lower-upper-words/map-lower-upper-words.component';
import { WordComponent } from './_components/word.component';

const routes: Routes = [
  {
    path: ':wordsetId',
    component: GameComponent,
    canActivate: [RequireGameGuard],
  },
  {
    path: ':wordsetId/new',
    component: GameComponent,
    canActivate: [CreateGameGuard],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    StarsModule,
    ConfettiModule,
  ],
  declarations: [
    GameComponent,
    WordComponent,
    GameEndedComponent,
    MapLowerUpperWordsComponent,
  ],
  providers: [GameService, CreateGameGuard, RequireGameGuard],
})
export class GameModule {}
