import { createToken } from 'chevrotain';
import Identifier from './Identifier';
import OneWordKw from './oneWordKw';

const ExecuteImmediateKw = createToken({
  name: 'ExecuteImmediateKw',
  pattern: /execute immediate/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

const UsingKw = createToken({
  name: 'UsingKw',
  pattern: /using/i,
  longer_alt: Identifier,
});

const ReturningKw = createToken({
  name: 'ReturningKw',
  pattern: /returning/i,
  longer_alt: Identifier,
  categories: [OneWordKw],
});

export default [ExecuteImmediateKw, UsingKw, ReturningKw];
