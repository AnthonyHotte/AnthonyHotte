import { PlacementValidity } from './placement-validity';

export interface LetterPlacementPossibility {
    row: number;
    column: number;
    letter: string;
    placement: PlacementValidity;
}
