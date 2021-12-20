import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuffleGameComponent } from './shuffle-game.component';

describe('ShuffleGameComponent', () => {
  let component: ShuffleGameComponent;
  let fixture: ComponentFixture<ShuffleGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShuffleGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuffleGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
