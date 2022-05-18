const { createToken } = require('chevrotain');

// does not work because identifier will always be this token
// const AnyValue = createToken({
//   name: 'AnyValue',
//   pattern: /(?:[a-zA-Z0-9']|\$\$)[a-zA-Z_.()+\-*/<>|,= ]*/,
// });

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadat
const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z][a-zA-Z0-9_$]*/, // first must be a letter than also numbers, "_" and "$"
  // longer_alt: AnyValue,
});

module.exports = { Identifier };
