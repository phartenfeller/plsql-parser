import { createToken, Lexer } from 'chevrotain';
import Identifier from './Identifier';

const ValueSeperator = createToken({
  name: 'ValueSeperator',
  pattern: Lexer.NA,
});

const Assignment = createToken({
  name: 'Assignment',
  pattern: /:=/,
  longer_alt: Identifier,
});

const SingleLineComment = createToken({
  name: 'SingleLineComment',
  pattern: /--.*/,
  group: Lexer.SKIPPED,
});

const MultiLineComment = createToken({
  name: 'MultiLineComment',
  pattern: /\/\*[^`]*?\*\//,
  line_breaks: true,
  group: Lexer.SKIPPED,
});

const Semicolon = createToken({
  name: 'Semicolon',
  pattern: /;/,
  longer_alt: Identifier,
});

const Comma = createToken({
  name: 'Comma',
  pattern: /,/,
  longer_alt: Identifier,
});

const AdditionOperator = createToken({
  name: 'AdditionOperator',
  pattern: Lexer.NA,
  categories: ValueSeperator,
});

const Plus = createToken({
  name: 'Plus',
  pattern: /\+/,
  longer_alt: Identifier,
  categories: AdditionOperator,
});

const Minus = createToken({
  name: 'Minus',
  pattern: /-/,
  longer_alt: SingleLineComment,
  categories: AdditionOperator,
});

const MultiplicationOperator = createToken({
  name: 'MultiplicationOperator',
  pattern: Lexer.NA,
  categories: ValueSeperator,
});

const Asterisk = createToken({
  name: 'Asterisk',
  pattern: /\*/,
  longer_alt: Identifier,
  categories: MultiplicationOperator,
});

const Slash = createToken({
  name: 'Slash',
  pattern: /\//,
  longer_alt: Identifier,
  categories: MultiplicationOperator,
});

const OpenBracket = createToken({
  name: 'OpenBracket',
  pattern: /\(/,
  longer_alt: Identifier,
});

const ClosingBracket = createToken({
  name: 'ClosingBracket',
  pattern: /\)/,
  longer_alt: Identifier,
});

const Concat = createToken({
  name: 'Concat',
  pattern: /\|\|/,
  categories: ValueSeperator,
});

const Pipe = createToken({
  name: 'Pipe',
  pattern: /\|/,
  longer_alt: Concat,
});

const Percent = createToken({
  name: 'Percent',
  pattern: /%/,
  longer_alt: Identifier,
});

const CompileErrorKw = createToken({
  name: 'CompileErrorKw',
  pattern: /\$error/i,
  longer_alt: Identifier,
});

const Dollar = createToken({
  name: 'Dollar',
  pattern: /\$/,
  longer_alt: CompileErrorKw,
});

const Dot = createToken({
  name: 'Dot',
  pattern: /\./,
  longer_alt: Identifier,
});

const Arrow = createToken({
  name: 'Arrow',
  pattern: /=>/,
  longer_alt: Identifier,
});

export default [
  Assignment,
  SingleLineComment,
  MultiLineComment,
  Semicolon,
  Comma,
  Plus,
  Minus,
  Asterisk,
  Slash,
  OpenBracket,
  ClosingBracket,
  Concat,
  Pipe,
  Percent,
  CompileErrorKw,
  Dollar,
  Dot,
  Arrow,
  AdditionOperator,
  MultiplicationOperator,
  ValueSeperator,
];
