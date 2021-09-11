import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
// eslint-disable-next-line no-restricted-imports
import * as Constants from '../constants';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: Constants.DEFAULT_WIDTH, y: Constants.DEFAULT_HEIGHT };

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    drawGrid() {
        // Place numbers at the top
        this.placeNumberTop();

        // place letters to the left side of the this.gridContext
        this.placeLetterSide();

        // create this.gridContext
        for (let i = 0; i < Constants.NUMBEROFCASE; i++) {
            for (let j = 0; j < Constants.NUMBEROFCASE; j++) {
                // for the case style
                let textChoice = -1;
                // word x2 (pink)
                if ((i + j === 14 || i === j) && [0, 5, 6, 8, 9, 14].indexOf(i) === -1) {
                    this.gridContext.fillStyle = 'pink';
                    if (i !== 7 && j !== 7) {
                        textChoice = 0;
                    }
                }
                // word x3 (red)
                else if (this.isRedCase(i, j)) {
                    this.gridContext.fillStyle = 'red';
                    textChoice = 1;
                }
                // Letter x3 (dark blue)
                else if (this.isDarkBlueCase(i, j)) {
                    this.gridContext.fillStyle = 'darkblue';
                    textChoice = 2;
                }
                // Letter x2 (Light blue)
                else if (this.isLightBlueCaseColumnNearCenter(i, j) || this.isLightBlueCaseColumnFar(i, j)) {
                    this.gridContext.fillStyle = '#add8e6';
                    textChoice = 3;
                } else {
                    this.gridContext.fillStyle = 'grey';
                }
                this.gridContext.fillRect(
                    Constants.CASESIZE * i + Constants.LEFTSPACE,
                    Constants.CASESIZE * j + Constants.UPPERSPACE,
                    Constants.CASESIZE,
                    Constants.CASESIZE,
                );

                this.gridContext.strokeRect(
                    Constants.CASESIZE * i + Constants.LEFTSPACE,
                    Constants.CASESIZE * j + Constants.UPPERSPACE,
                    Constants.CASESIZE,
                    Constants.CASESIZE,
                );
                // to write the text
                if (textChoice !== -1) {
                    this.gridContext.fillStyle = 'black';
                    this.gridContext.fillText(
                        Constants.TEXTONTILES[textChoice],
                        Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.LEFTSPACE,
                        Constants.CASESIZE * j + Constants.CASESIZE / 2 + Constants.UPPERSPACE,
                        Constants.CASESIZE,
                    );
                }
                // star
                else if (i === 7 && j === 7) {
                    this.drawStar();
                }
            }
        }
    }

    isRedCase(col: number, row: number): boolean {
        return ((col === 0 || col === 14) && [0, 7, 14].indexOf(row) !== -1) || (col === 7 && (row === 0 || row === 14));
    }

    isDarkBlueCase(col: number, row: number): boolean {
        return ((col === 5 || col === 9) && [1, 5, 9, 13].indexOf(row) !== -1) || ((col === 1 || col === 13) && (row === 5 || row === 9));
    }
    // add to break this color in two to respect complexity of function
    isLightBlueCaseColumnNearCenter(col: number, row: number): boolean {
        return ((col === 6 || col === 8) && [2, 6, 8, 12].indexOf(row) !== -1) || (col === 7 && (row === 3 || row === 11));
    }
    // add to break this color in two to respect complexity of function
    isLightBlueCaseColumnFar(col: number, row: number): boolean {
        return (
            ((col === 0 || col === 14) && (row === 3 || row === 11)) ||
            ((col === 2 || col === 12) && (row === 6 || row === 8)) ||
            ((col === 3 || col === 11) && [0, 7, 14].indexOf(row) !== -1)
        );
    }
    placeNumberTop() {
        for (let i = 0; i < Constants.NUMBEROFCASE; i++) {
            this.gridContext.beginPath();
            this.gridContext.moveTo(Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.LEFTSPACE, 0);
            this.gridContext.lineTo(Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.LEFTSPACE, Constants.CASESIZE);
            this.gridContext.globalAlpha = 0;
            this.gridContext.stroke();

            this.gridContext.globalAlpha = 1;
            this.gridContext.textAlign = 'center';
            this.gridContext.font = '15px serif';

            this.gridContext.fillText(
                (i + 1).toString(),
                Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.LEFTSPACE,
                Constants.UPPERSPACE - Constants.CASESIZE / 2,
            );
        }
    }

    placeLetterSide() {
        for (let i = 0; i < Constants.NUMBEROFCASE; i++) {
            this.gridContext.beginPath();
            this.gridContext.moveTo(0, Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.UPPERSPACE);
            this.gridContext.lineTo(Constants.CASESIZE, Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.UPPERSPACE);
            this.gridContext.globalAlpha = 0;
            this.gridContext.stroke();

            this.gridContext.globalAlpha = 1;
            this.gridContext.textBaseline = 'middle';
            this.gridContext.font = '15px serif';

            this.gridContext.fillText(
                Constants.SIDELETTERS[i].toString(),
                Constants.LEFTSPACE - Constants.CASESIZE / 2,
                Constants.CASESIZE * i + Constants.CASESIZE / 2 + Constants.UPPERSPACE,
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
}
