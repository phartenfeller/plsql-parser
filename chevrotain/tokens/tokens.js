const { createToken, Lexer } = require('chevrotain');
const Identifier = require('./Identifier');
const relationalOperators = require('./relationalOperators');
const ifStatement = require('./ifStatement');

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

/* ===== Keywords ===== */
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
const DtypePlsIteger = createToken({
  name: 'DtypePlsIteger',
  pattern: /pls_integer/,
  longer_alt: Identifier
});
const DtypeVarchar2 = createToken({
  name: 'DtypeVarchar2',
  pattern: /varchar2/,
  longer_alt: Identifier
});
const DtypeBoolean = createToken({
  name: 'DtypeBoolean',
  pattern: /boolean/,
  longer_alt: Identifier
});
const DtypeDate = createToken({
  name: 'DtypeDate',
  pattern: /date/,
  longer_alt: Identifier
});
const Char = createToken({
  name: 'Char',
  pattern: /char/,
  longer_alt: Identifier
});
const DateValue = createToken({
  name: 'DateValue',
  pattern: /(sysdate|current_date)/
});
const BoolValue = createToken({
  name: 'BoolValue',
  pattern: Lexer.NA
});
const BoolTrue = createToken({
  name: 'BoolTrue',
  pattern: /true/,
  longer_alt: Identifier,
  categories: BoolValue
});
const BoolFalse = createToken({
  name: 'BoolTrue',
  pattern: /false/,
  longer_alt: Identifier,
  categories: BoolValue
});

const Null = createToken({
  name: 'Null',
  pattern: /null/,
  longer_alt: Identifier
});

/* ===== Other ===== */
const Assignment = createToken({
  name: 'Assignment',
  pattern: /:=/,
  longer_alt: Identifier
});
const SingleLineComment = createToken({
  name: 'SingleLineComment',
  pattern: /--.+/
});
const MultiLineCommentStart = createToken({
  name: 'MultiLineCommentStart',
  pattern: /\/\*/,
  longer_alt: Identifier
});
const MultiLineCommentEnd = createToken({
  name: 'MultiLineCommentEnd',
  pattern: /\*\//,
  longer_alt: Identifier
});
const Semicolon = createToken({
  name: 'Semicolon',
  pattern: /;/,
  longer_alt: Identifier
});
const Comma = createToken({
  name: 'Comma',
  pattern: /,/,
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
const Asterisk = createToken({
  name: 'Asterisk',
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
const Float = createToken({
  name: 'Float',
  pattern: /([0-9]*[.])[0-9]+/
});
const Integer = createToken({
  name: 'Integer',
  pattern: /0|[1-9]\d*/
});
const String = createToken({ name: 'String', pattern: /'((?:''|[^'])*)'/ });

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED
});

const allTokens = [
  WhiteSpace,
  // "keywords" appear before the Identifier
  ...relationalOperators,
  ...ifStatement,
  Declare,
  Begin,
  End,
  DtypeNumber,
  DtypePlsIteger,
  DtypeVarchar2,
  DtypeBoolean,
  DtypeDate,
  Char,
  DateValue,
  BoolValue,
  BoolTrue,
  BoolFalse,
  Null,
  Assignment,
  SingleLineComment,
  MultiLineCommentStart,
  MultiLineCommentEnd,
  Semicolon,
  Comma,
  Plus,
  Minus,
  Asterisk,
  Slash,
  OpenBracket,
  ClosingBracket,
  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
  Float,
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
