import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { StoreService, WordSet } from '../core/store.service';
import { LayoutService } from '../shared/material/layout.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    public store: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private layout: LayoutService
  ) {}

  readonly wordsetsSorted$ = this.store.wordSets$.pipe(
    map((wordsets) => [...wordsets].reverse())
  );

  readonly isEditMode$ = this.route.queryParams.pipe(map((qs) => !!qs['edit']));

  readonly $$ = combineLatest([
    this.wordsetsSorted$,
    this.isEditMode$,
    this.layout.isPortrait$,
  ]).pipe(
    map(([wordSets, isEditMode, isPortrait]) => ({
      wordSets,
      isEditMode,
      isPortrait,
    }))
  );

  async gotoLink(routeLink: string | unknown[], disabled?: boolean) {
    if (disabled) {
      return;
    }
    if (typeof routeLink === 'string') {
      routeLink = [routeLink];
    }
    this.router.navigate(routeLink, { relativeTo: this.route });
  }

  clickDisabled = false;

  setEditMode(enable: boolean) {
    if (enable) {
      this.router.navigate([], { queryParams: { edit: 1 } });
    } else {
      this.location.back();
    }
    this.clickDisabled = enable;
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
    const newWordSets = [...e.container.data];
    moveItemInArray(newWordSets, e.previousIndex, e.currentIndex);
    this.store.patch({ wordSets: newWordSets.reverse() });
  }
}
