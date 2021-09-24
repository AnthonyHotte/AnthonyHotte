// useful constants for the board
const FOUR = 4;
const SIXTEEN = 16;
const SEVEN = 7;
// export const SIDESPACE = 30;
export const NUMBEROFCASE = 15;
export const DEFAULT_WIDTH = 750;
export const CASESIZE = DEFAULT_WIDTH / (NUMBEROFCASE + 1);
export const SIDESPACE = CASESIZE;
export const TILESIZE = (CASESIZE * 3) / FOUR;
export const TILESPACE = CASESIZE / SIXTEEN;
export const NOTEXT = -1;
export const CENTERCASE = 8;
export const SIDELETTERS: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
// value t0 removes from each letter ascii code to transform it into the line number,these should always be tranform into lowercase before use in code
export const SIDELETTERS_TO_ASCII = 97;
export const LETTERVALUEMINPOLICESIZE = 10;
export const LETTERVALUEDEFAULTPOLICESIZE = 15;
export const LETTERVALUEMAXPOLICESIZE = 20;

export const LETTERMINPOLICESIZE = 20;
export const LETTERDEFAULTPOLICESIZE = 28;
export const LETTERMAXPOLICESIZE = 34;
// to write on the Tiles
export const TEXTONTILES = ['mot compte double', 'mot compte tripple', 'lettre compte tripple', 'lettre compte double'];
// useful constants to draw the star in the middle of the board
export const MIDDLECASENUMBER = NUMBEROFCASE / 2;
export const OUTERRADIUS = CASESIZE * (SEVEN / SIXTEEN);
export const INNERRADIUS = CASESIZE / FOUR;
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
export const PLACERCOMMANDLENGTH = 7;
export const ASCIICODEOFLOWERA = 97;
export const ASCIICODEOFLOWERZ = 122;
export const MAXLETTERINHAND = 7;

export const MAX_CHARACTERS = 512;
export const ENTER_ASCII = 69;
