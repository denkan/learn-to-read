import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsetFormComponent } from './wordset-form.component';

describe('WordsetFormComponent', () => {
  let component: WordsetFormComponent;
  let fixture: ComponentFixture<WordsetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordsetFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
