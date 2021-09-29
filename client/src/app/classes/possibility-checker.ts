import { NUMBEROFCASE } from '@app/constants';
import { LetterPlacementPossibility } from '@app/classes/letter-placement-possibility';
import { PlacementValidity } from '@app/classes/placement-validity';

export class PossibilityChecker {
    valid: boolean = false;
    constructor(valid: boolean) {
        this.valid = valid;
    }

    checkRight(lettersOnBoard: string[][], i: number, j: number, possibility: LetterPlacementPossibility) {
        if (i !== NUMBEROFCASE - 1) {
            if (lettersOnBoard[i + 1][j] === '') {
                possibility.placement = PlacementValidity.Right;
            }
        }
        return possibility;
    }

    checkLeft(lettersOnBoard: string[][], i: number, j: number, possibility: LetterPlacementPossibility) {
        if (i !== 0) {
            if (lettersOnBoard[i - 1][j] === '') {
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
        if (j !== NUMBEROFCASE - 1) {
            if (lettersOnBoard[i][j + 1] === '') {
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
        if (j !== 0) {
            if (lettersOnBoard[i][j - 1] === '') {
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
                    case PlacementValidity.HUp:
                        possibility.placement = PlacementValidity.HUpHDown;
                        break;
                    case PlacementValidity.HUpLeft:
                        possibility.placement = PlacementValidity.HUpHDownLeft;
                        break;
                    case PlacementValidity.HUpRight:
                        possibility.placement = PlacementValidity.HUpHDownRight;
                        break;
                    default:
                        possibility.placement = PlacementValidity.HUp;
                }
            }
        }
        return possibility;
    }
}
