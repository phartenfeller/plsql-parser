const readFile = require('./util/readFile');
const parserGenerator = require('./jison/parser');

const main = async () => {
  const parser = await parserGenerator();
  const file = await readFile('./test/plsql/test.sql');
  const res = parser.parse(file);
  console.log(res);
};

main();
