import { Message } from '@app/message';
import { Service } from 'typedi';
import { RoomsService } from './rooms.service';

@Service()
export class TurnService {
    clientMessages: Message[];
    constructor(private readonly roomsService: RoomsService) {
        this.clientMessages = [];
    }
    getTurn(indexRoom: number): Message {
        // roomsService is undefined??? why
        const stringBody = this.roomsService.rooms[indexRoom].turn.toString();
        return {
            title: 'turn',
            body: stringBody,
        };
    }
}
