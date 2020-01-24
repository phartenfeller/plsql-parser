// const commentRule = lexer => {
//   let char;
//   let comment = '';
//   do {
//     char = lexer.input();
//     comment += char;
//     if (char === '*') {
//       const nextChar = lexer.input();
//       if (nextChar === '/') {
//         break;
//       }
//     }
//   } while (char !== '');
//   // remove last "*""
//   comment = comment.slice(0, -1);
//   console.log('Found comment =>', comment);
//   return lexer;
// };

const setupRules = lexer => {
  lexer.addRule(/{BEGIN}/, () => {
    console.log(`Found begin =>`, lexer.text);
  });

  lexer.addRule('/*', () => {
    let char;
    let comment = '';
    do {
      char = lexer.input();
      comment += char;
      if (char === '*') {
        const nextChar = lexer.input();
        if (nextChar === '/') {
          break;
        }
      }
    } while (char !== '');
    // remove last "*""
    comment = comment.slice(0, -1);
    console.log('Found comment =>', comment.trim());
  });

  lexer.addRule('--', () => {
    let char;
    let comment = '';
    do {
      char = lexer.input();
      comment += char;
    } while (char !== '\n');
    // remove last "\n""
    comment = comment.slice(0, -1);
    console.log('Found comment =>', comment.trim());
  });

  return lexer;
};

module.exports = setupRules;
