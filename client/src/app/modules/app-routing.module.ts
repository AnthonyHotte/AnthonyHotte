import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { GameSelectionPageComponent } from '@app/pages/game-selection-page/game-selection-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { OpponentWaitingRoomComponent } from '@app/pages/opponent-waiting-room/opponent-waiting-room.component';
import { SoloGameInitiatorComponent } from '@app/pages/solo-game-initiator/solo-game-initiator.component';
import { WaitingRoomComponent } from '@app/pages/waiting-room/waiting-room.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'admin', component: AdminPageComponent },
    { path: 'home', component: MainPageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'material', component: MaterialPageComponent },
    { path: 'selection', component: GameSelectionPageComponent },
    { path: 'soloInitiator', component: SoloGameInitiatorComponent },
    { path: 'waiting', component: WaitingRoomComponent },
    { path: 'gameSelection', component: OpponentWaitingRoomComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
