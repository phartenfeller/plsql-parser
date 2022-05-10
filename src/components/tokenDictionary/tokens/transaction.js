const { createToken } = require('chevrotain');
const {Identifier} = require('./Identifier');

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

module.exports = [StartTransactionKw, CommitKw, RollbackKw];
