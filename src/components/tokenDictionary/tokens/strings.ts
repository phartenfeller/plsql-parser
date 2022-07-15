import {
  createToken,
  CustomPatternMatcherFunc,
  CustomPatternMatcherReturn,
  Lexer,
} from 'chevrotain';

const StringTk = createToken({
  name: 'StringTk',
  pattern: Lexer.NA,
});

// /y mode is needed to only match relevant part and not whole input
const startPattern = /q'(\[|\(|\{|\^|#|!)/y;

const matchAQM: CustomPatternMatcherFunc = (
  text: string,
  startOffset: number
) => {
  startPattern.lastIndex = startOffset;
  const startMatch = startPattern.exec(text);
  if (!startMatch) {
    return null;
  }

  const match = startMatch[0];
  const prefix = startMatch[1];
  let neededSuffix = '';

  switch (prefix) {
    case '[':
      neededSuffix = `]'`;
      break;
    case '{':
      neededSuffix = `}'`;
      break;
    case '(':
      neededSuffix = `)'`;
      break;
    default:
      neededSuffix = `${prefix}'`;
      break;
  }

  let currentIndex = startOffset + match.length;
  let tokenContent = match;

  for (; currentIndex < text.length; currentIndex++) {
    const currentChar = text[currentIndex];
    if (
      currentChar === neededSuffix[0] &&
      text[currentIndex + 1] === neededSuffix[1]
    ) {
      const payload = tokenContent.replace(match, '');
      tokenContent += currentChar;
      tokenContent += text[currentIndex + 1];
      const ret: unknown = [tokenContent];
      (ret as CustomPatternMatcherReturn).payload = payload;
      return ret as CustomPatternMatcherReturn;
    }
    tokenContent += currentChar;
  }

  return null;
};

const AlternateQuotingMechanism = createToken({
  name: 'AlternateQuotingMechanism',
  pattern: matchAQM,
  line_breaks: true,
  categories: StringTk,
  start_chars_hint: [`q'`],
});

const StandardString = createToken({
  name: 'StandardString',
  pattern: /'((?:''|[^'])*)'/,
  categories: StringTk,
  //longer_alt: AlternateQuotingMechanism,
});

export default [StringTk, StandardString, AlternateQuotingMechanism];
