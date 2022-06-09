import { createToken, Lexer } from 'chevrotain';
import { categorizeSyntaxToken, SyntaxCategory } from '../syntaxHelper';
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
categorizeSyntaxToken(SyntaxCategory.Operator, Assignment);

const SingleLineComment = createToken({
  name: 'SingleLineComment',
  pattern: /--.*/,
  group: Lexer.SKIPPED,
});

const MultiLineComment = createToken({
  name: 'MultiLineComment',
  pattern: /\/\*[^`]*?\*\//,
  line_breaks: true,
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
categorizeSyntaxToken(SyntaxCategory.Operator, Plus);

const Minus = createToken({
  name: 'Minus',
  pattern: /-/,
  longer_alt: SingleLineComment,
  categories: AdditionOperator,
});
categorizeSyntaxToken(SyntaxCategory.Operator, Minus);

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
categorizeSyntaxToken(SyntaxCategory.Operator, Asterisk);

const Slash = createToken({
  name: 'Slash',
  pattern: /\//,
  longer_alt: Identifier,
  categories: MultiplicationOperator,
});
categorizeSyntaxToken(SyntaxCategory.Operator, Slash);

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
categorizeSyntaxToken(SyntaxCategory.Operator, Concat);

const Percent = createToken({
  name: 'Percent',
  pattern: /%/,
  longer_alt: Identifier,
});

const Dollar = createToken({
  name: 'Dollar',
  pattern: /\$/,
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
  Percent,
  Dollar,
  Dot,
  Arrow,
  AdditionOperator,
  MultiplicationOperator,
  ValueSeperator,
];
