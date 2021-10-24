import { Room } from '@app/classes/room';
import { NUMBEROFROOMS } from '@app/constants';
import { Service } from 'typedi';

@Service()
export class RoomsService {
    rooms: Room[];
    listRoomWaiting: Room[];
    indexNextRoom: number;
    constructor() {
        this.indexNextRoom = 0;
        this.rooms = [];
        this.listRoomWaiting = [];
        for (let i = 0; i < NUMBEROFROOMS; i++) {
            this.rooms.push(new Room('room number' + i, i));
        }
    }
}
