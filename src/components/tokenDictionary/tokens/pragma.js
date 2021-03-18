const { createToken } = require('chevrotain');
const Identifier = require('./Identifier');

const PragmaKw = createToken({
  name: 'PragmaKw',
  pattern: /pragma/i,
  longer_alt: Identifier,
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
});

const RestrictReferencesKw = createToken({
  name: 'RestrictReferencesKw',
  pattern: /restrict_references/i,
  longer_alt: Identifier,
});

const SeriallyReusableKw = createToken({
  name: 'SeriallyReusableKw',
  pattern: /serially_reusable/i,
  longer_alt: Identifier,
});

module.exports = [
  PragmaKw,
  AutonomousTransactionKw,
  ExceptionInitKw,
  RestrictReferencesKw,
  SeriallyReusableKw,
];
