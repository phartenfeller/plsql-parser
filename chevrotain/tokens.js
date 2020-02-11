const { createToken, Lexer } = require('chevrotain');

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadat
const Identifier = createToken({ name: 'Identifier', pattern: /[a-zA-Z]\w*/ });

const Declare = createToken({
  name: 'Declare',
  pattern: /declare/
  // longer_alt: Identifier
});
const Begin = createToken({
  name: 'Begin',
  pattern: /begin/,
  longer_alt: Identifier
});
const End = createToken({
  name: 'End',
  pattern: /end/,
  longer_alt: Identifier
});
const DtypeNumber = createToken({
  name: 'DtypeNumber',
  pattern: /number/,
  longer_alt: Identifier
});
const DtypeVarchar2 = createToken({
  name: 'DtypeVarchar2',
  pattern: /varchar2/,
  longer_alt: Identifier
});
const Char = createToken({
  name: 'Char',
  pattern: /char/,
  longer_alt: Identifier
});
const Assignment = createToken({
  name: 'Assignment',
  pattern: /:=/,
  longer_alt: Identifier
});
const SingleLineComment = createToken({
  name: 'SingleLineComment',
  pattern: /--.+/,
  longer_alt: Identifier
});
const MultiLineComment = createToken({
  name: 'MultiLineComment',
  pattern: /\/*.*\//,
  longer_alt: Identifier
});
const Semicolon = createToken({
  name: 'Semicolon',
  pattern: /;/,
  longer_alt: Identifier
});
const Plus = createToken({
  name: 'Plus',
  pattern: /\+/,
  longer_alt: Identifier
});
const Minus = createToken({
  name: 'Minus',
  pattern: /-/,
  longer_alt: Identifier
});
const Star = createToken({
  name: 'Star',
  pattern: /\*/,
  longer_alt: Identifier
});
const Slash = createToken({
  name: 'Slash',
  pattern: /\//,
  longer_alt: Identifier
});
const OpenBracket = createToken({
  name: 'OpenBracket',
  pattern: /\(/,
  longer_alt: Identifier
});
const ClosingBracket = createToken({
  name: 'ClosingBracket',
  pattern: /\)/,
  longer_alt: Identifier
});

const Integer = createToken({ name: 'Integer', pattern: /0|[1-9]\d*/ });
const String = createToken({ name: 'String', pattern: /'((?:''|[^'])*)'/ });

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED
});

const allTokens = [
  WhiteSpace,
  // "keywords" appear before the Identifier
  Declare,
  Begin,
  End,
  DtypeNumber,
  DtypeVarchar2,
  Char,
  Assignment,
  Semicolon,
  SingleLineComment,
  MultiLineComment,
  Plus,
  Minus,
  Star,
  Slash,
  OpenBracket,
  ClosingBracket,
  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
  Integer,
  String
];

const SelectLexer = new Lexer(allTokens, { positionTracking: 'onlyStart' });

allTokens.forEach(tokenType => {
  tokenVocabulary[tokenType.name] = tokenType;
});

module.exports = {
  tokenVocabulary,

  lex(inputText) {
    const lexingResult = SelectLexer.tokenize(inputText);

    if (lexingResult.errors && lexingResult.errors.length > 0) {
      console.log('errors: ', lexingResult.errors);
      // throw Error('Sad Sad Panda, lexing errors detected');
    }

    return lexingResult;
  }
};
