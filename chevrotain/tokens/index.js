const { createToken, Lexer } = require('chevrotain');
const Identifier = require('./Identifier');
const relationalOperators = require('./relationalOperators');
const ifStatement = require('./ifStatement');
const subprograms = require('./subprograms');
const dataTypes = require('./dataTypes');
const symbols = require('./symbols');
const pragma = require('./pragma');
const transaction = require('./transaction');
const sql = require('./sql');

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

/* ===== Keywords ===== */
const Declare = createToken({
  name: 'Declare',
  pattern: /declare/,
  // longer_alt: Identifier
});
const Begin = createToken({
  name: 'Begin',
  pattern: /begin/,
  longer_alt: Identifier,
});
const End = createToken({
  name: 'End',
  pattern: /end/,
  longer_alt: Identifier,
});

// TODO: Refactor more things from rules to categories
const BoolValue = createToken({
  name: 'BoolValue',
  pattern: Lexer.NA,
});
const BoolTrue = createToken({
  name: 'BoolTrue',
  pattern: /true/,
  longer_alt: Identifier,
  categories: BoolValue,
});
const BoolFalse = createToken({
  name: 'BoolTrue',
  pattern: /false/,
  longer_alt: Identifier,
  categories: BoolValue,
});

const Null = createToken({
  name: 'Null',
  pattern: /null/,
  longer_alt: Identifier,
});

const CreateKw = createToken({
  name: 'CreateKw',
  pattern: /create/,
  longer_alt: Identifier,
});

const OrKw = createToken({
  name: 'OrKw',
  pattern: /or/,
  longer_alt: Identifier,
});

const ReplaceKw = createToken({
  name: 'ReplaceKw',
  pattern: /replace/,
  longer_alt: Identifier,
});

const AsKw = createToken({
  name: 'AsKw',
  pattern: /as/,
  longer_alt: Identifier,
});

const Float = createToken({
  name: 'Float',
  pattern: /([0-9]*[.])[0-9]+/,
});
const Integer = createToken({
  name: 'Integer',
  pattern: /0|[1-9]\d*/,
});
const String = createToken({ name: 'String', pattern: /'((?:''|[^'])*)'/ });

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
});

const allTokens = [
  WhiteSpace,
  // "keywords" appear before the Identifier
  ...ifStatement,
  Declare,
  Begin,
  End,
  ...dataTypes,
  BoolValue,
  BoolTrue,
  BoolFalse,
  Null,
  ...sql,
  ...pragma,
  ...transaction,
  CreateKw,
  OrKw,
  ReplaceKw,
  AsKw,
  ...subprograms,
  ...symbols,
  ...relationalOperators,
  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
  Float,
  Integer,
  String,
];

const SelectLexer = new Lexer(allTokens, { positionTracking: 'onlyStart' });

allTokens.forEach((tokenType) => {
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
  },
};
