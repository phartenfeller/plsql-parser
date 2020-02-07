const { createToken, Lexer } = require('chevrotain');

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadat
const Identifier = createToken({ name: 'Identifier', pattern: /[a-zA-Z]\w*/ });

const Declare = createToken({
  name: 'Declare',
  pattern: /declare/
  // longer_alt: Identifier
});
const Begin = createToken({
  name: 'Begin',
  pattern: /begin/,
  longer_alt: Identifier
});
const End = createToken({
  name: 'End',
  pattern: /end/,
  longer_alt: Identifier
});
const Assignment = createToken({
  name: 'Assignment',
  pattern: /:=/,
  longer_alt: Identifier
});
const SingleLineComment = createToken({
  name: 'SingleLineComment',
  pattern: /--.+/,
  longer_alt: Identifier
});
const MultiLineComment = createToken({
  name: 'MultiLineComment',
  pattern: /\/*.*\//,
  longer_alt: Identifier
});
const Semicolon = createToken({
  name: 'Semicolon',
  pattern: /;/,
  longer_alt: Identifier
});
const Plus = createToken({
  name: 'Plus',
  pattern: /\+/,
  longer_alt: Identifier
});

const Integer = createToken({ name: 'Integer', pattern: /0|[1-9]\d*/ });

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED
});

const allTokens = [
  WhiteSpace,
  // "keywords" appear before the Identifier
  Declare,
  Begin,
  End,
  Assignment,
  Semicolon,
  SingleLineComment,
  MultiLineComment,
  Plus,
  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
  Integer
];

const SelectLexer = new Lexer(allTokens);

allTokens.forEach(tokenType => {
  tokenVocabulary[tokenType.name] = tokenType;
});

module.exports = {
  tokenVocabulary,

  lex(inputText) {
    const lexingResult = SelectLexer.tokenize(inputText);

    if (lexingResult.errors.length > 0) {
      throw Error(lexingResult.errors);
      // throw Error('Sad Sad Panda, lexing errors detected');
    }

    return lexingResult;
  }
};
