import { Component } from '@angular/core';
import { map } from 'rxjs';
import { StoreService } from '../../core/store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(public store: StoreService) {}
}
