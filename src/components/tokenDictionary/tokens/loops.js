const { createToken } = require('chevrotain');
const Identifier = require('./Identifier');

const ForKw = createToken({
  name: 'ForKw',
  pattern: /for/i,
  longer_alt: Identifier,
});

const LoopKw = createToken({
  name: 'LoopKw',
  pattern: /loop/i,
  longer_alt: Identifier,
});

const DoubleDot = createToken({
  name: 'DoubleDot',
  pattern: /\.\./,
  longer_alt: Identifier,
});

const WhileKw = createToken({
  name: 'WhileKw',
  pattern: /while/i,
  longer_alt: Identifier,
});

module.exports = [ForKw, LoopKw, DoubleDot, WhileKw];
