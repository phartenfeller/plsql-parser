const readFile = require('../../util/readFile');
const SelectLexer = require('./tokens');
// const parser = require('./rules');

const main = async () => {
  const file = await readFile('../test/plsql/test.sql');
  const lexingResult = SelectLexer.tokenize(file);
  console.log(lexingResult);
  // parser.input = lexingResult;
  // console.log(parser);
  // parser.selectStatement();
};

main();
