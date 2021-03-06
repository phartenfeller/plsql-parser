/* global chevrotain */
(function varDeclaration() {
  // ----------------- Lexer -----------------
  const { createToken } = chevrotain;
  const { Lexer } = chevrotain;

  const Identifier = createToken({
    name: 'Identifier',
    pattern: /[a-zA-Z]\w*/,
  });

  const Semicolon = createToken({
    name: 'Semicolon',
    pattern: /;/,
  });

  const AdditionOperator = createToken({
    name: 'AdditionOperator',
    pattern: Lexer.NA,
  });

  const Plus = createToken({
    name: 'Plus',
    pattern: /\+/,
    longer_alt: Identifier,
    categories: AdditionOperator,
  });

  const Minus = createToken({
    name: 'Minus',
    pattern: /-/,
    longer_alt: Identifier,
    categories: AdditionOperator,
  });

  const MultiplicationOperator = createToken({
    name: 'MultiplicationOperator',
    pattern: Lexer.NA,
  });

  const Asterisk = createToken({
    name: 'Asterisk',
    pattern: /\*/,
    longer_alt: Identifier,
    categories: MultiplicationOperator,
  });

  const Slash = createToken({
    name: 'Slash',
    pattern: /\//,
    longer_alt: Identifier,
    categories: MultiplicationOperator,
  });

  const Comma = createToken({
    name: 'Comma',
    pattern: /,/,
    longer_alt: Identifier,
  });

  const OpenBracket = createToken({
    name: 'OpenBracket',
    pattern: /\(/,
    longer_alt: Identifier,
  });

  const ClosingBracket = createToken({
    name: 'ClosingBracket',
    pattern: /\)/,
    longer_alt: Identifier,
  });

  const Dot = createToken({
    name: 'Dot',
    pattern: /\./,
  });

  const Float = createToken({
    name: 'Float',
    pattern: /([0-9]*[.])[0-9]+/,
  });

  const Integer = createToken({
    name: 'Integer',
    pattern: /0|[1-9]\d*/,
  });

  const WhiteSpace = createToken({
    name: 'WhiteSpace',
    pattern: /[ \t\n\r]+/,
    group: Lexer.SKIPPED,
  });

  const tokenVocabulary = [
    Semicolon,
    Identifier,
    AdditionOperator,
    Plus,
    Minus,
    MultiplicationOperator,
    Asterisk,
    Slash,
    Comma,
    Dot,
    OpenBracket,
    ClosingBracket,
    Float,
    Integer,
    WhiteSpace,
  ];

  const PlSqlLexer = new Lexer(tokenVocabulary, {
    // Less position info tracked, reduces verbosity of the playground output.
    positionTracking: 'full',
  });

  // ----------------- parser -----------------
  const { CstParser } = chevrotain;

  class PlSqlParser extends CstParser {
    constructor() {
      super(tokenVocabulary, {
        recoveryEnabled: true,
      });

      const $ = this;

      $.RULE('block', () => {
        $.SUBRULE($.mathExpression);
        $.SUBRULE($.semicolon);
      });

      $.RULE('functionCall', () => {
        $.CONSUME(Identifier); // fct_name (or schema or pkg)
        $.OPTION(() => {
          $.CONSUME(Dot);
          $.CONSUME2(Identifier);
        });
        $.OPTION2(() => {
          $.CONSUME2(Dot);
          $.CONSUME3(Identifier);
        });
        $.CONSUME(OpenBracket); // (
        // function without params can be called like fct()
        $.OPTION4(() => {
          $.MANY_SEP({
            SEP: Comma,
            DEF: () => {
              $.SUBRULE($.value); // 6
            },
          });
        });
        $.CONSUME(ClosingBracket); // )
      });

      $.RULE('value', () => {
        $.OR([
          {
            GATE: $.BACKTRACK($.mathExpression),
            ALT: () => $.SUBRULE($.mathExpression),
          },
          { ALT: () => $.SUBRULE($.functionCall) },
        ]);
      });

      $.RULE('mathParenthesisExpression', () => {
        $.CONSUME(OpenBracket);
        $.SUBRULE($.mathExpression);
        $.CONSUME(ClosingBracket);
      });

      $.RULE('number', () => {
        $.OR([
          { ALT: () => $.CONSUME(Integer) },
          { ALT: () => $.CONSUME(Float) },
        ]);
      });

      $.RULE('mathAtomicExpression', () => {
        $.OR([
          {
            GATE: $.BACKTRACK($.mathParenthesisExpression),
            ALT: () => $.SUBRULE($.mathParenthesisExpression),
          },
          { ALT: () => $.SUBRULE($.number) },
          {
            ALT: () => $.SUBRULE($.functionCall),
          },
          { ALT: () => $.CONSUME(Identifier) },
        ]);
      });

      $.RULE('mathMultiplicationExpression', () => {
        $.SUBRULE($.mathAtomicExpression, { LABEL: 'lhs' });
        $.MANY(() => {
          $.CONSUME(MultiplicationOperator);
          $.SUBRULE2($.mathAtomicExpression, { LABEL: 'rhs' });
        });
      });

      $.RULE('mathAdditionExpression', () => {
        $.SUBRULE($.mathMultiplicationExpression, { LABEL: 'lhs' });
        $.MANY(() => {
          $.CONSUME(AdditionOperator);
          $.SUBRULE2($.mathMultiplicationExpression, { LABEL: 'rhs' });
        });
      });

      $.RULE('mathExpression', () => {
        $.SUBRULE($.mathAdditionExpression);
      });

      $.RULE('semicolon', () => {
        $.CONSUME(Semicolon, {
          ERR_MSG: 'expteted ";" at the end of the statement',
        });
      });

      // very important to call this after all the rules have been setup.
      // otherwise the parser may not work correctly as it will lack information
      // derived from the self analysis.
      this.performSelfAnalysis();
    }
  }

  // for the playground to work the returned object must contain these fields
  return {
    lexer: PlSqlLexer,
    parser: PlSqlParser,
    defaultRule: 'block',
  };
})();
