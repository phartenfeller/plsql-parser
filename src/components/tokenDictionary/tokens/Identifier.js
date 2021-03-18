const { createToken } = require('chevrotain');

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadat
const Identifier = createToken({ name: 'Identifier', pattern: /[a-zA-Z]\w*/ });

module.exports = Identifier;
