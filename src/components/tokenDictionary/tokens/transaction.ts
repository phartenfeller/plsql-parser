import { createToken } from 'chevrotain';
import Identifier from './Identifier';
import OneWordKw from './oneWordKw';

const StartTransactionKw = createToken({
  name: 'StartTransactionKw',
  pattern: /start transaction/i,
  longer_alt: Identifier,
});

const CommitKw = createToken({
  name: 'CommitKw',
  pattern: /commit/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

const RollbackKw = createToken({
  name: 'RollbackKw',
  pattern: /rollback/i,
  longer_alt: Identifier,
  categories: OneWordKw,
});

export default [StartTransactionKw, CommitKw, RollbackKw];
