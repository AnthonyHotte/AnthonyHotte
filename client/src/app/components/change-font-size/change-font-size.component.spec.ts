import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeFontSizeComponent } from './change-font-size.component';

describe('ChangeFontSizeComponent', () => {
  let component: ChangeFontSizeComponent;
  let fixture: ComponentFixture<ChangeFontSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeFontSizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeFontSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
