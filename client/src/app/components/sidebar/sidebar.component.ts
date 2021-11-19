import { Component } from '@angular/core';
import { SocketService } from '@app/services/socket.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(private socketService: SocketService) {}

    getLOG2990() {
        return this.socketService.is2990;
    }
}
