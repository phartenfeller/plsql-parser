const readFile = require('./src/util/readFile');
const { lex } = require('./src/components/tokenDictionary/tokens');
const parse = require('./src/components/mainParser/noRecoveryParser');

// const yellowLog = (text) => `\x1b[33m${text}\x1b[0m`;

const logLexer = (file) => {
  const lexRes = lex(file);

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
      position: `${token.startLine}:${token.startColumn} - ${token.endLine}:${token.endColumn}`,
    });
  });

  console.table(arr);
};

const main = async () => {
  try {
    const file = await readFile('./test/plsql/current-error.sql');
    logLexer(file);
    parse(file, true);
  } catch (err) {
    console.log(err);
  }
};

main();
