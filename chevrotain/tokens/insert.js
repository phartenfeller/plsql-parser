const { createToken } = require('chevrotain');
const Identifier = require('./Identifier');

const InsertKw = createToken({
  name: 'InsertKw',
  pattern: /insert/,
  longer_alt: Identifier,
});

const IntoKw = createToken({
  name: 'IntoKw',
  pattern: /into/,
  longer_alt: Identifier,
});

const ValuesKw = createToken({
  name: 'ValuesKw',
  pattern: /values/,
  longer_alt: Identifier,
});

module.exports = [InsertKw, IntoKw, ValuesKw];
