import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketService } from './socket.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
describe('MessageService', () => {
    let service: MessageService;
    let socketSpy: jasmine.SpyObj<SocketService>;
    let routerSpy: jasmine.SpyObj<Router>;
    beforeEach(async () => {
        socketSpy = jasmine.createSpyObj('SocketService', ['getMessageObservable']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: SocketService, useValue: socketSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MessageService);
        service.gameStartingInfo = new BehaviorSubject<boolean>(true);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('gameStartingInfoSubscribe should call navigate', () => {
        socketSpy.startGame = new BehaviorSubject<boolean>(true);
        service.gameStartingInfoSubscribe();
        expect(routerSpy.navigate).toHaveBeenCalled();
    });
    it('gameStartingInfoSubscribe should not call navigate', () => {
        socketSpy.startGame = new BehaviorSubject<boolean>(false);
        service.gameStartingInfoSubscribe();
        expect(routerSpy.navigate).toHaveBeenCalledTimes(0);
    });
});
