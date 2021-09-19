/* eslint-disable @typescript-eslint/no-magic-numbers */
import { PINKCOLCASE, REDROWCASE, LIGHTBLUENEARCENTERROWCASE, DARKBLUEROWCASE, NUMBEROFCASE, NUMBEROFCASEPLUSONE, CENTERCASE } from '@app/constants';
// word x 3
export const isRedCase = (col: number, row: number): boolean => {
    return ((col === 1 || col === NUMBEROFCASE) && REDROWCASE.indexOf(row) !== -1) || (col === CENTERCASE && (row === 1 || row === NUMBEROFCASE));
};
// word x 2
export const isPinkCase = (col: number, row: number): boolean => {
    return (col + row === NUMBEROFCASEPLUSONE || col === row) && PINKCOLCASE.indexOf(col) === -1;
};
// Letter x 3
export const isDarkBlueCase = (col: number, row: number): boolean => {
    return ((col === 6 || col === 10) && DARKBLUEROWCASE.indexOf(row) !== -1) || ((col === 2 || col === 14) && (row === 6 || row === 10));
};
// to make it easier to use
// Letter x 2
export const isLightBlueCase = (col: number, row: number): boolean => {
    return isLightBlueCaseColumnFar(col, row) || isLightBlueCaseColumnNearCenter(col, row);
};
// add to break this color in two to respect complexity of function
const isLightBlueCaseColumnNearCenter = (col: number, row: number): boolean => {
    return ((col === 7 || col === 9) && LIGHTBLUENEARCENTERROWCASE.indexOf(row) !== -1) || (col === CENTERCASE && (row === 4 || row === 12));
};
// add to break this color in two to respect complexity of function
const isLightBlueCaseColumnFar = (col: number, row: number): boolean => {
    return (
        ((col === 1 || col === NUMBEROFCASE) && (row === 4 || row === 12)) ||
        ((col === 3 || col === 13) && (row === 7 || row === 9)) ||
        ((col === 4 || col === 12) && [1, 8, 15].indexOf(row) !== -1)
    );
};
