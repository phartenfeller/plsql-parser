const { CstParser } = require('chevrotain');
const { tokenVocabulary } = require('../tokenDictionary/tokens');

class PlSqlParser extends CstParser {
  constructor({ recover }) {
    super(tokenVocabulary, { recoveryEnabled: recover });

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

    $.RULE('typeDefiniton', () => {
      $.CONSUME(tokenVocabulary.Type);
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.IsKw);
      $.OR([
        {
          // table type
          ALT: () => {
            $.CONSUME(tokenVocabulary.TableKw);
            $.CONSUME(tokenVocabulary.OfKw);
            $.SUBRULE($.variableSpec);
            $.OPTION(() => {
              $.CONSUME(tokenVocabulary.IndexKw);
              $.CONSUME(tokenVocabulary.ByKw);
              $.SUBRULE1($.variableSpec);
            });
          },
        },
        {
          // record type
          ALT: () => {
            $.CONSUME(tokenVocabulary.RecordKw);
            $.CONSUME(tokenVocabulary.OpenBracket);
            $.AT_LEAST_ONE_SEP({
              SEP: tokenVocabulary.Comma,
              DEF: () => {
                $.CONSUME1(tokenVocabulary.Identifier);
                $.SUBRULE2($.variableSpec);
              },
            });
            $.CONSUME(tokenVocabulary.ClosingBracket);
          },
        },
      ]);

      $.CONSUME(tokenVocabulary.Semicolon);
    });

