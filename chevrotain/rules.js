const { CstParser } = require('chevrotain');
const { tokenVocabulary, lex } = require('./tokens/tokens');

class SelectParser extends CstParser {
  constructor() {
    super(tokenVocabulary);

    const $ = this;

    $.RULE('global', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.block) },
        { ALT: () => $.SUBRULE($.createPackage) },
      ]);
    });

    $.RULE('createPackage', () => {
      $.OR({
        MAX_LOOKAHEAD: 5, // create or replace package ?BODY? pkg_name
        DEF: [
          { ALT: () => $.SUBRULE($.createPackageSpec) },
          { ALT: () => $.SUBRULE($.createPackageBody) },
        ],
      });
    });

    $.RULE('block', () => {
      $.OPTION(() => {
        $.SUBRULE($.declareClause);
        $.MANY(() => {
          $.OR([
            { ALT: () => $.SUBRULE($.packageObjSpec) },
            { ALT: () => $.SUBRULE($.variableDeclaration) },
          ]);
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
        { ALT: () => $.SUBRULE($.ifStatement) },
        { ALT: () => $.SUBRULE($.insertStatement) },
        { ALT: () => $.SUBRULE($.transactionStatement) },
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
        { ALT: () => $.CONSUME(tokenVocabulary.Smaller) },
      ]);
    });

    // TODO: implement condition
    $.RULE('condition', () => {
      $.CONSUME(tokenVocabulary.Identifier);
      $.SUBRULE($.relationalOperators);
      $.CONSUME2(tokenVocabulary.Identifier);
    });

    $.RULE('createPackageStatement', () => {
      $.CONSUME(tokenVocabulary.CreateKw); // create
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.OrKw); // or
        $.CONSUME(tokenVocabulary.ReplaceKw); // replace
      });
      $.CONSUME(tokenVocabulary.PackageKw); // package
    });

    $.RULE('createPackageSpec', () => {
      $.SUBRULE($.createPackageStatement); // create (or replace) package
      $.CONSUME(tokenVocabulary.Identifier); // pkg_name
      $.CONSUME(tokenVocabulary.AsKw); // as
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.objectDeclaration) },
          { ALT: () => $.SUBRULE($.variableDeclaration) },
        ]);
      });
      $.CONSUME(tokenVocabulary.End); // end
      $.OPTION2(() => {
        $.CONSUME2(tokenVocabulary.Identifier); // pkg_name
      });
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('createPackageBody', () => {
      $.SUBRULE($.createPackageStatement); // create (or replace) package
      $.CONSUME(tokenVocabulary.BodyKw); // body
      $.CONSUME(tokenVocabulary.Identifier); // pkg_name
      $.CONSUME(tokenVocabulary.AsKw); // as
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.packageObjSpec) },
          { ALT: () => $.SUBRULE($.variableDeclaration) }, // TODO: here is also spec ? where is spec allowed ? remove from variable declaration ? wth
        ]);
      });
      $.CONSUME(tokenVocabulary.End); // end
      $.OPTION2(() => {
        $.CONSUME2(tokenVocabulary.Identifier); // pkg_name
      });
      $.SUBRULE($.semicolon); // ;
    });

    // TODO: Add more: http://cui.unige.ch/isi/bnf/PLSQL21/package_obj_spec.html
    $.RULE('packageObjSpec', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.funcBody) },
        { ALT: () => $.SUBRULE($.procBody) },
      ]);
    });

    $.RULE('funcBody', () => {
      $.SUBRULE($.funcSpec);
      $.CONSUME(tokenVocabulary.AsKw); // as
      $.MANY(() => {
        $.SUBRULE($.variableDeclaration); // l_num number := 1;
      });
      $.CONSUME(tokenVocabulary.Begin); // begin
      $.MANY2(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.statement) },
          {
            ALT: () => {
              $.CONSUME(tokenVocabulary.ReturnKw); // return
              $.CONSUME(tokenVocabulary.Identifier); // l_var
              $.SUBRULE($.semicolon); // ;
            },
          },
        ]);
      });
      $.CONSUME(tokenVocabulary.End); // end
      $.OPTION(() => {
        $.CONSUME2(tokenVocabulary.Identifier); // my_fnc
      });
      $.SUBRULE2($.semicolon); // ;
    });

    $.RULE('procBody', () => {
      $.SUBRULE($.procSpec);
      $.CONSUME(tokenVocabulary.AsKw); // as
      $.MANY(() => {
        $.SUBRULE($.variableDeclaration); // l_num number := 1;
      });
      $.CONSUME(tokenVocabulary.Begin); // begin
      $.MANY2(() => {
        $.SUBRULE($.statement);
      });
      $.CONSUME(tokenVocabulary.End); // end
      $.OPTION(() => {
        $.CONSUME2(tokenVocabulary.Identifier); // my_pkg
      });
      $.SUBRULE2($.semicolon); // ;
    });

    $.RULE('variableDeclaration', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.numberDeclaration) },
        { ALT: () => $.SUBRULE($.stringDeclaration) },
        { ALT: () => $.SUBRULE($.plsIntegerDeclaration) },
        { ALT: () => $.SUBRULE($.boolDeclaration) },
        { ALT: () => $.SUBRULE($.dateDeclaration) },
        { ALT: () => $.SUBRULE($.pragmaStatement) },
        { ALT: () => $.SUBRULE($.objectType) },
        { ALT: () => $.SUBRULE($.comment) }, // TODO: is this necessary???
      ]);
    });

    $.RULE('objectType', () => {
      $.CONSUME(tokenVocabulary.Identifier); // l_row
      $.OR({
        MAX_LOOKAHEAD: 5, // table_name.column_name%?type | rowtype?
        DEF: [
          { ALT: () => $.SUBRULE($.columnType) },
          { ALT: () => $.SUBRULE($.rowType) },
        ],
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('columnType', () => {
      $.CONSUME(tokenVocabulary.Identifier); // schema_name
      $.CONSUME(tokenVocabulary.Dot); // .
      $.CONSUME2(tokenVocabulary.Identifier); // table_name
      $.OPTION(() => {
        $.CONSUME2(tokenVocabulary.Dot); // .
        $.CONSUME3(tokenVocabulary.Identifier); // column_name
      });
      $.CONSUME(tokenVocabulary.Percent); // %
      $.CONSUME(tokenVocabulary.Type); // type
    });

    $.RULE('rowType', () => {
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Identifier); // schema_name
        $.CONSUME(tokenVocabulary.Dot); // .
      });
      $.CONSUME2(tokenVocabulary.Identifier); // table_name
      $.CONSUME(tokenVocabulary.Percent); // %
      $.CONSUME(tokenVocabulary.Rowtype); // rowtype
    });

    $.RULE('pragmaStatement', () => {
      $.CONSUME(tokenVocabulary.PragmaKw);
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.AutonomousTransactionKw) },
        { ALT: () => $.CONSUME(tokenVocabulary.ExceptionInitKw) },
        { ALT: () => $.CONSUME(tokenVocabulary.RestrictReferencesKw) },
        { ALT: () => $.CONSUME(tokenVocabulary.SeriallyReusableKw) },
      ]);
      $.SUBRULE($.semicolon);
    });

    $.RULE('objectDeclaration', () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.funcSpec);
            $.SUBRULE($.semicolon);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.procSpec);
            $.SUBRULE2($.semicolon);
          },
        },
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
          },
        },
        {
          ALT: () => {
            $.CONSUME2(tokenVocabulary.OutKw); // out
            $.OPTION3(() => {
              $.CONSUME2(tokenVocabulary.NocopyKw); // nocopy
            });
          },
        },
      ]);
      $.SUBRULE($.dataType); // varchar2 | number ...
      $.OPTION4(() => {
        $.OR2([
          { ALT: () => $.CONSUME(tokenVocabulary.DefaultKw) }, // default
          { ALT: () => $.CONSUME(tokenVocabulary.Assignment) }, // :=
        ]);
        $.SUBRULE($.value);
      });
    });

    $.RULE('value', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.number) }, // 4.2
        { ALT: () => $.CONSUME(tokenVocabulary.String) }, // 'value'
        { ALT: () => $.CONSUME(tokenVocabulary.BoolValue) }, // true
        { ALT: () => $.CONSUME(tokenVocabulary.DateValue) }, // sysdate | current_date
        { ALT: () => $.CONSUME(tokenVocabulary.Null) },
      ]);
    });

    $.RULE('argumentList', () => {
      $.CONSUME(tokenVocabulary.OpenBracket); // (
      $.MANY_SEP({
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.SUBRULE($.argument);
        },
      });
      $.CONSUME(tokenVocabulary.ClosingBracket); // )
    });

    $.RULE('funcSpec', () => {
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
    });

    $.RULE('procSpec', () => {
      $.CONSUME(tokenVocabulary.ProcedureKw); // procedure
      $.CONSUME(tokenVocabulary.Identifier); // prc_name
      $.OPTION(() => {
        $.SUBRULE($.argumentList); // (pi_vc in varchar2, pi_dat in date)
      });
    });

    $.RULE('dataType', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeNumber) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeDate) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeBoolean) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeVarchar2) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypePlsIteger) },
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
      $.CONSUME(tokenVocabulary.Identifier); // l_str
      $.CONSUME(tokenVocabulary.DtypeVarchar2); // varchar2
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.OpenBracket); // (
        $.CONSUME(tokenVocabulary.Integer); // 32
        $.OPTION2(() => {
          $.CONSUME(tokenVocabulary.Char); // char
        });
        $.CONSUME(tokenVocabulary.ClosingBracket); // )
      });
      $.OPTION3(() => {
        $.CONSUME(tokenVocabulary.Assignment); // :=
        $.AT_LEAST_ONE_SEP({
          // 'concat' || l_str
          SEP: tokenVocabulary.Concat,
          DEF: () => {
            $.OR([
              { ALT: () => $.CONSUME(tokenVocabulary.String) },
              { ALT: () => $.CONSUME2(tokenVocabulary.Identifier) },
            ]);
          },
        });
      });
      $.SUBRULE($.semicolon); // ;
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
        { ALT: () => $.SUBRULE($.multiLineComment) },
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
        { ALT: () => $.SUBRULE($.number) },
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
        { ALT: () => $.CONSUME(tokenVocabulary.Slash) },
      ]);
      $.OR2([
        { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
        { ALT: () => $.SUBRULE($.number) },
      ]);
    });

    $.RULE('number', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.Integer) },
        { ALT: () => $.CONSUME(tokenVocabulary.Float) },
      ]);
    });

    $.RULE('insertStatement', () => {
      $.CONSUME(tokenVocabulary.InsertKw); // insert
      $.CONSUME(tokenVocabulary.IntoKw); // into
      $.CONSUME(tokenVocabulary.Identifier); // table_name
      $.CONSUME(tokenVocabulary.OpenBracket); // (
      $.MANY_SEP({
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.CONSUME2(tokenVocabulary.Identifier);
        },
      });
      $.CONSUME(tokenVocabulary.ClosingBracket); // )
      $.CONSUME(tokenVocabulary.ValuesKw); // values
      $.CONSUME2(tokenVocabulary.OpenBracket); // (
      $.MANY_SEP2({
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.OR([
            { ALT: () => $.CONSUME3(tokenVocabulary.Identifier) },
            { ALT: () => $.SUBRULE($.value) },
          ]);
        },
      });
      $.CONSUME2(tokenVocabulary.ClosingBracket); // )
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('transactionStatement', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.StartTransactionKw) }, // start transaction
        { ALT: () => $.CONSUME(tokenVocabulary.CommitKw) }, // commit
        { ALT: () => $.CONSUME(tokenVocabulary.RollbackKw) }, // rollback
      ]);
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('semicolon', () => {
      $.CONSUME(tokenVocabulary.Semicolon, {
        ERR_MSG: 'expteted ";" at the end of the statement',
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
  },
};
