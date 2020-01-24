const setupDefinitions = lexer => {
  lexer.addDefinition('DIGIT', /[0-9]/);
  lexer.addDefinition('BEGIN', /begin/);
  lexer.addDefinition('END', /end/);
  return lexer;
};

module.exports = setupDefinitions;
