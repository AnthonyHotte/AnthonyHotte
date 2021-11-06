import { expect } from 'chai';
import { describe } from 'mocha';
import { Room } from './room';

describe('Room', () => {
    let room: Room;
    before(() => {
        room = new Room('room1', 1);
    });
    it('should create a room', () => {
        expect(room.roomName).equal('room1');
    });

    it('setStartingInfo should set the room', () => {
        const timeGame = 30;
        room.setStartingInfo(
            timeGame,
            'Antho',
            'hdf6547',
            false,
            [{ letter: 'a', quantity: 1, point: 1 }],
            [{ letter: 'a', quantity: 1, point: 1 }],
            [],
        );

        expect(room.roomName).equal('room1');
        expect(room.playerNames[0]).equal('Antho');
        expect(room.socketsId[0]).equal('hdf6547');
    });
    it('cleanRoom should clean the room', () => {
        room.timePerTurn = 30;
        room.playerNames = ['antho', 'hotte'];
        room.bonusOn = true;
        room.cleanRoom();
        const defaultTimePerTurn = 60;
        expect(room.bonusOn).equal(false);
        expect(room.playerNames[0]).equal('joueur1');
        expect(room.timePerTurn).equal(defaultTimePerTurn);
    });
    it('set room occupied', () => {
        room.roomIsAvailable = true;
        room.setRoomOccupied();
        expect(room.roomIsAvailable).equal(false);
    });
    it('set room available', () => {
        room.roomIsAvailable = false;
        room.setRoomAvailable();
        expect(room.roomIsAvailable).equal(true);
    });
    it('returnLettersInString ...', () => {
        room.lettersCreator = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        const res = room.returnLettersInString(true);
        expect(res).equal('ae');
    });
    it('returnLettersInString ...', () => {
        room.lettersJoiner = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        const res = room.returnLettersInString(false);
        expect(res).equal('ae');
    });
});
