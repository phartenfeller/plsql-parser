const fs = require('fs');

const run = require('./src/lexer/lexer');

fs.readFile('./test/plsql/test.sql', (err, data) => {
  if (err) throw err;
  run(data.toString());
});
