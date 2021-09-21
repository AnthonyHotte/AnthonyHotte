import { TestBed } from '@angular/core/testing';
import { SoloGameInformationService } from './solo-game-information.service';

describe('SoloGameInformationService', () => {
    let service: SoloGameInformationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SoloGameInformationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should send a message correctly', () => {
        const arrMessage = ['Hello', 'World'];
        service.sendMessage(arrMessage);
        let index = 0;
        for (const message of arrMessage) {
            expect(service.message[index++]).toEqual(message);
        }
    });
    it('send message should call next()', () => {
        const nextSpy = spyOn(service.subject, 'next');
        const arrMessage = ['Hello', 'World'];
        service.sendMessage(arrMessage);
        expect(nextSpy).toHaveBeenCalledWith(arrMessage);
    });
    it('clear message should call next()', () => {
        const nextSpy = spyOn(service.subject, 'next');
        service.clearMessages();
        expect(nextSpy).toHaveBeenCalled();
    });
    it('get message should call asObservable()', () => {
        const nextSpy = spyOn(service.subject, 'asObservable');
        service.getMessage();
        expect(nextSpy).toHaveBeenCalled();
    });
});
