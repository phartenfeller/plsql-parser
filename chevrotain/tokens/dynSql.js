const { createToken } = require('chevrotain');
const Identifier = require('./Identifier');

const ExecuteImmediateKw = createToken({
  name: 'ExecuteImmediateKw',
  pattern: /execute immediate/,
  longer_alt: Identifier,
});

const UsingKw = createToken({
  name: 'UsingKw',
  pattern: /using/,
  longer_alt: Identifier,
});

const ReturningKw = createToken({
  name: 'ReturningKw',
  pattern: /returning/,
  longer_alt: Identifier,
});

module.exports = [ExecuteImmediateKw, UsingKw, ReturningKw];
