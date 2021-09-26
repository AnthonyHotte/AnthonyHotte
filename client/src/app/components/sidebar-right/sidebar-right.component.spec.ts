import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SidebarRightComponent } from '@app/components/sidebar-right/sidebar-right.component';

describe('SidebarRightComponent', () => {
    let component: SidebarRightComponent;
    let fixture: ComponentFixture<SidebarRightComponent>;
    /*
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SidebarRightComponent],
            imports: [RouterTestingModule],
        }).compileComponents();
    });*/
    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [SidebarRightComponent],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarRightComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
