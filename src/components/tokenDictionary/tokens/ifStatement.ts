import { createToken, TokenType } from 'chevrotain';
import exceptions from './exception';
import Identifier from './Identifier';
import OneWordKw from './oneWordKw';

const If = createToken({
  name: 'If',
  pattern: /if/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const Elsif = createToken({
  name: 'Elsif',
  pattern: /elsif/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const Else = createToken({
  name: 'Else',
  pattern: /else/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const Then = createToken({
  name: 'Then',
  pattern: /then/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const CaseKw = createToken({
  name: 'CaseKw',
  pattern: /case/i,
  longer_alt: [
    exceptions.find((e) => e.name === 'CaseNotFoundKw') as TokenType,
    Identifier,
  ],
  categories: OneWordKw,
});

export default [If, Elsif, Else, Then, CaseKw];
