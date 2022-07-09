import { createToken, CustomPatternMatcherFunc, Lexer } from 'chevrotain';

const StringTk = createToken({
  name: 'StringTk',
  pattern: Lexer.NA,
});

// /y mode is needed to only match relevant part and not whole input
// this is complicated bc when we have mutluple strings in a file we must make sure to only match one of a time
// thatswhy we use a no match `(?:...)` with all ending chars and then a `'`

// https://regex101.com/r/PC2HBb/1

// eslint bug
// eslint-disable-next-line no-useless-escape
const aqmPattern = /q'(\[|\(|\{|\^|#|!)(?:[^[\]|\)|\}|\^|#|!]]|[^'])*'/y;

const matchAQM: CustomPatternMatcherFunc = (
  text: string,
  startOffset: number
) => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
  aqmPattern.lastIndex = startOffset;

  // Note that just because we are using a custom token pattern
  // Does not mean we cannot implement it using JavaScript Regular Expressions...
  const execResult = aqmPattern.exec(text);

  if (!execResult) return null;

  // Compute the payload.
  // Note we are accessing the capturing groups sub matches.
  const match = execResult[0];
  const prefix = execResult[1];
  const suffix = match.charAt(match.length - 2);

  let matchError = false;

  switch (prefix) {
    case '[':
      if (suffix !== ']') matchError = true;
      break;
    case '{':
      if (suffix !== '}') matchError = true;
      break;
    case '(':
      if (suffix !== ')') matchError = true;
      break;
    default:
      if (prefix !== suffix) matchError = true;
      break;
  }

  if (matchError) {
    return null;
  }

  (execResult as any).payload = match
    .replace(`q'${prefix}`, '')
    .replace(`${suffix}'`, '');

  return execResult;
};

const AlternateQuotingMechanism = createToken({
  name: 'AlternateQuotingMechanism',
  pattern: matchAQM,
  line_breaks: true,
  categories: StringTk,
});

const StandardString = createToken({
  name: 'StandardString',
  pattern: /'((?:''|[^'])*)'/,
  categories: StringTk,
  //longer_alt: AlternateQuotingMechanism,
});

export default [StringTk, StandardString, AlternateQuotingMechanism];
