const { createToken } = require('chevrotain');
const Identifier = require('./Identifier');

const PragmaKw = createToken({
  name: 'PragmaKw',
  pattern: /pragma/,
  longer_alt: Identifier,
});

const AutonomousTransactionKw = createToken({
  name: 'AutonomousTransactionKw',
  pattern: /autonomous_transaction/,
  longer_alt: Identifier,
});

const ExceptionInitKw = createToken({
  name: 'ExceptionInitKw',
  pattern: /exception_init/,
  longer_alt: Identifier,
});

const RestrictReferencesKw = createToken({
  name: 'RestrictReferencesKw',
  pattern: /restrict_references/,
  longer_alt: Identifier,
});

const SeriallyReusableKw = createToken({
  name: 'SeriallyReusableKw',
  pattern: /serially_reusable/,
  longer_alt: Identifier,
});

module.exports = [
  PragmaKw,
  AutonomousTransactionKw,
  ExceptionInitKw,
  RestrictReferencesKw,
  SeriallyReusableKw,
];
