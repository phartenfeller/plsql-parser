import readFile from './src/util/readFile';
import { lex } from './src/components/tokenDictionary/tokens';
import parse from './src/components/mainParser/noRecoveryParser';

// const yellowLog = (text) => `\x1b[33m${text}\x1b[0m`;

function getText(token) {
  if (token.tokenType.name === 'MultiLineComment') {
    return '/* ... */';
  }

  if (token.image.length > 35) {
    return `${token.image.substr(0, 32)}...`;
  }

  return token.image;
}

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
      text: getText(token),
      token:
        token.tokenType.name.length > 35
          ? `${token.tokenType.name.substr(0, 32)}...`
          : token.tokenType.name,
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
