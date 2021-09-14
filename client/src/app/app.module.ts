import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { AutosizeModule } from 'ngx-autosize';
import { SidebarRightComponent } from './components/sidebar-right/sidebar-right.component';
import { TextBoxRefactoredComponent } from './components/text-box-refactored/text-box-refactored.component';
import { GameSelectionPageComponent } from './pages/game-selection-page/game-selection-page.component';
import { HighestScoresComponent } from './pages/highest-scores/highest-scores.component';
import { SoloGameInitiatorComponent } from './pages/solo-game-initiator/solo-game-initiator.component';
import { SoloModeInformationsService } from './services/solo-mode-informations.service';

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
        HighestScoresComponent,
        GameSelectionPageComponent,
        SoloGameInitiatorComponent,
        SidebarRightComponent,
        TextBoxRefactoredComponent,
    ],
    imports: [AppMaterialModule, AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule, AutosizeModule],
    providers: [SoloModeInformationsService],
    bootstrap: [AppComponent],
})
export class AppModule {}
