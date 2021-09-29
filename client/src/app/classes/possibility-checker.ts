import { LetterPlacementPossibility } from '@app/classes/letter-placement-possibility';
import { PlacementValidity } from '@app/classes/placement-validity';

export class PossibilityChecker {
    valid: boolean = false;
    constructor(valid: boolean) {
        this.valid = valid;
    }
    checkAll(lettersOnBoard: string[][], i: number, j: number, possibility: LetterPlacementPossibility) {
        possibility = this.checkRight(lettersOnBoard, i, j, possibility);
        possibility = this.checkLeft(lettersOnBoard, i, j, possibility);
        possibility = this.checkDown(lettersOnBoard, i, j, possibility);
        possibility = this.checkUp(lettersOnBoard, i, j, possibility);
        return possibility;
    }

    checkRight(lettersOnBoard: string[][], i: number, j: number, possibility: LetterPlacementPossibility) {
        if (j !== lettersOnBoard.length - 1) {
            if (lettersOnBoard[i][j + 1] === '') {
                possibility.placement = PlacementValidity.Right;
            }
        }
        return possibility;
    }

    checkLeft(lettersOnBoard: string[][], i: number, j: number, possibility: LetterPlacementPossibility) {
        if (j !== 0) {
            if (lettersOnBoard[i][j - 1] === '') {
                if (possibility.placement === PlacementValidity.Right) {
                    possibility.placement = PlacementValidity.LeftRight;
                } else {
                    possibility.placement = PlacementValidity.Left;
                }
            }
        }
        return possibility;
    }

    checkDown(lettersOnBoard: string[][], i: number, j: number, possibility: LetterPlacementPossibility) {
        if (i !== lettersOnBoard.length - 1) {
            if (lettersOnBoard[i + 1][j] === '') {
                switch (possibility.placement) {
                    case PlacementValidity.Right: {
                        possibility.placement = PlacementValidity.HDownRight;

                        break;
                    }
                    case PlacementValidity.LeftRight: {
                        possibility.placement = PlacementValidity.HDownLeftRight;

                        break;
                    }
                    case PlacementValidity.Left: {
                        possibility.placement = PlacementValidity.HDownLeft;

                        break;
                    }
                    default: {
                        possibility.placement = PlacementValidity.HDown;
                    }
                }
            }
        }
        return possibility;
    }

    checkUp(lettersOnBoard: string[][], i: number, j: number, possibility: LetterPlacementPossibility) {
        if (i !== 0) {
            if (lettersOnBoard[i - 1][j] === '') {
                switch (possibility.placement) {
                    case PlacementValidity.Right:
                        possibility.placement = PlacementValidity.HUpRight;
                        break;
                    case PlacementValidity.Left:
                        possibility.placement = PlacementValidity.HUpLeft;
                        break;
                    case PlacementValidity.LeftRight:
                        possibility.placement = PlacementValidity.HUpLeftRight;
                        break;
                    case PlacementValidity.HDown:
                        possibility.placement = PlacementValidity.HUpHDown;
                        break;
                    case PlacementValidity.HDownLeft:
                        possibility.placement = PlacementValidity.HUpHDownLeft;
                        break;
                    case PlacementValidity.HDownRight:
                        possibility.placement = PlacementValidity.HUpHDownRight;
                        break;
                    case PlacementValidity.HDownLeftRight:
                        possibility.placement = PlacementValidity.HDownLeftRightHUp;
                        break;
                    default:
                        possibility.placement = PlacementValidity.HUp;
                }
            }
        }
        return possibility;
    }
}
