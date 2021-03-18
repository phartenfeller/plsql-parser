/* global chevrotain */
(function varDeclaration() {
  // ----------------- Lexer -----------------
  const { createToken } = chevrotain;
  const { Lexer } = chevrotain;

  const Identifier = createToken({
    name: 'Identifier',
    pattern: /[a-zA-Z]\w*/,
  });

  const Declare = createToken({
    name: 'Declare',
    pattern: /declare/i,
    // longer_alt: Identifier
  });
  const Begin = createToken({
    name: 'Begin',
    pattern: /begin/i,
    longer_alt: Identifier,
  });
  const End = createToken({
    name: 'End',
    pattern: /end/i,
    longer_alt: Identifier,
  });
  const Assignment = createToken({
    name: 'Assignment',
    pattern: /:=/,
    longer_alt: Identifier,
  });
  const Concat = createToken({
    name: 'Concat',
    pattern: /\|\|/,
  });
  const Dot = createToken({
    name: 'Dot',
    pattern: /\./,
  });

  const Percent = createToken({
    name: 'Percent',
    pattern: /%/,
  });

  const Semicolon = createToken({
    name: 'Semicolon',
    pattern: /;/,
  });

  const Null = createToken({
    name: 'Null',
    pattern: /null/i,
    longer_alt: Identifier,
  });

  const Type = createToken({
    name: 'Type',
    pattern: /type/i,
    longer_alt: Identifier,
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

  const Float = createToken({
    name: 'Float',
    pattern: /([0-9]*[.])[0-9]+/,
  });

  const Integer = createToken({
    name: 'Integer',
    pattern: /0|[1-9]\d*/,
  });
  const String = createToken({ name: 'String', pattern: /'((?:''|[^'])*)'/ });

  const WhiteSpace = createToken({
    name: 'WhiteSpace',
    pattern: /[ \t\n\r]+/,
    group: Lexer.SKIPPED,
  });

  const tokenVocabulary = [
    Declare,
    Begin,
    End,
    Assignment,
    Concat,
    Dot,
    Percent,
    Semicolon,
    Type,
    Null,
    Identifier,
    AdditionOperator,
    Plus,
    Minus,
    MultiplicationOperator,
    Asterisk,
    Slash,
    Comma,
    OpenBracket,
    ClosingBracket,
    Float,
    Integer,
    String,
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
        $.CONSUME(Declare);
        $.MANY(() => {
          $.SUBRULE($.objectTypeDeclaration);
        });
        $.CONSUME(Begin);
        $.MANY2(() => {
          $.SUBRULE($.statement);
        });
        $.CONSUME(End);
        $.SUBRULE($.semicolon);
      });

      $.RULE('objectTypeDeclaration', () => {
        $.CONSUME(Identifier); // l_scope
        $.SUBRULE($.typeDef);
        $.OPTION2(() => {
          $.CONSUME(Assignment);
          $.SUBRULE($.value);
        });
        $.SUBRULE($.semicolon);
      });

      $.RULE('assignment', () => {
        $.OPTION(() => {
          $.CONSUME(Identifier); // l_obj
          $.CONSUME(Dot); // .
        });
        $.CONSUME2(Identifier);
        $.CONSUME(Assignment);
        $.SUBRULE($.value);
        $.SUBRULE($.semicolon);
      });

      $.RULE('value', () => {
        $.OR({
          DEF: [
            {
              GATE: $.BACKTRACK($.stringExpression),
              ALT: () => $.SUBRULE($.stringExpression),
            },
            {
              GATE: $.BACKTRACK($.mathExpression),
              ALT: () => $.SUBRULE($.mathExpression),
            },
          ],
        });
      });

      $.RULE('stringExpression', () => {
        $.AT_LEAST_ONE_SEP({
          SEP: Concat,
          DEF: () => {
            $.OR([
              { ALT: () => $.CONSUME(String) },
              { ALT: () => $.SUBRULE($.functionCall) },
              { ALT: () => $.CONSUME(Identifier) },
            ]);
          },
        });
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

      $.RULE('typeDef', () => {
        $.CONSUME(Identifier); // schema_name
        $.OPTION(() => {
          $.CONSUME(Dot); // .
          $.CONSUME2(Identifier); // table_name
        });
        $.OPTION2(() => {
          $.CONSUME2(Dot); // .
          $.CONSUME3(Identifier); // column_name
        });
        $.OPTION3(() => {
          $.CONSUME(Percent); // %
          $.CONSUME(Type);
        });
      });

      $.RULE('statement', () => {
        $.CONSUME(Null);
        $.SUBRULE($.semicolon);
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
