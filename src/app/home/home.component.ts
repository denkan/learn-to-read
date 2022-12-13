import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { StoreService } from '../../core/store.service';

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

  private _enableClickTimer?: NodeJS.Timer;
  enableClick() {
    clearTimeout(this._enableClickTimer);
    this._enableClickTimer = setTimeout(() => {
      this.clickDisabled = false;
    }, 100);
  }
}
