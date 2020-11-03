const { createToken } = require('chevrotain');
const Identifier = require('./Identifier');

const plsqlUnitKw = createToken({
  name: 'plsqlUnitKw',
  pattern: /\$\$plsql_unit/i,
  longer_alt: Identifier,
});

const plsqlTypeKw = createToken({
  name: 'plsqlTypeKw',
  pattern: /\$\$plsql_type/i,
  longer_alt: Identifier,
});

module.exports = [plsqlUnitKw, plsqlTypeKw];
