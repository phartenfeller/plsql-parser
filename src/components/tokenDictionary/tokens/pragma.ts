import { createToken } from 'chevrotain';
import Identifier from './Identifier';
import OneWordKw from './oneWordKw';

const PragmaKw = createToken({
  name: 'PragmaKw',
  pattern: /pragma/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const AutonomousTransactionKw = createToken({
  name: 'AutonomousTransactionKw',
  pattern: /autonomous_transaction/i,
  longer_alt: Identifier,
});

const ExceptionInitKw = createToken({
  name: 'ExceptionInitKw',
  pattern: /exception_init/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const RestrictReferencesKw = createToken({
  name: 'RestrictReferencesKw',
  pattern: /restrict_references/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const SeriallyReusableKw = createToken({
  name: 'SeriallyReusableKw',
  pattern: /serially_reusable/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

export default [
  PragmaKw,
  AutonomousTransactionKw,
  ExceptionInitKw,
  RestrictReferencesKw,
  SeriallyReusableKw,
];
