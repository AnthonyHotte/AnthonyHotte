import { RoomsService } from '@app/services/rooms.service';
import { expect } from 'chai';

describe('Date Service', () => {
    let roomService: RoomsService;

    before(() => {
        roomService = new RoomsService();
    });

    it('currentTime should return a valid message', async () => {
        const NUMBEROFROOMS = 50;
        expect(roomService.rooms.length).to.equal(NUMBEROFROOMS);
    });
});
