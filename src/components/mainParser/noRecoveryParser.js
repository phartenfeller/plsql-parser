const { lex } = require('../tokenDictionary/tokens');
const PlSqlParser = require('./rules');
const logParserErrors = require('./util/logParserErrors');

const parserInstance = new PlSqlParser({ recover: false });

function parse(input, log = false) {
  const lexResult = lex(input);

  // ".input" is a setter which will reset the parser's internal's state.
  parserInstance.input = lexResult.tokens;

  // No semantic actions so this won't return anything yet.
  parserInstance.global();

  if (parserInstance.errors.length > 0) {
    if (log) {
      logParserErrors(parserInstance.errors);
    }
    throw Error(parserInstance.errors);
  }

  return { errors: parserInstance.errors };
}

module.exports = parse;
