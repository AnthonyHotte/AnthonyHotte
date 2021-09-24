import { Injectable } from '@angular/core';
import { TileMap } from '@app/classes/grid-special-tile';
import { Vec2 } from '@app/classes/vec2';
import * as Constants from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_WIDTH };
    // injector = Injector.create([{ provide: PlaceLettersService }]);
    drawGrid() {
        // Place numbers at the top
        this.placeNumberTop();

        // place letters to the left side of the this.gridContext
        this.placeLetterSide();

        // create this.gridContext
        for (let i = 1; i <= Constants.NUMBEROFCASE; i++) {
            for (let j = 1; j <= Constants.NUMBEROFCASE; j++) {
                this.drawtilebackground(i, j);
            }
        }
    }
    drawtilebackground(i: number, j: number) {
        // for the case style
        let textChoice = -1;
        // word x2 (pink)
        if (TileMap.gridMap.isDoubleWordTile(i, j)) {
            this.gridContext.fillStyle = 'pink';
            if (i !== Constants.CENTERCASE && j !== Constants.CENTERCASE) {
                textChoice = 0;
            }
        }
        // word x3 (red)
        else if (TileMap.gridMap.isTripleWordTile(i, j)) {
            this.gridContext.fillStyle = 'red';
            textChoice = 1;
        }
        // Letter x3 (dark blue)
        else if (TileMap.gridMap.isTripleLetterTile(i, j)) {
            this.gridContext.fillStyle = 'darkblue';
            textChoice = 2;
        }
        // Letter x2 (Light blue)
        else if (TileMap.gridMap.isDoubleLetterTile(i, j)) {
            this.gridContext.fillStyle = '#add8e6';
            textChoice = 3;
        } else {
            this.gridContext.fillStyle = 'grey';
        }

        this.gridContext.fillRect(
            Constants.CASESIZE * (i - 1) + Constants.SIDESPACE,
            Constants.CASESIZE * (j - 1) + Constants.SIDESPACE,
            Constants.CASESIZE,
            Constants.CASESIZE,
        );

        this.gridContext.strokeRect(
            Constants.CASESIZE * (i - 1) + Constants.SIDESPACE,
            Constants.CASESIZE * (j - 1) + Constants.SIDESPACE,
            Constants.CASESIZE,
            Constants.CASESIZE,
        );
        // to write the text
        if (textChoice !== Constants.NOTEXT) {
            this.gridContext.fillStyle = 'black';
            this.gridContext.fillText(
                Constants.TEXTONTILES[textChoice],
                Constants.CASESIZE * (i - 1) + Constants.CASESIZE / 2 + Constants.SIDESPACE,
                Constants.CASESIZE * (j - 1) + Constants.CASESIZE / 2 + Constants.SIDESPACE,
                Constants.CASESIZE,
            );
        }
        // star
        else if (i === Constants.CENTERCASE && j === Constants.CENTERCASE) {
            this.drawStar();
        }
    }

    placeNumberTop() {
        for (let i = 0; i < Constants.NUMBEROFCASE; i++) {
            this.gridContext.beginPath();
            this.gridContext.moveTo(Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.SIDESPACE, 0);
            this.gridContext.lineTo(Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.SIDESPACE, Constants.CASESIZE);
            this.gridContext.globalAlpha = 0;
            this.gridContext.stroke();

            this.gridContext.globalAlpha = 1;
            this.gridContext.textAlign = 'center';
            this.gridContext.font = '15px serif';

            this.gridContext.fillText(
                (i + 1).toString(),
                Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.SIDESPACE,
                Constants.SIDESPACE - Constants.CASESIZE / 2,
            );
        }
    }

    placeLetterSide() {
        for (let i = 0; i < Constants.NUMBEROFCASE; i++) {
            this.gridContext.beginPath();
            this.gridContext.moveTo(0, Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.SIDESPACE);
            this.gridContext.lineTo(Constants.CASESIZE, Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.SIDESPACE);
            this.gridContext.globalAlpha = 0;
            this.gridContext.stroke();

            this.gridContext.globalAlpha = 1;
            this.gridContext.textBaseline = 'middle';
            this.gridContext.font = '15px serif';

            this.gridContext.fillText(
                Constants.SIDELETTERS[i].toString(),
                Constants.SIDESPACE - Constants.CASESIZE / 2,
                Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.SIDESPACE,
            );
        }
    }

    drawStar() {
        let rot = (Math.PI / 2) * 3;
        let x = Constants.CENTERSTARHORIZONTALY;
        let y = Constants.CENTERSTARVERTICALY;

        this.gridContext.strokeStyle = 'black';

        this.gridContext.beginPath();
        this.gridContext.moveTo(Constants.CENTERSTARHORIZONTALY, Constants.CENTERSTARVERTICALY - Constants.OUTERRADIUS);
        for (let i = 0; i < Constants.SPIKES; i++) {
            x = Constants.CENTERSTARHORIZONTALY + Math.cos(rot) * Constants.OUTERRADIUS;
            y = Constants.CENTERSTARVERTICALY + Math.sin(rot) * Constants.OUTERRADIUS;
            this.gridContext.lineTo(x, y);
            rot += Constants.STEP;

            x = Constants.CENTERSTARHORIZONTALY + Math.cos(rot) * Constants.INNERRADIUS;
            y = Constants.CENTERSTARVERTICALY + Math.sin(rot) * Constants.INNERRADIUS;
            this.gridContext.lineTo(x, y);
            rot += Constants.STEP;
        }

        this.gridContext.lineTo(Constants.CENTERSTARHORIZONTALY, Constants.CENTERSTARVERTICALY - Constants.OUTERRADIUS);
        this.gridContext.closePath();
        this.gridContext.lineWidth = 5;

        this.gridContext.stroke();
        this.gridContext.fillStyle = 'black';
        this.gridContext.fill();
        this.gridContext.lineWidth = 1;
    }

    drawWord(word: string) {
        const startPosition: Vec2 = { x: 175, y: 100 };
        const step = 20;
        this.gridContext.font = '20px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.gridContext.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
    // usefull for future mouse input
    /*
    drawLetter(word: string, x1: number, y1: number) {
        // eslint-disable-next-line max-len
        const x: number = Math.floor(x1 / Constants.CASESIZE) * Constants.CASESIZE + Constants.CASESIZE / 2;
        const y: number = Math.floor(y1 / Constants.CASESIZE) * Constants.CASESIZE + Constants.CASESIZE / 2;
        this.gridContext.strokeRect(x - 12.5, y - 12.5, 23.5, 23.5);
        this.gridContext.fillStyle = 'white';
        this.gridContext.fillRect(x - 12, y - 12, 23, 23);
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '20px system-ui';
        this.gridContext.fillText(word, x, y);
    }
    */
    /*
    drawLetterwithposition(word: Letter, x1: number, y1: number) {
         const x: number = x1.charCodeAt(0) - Constants.SIDELETTERS_TO_ASCII * Constants.CASESIZE + Constants.CASESIZE / 2;
         const y: number = Number(x1.charCodeAt(0)) * Constants.CASESIZE + Constants.CASESIZE / 2;
         const x: number = x1 * Constants.CASESIZE + Constants.CASESIZE / 2;
         const y: number = y1 * Constants.CASESIZE * Constants.CASESIZE + Constants.CASESIZE / 2;
         this.gridContext.strokeRect(x - 12.5, y - 12.5, 23.5, 23.5);
         this.gridContext.fillStyle = 'white';
         this.gridContext.fillRect(x - 12, y - 12, 23, 23);
         this.gridContext.fillStyle = 'black';
         this.gridContext.font = '20px system-ui';
         this.gridContext.fillText(word.letter, x, y);
         this.drawLetterValue(word, x, y);
         this.drawLetterValue('2', x, y);
    }
    */
    // TODO to be removed, added for testing purpose;
    drawLetterwithpositionstring(word: string, x1: number, y1: number) {
        // const x: number = x1.charCodeAt(0) - Constants.SIDELETTERS_TO_ASCII * Constants.CASESIZE + Constants.CASESIZE / 2;
        // const y: number = Number(x1.charCodeAt(0)) * Constants.CASESIZE + Constants.CASESIZE / 2;
        const x: number = x1 * Constants.CASESIZE + Constants.CASESIZE;
        const y: number = y1 * Constants.CASESIZE + Constants.CASESIZE;
        this.gridContext.strokeRect(x + Constants.TILESPACE, y + Constants.TILESPACE, Constants.TILESIZE, Constants.TILESIZE);
        this.gridContext.fillStyle = 'white';
        this.gridContext.fillRect(x + Constants.TILESPACE, y + Constants.TILESPACE, Constants.TILESIZE, Constants.TILESIZE);
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '20px system-ui';
        this.gridContext.fillText(word, x + Constants.CASESIZE / 2 - Constants.TILESPACE, y + Constants.CASESIZE / 2 - Constants.TILESPACE);
        // this.drawLetterValue(word, x, y);
        // this.drawLetterValue('2', x, y);
    }
    /*
    drawLetterValue(word: Letter, x1: number, y1: number) {
        // drawLetterValue(word: string, x1: number, y1: number) {
        // eslint-disable-next-line max-len
        // const x: number = Math.floor(x1 / Constants.CASESIZE) * Constants.CASESIZE + (Constants.CASESIZE * 3) / 4; // useful for future mouse input
        // const y: number = Math.floor(y1 / Constants.CASESIZE) * Constants.CASESIZE + (Constants.CASESIZE * 3) / 4;
        // const x: number = x1 * Constants.CASESIZE + (Constants.CASESIZE * 3) / 4;
        // const y: number = y1 * Constants.CASESIZE + Constants.CASESIZE / 4;
        // this.gridContext.fillStyle = 'black';
        // this.gridContext.font = '10px system-ui';
        // this.gridContext.fillText(word.letter, x, y);
    }
    */
}
