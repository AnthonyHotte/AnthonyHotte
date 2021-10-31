import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpData } from '@app/classes/pop-up-data';

import { PopUpComponent } from './pop-up.component';

describe('PopUpComponent', () => {
    let component: PopUpComponent;
    let fixture: ComponentFixture<PopUpComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PopUpComponent>>;
    let dataSpy: jasmine.SpyObj<PopUpData>;

    beforeEach(async () => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
        await TestBed.configureTestingModule({
            declarations: [PopUpComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: PopUpData, useValue: dataSpy },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PopUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onConfirm should call close', () => {
        component.onConfirm();
        expect(dialogRefSpy.close).toHaveBeenCalled();
    });
});
