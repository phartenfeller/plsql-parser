import { createToken, Lexer, TokenType } from 'chevrotain';
import dataTypes from './dataTypes';
import dynSql from './dynSql';
import exception from './exception';
import Identifier from './Identifier';
import ifStatement from './ifStatement';
import loops from './loops';
import pragma from './pragma';
import relationalOperators from './relationalOperators';
import sql from './sql';
import subprograms from './subprograms';
import symbols from './symbols';
import transaction from './transaction';
import values from './values';

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

const AsIs = createToken({
  name: 'AsIs',
  pattern: Lexer.NA,
});

const AsKw = createToken({
  name: 'AsKw',
  pattern: /as/i,
  longer_alt: Identifier,
  categories: AsIs,
});

const IsKw = createToken({
  name: 'IsKw',
  pattern: /is/i,
  longer_alt: Identifier,
  categories: AsIs,
});

const ExitKw = createToken({
  name: 'ExitKw',
  pattern: /exit/i,
  longer_alt: Identifier,
});

const TableKw = createToken({
  name: 'TableKw',
  pattern: /table/i,
  longer_alt: Identifier,
});

const CursorKw = createToken({
  name: 'CursorKw',
  pattern: /cursor/i,
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
  AsIs,
  AsKw,
  IsKw,
  ExitKw,
  TableKw,
  CursorKw,
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

// the vocabulary will be exported and used in the Parser definition.
export const tokenVocabulary: { [key: string]: TokenType } = {};

allTokens.forEach((tokenType) => {
  tokenVocabulary[tokenType.name] = tokenType;
});

export function lex(inputText: string) {
  const lexingResult = SelectLexer.tokenize(inputText);

  if (lexingResult.errors && lexingResult.errors.length > 0) {
    console.log('errors: ', lexingResult.errors);
    // throw Error('Sad Sad Panda, lexing errors detected');
  }

  return lexingResult;
}
