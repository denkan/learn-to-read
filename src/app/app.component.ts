import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(private route: ActivatedRoute, private router: Router) {
    // if ?p=my/path present, try navigate to it
    this.route.queryParams
      .pipe(first((params) => !!params['p']))
      .subscribe((params) => this.router.navigateByUrl(params['p']));
  }
}
