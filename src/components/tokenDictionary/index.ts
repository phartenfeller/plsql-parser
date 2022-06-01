import readFile from '../../util/readFile';
import SelectLexer from './tokens';
// const parser from'./rules');

const main = async () => {
  const file = await readFile('../test/plsql/test.sql');
  const lexingResult = SelectLexer.tokenize(file);
  console.log(lexingResult);
  // parser.input = lexingResult;
  // console.log(parser);
  // parser.selectStatement();
};

main();
