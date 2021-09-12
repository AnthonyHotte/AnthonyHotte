import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoloGameInitiatorComponent } from './solo-game-initiator.component';

describe('SoloGameInitiatorComponent', () => {
  let component: SoloGameInitiatorComponent;
  let fixture: ComponentFixture<SoloGameInitiatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoloGameInitiatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoloGameInitiatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
