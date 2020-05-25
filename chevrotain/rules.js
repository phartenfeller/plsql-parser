const { CstParser } = require('chevrotain');
const { tokenVocabulary, lex } = require('./tokens');

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
      $.OPTION2(() => {
        $.SUBRULE($.exceptionBlock);
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
        { ALT: () => $.SUBRULE($.queryStatement) },
        { ALT: () => $.SUBRULE($.insertStatement) },
        { ALT: () => $.SUBRULE($.transactionStatement) },
        { ALT: () => $.SUBRULE($.functionCallSemicolon) },
        { ALT: () => $.SUBRULE($.returnStatement) },
        { ALT: () => $.SUBRULE($.block) },
        { ALT: () => $.SUBRULE($.dynamicSqlStatement) },
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

    $.RULE('atomicExpression', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.Integer) },
        { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
      ]);
    });

    $.RULE('condition', () => {
      $.SUBRULE($.atomicExpression, { LABEL: 'lhs' });
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.relationalOperators);
            $.SUBRULE2($.atomicExpression, { LABEL: 'rhs' });
          },
        },
        {
          ALT: () => {
            $.CONSUME(tokenVocabulary.IsKw);
            $.OPTION(() => {
              $.CONSUME(tokenVocabulary.NotKw);
            });
            $.CONSUME(tokenVocabulary.Null, { LABEL: 'rhs' });
          },
        },
      ]);
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
          { ALT: () => $.SUBRULE($.variableDeclaration) }, // TODO here is also spec ? where is spec allowed ? remove from variable declaration ? wth
        ]);
      });
      $.CONSUME(tokenVocabulary.End); // end
      $.OPTION2(() => {
        $.CONSUME2(tokenVocabulary.Identifier); // pkg_name
      });
      $.SUBRULE($.semicolon); // ;
    });

    // TODO Add more to the pkg obj spec: http://cui.unige.ch/isi/bnf/PLSQL21/package_obj_spec.html
    $.RULE('packageObjSpec', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.funcBody) },
        { ALT: () => $.SUBRULE($.procBody) },
      ]);
    });

    $.RULE('returnStatement', () => {
      $.CONSUME(tokenVocabulary.ReturnKw); // return
      $.SUBRULE($.value); // 3, l_var ...
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('funcBody', () => {
      $.SUBRULE($.funcSpec);
      $.CONSUME(tokenVocabulary.AsKw); // as
      $.MANY(() => {
        $.SUBRULE($.variableDeclaration); // l_num number := 1;
      });
      $.CONSUME(tokenVocabulary.Begin); // begin
      $.MANY2(() => {
        $.SUBRULE($.statement);
      });
      $.OPTION(() => {
        $.SUBRULE($.exceptionBlock); // exception ...
      });
      $.CONSUME(tokenVocabulary.End); // end
      $.OPTION2(() => {
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
      $.OPTION(() => {
        $.SUBRULE($.exceptionBlock); // exception ...
      });
      $.CONSUME(tokenVocabulary.End); // end
      $.OPTION2(() => {
        $.CONSUME2(tokenVocabulary.Identifier); // my_pkg
      });
      $.SUBRULE2($.semicolon); // ;
    });

    // TODO make sure return is only called in functions
    $.RULE('variableDeclaration', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.numberDeclaration) },
        { ALT: () => $.SUBRULE($.stringDeclaration) },
        { ALT: () => $.SUBRULE($.plsIntegerDeclaration) },
        { ALT: () => $.SUBRULE($.boolDeclaration) },
        { ALT: () => $.SUBRULE($.dateDeclaration) },
        { ALT: () => $.SUBRULE($.timestampDeclaration) },
        { ALT: () => $.SUBRULE($.pragmaStatement) },
        { ALT: () => $.SUBRULE($.objectType) },
        { ALT: () => $.SUBRULE($.comment) }, // TODO is comment in variableDeclaration necessary?
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

    $.RULE('inOut', () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(tokenVocabulary.InKw); // in
            $.OPTION(() => {
              $.CONSUME(tokenVocabulary.OutKw); // out
            });
          },
        },
        {
          ALT: () => {
            $.CONSUME2(tokenVocabulary.OutKw); // out
          },
        },
      ]);
    });

    $.RULE('argument', () => {
      $.CONSUME(tokenVocabulary.Identifier); // pi_input
      $.SUBRULE($.inOut); // in | out | in out
      $.OPTION(() => {
        $.CONSUME2(tokenVocabulary.NocopyKw); // nocopy
      });
      $.SUBRULE($.dataType); // varchar2 | number ...
      $.OPTION2(() => {
        $.OR2([
          { ALT: () => $.CONSUME(tokenVocabulary.DefaultKw) }, // default
          { ALT: () => $.CONSUME(tokenVocabulary.Assignment) }, // :=
        ]);
        $.SUBRULE($.value);
      });
    });

    // ignore ambiguities because string can be only a variable -> Identifier as well as a number
    $.RULE('value', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.functionCall) }, // function call
        { ALT: () => $.SUBRULE($.number), IGNORE_AMBIGUITIES: true }, // 4.2
        { ALT: () => $.SUBRULE($.stringExpression), IGNORE_AMBIGUITIES: true }, // 'value'
        { ALT: () => $.CONSUME(tokenVocabulary.BoolValue) }, // true
        { ALT: () => $.CONSUME(tokenVocabulary.DateValue) }, // sysdate | current_date
        { ALT: () => $.CONSUME(tokenVocabulary.Null) },
        { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
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
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeTimestamp) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeTimestampWTZ) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeBoolean) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeVarchar2) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypePlsIteger) },
      ]);
    });

    $.RULE('numberValue', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.number) },
        { ALT: () => $.SUBRULE($.functionCall) },
        { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
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
        $.SUBRULE($.numberValue);
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
        $.SUBRULE($.numberValue);
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
        $.SUBRULE($.stringExpression);
      });
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('stringVar', () => {
      $.CONSUME(tokenVocabulary.Identifier);
    });

    $.RULE('stringExpression', () => {
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.Concat,
        DEF: () => {
          $.OR([
            { ALT: () => $.SUBRULE($.stringVar) },
            { ALT: () => $.CONSUME(tokenVocabulary.String) },
          ]);
        },
      });
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
      $.CONSUME(tokenVocabulary.Identifier); // l_date
      $.CONSUME(tokenVocabulary.DtypeDate); // date
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Assignment); // :=
        $.CONSUME(tokenVocabulary.DateValue); // sysdate
      });
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('timestampDeclaration', () => {
      $.CONSUME(tokenVocabulary.Identifier); // l_ts
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeTimestamp) }, // timestamp
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeTimestampWTZ) }, // timestamp with timezone
      ]);
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Assignment); // :=
        $.CONSUME(tokenVocabulary.TsValue); // systimestamp
      });
      $.SUBRULE($.semicolon); // ;
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
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.Assignment);
      $.OR([
        { ALT: () => $.SUBRULE($.mathExpression) },
        { ALT: () => $.SUBRULE($.value) },
      ]);
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
          $.SUBRULE($.value);
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

    // function or procedure call acutally
    $.RULE('functionCall', () => {
      $.CONSUME(tokenVocabulary.Identifier); // fct_name (or schema or pkg)
      $.OPTION2(() => {
        $.CONSUME(tokenVocabulary.Dot);
        $.CONSUME2(tokenVocabulary.Identifier);
      });
      $.OPTION3(() => {
        $.CONSUME2(tokenVocabulary.Dot);
        $.CONSUME3(tokenVocabulary.Identifier);
      });
      $.CONSUME(tokenVocabulary.OpenBracket); // (
      $.MANY_SEP({
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.OPTION4(() => {
            $.CONSUME4(tokenVocabulary.Identifier); // pi_param
            $.CONSUME(tokenVocabulary.Arrow); // =>
          });
          $.SUBRULE($.value); // 6
        },
      });
      $.CONSUME(tokenVocabulary.ClosingBracket); // (
    });

    $.RULE('functionCallSemicolon', () => {
      $.SUBRULE($.functionCall);
      $.SUBRULE($.semicolon);
    });

    // TODO with clause
    // TODO join
    // TODO order by
    // TODO group by
    // TODO having
    // TODO union, minus, intersect
    // TODO subquery
    // TODO distinct
    $.RULE('queryStatement', () => {
      $.CONSUME(tokenVocabulary.SelectKw); // select
      $.AT_LEAST_ONE_SEP({
        // col1, col2, fct1(3)
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.SUBRULE($.value); // direct value / function call / variable
        },
      });
      $.OPTION(() => {
        $.CONSUME1(tokenVocabulary.IntoKw); // into
        $.AT_LEAST_ONE_SEP2({
          // into l_val1, l_val2
          SEP: tokenVocabulary.Comma,
          DEF: () => {
            $.CONSUME2(tokenVocabulary.Identifier);
          },
        });
      });
      $.CONSUME(tokenVocabulary.FromKw); // from
      $.AT_LEAST_ONE_SEP3({
        // table 1, table 2
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.CONSUME3(tokenVocabulary.Identifier);
        },
      });
      $.OPTION2(() => {
        // where 1 = 1 and col2 = 5
        $.CONSUME(tokenVocabulary.WhereKw);
        $.AT_LEAST_ONE_SEP4({
          SEP: $.OR2([
            { ALT: () => $.CONSUME(tokenVocabulary.AndKw) },
            { ALT: () => $.CONSUME(tokenVocabulary.OrKw) },
          ]),
          DEF: () => {
            $.SUBRULE($.condition);
          },
        });
      });
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('dynamicSqlStatement', () => {
      $.CONSUME(tokenVocabulary.ExecuteImmediateKw); // execute immediate
      $.SUBRULE($.stringExpression); // l_var or 'create table...'
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.IntoKw); // into
        $.AT_LEAST_ONE_SEP({
          SEP: tokenVocabulary.Comma,
          DEF: () => {
            $.CONSUME(tokenVocabulary.Identifier); // l_var, l_rec
          },
        });
      });
      $.OPTION2(() => {
        $.CONSUME(tokenVocabulary.UsingKw); // using
        $.OPTION3(() => {
          $.SUBRULE($.inOut); // in | out | in out
        });
        $.AT_LEAST_ONE_SEP2({
          SEP: tokenVocabulary.Comma,
          DEF: () => {
            $.CONSUME2(tokenVocabulary.Identifier); // l_var, l_var2
          },
        });
      });
      $.OPTION4(() => {
        $.OR([
          { ALT: () => $.CONSUME(tokenVocabulary.ReturnKw) }, // return
          { ALT: () => $.CONSUME(tokenVocabulary.ReturningKw) }, // returning
        ]);
        $.CONSUME2(tokenVocabulary.IntoKw); // into
        $.AT_LEAST_ONE_SEP3({
          SEP: tokenVocabulary.Comma,
          DEF: () => {
            $.CONSUME3(tokenVocabulary.Identifier); // l_var, l_var2
          },
        });
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('exceptionBlock', () => {
      $.CONSUME(tokenVocabulary.ExceptionKw); // exception
      $.MANY(() => {
        $.CONSUME(tokenVocabulary.WhenKw); // when
        $.OR([
          { ALT: () => $.CONSUME(tokenVocabulary.DefinedException) }, // dup_val_on_index
          { ALT: () => $.CONSUME(tokenVocabulary.OthersKw) }, // others
          { ALT: () => $.CONSUME(tokenVocabulary.Identifier) }, // user_defined_exception
        ]);
        $.CONSUME(tokenVocabulary.Then); // then
        $.MANY2(() => {
          $.OR2([
            { ALT: () => $.SUBRULE($.statement) },
            {
              ALT: () => {
                $.CONSUME(tokenVocabulary.RaiseKw);
                $.SUBRULE($.semicolon);
              },
            },
          ]);
        });
      });
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
      const error = parserInstance.errors[0];
      throw Error(
        `${parserInstance.errors}. 
        RuleStack: ${error.context.ruleStack.join(', ')}
        Token: Line: ${error.token.startLine} Column: ${
          error.token.startColumn
        }`
      );
      // throw Error(
      //   `Sad sad panda, parsing errors detected!\n${parserInstance.errors[0].message}`
      // );
    }

    return { errors: parserInstance.errors };
  },
};
