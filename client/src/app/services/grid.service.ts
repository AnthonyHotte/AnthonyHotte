import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;


@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    drawGrid() {
        let caseSize = 30;
        let leftSpace = 30;
        let upperSpace = 30;
        let NUMBEROFCASE = 15;
        

        for (let i = 0; i < NUMBEROFCASE; i++) {
            this.gridContext.beginPath();
            this.gridContext.moveTo(caseSize * i + caseSize / 2 + leftSpace, 0);
            this.gridContext.lineTo(caseSize * i + caseSize / 2 + leftSpace, caseSize);
            this.gridContext.globalAlpha = 0;
            this.gridContext.stroke();

            this.gridContext.globalAlpha = 1;
            this.gridContext.textAlign = 'center';
            this.gridContext.font = '15px serif';

            this.gridContext.fillText((i + 1).toString(), caseSize * i + caseSize / 2 + leftSpace, upperSpace - caseSize / 2);
        }

        //place letters to the left side of the this.gridContext
        let sideLetters: String[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
        for (let i = 0; i < 15; i++) {
            this.gridContext.beginPath();
            this.gridContext.moveTo(0, caseSize * i + caseSize / 2 + upperSpace);
            this.gridContext.lineTo(caseSize, caseSize * i + caseSize / 2 + upperSpace);
            this.gridContext.globalAlpha = 0;
            this.gridContext.stroke();

            this.gridContext.globalAlpha = 1;
            this.gridContext.textBaseline = 'middle';
            this.gridContext.font = '15px serif';

            this.gridContext.fillText(sideLetters[i].toString(), leftSpace - caseSize / 2, caseSize * i + caseSize / 2 + upperSpace);
        }
        // to write the text on the this.gridContext
        let arrText = ['mot compte double', 'mot compte tripple', 'lettre compte tripple', 'lettre compte double'];

        //create this.gridContext
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                //letiable forthe text
                let textChoice = -1;
                // word x2 (pink)
                if ((i + j == 14 || i == j) && [0, 5, 6, 8, 9, 14].indexOf(i) == -1) {
                    this.gridContext.fillStyle = 'pink';
                    if (i != 7 && j != 7) {
                        textChoice = 0;
                    }
                }
                //word x3 (red)
                else if (((i == 0 || i == 14) && [0, 7, 14].indexOf(j) != -1) || (i == 7 && (j == 0 || j == 14))) {
                    this.gridContext.fillStyle = 'red';
                    textChoice = 1;
                }
                // Letter x3 (dark blue)
                else if (((i == 5 || i == 9) && [1, 5, 9, 13].indexOf(j) != -1) || ((i == 1 || i == 13) && (j == 5 || j == 9))) {
                    this.gridContext.fillStyle = 'darkblue';
                    textChoice = 2;
                }
                // Letter x2 (Light blue)
                else if (
                    ((i == 0 || i == 14) && (j == 3 || j == 11)) ||
                    ((i == 2 || i == 12) && (j == 6 || j == 8)) ||
                    ((i == 3 || i == 11) && [0, 7, 14].indexOf(j) != -1) ||
                    ((i == 6 || i == 8) && [2, 6, 8, 12].indexOf(j) != -1) ||
                    (i == 7 && (j == 3 || j == 11))
                ) {
                    this.gridContext.fillStyle = '#add8e6';
                    textChoice = 3;
                } else {
                    this.gridContext.fillStyle = 'grey';
                }
                this.gridContext.fillRect(caseSize * i + leftSpace, caseSize * j + upperSpace, caseSize, caseSize);

                this.gridContext.strokeRect(caseSize * i + leftSpace, caseSize * j + upperSpace, caseSize, caseSize);
                //to write the text
                if (textChoice != -1) {
                    this.gridContext.fillStyle = 'black';
                    this.gridContext.fillText(
                        arrText[textChoice],
                        caseSize * i + caseSize / 2 + leftSpace,
                        caseSize * j + caseSize / 2 + upperSpace,
                        caseSize,
                    );
                }
                //star
                else if (i == 7 && j == 7) {
                    this.drawStar(caseSize, leftSpace, upperSpace);
                }
            }
        }

        //Ancien code
        /*
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;

        this.gridContext.moveTo((this.width * 3) / 10, (this.height * 4) / 10);
        this.gridContext.lineTo((this.width * 7) / 10, (this.height * 4) / 10);

        this.gridContext.moveTo((this.width * 3) / 10, (this.height * 6) / 10);
        this.gridContext.lineTo((this.width * 7) / 10, (this.height * 6) / 10);

        this.gridContext.moveTo((this.width * 4) / 10, (this.height * 3) / 10);
        this.gridContext.lineTo((this.width * 4) / 10, (this.height * 7) / 10);

        this.gridContext.moveTo((this.width * 6) / 10, (this.height * 3) / 10);
        this.gridContext.lineTo((this.width * 6) / 10, (this.height * 7) / 10);

        this.gridContext.stroke();
        */
    }

    //créer par moi
    drawStar(caseSize: number, leftSpace: number, upperSpace: number) {
        let middleCase = 15 / 2;
        let cx = caseSize * middleCase + leftSpace;
        let cy = caseSize * middleCase + upperSpace;
        let outerRadius = (caseSize * 7) / 16;
        let innerRadius = caseSize / 4;
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        let spikes = 5;
        let step = Math.PI / spikes;

        this.gridContext.strokeStyle = 'black';

        this.gridContext.beginPath();
        this.gridContext.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.gridContext.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.gridContext.lineTo(x, y);
            rot += step;
        }

        this.gridContext.lineTo(cx, cy - outerRadius);
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
