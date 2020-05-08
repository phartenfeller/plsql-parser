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
        { ALT: () => $.SUBRULE($.stringDeclaration) },
        { ALT: () => $.SUBRULE($.plsIntegerDeclaration) },
        { ALT: () => $.SUBRULE($.boolDeclaration) },
        { ALT: () => $.SUBRULE($.dateDeclaration) },
        { ALT: () => $.SUBRULE($.comment) }
      ]);
    });

    $.RULE('numberDeclaration', () => {
      // l_num number
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.DtypeNumber);
      // (3,2)
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.OpenBracket);
        $.CONSUME(tokenVocabulary.Integer);
        $.OPTION2(() => {
          $.CONSUME(tokenVocabulary.Comma);
          $.CONSUME2(tokenVocabulary.Integer);
        });
        $.CONSUME(tokenVocabulary.ClosingBracket);
      });
      // := 3
      $.OPTION3(() => {
        $.CONSUME(tokenVocabulary.Assignment);
        $.CONSUME3(tokenVocabulary.Integer);
      });
      // ;
      $.SUBRULE($.semicolon);
    });

    $.RULE('plsIntegerDeclaration', () => {
      // l_pls pls_integer
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.DtypePlsIteger);
      // := 3
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Assignment);
        $.CONSUME3(tokenVocabulary.Integer);
      });
      // ;
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

    $.RULE('boolDeclaration', () => {
      // l_bool boolean
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.DtypeBoolean);
      // := true
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Assignment);
        $.CONSUME(tokenVocabulary.BoolValue);
      });
      // ;
      $.SUBRULE($.semicolon);
    });

    $.RULE('dateDeclaration', () => {
      // l_bool boolean
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.DtypeDate);
      // := true
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Assignment);
        $.CONSUME(tokenVocabulary.DateValue);
      });
      // ;
      $.SUBRULE($.semicolon);
    });

    $.RULE('comment', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.SingleLineComment) },
        { ALT: () => $.SUBRULE($.multiLineComment) }
      ]);
    });

    $.RULE('multiLineComment', () => {
      $.CONSUME(tokenVocabulary.MultiLineCommentStart);
      $.OPTION(() => {
        $.MANY(() => {
          $.CONSUME(tokenVocabulary.Identifier);
        });
      });
      $.CONSUME(tokenVocabulary.MultiLineCommentEnd);
    });

    $.RULE('assignment', () => {
      $.OR([{ ALT: () => $.SUBRULE($.mathAssignment) }]);
    });

    $.RULE('mathAssignment', () => {
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.Assignment);
      $.SUBRULE($.mathExpression);
      $.SUBRULE($.semicolon);
    });

    $.RULE('mathExpression', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
        { ALT: () => $.SUBRULE($.number) }
      ]);
      $.AT_LEAST_ONE(() => {
        $.SUBRULE($.mathTerm);
      });
    });

    $.RULE('mathTerm', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.Plus) },
        { ALT: () => $.CONSUME(tokenVocabulary.Minus) },
        { ALT: () => $.CONSUME(tokenVocabulary.Asterisk) },
        { ALT: () => $.CONSUME(tokenVocabulary.Slash) }
      ]);
      $.OR2([
        { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
        { ALT: () => $.SUBRULE($.number) }
      ]);
    });

    $.RULE('number', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.Integer) },
        { ALT: () => $.CONSUME(tokenVocabulary.Float) }
      ]);
    });

    $.RULE('semicolon', () => {
      $.CONSUME(tokenVocabulary.Semicolon, {
        ERR_MSG: 'expteted ";" at the end of the statemet'
      });
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

    return { errors: parserInstance.errors };
  }
};
