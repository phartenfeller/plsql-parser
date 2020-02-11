const { CstParser } = require('chevrotain');
const { tokenVocabulary, lex } = require('./tokens');

class SelectParser extends CstParser {
  constructor() {
    super(tokenVocabulary);

    const $ = this;

    $.RULE('block', () => {
      $.OPTION(() => {
        $.SUBRULE($.declareClause);
        $.MANY(() => {
          $.SUBRULE($.variableDeclaration);
        });
      });
      $.SUBRULE($.beginClause);
      $.MANY2(() => {
        $.SUBRULE($.statement);
      });
      $.SUBRULE($.endClause);
      $.SUBRULE($.semicolon);
    });

    $.RULE('declareClause', () => {
      $.CONSUME(tokenVocabulary.Declare);
    });

    $.RULE('beginClause', () => {
      $.CONSUME(tokenVocabulary.Begin);
    });

    $.RULE('endClause', () => {
      $.CONSUME(tokenVocabulary.End);
    });

    $.RULE('statement', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.assignment) },
        { ALT: () => $.SUBRULE($.comment) }
      ]);
    });

    $.RULE('variableDeclaration', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.numberDeclaration) },
        { ALT: () => $.SUBRULE($.stringDeclaration) }
      ]);
    });

    $.RULE('numberDeclaration', () => {
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.DtypeNumber);
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Assignment);
        $.CONSUME(tokenVocabulary.Integer);
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('stringDeclaration', () => {
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.DtypeVarchar2);
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.OpenBracket);
        $.CONSUME(tokenVocabulary.Integer);
        $.OPTION2(() => {
          $.CONSUME(tokenVocabulary.Char);
        });
        $.CONSUME(tokenVocabulary.ClosingBracket);
      });
      $.OPTION3(() => {
        $.CONSUME(tokenVocabulary.Assignment);
        $.CONSUME(tokenVocabulary.String);
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('comment', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.SingleLineComment) },
        { ALT: () => $.CONSUME(tokenVocabulary.MultiLineComment) }
      ]);
    });

    $.RULE('assignment', () => {
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.Assignment);
      $.SUBRULE($.additionExpression);
      $.SUBRULE($.semicolon);
    });

    $.RULE('additionExpression', () => {
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.Plus);
      $.CONSUME(tokenVocabulary.Integer);
    });

    $.RULE('semicolon', () => {
      $.CONSUME(tokenVocabulary.Semicolon);
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

const parserInstance = new SelectParser();

module.exports = {
  parserInstance,

  SelectParser,

  parse(inputText) {
    const lexResult = lex(inputText);

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens;

    // No semantic actions so this won't return anything yet.
    parserInstance.block();

    if (parserInstance.errors.length > 0) {
      throw Error(parserInstance.errors);
      // throw Error(
      //   `Sad sad panda, parsing errors detected!\n${parserInstance.errors[0].message}`
      // );
    }
  }
};
