import { createToken } from 'chevrotain';
import Identifier from './Identifier';

const Equals = createToken({
  name: 'Equals',
  pattern: /=/,
  longer_alt: Identifier,
});

const UnEquals1 = createToken({
  name: 'UnEquals1',
  pattern: /!=/,
  longer_alt: Identifier,
});

const UnEquals2 = createToken({
  name: 'UnEquals2',
  pattern: /<>/,
  longer_alt: Identifier,
});

const UnEquals3 = createToken({
  name: 'UnEquals3',
  pattern: /~=/,
  longer_alt: Identifier,
});

const BiggerEquals = createToken({
  name: 'BiggerEquals',
  pattern: />=/,
  longer_alt: Identifier,
});

const Bigger = createToken({
  name: 'Bigger',
  pattern: />/,
  longer_alt: Identifier,
});

const SmallerEquals = createToken({
  name: 'SmallerEquals',
  pattern: /<=/,
  longer_alt: Identifier,
});

const Smaller = createToken({
  name: 'Smaller',
  pattern: /</,
  longer_alt: Identifier,
});

const NotKw = createToken({
  name: 'NotKw',
  pattern: /not/i,
  longer_alt: Identifier,
});

const LikeKw = createToken({
  name: 'LikeKw',
  pattern: /like/i,
  longer_alt: Identifier,
});

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
