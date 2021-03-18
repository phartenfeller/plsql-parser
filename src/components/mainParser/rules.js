const { CstParser } = require('chevrotain');
const { tokenVocabulary, lex } = require('../tokenDictionary/tokens');

class PlSqlParser extends CstParser {
  constructor() {
    super(tokenVocabulary, { recoveryEnabled: true });

    const $ = this;

    $.RULE('global', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.block) },
        { ALT: () => $.SUBRULE($.createPackage) },
      ]);
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Slash);
      });
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
            { ALT: () => $.SUBRULE($.comment) },
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

    $.RULE('throwException', () => {
      $.CONSUME(tokenVocabulary.RaiseKw); // raise
      $.CONSUME(tokenVocabulary.Identifier); // my_exception
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Dot);
        $.CONSUME2(tokenVocabulary.Identifier);
      });
      $.OPTION2(() => {
        $.CONSUME2(tokenVocabulary.Dot);
        $.CONSUME3(tokenVocabulary.Identifier);
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('caseGlobalExpression', () => {
      $.CONSUME(tokenVocabulary.Identifier);
      $.AT_LEAST_ONE(() => {
        $.CONSUME(tokenVocabulary.WhenKw);
        $.SUBRULE($.value);
        $.CONSUME(tokenVocabulary.Then);
        $.MANY(() => {
          $.SUBRULE($.statement);
        });
      });
    });

    $.RULE('caseWithoutGlobalExpression', () => {
      $.AT_LEAST_ONE(() => {
        $.CONSUME(tokenVocabulary.WhenKw);
        $.SUBRULE($.condition);
        $.CONSUME(tokenVocabulary.Then);
        $.MANY(() => {
          $.SUBRULE($.statement);
        });
      });
    });

    $.RULE('caseStatement', () => {
      $.CONSUME(tokenVocabulary.CaseKw);
      $.OR([
        { ALT: () => $.SUBRULE($.caseGlobalExpression) },
        { ALT: () => $.SUBRULE($.caseWithoutGlobalExpression) },
      ]);
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Else);
        $.MANY(() => {
          $.SUBRULE2($.statement);
        });
      });
      $.CONSUME(tokenVocabulary.End);
      $.OPTION2(() => {
        $.CONSUME2(tokenVocabulary.CaseKw);
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('sqlCaseGlobalExpression', () => {
      $.CONSUME(tokenVocabulary.Identifier);
      $.AT_LEAST_ONE(() => {
        $.CONSUME(tokenVocabulary.WhenKw);
        $.SUBRULE($.value);
        $.CONSUME(tokenVocabulary.Then);
        $.SUBRULE2($.value);
      });
    });

    $.RULE('sqlCaseWithoutGlobalExpression', () => {
      $.AT_LEAST_ONE(() => {
        $.CONSUME(tokenVocabulary.WhenKw);
        $.SUBRULE($.condition);
        $.CONSUME(tokenVocabulary.Then);
        $.SUBRULE($.value);
      });
    });

    $.RULE('sqlCaseStatement', () => {
      $.CONSUME(tokenVocabulary.CaseKw);
      $.OR([
        { ALT: () => $.SUBRULE($.sqlCaseGlobalExpression) },
        { ALT: () => $.SUBRULE($.sqlCaseWithoutGlobalExpression) },
      ]);
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Else);
        $.MANY(() => {
          $.SUBRULE($.value);
        });
      });
      $.CONSUME(tokenVocabulary.End);
    });

    $.RULE('statement', () => {
      $.OR([
        { GATE: $.BACKTRACK($.assignment), ALT: () => $.SUBRULE($.assignment) },
        { ALT: () => $.SUBRULE($.comment) },
        { ALT: () => $.SUBRULE($.nullStatement) },
        { ALT: () => $.SUBRULE($.ifStatement) },
        { ALT: () => $.SUBRULE($.caseStatement) },
        { ALT: () => $.SUBRULE($.queryStatement) },
        { ALT: () => $.SUBRULE($.insertStatement) },
        { ALT: () => $.SUBRULE($.deleteStatement) },
        { ALT: () => $.SUBRULE($.updateStatement) },
        { ALT: () => $.SUBRULE($.transactionStatement) },
        { ALT: () => $.SUBRULE($.forLoop) },
        {
          ALT: () => $.SUBRULE($.functionCallSemicolon),
        },
        { ALT: () => $.SUBRULE($.returnStatement) },
        { ALT: () => $.SUBRULE($.block) },
        { ALT: () => $.SUBRULE($.dynamicSqlStatement) },
        { ALT: () => $.SUBRULE($.throwException) },
      ]);
    });

    $.RULE('nullStatement', () => {
      $.CONSUME(tokenVocabulary.Null);
      $.SUBRULE($.semicolon);
    });

    $.RULE('ifCondition', () => {
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.AndOr,
        DEF: () => $.SUBRULE($.condition),
      });
    });

    $.RULE('ifStatement', () => {
      $.CONSUME(tokenVocabulary.If); // if
      $.SUBRULE($.ifCondition);
      $.CONSUME(tokenVocabulary.Then); // Then
      $.MANY(() => {
        $.SUBRULE2($.statement); // ...
      });
      $.OPTION(() => {
        $.MANY2(() => {
          $.CONSUME(tokenVocabulary.Elsif); // elsif
          $.SUBRULE2($.ifCondition);
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

    $.RULE('condition', () => {
      $.SUBRULE($.value, { LABEL: 'lhs' });
      $.OPTION(() => {
        $.OR([
          {
            ALT: () => {
              $.SUBRULE($.relationalOperators);
              $.SUBRULE2($.value, { LABEL: 'rhs' });
            },
          },
          {
            ALT: () => {
              $.CONSUME(tokenVocabulary.IsKw);
              $.OPTION2(() => {
                $.CONSUME(tokenVocabulary.NotKw);
              });
              $.CONSUME(tokenVocabulary.Null, { LABEL: 'rhs' });
            },
          },
        ]);
      });
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
          { ALT: () => $.SUBRULE($.comment) },
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
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.AsKw) }, // as
        { ALT: () => $.CONSUME(tokenVocabulary.IsKw) }, // is
      ]);
      $.MANY(() => {
        $.OR2([
          { ALT: () => $.SUBRULE($.packageObjSpec) },
          { ALT: () => $.SUBRULE($.variableDeclaration) }, // TODO here is also spec ? where is spec allowed ? remove from variable declaration ? wth
          { ALT: () => $.SUBRULE($.comment) },
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
        $.OR([
          { ALT: () => $.SUBRULE($.variableDeclaration) }, // l_num number := 1;
          { ALT: () => $.SUBRULE($.pragmaStatement) },
          { ALT: () => $.SUBRULE($.comment) },
        ]);
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
        $.OR([
          { ALT: () => $.SUBRULE($.variableDeclaration) }, // l_num number := 1;
          { ALT: () => $.SUBRULE($.pragmaStatement) },
          { ALT: () => $.SUBRULE($.comment) },
        ]);
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
      $.CONSUME(tokenVocabulary.Identifier); // l_row
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.ConstantKw);
      });
      $.OR([
        { ALT: () => $.SUBRULE($.numberDeclaration) },
        { ALT: () => $.SUBRULE($.stringDeclaration) },
        { ALT: () => $.SUBRULE($.plsIntegerDeclaration) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeBoolean) },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeDate) },
        { ALT: () => $.SUBRULE($.timestampDeclaration) },
        { ALT: () => $.CONSUME(tokenVocabulary.JsonDtypes) },
        { ALT: () => $.SUBRULE($.typeDef) }, // custom types e.g. rowtype
        { ALT: () => $.SUBRULE($.comment) },
      ]);
      $.OPTION2(() => {
        $.CONSUME(tokenVocabulary.Assignment);
        $.SUBRULE($.value);
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('jsonDtypeValue', () => {
      $.CONSUME(tokenVocabulary.JsonDtypes); // JSON_OBJECT_T / JSON_ARRAY_T ...
      $.CONSUME(tokenVocabulary.OpenBracket); // (
      $.OPTION(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.functionCall), IGNORE_AMBIGUITIES: true }, // myvar.value
          { ALT: () => $.SUBRULE($.stringExpression) }, // '{"json": "data"}'
        ]);
      });
      $.CONSUME(tokenVocabulary.ClosingBracket); // )
    });

    $.RULE('typeDef', () => {
      $.CONSUME(tokenVocabulary.Identifier); // schema_name
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Dot); // .
        $.CONSUME2(tokenVocabulary.Identifier); // table_name
      });
      $.OPTION2(() => {
        $.CONSUME2(tokenVocabulary.Dot); // .
        $.CONSUME3(tokenVocabulary.Identifier); // column_name
      });
      $.OPTION3(() => {
        $.CONSUME(tokenVocabulary.Percent); // %
        $.OR([
          { ALT: () => $.CONSUME(tokenVocabulary.Rowtype) }, // rowtype
          { ALT: () => $.CONSUME(tokenVocabulary.Type) }, // type
        ]);
      });
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
      $.OPTION(() => {
        $.SUBRULE($.inOut); // in | out | in out
      });
      $.OPTION2(() => {
        $.CONSUME2(tokenVocabulary.NocopyKw); // nocopy
      });
      $.OR([
        { ALT: () => $.SUBRULE($.dataType) }, // varchar2 | number ...
        { ALT: () => $.SUBRULE($.typeDef) },
      ]);
      $.OPTION3(() => {
        $.OR2([
          { ALT: () => $.CONSUME(tokenVocabulary.DefaultKw) }, // default
          { ALT: () => $.CONSUME(tokenVocabulary.Assignment) }, // :=
        ]);
        $.SUBRULE($.value);
      });
    });

    $.RULE('valueInBrackets', () => {
      $.CONSUME(tokenVocabulary.OpenBracket);
      $.SUBRULE($.value);
      $.CONSUME(tokenVocabulary.ClosingBracket);
    });

    $.RULE('value', () => {
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.ValueSeperator,
        DEF: () => {
          $.OR([
            { ALT: () => $.CONSUME(tokenVocabulary.String) },
            { ALT: () => $.SUBRULE($.number) },
            {
              ALT: () => $.SUBRULE($.functionCall),
            },
            { ALT: () => $.SUBRULE($.valueInBrackets) },
            { ALT: () => $.SUBRULE($.sqlCaseStatement) },
            { ALT: () => $.CONSUME(tokenVocabulary.Null) },
            { ALT: () => $.CONSUME(tokenVocabulary.ValueKeyword) },
            { ALT: () => $.SUBRULE($.jsonDtypeValue) },
          ]);
        },
      });
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
      $.CONSUME(tokenVocabulary.FunctionKw); // function
      $.CONSUME(tokenVocabulary.Identifier); // fnc_name
      $.OPTION(() => {
        $.SUBRULE($.argumentList); // (pi_vc in varchar2, pi_dat in date)
      });
      $.CONSUME(tokenVocabulary.ReturnKw);
      $.OR([
        { ALT: () => $.SUBRULE($.dataType) }, // varchar2
        { ALT: () => $.SUBRULE($.typeDef) }, // rowtype, pkt type ...
      ]);
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
        { ALT: () => $.CONSUME(tokenVocabulary.JsonDtypes) },
      ]);
    });

    // TODO: remove and replace with mathExpression
    $.RULE('numberValue', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.number) },
        { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
      ]);
      // $.OR({
      //   DEF: [
      //     { ALT: () => $.SUBRULE($.number) },
      //     { ALT: () => $.SUBRULE($.functionCall), IGNORE_AMBIGUITIES: true },
      //     { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
      //   ],
      // });
    });

    $.RULE('numberDeclaration', () => {
      $.CONSUME(tokenVocabulary.DtypeNumber);
      // (3,2)
      $.OPTION1(() => {
        $.CONSUME(tokenVocabulary.OpenBracket);
        $.CONSUME(tokenVocabulary.Integer);
        $.OPTION2(() => {
          $.CONSUME(tokenVocabulary.Comma);
          $.CONSUME2(tokenVocabulary.Integer);
        });
        $.CONSUME(tokenVocabulary.ClosingBracket);
      });
    });

    $.RULE('plsIntegerDeclaration', () => {
      $.CONSUME(tokenVocabulary.DtypePlsIteger);
      // := 3
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Assignment);
        $.SUBRULE($.numberValue);
      });
    });

    $.RULE('stringDeclaration', () => {
      $.CONSUME(tokenVocabulary.DtypeVarchar2); // varchar2
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.OpenBracket); // (
        $.CONSUME(tokenVocabulary.Integer); // 32
        $.OPTION2(() => {
          $.CONSUME(tokenVocabulary.Char); // char
        });
        $.CONSUME(tokenVocabulary.ClosingBracket); // )
      });
    });

    $.RULE('stringExpression', () => {
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.Concat,
        DEF: () => {
          $.OR([
            { ALT: () => $.CONSUME(tokenVocabulary.String) },
            { ALT: () => $.CONSUME(tokenVocabulary.CompilationFlag) },
            { ALT: () => $.SUBRULE($.functionCall) },
          ]);
        },
      });
    });

    $.RULE('timestampDeclaration', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeTimestamp) }, // timestamp
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeTimestampWTZ) }, // timestamp with timezone
      ]);
    });

    $.RULE('comment', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.SingleLineComment) },
        { ALT: () => $.CONSUME(tokenVocabulary.MultiLineComment) },
      ]);
    });

    $.RULE('assignment', () => {
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Identifier); // l_obj
        $.CONSUME(tokenVocabulary.Dot); // .
      });
      $.CONSUME2(tokenVocabulary.Identifier);
      $.OPTION2(() => {
        // (i) on objects thart are indexed
        $.CONSUME(tokenVocabulary.OpenBracket);
        $.CONSUME3(tokenVocabulary.Identifier);
        $.CONSUME(tokenVocabulary.ClosingBracket);
      });
      $.CONSUME(tokenVocabulary.Assignment);
      $.SUBRULE($.value);
      $.SUBRULE($.semicolon);
    });

    $.RULE('number', () => {
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Minus);
      });
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.Integer) },
        { ALT: () => $.CONSUME(tokenVocabulary.Float) },
      ]);
    });

    $.RULE('insertStatement', () => {
      $.CONSUME(tokenVocabulary.InsertKw); // insert
      $.CONSUME(tokenVocabulary.IntoKw); // into
      $.CONSUME(tokenVocabulary.Identifier); // table_name
      $.OR([
        {
          ALT: () => {
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
          },
        },
        {
          ALT: () => {
            $.CONSUME2(tokenVocabulary.ValuesKw); // values
            $.CONSUME3(tokenVocabulary.Identifier); // l_rowtype
          },
        },
      ]);
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.ReturningKw); // returning
        $.CONSUME4(tokenVocabulary.Identifier); // identity_col
        $.CONSUME2(tokenVocabulary.IntoKw); // into
        $.CONSUME5(tokenVocabulary.Identifier); // variable
      });
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('deleteStatement', () => {
      $.CONSUME(tokenVocabulary.DeleteKw); // delte
      $.CONSUME(tokenVocabulary.FromKw); // from
      $.CONSUME(tokenVocabulary.Identifier); // table
      $.OPTION(() => {
        // where 1 = 1 ...
        $.SUBRULE($.whereClause);
      });
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('updateStatement', () => {
      $.CONSUME(tokenVocabulary.UpdateKw); // update
      $.CONSUME(tokenVocabulary.Identifier); // table
      $.CONSUME(tokenVocabulary.SetKw); // set
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.CONSUME2(tokenVocabulary.Identifier); // col_x
          $.CONSUME(tokenVocabulary.Equals); // =
          $.SUBRULE($.value); // 4
        },
      });
      $.OPTION(() => {
        // where 1 = 1 ...
        $.SUBRULE($.whereClause);
      });
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

    // function or procedure call acutally or schema.pkg.constant
    $.RULE('functionCall', () => {
      $.CONSUME(tokenVocabulary.Identifier); // fct_name (or schema or pkg)
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Dot);
        $.CONSUME2(tokenVocabulary.Identifier);
      });
      $.OPTION2(() => {
        $.CONSUME2(tokenVocabulary.Dot);
        $.CONSUME3(tokenVocabulary.Identifier);
      });
      $.OPTION3(() => {
        $.CONSUME(tokenVocabulary.OpenBracket); // (
        // function without params can be called like fct()
        $.OPTION4(() => {
          $.MANY_SEP({
            SEP: tokenVocabulary.Comma,
            DEF: () => {
              $.OPTION5(() => {
                $.CONSUME4(tokenVocabulary.Identifier); // pi_param
                $.CONSUME(tokenVocabulary.Arrow); // =>
              });
              $.SUBRULE($.value); // 6
            },
          });
        });
        $.CONSUME(tokenVocabulary.ClosingBracket); // )
      });
    });

    $.RULE('functionCallSemicolon', () => {
      $.SUBRULE($.functionCall);
      $.SUBRULE($.semicolon);
    });

    $.RULE('whereClause', () => {
      // where 1 = 1 and col2 = 5
      $.CONSUME(tokenVocabulary.WhereKw);
      $.SUBRULE($.condition);
      $.MANY(() => {
        $.CONSUME(tokenVocabulary.AndOr);
        $.SUBRULE2($.condition);
      });
    });

    // TODO with clause
    // TODO join
    // TODO order by
    // TODO group by
    // TODO having
    // TODO union, minus, intersect
    // TODO subquery
    // TODO distinct
    $.RULE('query', () => {
      $.CONSUME(tokenVocabulary.SelectKw); // select
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.Asterisk) }, // *
        {
          ALT: () => {
            $.AT_LEAST_ONE_SEP({
              // col1, col2, fct1(3)
              SEP: tokenVocabulary.Comma,
              DEF: () => {
                $.SUBRULE($.value); // direct value / function call / variable
              },
            });
          },
        },
      ]);
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
        $.SUBRULE($.whereClause);
      });
    });

    $.RULE('queryStatement', () => {
      $.SUBRULE($.query); // select ...
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
        $.AT_LEAST_ONE_SEP2({
          SEP: tokenVocabulary.Comma,
          DEF: () => {
            $.OPTION3(() => {
              $.SUBRULE($.inOut); // in | out | in out
            });
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

    $.RULE('forLoop', () => {
      $.CONSUME(tokenVocabulary.ForKw); // for
      $.CONSUME(tokenVocabulary.Identifier); // l_var
      $.CONSUME(tokenVocabulary.InKw); // in
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.numberValue); // l_num1
            $.CONSUME(tokenVocabulary.DoubleDot); // ..
            $.SUBRULE2($.numberValue); // 3
          },
        },
        {
          ALT: () => {
            $.CONSUME2(tokenVocabulary.OpenBracket); // (
            $.SUBRULE($.query); // select * from dual
            $.CONSUME3(tokenVocabulary.ClosingBracket); // )
          },
        },
      ]);
      $.CONSUME(tokenVocabulary.LoopKw);
      $.MANY(() => {
        $.SUBRULE($.statement);
      });
      $.CONSUME(tokenVocabulary.End);
      $.CONSUME2(tokenVocabulary.LoopKw);
      $.SUBRULE($.semicolon);
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

const parserInstance = new PlSqlParser();

module.exports = {
  parserInstance,

  PlSqlParser,

  lexer(inputText) {
    return lex(inputText);
  },

  parse(inputText, log = true) {
    const lexResult = lex(inputText);

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens;

    // No semantic actions so this won't return anything yet.
    parserInstance.global();

    if (parserInstance.errors.length > 0) {
      if (log) {
        parserInstance.errors.forEach((err) => {
          let errMsg = '';
          errMsg += `${err.message}.\n`;
          errMsg += `  RuleStack: ${err.context.ruleStack.join(', ')}\n`;
          errMsg += `  PreviousToken: ${err.token.image} | Line: "${err.token.startLine}"} | " Column: "${err.token.startColumn}"`;
          if (err.previousToken) {
            errMsg += `  Previous Token: ${err.previousToken.image} of type "${err.previousToken.tokenType.name}"\n\n`;
          }

          console.error(errMsg);
        });
      }
      throw Error(parserInstance.errors);
    }

    return { errors: parserInstance.errors };
  },
};
