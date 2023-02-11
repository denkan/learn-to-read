import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs';
import { StoreService } from './core/store.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: StoreService,
    private translate: TranslateService
  ) {
    // if ?p=my/path present, try navigate to it
    this.route.queryParams
      .pipe(first((params) => !!params['p']))
      .subscribe((params) => this.router.navigateByUrl(params['p']));

    // track chosen language
    this.store.language$.subscribe((lang) => translate.use(lang));
  }
}
