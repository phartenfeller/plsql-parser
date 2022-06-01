const { lex } = require('../tokenDictionary/tokens');
const PlSqlParser = require('./rules');
const logParserErrors = require('./util/logParserErrors');

const parserInstance = new PlSqlParser({ recover: true });

function parse(input, log = false) {
  const lexResult = lex(input);

  // ".input" is a setter which will reset the parser's internal's state.
  parserInstance.input = lexResult.tokens;

  // No semantic actions so this won't return anything yet.
  const cst = parserInstance.global();

  if (parserInstance.errors.length > 0 && log) {
    logParserErrors(parserInstance.errors);
  }

  return { errors: parserInstance.errors, cst };
}

module.exports = parse;
