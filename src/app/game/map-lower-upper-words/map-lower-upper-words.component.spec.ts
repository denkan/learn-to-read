import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLowerUpperWordsComponent } from './map-lower-upper-words.component';

describe('MapLowerUpperWordsComponent', () => {
  let component: MapLowerUpperWordsComponent;
  let fixture: ComponentFixture<MapLowerUpperWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapLowerUpperWordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapLowerUpperWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
