import { createToken } from 'chevrotain';
import exceptions from './exception';
import Identifier from './Identifier';

const If = createToken({
  name: 'If',
  pattern: /if/i,
  longer_alt: Identifier,
});

const Elsif = createToken({
  name: 'Elsif',
  pattern: /elsif/i,
  longer_alt: Identifier,
});

const Else = createToken({
  name: 'Else',
  pattern: /else/i,
  longer_alt: Identifier,
});

const Then = createToken({
  name: 'Then',
  pattern: /then/i,
  longer_alt: Identifier,
});

const CaseKw = createToken({
  name: 'CaseKw',
  pattern: /case/i,
  longer_alt: exceptions.find((e) => e.name === 'CaseNotFoundKw'),
});

export default [If, Elsif, Else, Then, CaseKw];