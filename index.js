const readFile = require('./util/readFile');
const { parse } = require('./chevrotain/rules');

const main = async () => {
  try {
    const file = await readFile('./test/plsql/test.sql');
    const res = parse(file);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

console.log('test');
main();
