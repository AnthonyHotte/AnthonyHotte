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
    policesizeletter = Constants.LETTERDEFAULTPOLICESIZE;
    maxpolicesizeletter = Constants.LETTERMAXPOLICESIZE;
    letteroffset = 0;
    //  offsetingvalue2 = (16 * (Constants.LETTERMAXPOLICESIZE - Constants.LETTERDEFAULTPOLICESIZE)) / 2;
    // 4 change in a row move it to 1/16 offset (4/64 = 1/16)
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
            this.gridContext.font = '42 px system-ui'; // 19 * 2
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
            this.gridContext.font = '38px serif'; // 15 *2

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
            this.gridContext.font = '38px serif'; // 15 *2;

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

    // code pulled from https://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag

    drawarrow(orientation: string, row: number, column: number) {
        const arrowOffsetPerpendicularToDirection = 0.3;
        const arrowOffsetParalleleToDirection = 0.9;
        const tileSizeArrowLength = 3;
        const arrowlength = Constants.CASESIZE / tileSizeArrowLength;
        // TODO discuter ISMA
        let arrowHeadYpos = 0;
        let arrowHeadXpos = 0;
        let arrowtailYpos = 0;
        let arrowtailXpos = 0;
        if (orientation === 'h') {
            arrowHeadYpos = Constants.CASESIZE * (row + arrowOffsetPerpendicularToDirection) + Constants.CASESIZE;
            arrowHeadXpos = Constants.CASESIZE * (column + arrowOffsetParalleleToDirection) + Constants.CASESIZE;
            arrowtailYpos = arrowHeadYpos; // since the arrow is horizontal y doesn't change
            arrowtailXpos = arrowHeadXpos - arrowlength;
        } else {
            arrowHeadYpos = Constants.CASESIZE * (row + arrowOffsetParalleleToDirection) + Constants.CASESIZE;
            arrowHeadXpos = Constants.CASESIZE * (column + arrowOffsetPerpendicularToDirection) + Constants.CASESIZE;
            arrowtailYpos = arrowHeadYpos - arrowlength;
            arrowtailXpos = arrowHeadXpos; // since the arrow is horizontal x doesn't change
        }
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 2;
        this.gridContext.beginPath();
        this.canvasArrow(arrowtailXpos, arrowtailYpos, arrowHeadXpos, arrowHeadYpos);
        this.gridContext.stroke();
        this.gridContext.lineWidth = 1; // back to default value
    }

    canvasArrow(fromx: number, fromy: number, tox: number, toy: number) {
        const headlen = 10; // length of head in pixels
        const dx = tox - fromx;
        const dy = toy - fromy;
        const angle = Math.atan2(dy, dx);
        this.gridContext.moveTo(fromx, fromy);
        this.gridContext.lineTo(tox, toy);
        const six = 6;
        this.gridContext.lineTo(tox - headlen * Math.cos(angle - Math.PI / six), toy - headlen * Math.sin(angle - Math.PI / six));
        this.gridContext.moveTo(tox, toy);
        this.gridContext.lineTo(tox - headlen * Math.cos(angle + Math.PI / six), toy - headlen * Math.sin(angle + Math.PI / six));
    }
    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
    drawLetterwithpositionstring(word: string, x1: number, y1: number, color: string) {
        // color must be either black or red
        // const offset = 8;
        // TODO isma discussion ici;
        // all commented style are for smaller size tile (different style)
        this.drawtilebackground(x1, y1);
        const x: number = x1 * Constants.CASESIZE + Constants.CASESIZE;
        const y: number = y1 * Constants.CASESIZE + Constants.CASESIZE;
        // const linewidth = 6;
        // const letteroffset = Constants.CASESIZE / 16;
        this.gridContext.fillStyle = 'white';
        this.gridContext.fillRect(x, y, Constants.CASESIZE, Constants.CASESIZE);
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = String(this.policesizeletter) + 'px system-ui';
        this.gridContext.fillText(
            word.toUpperCase(),
            x + Constants.CASESIZE / 2 - this.letteroffset * Constants.CASESIZE,
            y + Constants.CASESIZE / 2 - this.letteroffset * Constants.CASESIZE,
        );
        const lettervalue = LetterMap.letterMap.letterMap.get(word) as Letter;
        this.drawLetterValuewithposition(lettervalue, x1, y1);
        // draw the rectangle border
        this.gridContext.strokeStyle = color;
        const rectanglelignewidth = 2;
        this.gridContext.lineWidth = rectanglelignewidth;
        this.gridContext.strokeRect(
            x + rectanglelignewidth,
            y + rectanglelignewidth,
            Constants.CASESIZE - rectanglelignewidth * 2,
            Constants.CASESIZE - rectanglelignewidth * 2,
        );
        this.gridContext.lineWidth = 1; // default size;
        // }
        //   this.gridContext.strokeRect(x + Constants.CASESIZE / offset, y + Constants.CASESIZE / offset, Constants.TILESIZE, Constants.TILESIZE);
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
        if (this.policesizeletter >= Constants.LETTERDEFAULTPOLICESIZE && this.policesizeletter < this.maxpolicesizeletter) {
            const offsettingvalue = 64;
            this.letteroffset = this.letteroffset + 1 / offsettingvalue;
        }
        if (this.policesizeletter + 2 <= this.maxpolicesizeletter) {
            this.policesizeletter = this.policesizeletter + 2;
        }
        if (this.policesizelettervalue + 1 <= this.maxpolicesizelettervalue) {
            this.policesizelettervalue = this.policesizelettervalue + 1;
        }
    }
    decreasePoliceSize() {
        if (this.policesizeletter > Constants.LETTERDEFAULTPOLICESIZE) {
            const offsettingvalue = 64;
            this.letteroffset = this.letteroffset - 1 / offsettingvalue;
        }
        if (this.policesizeletter - 2 >= this.minpolicesizeletter) {
            this.policesizeletter = this.policesizeletter - 2;
        }
        if (this.policesizelettervalue - 1 >= this.minpolicesizelettervalue) {
            this.policesizelettervalue = this.policesizelettervalue - 1;
        }
    }
}
