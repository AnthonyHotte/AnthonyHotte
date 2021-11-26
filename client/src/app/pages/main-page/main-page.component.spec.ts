import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { BestScoreService } from '@app/services/best-score.service';
import { CommunicationService } from '@app/services/communication.service';
import { SocketService } from '@app/services/socket.service';
import { of } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let communicationServiceSpy: SpyObj<CommunicationService>;
    let bestScoreServiceSpy: SpyObj<BestScoreService>;
    let socketServiceSpy: SpyObj<SocketService>;

    beforeEach(async () => {
        socketServiceSpy = jasmine.createSpyObj('SocketService', ['getMessageObservable']);
        socketServiceSpy.is2990 = false;
        bestScoreServiceSpy = jasmine.createSpyObj('BestScoreService', ['updateBestScore']);
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['basicGet', 'basicPost', 'getBestScoreClassique']);
        communicationServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
        communicationServiceSpy.basicPost.and.returnValue(of());

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [
                { provide: CommunicationService, useValue: communicationServiceSpy },
                { provide: BestScoreService, useValue: bestScoreServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'LOG2990'", () => {
        expect(component.title).toEqual('LOG2990');
    });

    it('should call basicGet when calling getMessagesFromServer', () => {
        component.getMessagesFromServer();
        expect(communicationServiceSpy.basicGet).toHaveBeenCalled();
    });

    it('should call basicPost when calling sendTimeToServer', () => {
        component.sendTimeToServer();
        expect(communicationServiceSpy.basicPost).toHaveBeenCalled();
    });
    it('updateBestScore should call updateBestScore', () => {
        component.updateBestScore();
        expect(bestScoreServiceSpy.updateBestScore).toHaveBeenCalled();
    });
    it('setMode2990 should call updateBestScore', () => {
        component.setMode2990(true);
        expect(socketServiceSpy.is2990).toBe(true);
    });
});
