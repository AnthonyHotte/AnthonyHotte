import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
// eslint-disable-next-line no-restricted-imports
import * as Constants from '../constants';
// eslint-disable-next-line no-restricted-imports
import { isRedCase, isDarkBlueCase, isLightBlueCase, isPinkCase } from '../tile-type-usefull-function';

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
        for (let i = 1; i <= Constants.NUMBEROFCASE; i++) {
            for (let j = 1; j <= Constants.NUMBEROFCASE; j++) {
                // for the case style
                let textChoice = -1;
                // word x2 (pink)
                if (isPinkCase(i, j)) {
                    this.gridContext.fillStyle = 'pink';
                    if (i !== 8 && j !== 8) {
                        textChoice = 0;
                    }
                }
                // word x3 (red)
                else if (isRedCase(i, j)) {
                    this.gridContext.fillStyle = 'red';
                    textChoice = 1;
                }
                // Letter x3 (dark blue)
                else if (isDarkBlueCase(i, j)) {
                    this.gridContext.fillStyle = 'darkblue';
                    textChoice = 2;
                }
                // Letter x2 (Light blue)
                else if (isLightBlueCase(i, j)) {
                    this.gridContext.fillStyle = '#add8e6';
                    textChoice = 3;
                } else {
                    this.gridContext.fillStyle = 'grey';
                }

                this.gridContext.fillRect(
                    Constants.CASESIZE * (i - 1) + Constants.LEFTSPACE,
                    Constants.CASESIZE * (j - 1) + Constants.UPPERSPACE,
                    Constants.CASESIZE,
                    Constants.CASESIZE,
                );

                this.gridContext.strokeRect(
                    Constants.CASESIZE * (i - 1) + Constants.LEFTSPACE,
                    Constants.CASESIZE * (j - 1) + Constants.UPPERSPACE,
                    Constants.CASESIZE,
                    Constants.CASESIZE,
                );
                // to write the text
                if (textChoice !== -1) {
                    this.gridContext.fillStyle = 'black';
                    this.gridContext.fillText(
                        Constants.TEXTONTILES[textChoice],
                        Constants.CASESIZE * (i - 1) + Constants.CASESIZE / 2 + Constants.LEFTSPACE,
                        Constants.CASESIZE * (j - 1) + Constants.CASESIZE / 2 + Constants.UPPERSPACE,
                        Constants.CASESIZE,
                    );
                }
                // star
                else if (i === 8 && j === 8) {
                    this.drawStar();
                }
            }
        }
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
    drawLetterValue(word: string, x1: number, y1: number) {
        // eslint-disable-next-line max-len
        const x: number = Math.floor(x1 / Constants.CASESIZE) * Constants.CASESIZE + (Constants.CASESIZE * 3) / 4;
        const y: number = Math.floor(y1 / Constants.CASESIZE) * Constants.CASESIZE + Constants.CASESIZE / 4;
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '10px system-ui';
        this.gridContext.fillText(word, x, y);
    }
}
