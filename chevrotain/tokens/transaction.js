const { createToken } = require('chevrotain');
const Identifier = require('./Identifier');

const StartTransactionKw = createToken({
  name: 'StartTransactionKw',
  pattern: /start transaction/,
  longer_alt: Identifier,
});

const CommitKw = createToken({
  name: 'CommitKw',
  pattern: /commit/,
  longer_alt: Identifier,
});

const RollbackKw = createToken({
  name: 'RollbackKw',
  pattern: /rollback/,
  longer_alt: Identifier,
});

module.exports = [StartTransactionKw, CommitKw, RollbackKw];
