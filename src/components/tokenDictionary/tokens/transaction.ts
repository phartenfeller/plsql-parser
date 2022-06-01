import { createToken } from 'chevrotain';
import Identifier from './Identifier';

const StartTransactionKw = createToken({
  name: 'StartTransactionKw',
  pattern: /start transaction/i,
  longer_alt: Identifier,
});

const CommitKw = createToken({
  name: 'CommitKw',
  pattern: /commit/i,
  longer_alt: Identifier,
});

const RollbackKw = createToken({
  name: 'RollbackKw',
  pattern: /rollback/i,
  longer_alt: Identifier,
});

export default [StartTransactionKw, CommitKw, RollbackKw];
