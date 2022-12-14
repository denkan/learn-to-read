import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { StoreService, WordSet } from '../../core/store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    public store: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  readonly wordsetsSorted$ = this.store.wordSets$.pipe(
    map((wordsets) => wordsets.reverse())
  );

  readonly $$ = combineLatest([this.wordsetsSorted$]).pipe(
    map(([wordSets]) => ({ wordSets }))
  );

  gotoLink(routeLink: string | unknown[]) {
    if (this.editMode) {
      return;
    }
    if (typeof routeLink === 'string') {
      routeLink = [routeLink];
    }
    this.router.navigate(routeLink, { relativeTo: this.route });
  }

  editMode = false;
  clickDisabled = false;

  setEditMode(enabled: boolean) {
    this.editMode = enabled;
    this.clickDisabled = enabled;
  }

  // hack to disable the click that occur at longpress release
  private _enableClickTimer?: NodeJS.Timer;
  enableClick() {
    clearTimeout(this._enableClickTimer);
    this._enableClickTimer = setTimeout(() => {
      this.clickDisabled = false;
    }, 100);
  }

  onBoxSortDrop(e: CdkDragDrop<WordSet[]>) {
    console.log(e);
  }
}
