import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBoxRefactoredComponent } from './text-box-refactored.component';

describe('TextBoxRefactoredComponent', () => {
  let component: TextBoxRefactoredComponent;
  let fixture: ComponentFixture<TextBoxRefactoredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextBoxRefactoredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBoxRefactoredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
