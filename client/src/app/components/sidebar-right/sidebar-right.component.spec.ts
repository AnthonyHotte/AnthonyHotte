import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarRightComponent } from '@app/components/sidebar-right/sidebar-right.component';
import { SoloOpponent2Service } from '@app/services/solo-opponent2.service';

class SoloStub extends SoloOpponent2Service {}
describe('SidebarRightComponent', () => {
    let component: SidebarRightComponent;
    let fixture: ComponentFixture<SidebarRightComponent>;
    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [SidebarRightComponent],
                providers: [{ provide: SoloOpponent2Service, useValue: SoloStub }],
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
