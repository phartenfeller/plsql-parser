const readFile = require('./util/readFile');
const { parse } = require('./chevrotain/rules');

const main = async () => {
  try {
    const file = await readFile('./test/plsql/test.sql');
    parse(file);
  } catch (err) {
    console.log(err);
  }
};

main();
