const { createToken } = require('chevrotain');
const Identifier = require('./Identifier');

const ForKw = createToken({
  name: 'ForKw',
  pattern: /for/,
  longer_alt: Identifier,
});

const LoopKw = createToken({
  name: 'LoopKw',
  pattern: /loop/,
  longer_alt: Identifier,
});

const DoubleDot = createToken({
  name: 'DoubleDot',
  pattern: /\.\./,
  longer_alt: Identifier,
});

module.exports = [ForKw, LoopKw, DoubleDot];
