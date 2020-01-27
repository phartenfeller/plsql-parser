const readFile = require('../util/readFile');
const jison = require('jison');

const parserGenerator = async () => {
  const bnf = await readFile('./jison/plsql.jison');
  return new jison.Parser(bnf);
};

module.exports = parserGenerator;
