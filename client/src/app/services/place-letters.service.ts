import { Injectable } from '@angular/core';
import { GridService } from '@app/services/grid.service';
// eslint-disable-next-line no-restricted-imports
import * as Constants from '../constants';

@Injectable({
    providedIn: 'root',
})
export class PlaceLettersService {
    row: number;
    colomnNumber: number;
    orientation: string;
    wordToPlace: string;
    spaceIndexInput: number;
    constructor(private readonly gridService: GridService) {}
    // TODO firstletter to place
    // TODO input seperated by , ?
    // TODO make sure that 2 " " back to back doesn't break the input
    // this function verify that the input is the right length so that it can be separeted by the next function
    checkArgumentInputlength(unCheckedUnVerifiedInput: string): string {
        // TODO not break when " " add the end of command;
        let returnVariable = 'invalid input'; // TODO change to french for display ?
        for (let i = 0; i <= unCheckedUnVerifiedInput.length; i++) {
            if (unCheckedUnVerifiedInput.charAt(i) === ' ') {
                const firstArgument: string = unCheckedUnVerifiedInput.substring(0, i);
                // const lastArgument: string = unCheckedUnVerifiedInput.substring(i + 1, unCheckedUnVerifiedInput.length - 1);
                if (firstArgument.length !== (Constants.PLACERCOMMANDFIRSTARGUMENTVALIDLENGTH || Constants.PLACERCOMMANDFIRSTARGUMENTVALIDLENGTH2)) {
                    returnVariable = 'first argument length invalid'; // TODO change to french for display ?
                } else {
                    this.spaceIndexInput = i;
                    returnVariable = 'ok';
                }
            }
            // if (i === unCheckedUnVerifiedInput.length) {
            //   returnVariable = "input doesn't containt 2 arguments";
            // }
        }
        return returnVariable;
    }
    seperateInputVariable(checkedUnVerifiedInput: string) {
        const firstArgument: string = checkedUnVerifiedInput.substring(0, this.spaceIndexInput);
        const lastArgument: string = checkedUnVerifiedInput.substring(this.spaceIndexInput + 1, checkedUnVerifiedInput.length);
        this.wordToPlace = lastArgument;
        // get the colomn number depending on if it's a colomn number made of 1 or 2 numbers (if it's above 9)
        if (firstArgument.length === 3) {
            this.row = this.rowLetterToNumbers(firstArgument.toLocaleLowerCase().charAt(0));
            this.colomnNumber = Number(firstArgument.charAt(1));
            this.orientation = firstArgument.charAt(2);
        } else {
            this.row = this.rowLetterToNumbers(firstArgument.toLocaleLowerCase().charAt(0));
            this.colomnNumber = Number(firstArgument.substring(1, 2));
            this.orientation = firstArgument.charAt(3);
        }
    }
    verifyrowInputVariable(): boolean {
        if (this.row > Constants.NUMBEROFCASE || this.row < 0) {
            return false;
        } else {
            return true;
        }
    }
    verifyColomnInputVariable(): boolean {
        if (this.colomnNumber > Constants.NUMBEROFCASE || this.colomnNumber < 0) {
            return false;
        } else {
            return true;
        }
    }
    verifyOrientationInputVariable(): boolean {
        if (this.orientation === 'h' || this.orientation === 'v') {
            return true;
        } else {
            return false;
        }
    }
    verifyWordToPlaceInputVariable(): string {
        let isAsciiCodeBelowa: boolean;
        let isAsciiCodeAbovez: boolean;
        for (let i = 0; this.wordToPlace.length; i++) {
            isAsciiCodeBelowa = this.wordToPlace.toLowerCase().charCodeAt(i) < Constants.ASCIICODEOFLOWERA;
            isAsciiCodeAbovez = this.wordToPlace.toLowerCase().charCodeAt(i) > Constants.ASCIICODEOFLOWERZ;
            if (isAsciiCodeBelowa || isAsciiCodeAbovez) {
                return 'the word argument contains illegal character';
            }
        }
        if (this.wordToPlace.length > Constants.NUMBEROFCASE || this.wordToPlace.length > 0) {
            return 'the word length is invalid';
        } else {
            return 'ok';
        }
    }
    verifyTileNotOutOfBound(): boolean {
        if (this.orientation === 'h' && this.colomnNumber + this.wordToPlace.length >= Constants.NUMBEROFCASE) {
            return false;
        } else if (this.orientation === 'v' && this.row + this.wordToPlace.length >= Constants.NUMBEROFCASE) {
            return false;
        } else {
            return true;
        }
    }
    verifyInputArgument(): string {
        if (!this.verifyrowInputVariable()) {
            return 'La lettre de ligne est invalide';
        } else if (!this.verifyColomnInputVariable()) {
            return 'Le numero de colonne est invalide';
        } else if (!this.verifyOrientationInputVariable()) {
            return "l'argument d'orientation est invalide";
        } else if (!this.verifyTileNotOutOfBound()) {
            return 'le mot ne rentre pas sur le plateau';
        } else {
            return 'ok';
        }
    }
    checkinput(commandrowInput: string): string {
        const regexInput = /(?<letter>[a-o])(?<number>[0-9]|1[0-5])(?<dir>[hv])(?<space>[ ])(?<word>[a-zA-Z]{1,15})/;
        const match = regexInput.exec(commandrowInput);
        if (match != null && match.groups != null) {
            this.row = this.rowLetterToNumbers(match.groups.letter);
            this.colomnNumber = Number(match.groups.number);
            this.orientation = match.groups.dir;
            this.wordToPlace = match.groups.word;
            return 'ok';
        } else {
            return 'Mauvais input!';
        }
    }
    placeWord(commandrowInput: string): string {
        // const checkArgumentlength: string = this.checkArgumentInputlength(commandrowInput);
        const chekinput = this.checkinput(commandrowInput);
        if (chekinput === 'ok') {
            const tileoutofbound = this.verifyTileNotOutOfBound();
            if (tileoutofbound === false) {
                return 'le mot dépasse du plateau de jeux';
            } else {
                this.drawword();
                return 'ok';
            }
            // if (can it be placed.service.chek() )//TODO add if the word exist and can be placed there
        } else {
            return 'argument de commande invalide';
        }
    }
    drawword() {
        let xtile: number = this.colomnNumber;
        let ytile: number = this.row;
        for (let i = 0; i <= this.wordToPlace.length - 1; i++) {
            this.gridService.drawLetterwithpositionstring(this.wordToPlace.charAt(i), xtile, ytile);
            // TODO repplace with drawletterwithposition and integrate with position
            if (this.orientation === 'h') {
                xtile++;
            } else if (this.orientation === 'v') {
                ytile++;
            }
        }
    }
    testing(): string {
        return this.row + ' ' + this.colomnNumber + ' ' + this.orientation + ' ' + this.wordToPlace;
    }
    rowLetterToNumbers(row: string): number {
        const x: number = row.charCodeAt(0) - Constants.SIDELETTERS_TO_ASCII;
        return x;
    }
    /*
    placeLetter(input: string){
        const rowLetter: string = input.charAt(0).toUpperCase();
        const colomnNumber: number = Number(input.charAt(0));
        if (Constants.SIDELETTERS.includes(rowLetter) == false) {
          // TODO display error message on console
        }else if {colomnNumber != 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9

        }
      row:number = this.rowLetterToNumbers(row_colomn.charAt(0));
      colomn:number =row_colomn.charAt(1);
      this.gridService.drawLetterwithposition()
      
    }
    */
}
