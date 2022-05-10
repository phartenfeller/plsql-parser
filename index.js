const readFile = require('./src/util/readFile');
const { parse, lexer } = require('./src/components/mainParser/rules');

// const yellowLog = (text) => `\x1b[33m${text}\x1b[0m`;

const logLexer = (file) => {
  const lexRes = lexer(file);

  const arr = [];

  lexRes.tokens.forEach((token) => {
    // let logText = `${yellowLog(token.image)}`;
    // logText += ` | Token: "${token.tokenType.name}"`;
    // if (token.tokenType?.LONGER_ALT?.name) {
    //   logText += ` - Longer Alt: "${token.tokenType?.LONGER_ALT?.name}"`;
    // }
    // console.log(logText);
    arr.push({
      text:
        token.tokenType.name === 'MultiLineComment' ? '/* ... */' : token.image,
      token: token.tokenType.name,
      longerAlt: token.tokenType?.LONGER_ALT?.name,
    });
  });

  console.table(arr);
};

const main = async () => {
  try {
    const file = await readFile('./test/plsql/current-error.sql');
    logLexer(file);
    parse(file);
  } catch (err) {
    console.log(err);
  }
};

main();
