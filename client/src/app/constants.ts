// solo-opponent-useful-functions
export const FOUR = 4;
export const FIVE = 5;
export const SIX = 6;
export const SEVEN = 7;
export const EIGHT = 8;
export const NINE = 9;
export const TEN = 10;
export const ELEVEN = 11;
export const TWELVE = 12;
export const THIRTEEN = 13;
export const FOURTEEN = 14;
export const FIFTEEN = 15;
export const SIXTEEN = 16;
export const TWENTY = 20;
export const THIRTY = 30;
// export const SIDESPACE = 30;
export const NUMBEROFCASE = 15;
export const DEFAULT_WIDTH = 674; // determined by experimentation
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
export const LETTERVALUEMAXPOLICESIZE = 19;

export const LETTERMINPOLICESIZE = 20;
export const LETTERDEFAULTPOLICESIZE = 26;
export const LETTERMAXPOLICESIZE = 34;
// to write on the Tiles
export const TEXTONTILES = ['mot', 'mot ', 'lettre', 'lettre'];
export const TEXTONTILESVALUE = ['X2', 'X3', 'X3', 'X2'];
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
export const MAX_NUMBER_SKIPPED_TURNS = 5;
export const NUMBER_DOUBLE_WORD = 17;
export const NUMBER_TRIPLE_WORD = 8;
export const NUMBER_DOUBLE_LETTER = 24;
export const NUMBER_TRIPLE_LETTER = 12;

export const ERRORCODE = -1;

export const MAXPERCENTAGE = 100;
export const TIMETOWAITFORVALIDATION = 2000;

export const MAXNUMBERBESTSCORE = 5;
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const BASEDEFAULTBESTSCORECLASSIQUE = [120, 110, 100, 90, 80];
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const BASEDEFAULTBESTSCORELOG2990 = [150, 130, 120, 100, 90];
