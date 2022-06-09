import { createToken } from 'chevrotain';
import { categorizeSyntaxToken, SyntaxCategory } from '../syntaxHelper';
import Identifier from './Identifier';

const Equals = createToken({
  name: 'Equals',
  pattern: /=/,
  longer_alt: Identifier,
});
categorizeSyntaxToken(SyntaxCategory.Operator, Equals);

const UnEquals1 = createToken({
  name: 'UnEquals1',
  pattern: /!=/,
  longer_alt: Identifier,
});
categorizeSyntaxToken(SyntaxCategory.Operator, UnEquals1);

const UnEquals2 = createToken({
  name: 'UnEquals2',
  pattern: /<>/,
  longer_alt: Identifier,
});
categorizeSyntaxToken(SyntaxCategory.Operator, UnEquals2);

const UnEquals3 = createToken({
  name: 'UnEquals3',
  pattern: /~=/,
  longer_alt: Identifier,
});
categorizeSyntaxToken(SyntaxCategory.Operator, UnEquals3);

const BiggerEquals = createToken({
  name: 'BiggerEquals',
  pattern: />=/,
  longer_alt: Identifier,
});
categorizeSyntaxToken(SyntaxCategory.Operator, BiggerEquals);

const Bigger = createToken({
  name: 'Bigger',
  pattern: />/,
  longer_alt: Identifier,
});
categorizeSyntaxToken(SyntaxCategory.Operator, Bigger);

const SmallerEquals = createToken({
  name: 'SmallerEquals',
  pattern: /<=/,
  longer_alt: Identifier,
});
categorizeSyntaxToken(SyntaxCategory.Operator, SmallerEquals);

const Smaller = createToken({
  name: 'Smaller',
  pattern: /</,
  longer_alt: Identifier,
});
categorizeSyntaxToken(SyntaxCategory.Operator, Smaller);

const NotKw = createToken({
  name: 'NotKw',
  pattern: /not/i,
  longer_alt: Identifier,
});
categorizeSyntaxToken(SyntaxCategory.Operator, NotKw);

const LikeKw = createToken({
  name: 'LikeKw',
  pattern: /like/i,
  longer_alt: Identifier,
});
categorizeSyntaxToken(SyntaxCategory.Operator, LikeKw);

export default [
  Equals,
  UnEquals1,
  UnEquals2,
  UnEquals3,
  BiggerEquals,
  Bigger,
  SmallerEquals,
  Smaller,
  NotKw,
  LikeKw,
];
