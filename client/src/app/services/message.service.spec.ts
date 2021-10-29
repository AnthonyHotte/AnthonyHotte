import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';
import { RouterTestingModule } from '@angular/router/testing';
describe('MessageService', () => {
    let service: MessageService;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MessageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
