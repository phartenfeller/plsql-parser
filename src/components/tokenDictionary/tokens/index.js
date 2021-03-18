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
const exception = require('./exception');
const dynSql = require('./dynSql');
const loops = require('./loops');
const values = require('./values');

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

/* ===== Keywords ===== */
const Declare = createToken({
  name: 'Declare',
  pattern: /declare/i,
  // longer_alt: Identifier
});
const Begin = createToken({
  name: 'Begin',
  pattern: /begin/i,
  longer_alt: Identifier,
});
const End = createToken({
  name: 'End',
  pattern: /end/i,
  longer_alt: Identifier,
});

const Null = createToken({
  name: 'Null',
  pattern: /null/i,
  longer_alt: Identifier,
});

const CreateKw = createToken({
  name: 'CreateKw',
  pattern: /create/i,
  longer_alt: Identifier,
});

const ReplaceKw = createToken({
  name: 'ReplaceKw',
  pattern: /replace/i,
  longer_alt: Identifier,
});

const AsKw = createToken({
  name: 'AsKw',
  pattern: /as/i,
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
  ...pragma,
  ...exception,
  ...ifStatement,
  Declare,
  Begin,
  End,
  ...dataTypes,
  ...values,
  Null,
  ...sql,
  ...dynSql,
  ...transaction,
  ...loops,
  CreateKw,
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

const SelectLexer = new Lexer(allTokens, { positionTracking: 'full' });

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
