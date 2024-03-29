import { createToken } from 'chevrotain';
import { KwIdentifier } from './specialIdentifiers';
import strings from './strings';

// does not work because identifier will always be this token
// const AnyValue = createToken({
//   name: 'AnyValue',
//   pattern: /(?:[a-zA-Z0-9']|\$\$)[a-zA-Z_.()+\-*/<>|,= ]*/,
// });

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadat
const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z][a-zA-Z0-9_$]*/, // first must be a letter than also numbers, "_" and "$"
  longer_alt: strings.find((t) => t.name === 'AlternateQuotingMechanism'),
  categories: [KwIdentifier],
});

export default Identifier;