    $.RULE('block', () => {
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Declare);
        $.MANY(() => {
          $.OR([
            { ALT: () => $.SUBRULE($.packageObjSpec) },
            { ALT: () => $.SUBRULE($.variableDeclaration) },
            { ALT: () => $.SUBRULE($.comment) },
            { ALT: () => $.SUBRULE($.typeDefiniton) },
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

    $.RULE('beginClause', () => {
      $.CONSUME(tokenVocabulary.Begin);
    });

    $.RULE('endClause', () => {
      $.CONSUME(tokenVocabulary.End);
    });

    $.RULE('throwException', () => {
      $.CONSUME(tokenVocabulary.RaiseKw); // raise
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Identifier); // my_exception
        $.OPTION1(() => {
          $.CONSUME(tokenVocabulary.Dot);
          $.CONSUME2(tokenVocabulary.Identifier);
        });
        $.OPTION2(() => {
          $.CONSUME2(tokenVocabulary.Dot);
          $.CONSUME3(tokenVocabulary.Identifier);
        });
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('caseGlobalExpression', () => {
      $.SUBRULE($.value);
      $.AT_LEAST_ONE(() => {
        $.CONSUME(tokenVocabulary.WhenKw);
        $.SUBRULE1($.value);
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

    $.RULE('pipeRowStatement', () => {
      $.CONSUME(tokenVocabulary.PipeRowKw);
      $.CONSUME(tokenVocabulary.OpenBracket);
      $.SUBRULE($.value);
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.ClosingBracket);
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('gotoLabelDefinitionStatement', () => {
      $.CONSUME(tokenVocabulary.Smaller); // <
      $.CONSUME1(tokenVocabulary.Smaller); // <
      $.CONSUME(tokenVocabulary.Identifier); // my_goto_label
      $.CONSUME(tokenVocabulary.Bigger); // >
      $.CONSUME1(tokenVocabulary.Bigger); // >
    });

    $.RULE('gotoStatement', () => {
      $.CONSUME(tokenVocabulary.GotoKw);
      $.CONSUME(tokenVocabulary.Identifier);
      $.SUBRULE($.semicolon);
    });

    $.RULE('statement', () => {
      $.OR([
        { GATE: $.BACKTRACK($.assignment), ALT: () => $.SUBRULE($.assignment) },
        ...($.XstatementOr ??
          ($.XstatementOr = [
            { ALT: () => $.SUBRULE($.comment) },
            { ALT: () => $.SUBRULE($.nullStatement) },
            { ALT: () => $.SUBRULE($.exitStatement) },
            { ALT: () => $.SUBRULE($.ifStatement) },
            { ALT: () => $.SUBRULE($.caseStatement) },
            {
              ALT: () => $.SUBRULE($.functionCallSemicolon),
            },
            { ALT: () => $.SUBRULE($.queryStatement) },
            { ALT: () => $.SUBRULE($.insertStatement) },
            { ALT: () => $.SUBRULE($.deleteStatement) },
            { ALT: () => $.SUBRULE($.updateStatement) },
            { ALT: () => $.SUBRULE($.transactionStatement) },
            { ALT: () => $.SUBRULE($.forLoop) },
            { ALT: () => $.SUBRULE($.whileLoop) },
            { ALT: () => $.SUBRULE($.exitLoop) },
            { ALT: () => $.SUBRULE($.returnStatement) },
            { ALT: () => $.SUBRULE($.block) },
            { ALT: () => $.SUBRULE($.dynamicSqlStatement) },
            { ALT: () => $.SUBRULE($.throwException) },
            { ALT: () => $.SUBRULE($.pipeRowStatement) },
            { ALT: () => $.SUBRULE($.gotoLabelDefinitionStatement) },
            { ALT: () => $.SUBRULE($.gotoStatement) },
          ])),
      ]);
    });

    $.RULE('exitStatement', () => {
      $.CONSUME(tokenVocabulary.ExitKw);
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.WhenKw);
        $.SUBRULE($.chainedConditions);
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('nullStatement', () => {
      $.CONSUME(tokenVocabulary.Null);
      $.SUBRULE($.semicolon);
    });

    $.RULE('chainedConditions', () => {
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.AndOr,
        DEF: () => $.SUBRULE($.condition),
      });
    });

    $.RULE('ifCondition', () => {
      $.SUBRULE($.chainedConditions);
      $.CONSUME(tokenVocabulary.Then); // Then
    });

    $.RULE('ifStatement', () => {
      $.CONSUME(tokenVocabulary.If); // if
      $.SUBRULE($.ifCondition);
      $.MANY(() => {
        $.SUBRULE2($.statement); // ...
      });
      $.OPTION(() => {
        $.MANY2(() => {
          $.CONSUME(tokenVocabulary.Elsif); // elsif
          $.SUBRULE2($.ifCondition);
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
      $.OR(
        $.XrelOpOr ??
          ($.XrelOpOr = [
            { ALT: () => $.CONSUME(tokenVocabulary.Equals) },
            { ALT: () => $.CONSUME(tokenVocabulary.UnEquals1) },
            { ALT: () => $.CONSUME(tokenVocabulary.UnEquals2) },
            { ALT: () => $.CONSUME(tokenVocabulary.UnEquals3) },
            { ALT: () => $.CONSUME(tokenVocabulary.BiggerEquals) },
            { ALT: () => $.CONSUME(tokenVocabulary.Bigger) },
            { ALT: () => $.CONSUME(tokenVocabulary.SmallerEquals) },
            { ALT: () => $.CONSUME(tokenVocabulary.Smaller) },
            {
              ALT: () => {
                $.OPTION(() => {
                  $.CONSUME(tokenVocabulary.NotKw);
                });
                $.CONSUME(tokenVocabulary.LikeKw);
              },
            },
          ])
      );
    });

    $.RULE('conditionsInBrackets', () => {
      $.OPTION(() => $.CONSUME(tokenVocabulary.NotKw));
      $.CONSUME(tokenVocabulary.OpenBracket);
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.AndOr,
        DEF: () => {
          $.SUBRULE($.condition);
        },
      });
      $.CONSUME(tokenVocabulary.ClosingBracket);
    });

    $.RULE('singleCondition', () => {
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.NotKw);
      });
      $.SUBRULE($.value, { LABEL: 'lhs' });
      $.OPTION2(() => {
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
              $.OPTION3(() => {
                $.CONSUME2(tokenVocabulary.NotKw);
              });
              $.CONSUME(tokenVocabulary.Null, { LABEL: 'rhs' });
            },
          },
          {
            ALT: () => {
              $.OPTION4(() => {
                $.CONSUME3(tokenVocabulary.NotKw);
              });
              $.CONSUME(tokenVocabulary.InKw);
              $.OR2([
                { ALT: () => $.SUBRULE($.valueInBrackets, { LABEL: 'rhs' }) },
                {
                  ALT: () => {
                    $.CONSUME(tokenVocabulary.OpenBracket);
                    $.SUBRULE($.query);
                    $.CONSUME(tokenVocabulary.ClosingBracket);
                  },
                },
              ]);
            },
          },
        ]);
      });
    });

    $.RULE('condition', () => {
      $.OR({
        DEF: [
          {
            GATE: $.BACKTRACK($.conditionsInBrackets),
            ALT: () => $.SUBRULE($.conditionsInBrackets),
          },
          { ALT: () => $.SUBRULE($.singleCondition) },
        ],
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
      $.CONSUME(tokenVocabulary.AsIs); // as
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.variableDeclaration) },
          { ALT: () => $.SUBRULE($.comment) },
          { ALT: () => $.SUBRULE($.objectDeclaration) },
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
      $.CONSUME(tokenVocabulary.AsIs);
      $.MANY(() => {
        $.OR2([
          { ALT: () => $.SUBRULE($.packageObjSpec) },
          { ALT: () => $.SUBRULE($.variableDeclaration) }, // TODO here is also spec ? where is spec allowed ? remove from variable declaration ? wth
          { ALT: () => $.SUBRULE($.comment) },
          { ALT: () => $.SUBRULE($.typeDefiniton) },
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
      $.OPTION(() => {
        $.SUBRULE($.value); // 3, l_var ...
      });
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('funcBody', () => {
      $.SUBRULE($.funcSpec);
      $.CONSUME(tokenVocabulary.AsIs); // as
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.variableDeclaration) }, // l_num number := 1;
          { ALT: () => $.SUBRULE($.pragmaStatement) },
          { ALT: () => $.SUBRULE($.comment) },
          { ALT: () => $.SUBRULE($.packageObjSpec) },
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
      $.CONSUME(tokenVocabulary.AsIs); // as
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.variableDeclaration) }, // l_num number := 1;
          { ALT: () => $.SUBRULE($.pragmaStatement) },
          { ALT: () => $.SUBRULE($.comment) },
          { ALT: () => $.SUBRULE($.packageObjSpec) },
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

    $.RULE('cursorDeclaration', () => {
      $.CONSUME(tokenVocabulary.CursorKw); // cursor
      $.CONSUME(tokenVocabulary.Identifier); // my_cursor
      $.CONSUME(tokenVocabulary.IsKw); // is
      $.SUBRULE($.query);
      $.CONSUME(tokenVocabulary.Semicolon); // ;
    });

    $.RULE('rawDeclaration', () => {
      $.CONSUME(tokenVocabulary.DtypeRaw); // varchar2
      $.CONSUME(tokenVocabulary.OpenBracket); // (
      $.CONSUME(tokenVocabulary.Integer); // 32
      $.CONSUME(tokenVocabulary.ClosingBracket); // )
    });

    $.RULE('exceptionDeclaration', () => {
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.ExceptionKw);
      $.CONSUME(tokenVocabulary.Semicolon);
    });

    $.RULE('variableSpec', () => {
      $.OR(
        $.XvarDeclarationOr ??
          ($.XvarDeclarationOr = [
            { ALT: () => $.SUBRULE($.numberDeclaration) },
            { ALT: () => $.SUBRULE($.stringDeclaration) },
            { ALT: () => $.SUBRULE($.rawDeclaration) },
            { ALT: () => $.CONSUME(tokenVocabulary.DtypePlsIteger) },
            { ALT: () => $.CONSUME(tokenVocabulary.DtypeBoolean) },
            { ALT: () => $.CONSUME(tokenVocabulary.DtypeDate) },
            { ALT: () => $.SUBRULE($.timestampDeclaration) },
            { ALT: () => $.CONSUME(tokenVocabulary.JsonDtypes) },
            { ALT: () => $.SUBRULE($.objType) }, // custom types e.g. rowtype
          ])
      );
    });

    // TODO make sure return is only called in functions
    $.RULE('standardVariableDeclaration', () => {
      // follow pattern ident (constant) type...
      $.CONSUME(tokenVocabulary.Identifier); // l_row
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.ConstantKw);
      });
      $.SUBRULE($.variableSpec);
      $.OPTION2(() => {
        $.OR1([
          { ALT: () => $.CONSUME(tokenVocabulary.Assignment) }, // :=
          { ALT: () => $.CONSUME(tokenVocabulary.DefaultKw) }, // default
        ]);

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

    $.RULE('variableDeclaration', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.standardVariableDeclaration) },
        // { ALT: () => $.SUBRULE($.objectDeclaration) },
        { ALT: () => $.SUBRULE($.cursorDeclaration) },
        { ALT: () => $.SUBRULE($.exceptionDeclaration) },
      ]);
    });

    $.RULE('objType', () => {
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
        { ALT: () => $.SUBRULE($.objType) },
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
      // more possible in multi dimensional arrays
      $.CONSUME(tokenVocabulary.OpenBracket);
      // $.CONSUME(tokenVocabulary.Identifier);
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.value) },
          { ALT: () => $.CONSUME(tokenVocabulary.Comma) },
        ]);
      });
      $.CONSUME(tokenVocabulary.ClosingBracket);
    });

    $.RULE('value', () => {
      // $.AT_LEAST_ONE(() => {
      //   $.CONSUME(tokenVocabulary.AnyValue);
      // });
      $.AT_LEAST_ONE(() => {
        $.OR(
          $.XvalueOr ??
            ($.XvalueOr = [
              { ALT: () => $.CONSUME(tokenVocabulary.ValueSeperator) },
              { ALT: () => $.CONSUME(tokenVocabulary.String) },
              { ALT: () => $.SUBRULE($.number) },
              // {
              //   ALT: () => $.SUBRULE($.functionCall),
              // },
              { ALT: () => $.SUBRULE($.valueInBrackets) },
              { ALT: () => $.SUBRULE($.sqlCaseStatement) },
              { ALT: () => $.CONSUME(tokenVocabulary.Null) },
              { ALT: () => $.CONSUME(tokenVocabulary.ValueKeyword) },
              { ALT: () => $.SUBRULE($.jsonDtypeValue) },
              { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
              // { ALT: () => $.CONSUME(tokenVocabulary.OpenBracket) },
              // { ALT: () => $.CONSUME(tokenVocabulary.ClosingBracket) },
              { ALT: () => $.CONSUME(tokenVocabulary.Arrow) },
              { ALT: () => $.CONSUME(tokenVocabulary.AsKw) }, // cast(l_xy as number)
              { ALT: () => $.SUBRULE($.dataType) }, // cast(l_xy as number)
              { ALT: () => $.CONSUME(tokenVocabulary.Dot) },
              { ALT: () => $.CONSUME(tokenVocabulary.Percent) }, // for e. g. sql%rowcount
              { ALT: () => $.CONSUME(tokenVocabulary.Equals) }, // bool := 1 = 2
              { ALT: () => $.CONSUME(tokenVocabulary.ReplaceKw) }, // keyword and also function
            ])
        );
      });
      debugger;
      // $.AT_LEAST_ONE_SEP({
      //   SEP: tokenVocabulary.ValueSeperator,
      //   DEF: () => {
      //     $.OR([
      //       { ALT: () => $.CONSUME(tokenVocabulary.String) },
      //       { ALT: () => $.SUBRULE($.number) },
      //       {
      //         ALT: () => $.SUBRULE($.functionCall),
      //       },
      //       { ALT: () => $.SUBRULE($.valueInBrackets) },
      //       { ALT: () => $.SUBRULE($.sqlCaseStatement) },
      //       { ALT: () => $.CONSUME(tokenVocabulary.Null) },
      //       { ALT: () => $.CONSUME(tokenVocabulary.ValueKeyword) },
      //       { ALT: () => $.SUBRULE($.jsonDtypeValue) },
      //     ]);
      //   },
      // });
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
        { ALT: () => $.SUBRULE($.objType) }, // rowtype, pkt type ...
      ]);
      $.OPTION2(() => {
        $.CONSUME(tokenVocabulary.DeterministicKw); // deterministic
      });
      $.OPTION3(() => {
        $.CONSUME(tokenVocabulary.ResultCacheKw); // result_cache
      });
      $.OPTION4(() => {
        $.CONSUME(tokenVocabulary.PipelinedKw); // pipelined
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
      $.OR(
        $.XdataTypeOr ??
          ($.XdataTypeOr = [
            { ALT: () => $.CONSUME(tokenVocabulary.DtypeNumber) },
            { ALT: () => $.CONSUME(tokenVocabulary.DtypeDate) },
            { ALT: () => $.CONSUME(tokenVocabulary.DtypeTimestamp) },
            { ALT: () => $.CONSUME(tokenVocabulary.DtypeTimestampWTZ) },
            { ALT: () => $.CONSUME(tokenVocabulary.DtypeBoolean) },
            { ALT: () => $.CONSUME(tokenVocabulary.DtypeVarchar2) },
            { ALT: () => $.CONSUME(tokenVocabulary.DtypePlsIteger) },
            { ALT: () => $.CONSUME(tokenVocabulary.DtypeRaw) },
            { ALT: () => $.CONSUME(tokenVocabulary.JsonDtypes) },
          ])
      );
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
        {
          ALT: () => {
            $.CONSUME(tokenVocabulary.DtypeTimestamp); // timestamp
            $.OPTION(() => {
              $.CONSUME(tokenVocabulary.OpenBracket); // (
              $.CONSUME(tokenVocabulary.Integer); // 6
              $.CONSUME(tokenVocabulary.ClosingBracket); // )
            });
          },
        },
        { ALT: () => $.CONSUME(tokenVocabulary.DtypeTimestampWTZ) }, // timestamp with timezone
      ]);
    });

    $.RULE('comment', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.SingleLineComment) },
        { ALT: () => $.CONSUME(tokenVocabulary.MultiLineComment) },
      ]);
    });

    // $.RULE('variableName', () => {
    //   $.OR([
    //     { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
    //     { ALT: () => $.CONSUME(tokenVocabulary.AnyValue) },
    //   ]);
    // });

    $.RULE('numberInBrackets', () => {
      $.CONSUME(tokenVocabulary.OpenBracket); // (
      $.OR([
        { ALT: () => $.SUBRULE($.number) },
        { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
      ]);
      $.CONSUME(tokenVocabulary.ClosingBracket); // )
    });

    $.RULE('assignment', () => {
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.Dot,
        DEF: () => {
          $.CONSUME(tokenVocabulary.Identifier);
          // associative arrays e. g. l_2d_array(1)(2)
          $.OPTION(() => {
            $.MANY(() => {
              $.SUBRULE($.valueInBrackets);
            });
          });
        },
      });

      $.CONSUME(tokenVocabulary.Assignment);
      $.SUBRULE2($.value);
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
    // or some array velues like myval.arr(2)
    $.RULE('functionCall', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.Identifier) }, // fct_name (or schema or pkg)
        { ALT: () => $.CONSUME(tokenVocabulary.ReplaceKw) }, // replace is keyword and function name
      ]);
      $.MANY(() => {
        // .subname
        $.CONSUME(tokenVocabulary.Dot);
        $.OR2([
          {
            ALT: () => {
              $.CONSUME2(tokenVocabulary.Identifier);
              $.OPTION(() => {
                // (3) for arrays
                $.SUBRULE($.numberInBrackets);
              });
            },
          },
          // TODO: Delete this?!
          { ALT: () => $.CONSUME(tokenVocabulary.DeleteKw) }, // delete on an table array
        ]);
      });
      $.OPTION5(() => {
        $.CONSUME(tokenVocabulary.OpenBracket); // (
        // function without params can be called like fct()
        $.OPTION6(() => {
          $.MANY_SEP({
            SEP: tokenVocabulary.Comma,
            DEF: () => {
              $.OPTION7(() => {
                $.CONSUME4(tokenVocabulary.Identifier); // pi_param
                $.CONSUME(tokenVocabulary.Arrow); // =>
              });
              $.SUBRULE($.value); // 6
            },
          });
        });
        // optional because will be taken care of in value parser
        $.OPTION8(() => {
          $.CONSUME(tokenVocabulary.ClosingBracket); // )
        });
      });
    });

    $.RULE('functionCallSemicolon', () => {
      $.SUBRULE($.functionCall);
      $.SUBRULE($.semicolon);
    });

    $.RULE('whereClause', () => {
      // where 1 = 1 and col2 = 5
      $.CONSUME(tokenVocabulary.WhereKw);
      $.SUBRULE($.chainedConditions);
    });

    $.RULE('groupClause', () => {
      $.CONSUME(tokenVocabulary.GroupByKw);
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.OPTION(() => {
            $.CONSUME(tokenVocabulary.Identifier);
            $.CONSUME(tokenVocabulary.Dot);
          });
          $.CONSUME1(tokenVocabulary.Identifier);
        },
      });
      $.OPTION1(() => {
        $.CONSUME(tokenVocabulary.HavingKw);
        $.SUBRULE($.chainedConditions);
      });
    });

    $.RULE('orderClause', () => {
      $.CONSUME(tokenVocabulary.OrderByKw);
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.SUBRULE($.value); // value to support fc + alias.col
        },
      });
    });

    $.RULE('querySource', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
        {
          // array to table
          ALT: () => {
            $.CONSUME(tokenVocabulary.TableKw);
            $.CONSUME(tokenVocabulary.OpenBracket);
            $.SUBRULE($.value);
            $.OPTION(() => {
              $.CONSUME(tokenVocabulary.ClosingBracket); // gets eaten from value rule
            });
          },
        },
      ]);
      $.OPTION1(() => {
        $.CONSUME3(tokenVocabulary.Identifier); // table alias
      });
    });

    $.RULE('tableJoin', () => {
      $.MANY(() => {
        $.OPTION(() => {
          $.CONSUME(tokenVocabulary.JoinDirection); // left / right / inner / outer
        });
        $.CONSUME(tokenVocabulary.JoinKw);
        $.SUBRULE($.querySource); // table / object
        $.OPTION1(() => {
          $.CONSUME(tokenVocabulary.OnKw);
          $.SUBRULE($.chainedConditions);
        });
      });
    });

    // TODO with clause
    // TODO union, minus, intersect
    // TODO distinct
    $.RULE('query', () => {
      $.CONSUME(tokenVocabulary.SelectKw); // select
      $.AT_LEAST_ONE_SEP({
        // col1, col2, fct1(3)
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          // also includes just >> * <<
          $.SUBRULE($.value); // direct value / function call / variable
          $.OPTION(() => {
            $.CONSUME(tokenVocabulary.AsKw);
            $.CONSUME2(tokenVocabulary.Identifier); // alias
          });
        },
      });
      $.OPTION1(() => {
        $.CONSUME1(tokenVocabulary.IntoKw); // into
        $.AT_LEAST_ONE_SEP2({
          // into l_val1, l_val2
          SEP: tokenVocabulary.Comma,
          DEF: () => {
            $.CONSUME3(tokenVocabulary.Identifier);
          },
        });
      });
      $.CONSUME(tokenVocabulary.FromKw); // from
      $.AT_LEAST_ONE_SEP3({
        // table 1, table 2
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.SUBRULE($.querySource);
        },
      });
      $.SUBRULE($.tableJoin);
      $.OPTION2(() => {
        $.SUBRULE($.whereClause);
      });
      $.OPTION3(() => {
        $.SUBRULE($.groupClause);
      });
      $.OPTION4(() => {
        $.SUBRULE($.orderClause);
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
          $.SUBRULE($.statement);
        });
      });
    });

    $.RULE('whileLoop', () => {
      $.CONSUME(tokenVocabulary.WhileKw); // for
      $.SUBRULE($.chainedConditions);
      $.CONSUME(tokenVocabulary.LoopKw);
      $.MANY(() => {
        $.SUBRULE($.statement);
      });
      $.CONSUME(tokenVocabulary.End);
      $.CONSUME2(tokenVocabulary.LoopKw);
      $.SUBRULE($.semicolon);
    });

    $.RULE('forLoop', () => {
      $.CONSUME(tokenVocabulary.ForKw); // for
      $.CONSUME(tokenVocabulary.Identifier); // l_var
      $.CONSUME(tokenVocabulary.InKw); // in
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.value); // l_num1
            $.CONSUME(tokenVocabulary.DoubleDot); // ..
            $.SUBRULE2($.value); // 3
          },
        },
        {
          ALT: () => {
            $.CONSUME2(tokenVocabulary.OpenBracket); // (
            $.SUBRULE($.query); // select * from dual
            $.CONSUME3(tokenVocabulary.ClosingBracket); // )
          },
        },
        {
          ALT: () => {
            $.CONSUME2(tokenVocabulary.Identifier); // cursor_name
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

    $.RULE('exitLoop', () => {
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
module.exports = PlSqlParser;
