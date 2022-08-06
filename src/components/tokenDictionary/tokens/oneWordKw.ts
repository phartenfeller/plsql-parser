import { createToken, Lexer } from 'chevrotain';

const OneWordKw = createToken({
  name: 'OneWordKw',
  pattern: Lexer.NA,
});

export default OneWordKw;
