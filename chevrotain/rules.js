const { CstParser } = require('chevrotain');
const { tokenVocabulary, lex } = require('./tokens/tokens');

class SelectParser extends CstParser {
  constructor() {
    super(tokenVocabulary);

    const $ = this;

    $.RULE('global', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.block) },
        { ALT: () => $.SUBRULE($.createPackage) }
      ]);
    });

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
        { ALT: () => $.SUBRULE($.comment) },
        { ALT: () => $.SUBRULE($.nullStatement) },
        { ALT: () => $.SUBRULE($.ifStatement) }
      ]);
    });

    $.RULE('nullStatement', () => {
      $.CONSUME(tokenVocabulary.Null);
      $.SUBRULE($.semicolon);
    });

    $.RULE('ifStatement', () => {
      $.CONSUME(tokenVocabulary.If); // if
      $.SUBRULE($.condition); // l_var1 > l_var2
      $.CONSUME(tokenVocabulary.Then); // Then
      $.MANY(() => {
        $.SUBRULE2($.statement); // ...
      });
      $.OPTION(() => {
        $.MANY2(() => {
          $.CONSUME(tokenVocabulary.Elsif); // elsif
          $.SUBRULE3($.condition); // l_var1 < l_var2
          $.CONSUME2(tokenVocabulary.Then); // then
          $.MANY3(() => {
            $.SUBRULE4($.statement); // ...
          });
        });
      });
      $.OPTION2(() => {
        $.CONSUME(tokenVocabulary.Else); // else
        $.MANY4(() => {
          $.SUBRULE5($.statement); // ...
        });
      });
      $.CONSUME(tokenVocabulary.End); // end
      $.CONSUME2(tokenVocabulary.If); // if
      $.SUBRULE($.semicolon);
    });

    $.RULE('relationalOperators', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.Equals) },
        { ALT: () => $.CONSUME(tokenVocabulary.UnEquals1) },
        { ALT: () => $.CONSUME(tokenVocabulary.UnEquals2) },
        { ALT: () => $.CONSUME(tokenVocabulary.UnEquals3) },
        { ALT: () => $.CONSUME(tokenVocabulary.BiggerEquals) },
        { ALT: () => $.CONSUME(tokenVocabulary.Bigger) },
        { ALT: () => $.CONSUME(tokenVocabulary.SmallerEquals) },
        { ALT: () => $.CONSUME(tokenVocabulary.Smaller) }
      ]);
    });

    // TODO: implement condition
    $.RULE('condition', () => {
      $.CONSUME(tokenVocabulary.Identifier);
      $.SUBRULE($.relationalOperators);
      $.CONSUME2(tokenVocabulary.Identifier);
    });

    $.RULE('createPackage', () => {
      $.CONSUME(tokenVocabulary.CreateKw); // create
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.OrKw); // or
        $.CONSUME(tokenVocabulary.ReplaceKw); // replace
      });
      $.CONSUME(tokenVocabulary.PackageKw); // package
      $.CONSUME(tokenVocabulary.Identifier); // pkg_name
      $.CONSUME(tokenVocabulary.AsKw); // as
      $.MANY(() => {
        $.SUBRULE($.variableDeclaration);
      });
      $.CONSUME(tokenVocabulary.End); // end
      $.OPTION2(() => {
        $.CONSUME2(tokenVocabulary.Identifier); // pkg_name
      });
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('variableDeclaration', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.numberDeclaration) },
        { ALT: () => $.SUBRULE($.stringDeclaration) },
        { ALT: () => $.SUBRULE($.plsIntegerDeclaration) },
        { ALT: () => $.SUBRULE($.boolDeclaration) },
        { ALT: () => $.SUBRULE($.dateDeclaration) },
        { ALT: () => $.SUBRULE($.comment) }, // TODO: is this necessary???
        { ALT: () => $.SUBRULE($.functionDeclaration) },
        { ALT: () => $.SUBRULE($.procedureDeclaration) }
      ]);
    });

    $.RULE('argument', () => {
      $.CONSUME(tokenVocabulary.Identifier); // pi_input
      $.OR([
        {
          ALT: () => {
            $.CONSUME(tokenVocabulary.InKw); // in
            $.OPTION(() => {
              $.CONSUME(tokenVocabulary.OutKw); // out
              $.OPTION2(() => {
                $.CONSUME(tokenVocabulary.NocopyKw); // nopy
              });
            });
          }
        },
        {
          ALT: () => {
            $.CONSUME2(tokenVocabulary.OutKw); // out
            $.OPTION3(() => {
              $.CONSUME2(tokenVocabulary.NocopyKw); // nocopy
            });
          }
        }
      ]);
      $.SUBRULE($.dataType); // varchar2 | number ...
      $.OPTION4(() => {
        $.OR2([
          { ALT: () => $.CONSUME(tokenVocabulary.DefaultKw) }, // default
          { ALT: () => $.CONSUME(tokenVocabulary.Assignment) } // :=
        ]);
        $.SUBRULE($.value);
      });
    });

    $.RULE('value', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.number) }, // 4.2
        { ALT: () => $.CONSUME(tokenVocabulary.String) }, // 'value'
        { ALT: () => $.CONSUME(tokenVocabulary.BoolValue) }, // true
        { ALT: () => $.CONSUME(tokenVocabulary.DateValue) } // sysdate | current_date
      ]);
    });

    $.RULE('argumentList', () => {
      $.CONSUME(tokenVocabulary.OpenBracket); // (
      $.MANY_SEP({
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.SUBRULE($.argument);
        }
      });
      $.CONSUME(tokenVocabulary.ClosingBracket); // )
    });

    $.RULE('functionDeclaration', () => {
      $.CONSUME(tokenVocabulary.FunctionKw); // procedure
      $.CONSUME(tokenVocabulary.Identifier); // fnc_name
      $.OPTION(() => {
        $.SUBRULE($.argumentList); // (pi_vc in varchar2, pi_dat in date)
      });
      $.CONSUME(tokenVocabulary.ReturnKw);
      $.SUBRULE($.dataType); // varchar2
      $.OPTION2(() => {
        $.CONSUME(tokenVocabulary.DeterministicKw); // deterministic
      });
      $.OPTION3(() => {
        $.CONSUME(tokenVocabulary.ResultCacheKw); // result_cache
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('procedureDeclaration', () => {
      $.CONSUME(tokenVocabulary.ProcedureKw); // procedure
      $.CONSUME(tokenVocabulary.Identifier); // prc_name
      $.OPTION(() => {
        $.SUBRULE($.argumentList); // (pi_vc in varchar2, pi_dat in date)
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('dataType', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeNumber) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeDate) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeBoolean) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeVarchar2) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypePlsIteger) }
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
    parserInstance.global();

    if (parserInstance.errors.length > 0) {
      throw Error(parserInstance.errors);
      // throw Error(
      //   `Sad sad panda, parsing errors detected!\n${parserInstance.errors[0].message}`
      // );
    }

    return { errors: parserInstance.errors };
  }
};
