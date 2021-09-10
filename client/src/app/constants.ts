//useful constants for the board

export const CASESIZE = 30;
export const LEFTSPACE = 30;
export const UPPERSPACE = 30;
export const NUMBEROFCASE = 15;
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;
export const SIDElETTERS: String[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
//to write on the Tiles
export const TEXTONTILES = ['mot compte double', 'mot compte tripple', 'lettre compte tripple', 'lettre compte double'];



//useful constants to draw the star in the middle of the board

export const MIDDLECASE = NUMBEROFCASE / 2;
export const OUTERRADIUS = CASESIZE * (7 / 16);
export const INNERRADIUS = CASESIZE / 4;
export const SPIKES = 5;
export const STEP = Math.PI / SPIKES;
