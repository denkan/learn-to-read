import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, first, map } from 'rxjs';
import { ImportService } from './core/import.service';
import { StoreService } from './core/store.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(
    route: ActivatedRoute,
    router: Router,
    store: StoreService,
    translate: TranslateService,
    importService: ImportService
  ) {
    // if ?p=my/path present, try navigate to it
    route.queryParams
      .pipe(first((params) => !!params['p']))
      .subscribe((params) => router.navigateByUrl(params['p']));

    // track chosen language
    store.language$.subscribe((lang) => translate.use(lang));

    // track import data
    route.queryParams
      .pipe(
        map((qs) => qs['in']),
        filter((x) => !!x)
      )
      .subscribe((importData) =>
        importService.importWordsetsFromJson(importData)
      );
  }
}
