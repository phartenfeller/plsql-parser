const Lexer = require('flex-js');

const setupDefinitions = require('./definitions');
const setupRules = require('./rules');

let lexer = new Lexer();

lexer.setIgnoreCase(true);
// lexer.setDebugEnabled(true);

lexer = setupDefinitions(lexer);
lexer = setupRules(lexer);

const run = code => {
  lexer.setSource(code);
  const res = lexer.lex();
  console.log('res =>', res);
};

module.exports = run;
