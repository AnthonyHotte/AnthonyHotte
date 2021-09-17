/* eslint-disable @typescript-eslint/no-magic-numbers */
// useful constants for the board
export const SIDESPACE = 30;
export const NUMBEROFCASE = 15;
export const DEFAULT_WIDTH = 500;
export const CASESIZE = (DEFAULT_WIDTH - SIDESPACE) / NUMBEROFCASE;
export const NOTEXT = -1;
export const CENTERCASE = 8;
export const SIDELETTERS: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
// value tu removes from each letter ascii code to transform it into the line number, these should always be transform into lowercase before use in code
export const SIDELETTERS_TO_ASCII = 97;
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
export const PLACERCOMMANDFIRSTARGUMENTVALIDLENGTH = 3;
export const PLACERCOMMANDFIRSTARGUMENTVALIDLENGTH2 = 4;
export const ASCIICODEOFLOWERA = 97;
export const ASCIICODEOFLOWERZ = 122;
export const MAX_CHARACTERS = 512;
export const ENTER_ASCII = 69;
