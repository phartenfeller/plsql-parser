import { createToken, Lexer } from 'chevrotain';

export const KwIdentifier = createToken({
  name: 'KwIdentifier',
  pattern: Lexer.NA,
});
