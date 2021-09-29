import { PlacementValidity } from '@app/classes/placement-validity';

export interface LetterPlacementPossibility {
    row: number;
    column: number;
    letter: string;
    placement: PlacementValidity;
}
