import { Injectable } from '@angular/core';
import { LetterMap } from '@app/all-letters';
import { TileMap } from '@app/classes/grid-special-tile';
import { Vec2 } from '@app/classes/vec2';
import * as Constants from '@app/constants';
import { Letter } from '@app/letter';
@Injectable({
    providedIn: 'root',
})
export class GridService {
    minpolicesizelettervalue = Constants.LETTERVALUEMINPOLICESIZE;
    policesizelettervalue = Constants.LETTERVALUEDEFAULTPOLICESIZE;
    maxpolicesizelettervalue = Constants.LETTERVALUEMAXPOLICESIZE;

    minpolicesizeletter = Constants.LETTERMINPOLICESIZE;
    policesizeletter = Constants.LETTERMINPOLICESIZE;
    maxpolicesizeletter = Constants.LETTERMAXPOLICESIZE;

    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_WIDTH };
    drawGrid() {
        // Place numbers at the top
        this.placeNumberTop();

        // place letters to the left side of the this.gridContext
        this.placeLetterSide();

        // create this.gridContext
        for (let i = 1; i <= Constants.NUMBEROFCASE; i++) {
            for (let j = 1; j <= Constants.NUMBEROFCASE; j++) {
                this.drawtilebackground(i - 1, j - 1);
            }
        }
    }
    drawtilebackground(i: number, j: number) {
        i = i + 1;
        j = j + 1;

        // for the case style
        let textChoice = -1;
        // word x2 (pink)
        if (TileMap.gridMap.isDoubleWordTile(i, j)) {
            this.gridContext.fillStyle = 'pink';
            textChoice = 0;
        }
        // word x3 (red)
        else if (TileMap.gridMap.isTripleWordTile(i, j)) {
            this.gridContext.fillStyle = '#fa644d';
            textChoice = 1;
        }
        // Letter x3 (dark blue)
        else if (TileMap.gridMap.isTripleLetterTile(i, j)) {
            this.gridContext.fillStyle = '#3fa1b4';
            textChoice = 2;
        }
        // Letter x2 (Light blue)
        else if (TileMap.gridMap.isDoubleLetterTile(i, j)) {
            this.gridContext.fillStyle = '#add8e6';
            textChoice = 3;
        } else {
            this.gridContext.fillStyle = '#c8c3a6';
        }
        if (i === Constants.CENTERCASE && j === Constants.CENTERCASE) {
            textChoice = Constants.NOTEXT;
        }
        this.gridContext.fillRect(
            Constants.CASESIZE * (i - 1) + Constants.SIDESPACE,
            Constants.CASESIZE * (j - 1) + Constants.SIDESPACE,
            Constants.CASESIZE,
            Constants.CASESIZE,
        );
        this.gridContext.strokeStyle = 'white';
        this.gridContext.strokeRect(
            Constants.CASESIZE * (i - 1) + Constants.SIDESPACE,
            Constants.CASESIZE * (j - 1) + Constants.SIDESPACE,
            Constants.CASESIZE,
            Constants.CASESIZE,
        );
        // to write the text
        if (textChoice !== Constants.NOTEXT) {
            this.gridContext.fillStyle = 'black';
            const textpositionoffset = 3;
            const textpositionoffset2 = 0.75;
            this.gridContext.font = '19px system-ui';
            this.gridContext.fillText(
                Constants.TEXTONTILES[textChoice],
                Constants.CASESIZE * (i - 1) + Constants.CASESIZE / 2 + Constants.SIDESPACE,
                Constants.CASESIZE * (j - 1) + Constants.CASESIZE / textpositionoffset + Constants.SIDESPACE,
                Constants.CASESIZE,
            );
            this.gridContext.fillStyle = 'black';
            this.gridContext.fillText(
                Constants.TEXTONTILESVALUE[textChoice],
                Constants.CASESIZE * (i - 1) + Constants.CASESIZE / 2 + Constants.SIDESPACE,
                Constants.CASESIZE * (j - 1) + Constants.CASESIZE * textpositionoffset2 + Constants.SIDESPACE,
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

    //  not used yet, Julien do you need it in the future?
    drawWord(word: string) {
        const startPosition: Vec2 = { x: 175, y: 100 };
        const step = 20;
        this.gridContext.font = '20px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.gridContext.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    }
    // TODO add test for this function
    drawLetterwithRawXYcoordinate(word: string, x1: number, y1: number) {
        const x: number = Math.floor(x1 / Constants.CASESIZE) * Constants.CASESIZE + Constants.CASESIZE / 2;
        const y: number = Math.floor(y1 / Constants.CASESIZE) * Constants.CASESIZE + Constants.CASESIZE / 2;
        this.drawLetterwithpositionstring(word, x, y);
    }
    // code pulled from https://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag

    drawarrow(orientation: string, row: number, column: number) {
        const arrowOffset = 0.125;
        const tileSizeArrowLength = 3;
        const arrowlength = Constants.CASESIZE / tileSizeArrowLength;
        // TODO discuter ISMA
        let arrowHeadYpos = 0;
        let arrowHeadXpos = 0;
        let arrowtailYpos = 0;
        let arrowtailXpos = 0;
        if (orientation === 'h') {
            arrowHeadYpos = Constants.CASESIZE * (row + arrowOffset) + Constants.CASESIZE;
            arrowHeadXpos = Constants.CASESIZE * (column + 1) + Constants.CASESIZE;
            arrowtailYpos = arrowHeadYpos; // since the arrow is horizontal y doesn't change
            arrowtailXpos = arrowHeadXpos - arrowlength;
        } else {
            arrowHeadYpos = Constants.CASESIZE * (row + 1) + Constants.CASESIZE;
            arrowHeadXpos = Constants.CASESIZE * (column + arrowOffset) + Constants.CASESIZE;
            arrowtailYpos = arrowHeadYpos - arrowlength;
            arrowtailXpos = arrowHeadXpos; // since the arrow is horizontal x doesn't change
        }
        this.gridContext.strokeStyle = 'black';
        this.gridContext.beginPath();
        this.canvasArrow(arrowtailXpos, arrowtailYpos, arrowHeadXpos, arrowHeadYpos);

        /*
        if (orientation === 'h') {
            const arrowHeadYpos = Constants.TILESIZE * (column + arrowOffset);
            const arrowHeadXpos = Constants.TILESIZE * (row + 1);
            const arrowtailYpos = arrowHeadYpos; // since the arrow is horizontal y doesn't change
            const arrowtailXpos = arrowHeadXpos - arrowlength;
        } else {
            const arrowHeadYpos = Constants.TILESIZE * (column + 1);
            const arrowHeadXpos = Constants.TILESIZE * (row + arrowOffset);
            const arrowtailYpos = arrowHeadYpos - arrowlength;
            const arrowtailXpos = arrowHeadXpos; // since the arrow is horizontal x doesn't change
        }
        this.gridContext.beginPath();
        this.canvasArrow(arrowtailXpos, arrowtailYpos, arrowHeadXpos, arrowHeadYpos);
        */
        this.gridContext.stroke();
    }

    canvasArrow(fromx: number, fromy: number, tox: number, toy: number) {
        const value6 = 6;
        const headlen = 10; // length of head in pixels
        const dx = tox - fromx;
        const dy = toy - fromy;
        const angle = Math.atan2(dy, dx);
        this.gridContext.moveTo(fromx, fromy);
        this.gridContext.lineTo(tox, toy);
        this.gridContext.lineTo(tox - headlen * Math.cos(angle - Math.PI / value6), toy - headlen * Math.sin(angle - Math.PI / 6));
        this.gridContext.moveTo(tox, toy);
        this.gridContext.lineTo(tox - headlen * Math.cos(angle + Math.PI / value6), toy - headlen * Math.sin(angle + Math.PI / 6));
    }
    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
    drawLetterwithpositionstring(word: string, x1: number, y1: number) {
        const offset = 8;
        // TODO isma discussion ici;
        this.drawtilebackground(x1, y1);
        const x: number = x1 * Constants.CASESIZE + Constants.CASESIZE;
        const y: number = y1 * Constants.CASESIZE + Constants.CASESIZE;
        // const x: number = x1 * Constants.CASESIZE;
        // const y: number = y1 * Constants.CASESIZE;
        this.gridContext.strokeStyle = 'black';
        this.gridContext.strokeRect(x + Constants.CASESIZE / offset, y + Constants.CASESIZE / offset, Constants.TILESIZE, Constants.TILESIZE);
        this.gridContext.fillStyle = 'white';
        this.gridContext.fillRect(x + Constants.CASESIZE / offset, y + Constants.CASESIZE / offset, Constants.TILESIZE, Constants.TILESIZE);
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = String(this.policesizeletter) + 'px system-ui';
        this.gridContext.fillText(word, x + Constants.CASESIZE / 2, y + Constants.CASESIZE / 2);
        const lettervalue = LetterMap.letterMap.letterMap.get(word) as Letter;
        this.drawLetterValuewithposition(lettervalue, x1, y1);
    }
    drawLetterValuewithposition(word: Letter, x1: number, y1: number) {
        const valuePositionOffset = 1.75;
        const x: number = x1 * Constants.CASESIZE + Constants.CASESIZE * valuePositionOffset;
        const y: number = y1 * Constants.CASESIZE + Constants.CASESIZE * valuePositionOffset;
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = String(this.policesizelettervalue) + 'px system-ui';
        this.gridContext.fillText(String(word.point), x, y);
    }
    increasePoliceSize() {
        if (this.policesizeletter + 2 <= this.maxpolicesizeletter) {
            this.policesizeletter = this.policesizeletter + 2;
        }
        if (this.policesizelettervalue + 1 <= this.maxpolicesizelettervalue) {
            this.policesizelettervalue = this.policesizelettervalue + 1;
        }
    }
    decreasePoliceSize() {
        if (this.policesizeletter - 2 >= this.minpolicesizeletter) {
            this.policesizeletter = this.policesizeletter - 2;
        }
        if (this.policesizelettervalue - 1 >= this.minpolicesizelettervalue) {
            this.policesizelettervalue = this.policesizelettervalue - 1;
        }
    }
}
