import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LettersComponent } from '@app/components/letters/letters.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { CountdownModule } from '@ciri/ngx-countdown';
import { AutosizeModule } from 'ngx-autosize';
import { SidebarRightComponent } from './components/sidebar-right/sidebar-right.component';
import { TextBoxComponent } from './components/text-box/text-box';
import { GameSelectionPageComponent } from './pages/game-selection-page/game-selection-page.component';
import { SoloGameInitiatorComponent } from './pages/solo-game-initiator/solo-game-initiator.component';
import { FinishedGameComponent } from './components/finished-game/finished-game.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        GameSelectionPageComponent,
        SoloGameInitiatorComponent,
        SidebarRightComponent,
        TextBoxComponent,
        LettersComponent,
        FinishedGameComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AutosizeModule,
        CountdownModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
