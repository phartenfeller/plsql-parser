const { createToken } = require('chevrotain');
const Identifier = require('./Identifier');

const Assignment = createToken({
  name: 'Assignment',
  pattern: /:=/,
  longer_alt: Identifier
});

const SingleLineComment = createToken({
  name: 'SingleLineComment',
  pattern: /--.+/
});

const MultiLineCommentStart = createToken({
  name: 'MultiLineCommentStart',
  pattern: /\/\*/,
  longer_alt: Identifier
});

const MultiLineCommentEnd = createToken({
  name: 'MultiLineCommentEnd',
  pattern: /\*\//,
  longer_alt: Identifier
});

const Semicolon = createToken({
  name: 'Semicolon',
  pattern: /;/,
  longer_alt: Identifier
});

const Comma = createToken({
  name: 'Comma',
  pattern: /,/,
  longer_alt: Identifier
});

const Plus = createToken({
  name: 'Plus',
  pattern: /\+/,
  longer_alt: Identifier
});

const Minus = createToken({
  name: 'Minus',
  pattern: /-/,
  longer_alt: Identifier
});

const Asterisk = createToken({
  name: 'Asterisk',
  pattern: /\*/,
  longer_alt: Identifier
});

const Slash = createToken({
  name: 'Slash',
  pattern: /\//,
  longer_alt: Identifier
});

const OpenBracket = createToken({
  name: 'OpenBracket',
  pattern: /\(/,
  longer_alt: Identifier
});

const ClosingBracket = createToken({
  name: 'ClosingBracket',
  pattern: /\)/,
  longer_alt: Identifier
});

module.exports = [
  Assignment,
  SingleLineComment,
  MultiLineCommentStart,
  MultiLineCommentEnd,
  Semicolon,
  Comma,
  Plus,
  Minus,
  Asterisk,
  Slash,
  OpenBracket,
  ClosingBracket
];
