const { createToken } = require('chevrotain');
const {Identifier} = require('./Identifier');

const ExecuteImmediateKw = createToken({
  name: 'ExecuteImmediateKw',
  pattern: /execute immediate/i,
  longer_alt: Identifier,
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
});

module.exports = [ExecuteImmediateKw, UsingKw, ReturningKw];
