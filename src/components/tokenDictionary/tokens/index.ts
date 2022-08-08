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
import strings from './strings';
import objectTokens from './objectTokens';
import { KwIdentifier } from './specialIdentifiers';

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

const ExtractKw = createToken({
  name: 'ExtractKw',
  pattern: /extract/i,
  longer_alt: Identifier,
});

const RowKw = createToken({
  name: 'RowKw',
  pattern: /row[s]?/i,
  longer_alt: [
    Identifier,
    exception.find((t) => t.name === 'RowtypeMismatchKw') as TokenType,
  ],
});

const NoKw = createToken({
  name: 'NoKw',
  pattern: /no/i,
  longer_alt: [
    objectTokens.find((t) => t.name === 'NoCycleKw') as TokenType,
    objectTokens.find((t) => t.name === 'NoMaxvalueKw') as TokenType,
    objectTokens.find((t) => t.name === 'NoMinvalueKw') as TokenType,
    objectTokens.find((t) => t.name === 'NoCacheKw') as TokenType,
    objectTokens.find((t) => t.name === 'NoOrderKw') as TokenType,

    subprograms.find((t) => t.name === 'NocopyKw') as TokenType,

    relationalOperators.find((t) => t.name === 'NotKw') as TokenType,
    Identifier,
  ],
});

const ForceKw = createToken({
  name: 'ForceKw',
  pattern: /force/i,
  longer_alt: Identifier,
});

const ForallKw = createToken({
  name: 'ForallKw',
  pattern: /forall/i,
  longer_alt: Identifier,
});

const FormatJsonKw = createToken({
  name: 'FormatJsonKw',
  pattern: /format\s+json/i,
  longer_alt: Identifier,
});

const ForKw = createToken({
  name: 'ForKw',
  pattern: /for/i,
  longer_alt: [ForceKw, ForallKw, FormatJsonKw, Identifier],
});

const CastKw = createToken({
  name: 'CastKw',
  pattern: /cast/i,
  longer_alt: Identifier,
  categories: [KwIdentifier],
});

const Float = createToken({
  name: 'Float',
  pattern: /([0-9]*[.])[0-9]+/,
});

const Integer = createToken({
  name: 'Integer',
  pattern: /0|[1-9]\d*/,
});

const Quote = createToken({
  name: 'Quote',
  pattern: /"/,
  group: Lexer.SKIPPED,
});

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
});

const allTokens = [
  WhiteSpace,
  Quote,
  // "keywords" appear before the Identifier
  ...pragma,
  ...exception,
  ...ifStatement,
  Declare,
  Begin,
  End,
  ForceKw,
  ForallKw,
  FormatJsonKw,
  ForKw,
  CastKw,
  ...dataTypes,
  ...values,
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
  ExtractKw,
  RowKw,
  ...objectTokens,
  ...subprograms,
  ...symbols,
  ...relationalOperators,
  NoKw,
  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  KwIdentifier,
  Identifier,
  Float,
  Integer,
  ...strings,
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
    //console.log('errors: ', lexingResult.errors);
    throw Error(
      `Lexing errors detected: ${JSON.stringify(lexingResult.errors)}`
    );
  }

  return lexingResult;
}
