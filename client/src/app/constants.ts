/* eslint-disable @typescript-eslint/no-magic-numbers */
// useful constants for the board
export const SIDESPACE = 30;
export const NUMBEROFCASE = 15;
export const DEFAULT_WIDTH = 500;
export const CASESIZE = (DEFAULT_WIDTH - SIDESPACE) / NUMBEROFCASE;
export const NOTEXT = -1;
export const CENTERCASE = 8;
export const SIDELETTERS: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
// to write on the Tiles
export const TEXTONTILES = ['mot compte double', 'mot compte tripple', 'lettre compte tripple', 'lettre compte double'];
// useful constants to draw the star in the middle of the board
export const MIDDLECASENUMBER = NUMBEROFCASE / 2;
export const OUTERRADIUS = CASESIZE * (7 / 16);
export const INNERRADIUS = CASESIZE / 4;
export const SPIKES = 5;
export const STEP = Math.PI / SPIKES;
export const CENTERSTARHORIZONTALY = CASESIZE * MIDDLECASENUMBER + SIDESPACE;
export const CENTERSTARVERTICALY = CASESIZE * MIDDLECASENUMBER + SIDESPACE;
// useful for solo game mode
export const VALEUR_TEMPS_DEFAULT = 60;
export const LONGUEURNOMMAX = 17;
export const VERIFICATION_PRESENCE = -1;
export const LENGTHWORDVALIDATION = 3;

// usefull for usefull function
export const PINKCOLCASE = [1, 6, 7, 9, 10, 15];
export const REDROWCASE = [1, 8, 15];
export const LIGHTBLUENEARCENTERROWCASE = [3, 7, 9, 13];
export const DARKBLUEROWCASE = [2, 6, 10, 14];
export const NUMBEROFCASEPLUSONE = 16;
