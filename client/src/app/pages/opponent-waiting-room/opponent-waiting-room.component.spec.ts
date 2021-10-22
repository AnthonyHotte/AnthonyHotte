import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpponentWaitingRoomComponent } from './opponent-waiting-room.component';

describe('OpponentWaitingRoomComponent', () => {
    let component: OpponentWaitingRoomComponent;
    let fixture: ComponentFixture<OpponentWaitingRoomComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OpponentWaitingRoomComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OpponentWaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
