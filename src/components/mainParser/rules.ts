import { CstParser } from 'chevrotain';
import { tokenVocabulary } from '../tokenDictionary/tokens';

type ParserArgs = {
  recover: boolean;
};

class PlSqlParser extends CstParser {
  global: any;

  constructor({ recover }: ParserArgs) {
    super(tokenVocabulary, {
      recoveryEnabled: recover,
      nodeLocationTracking: 'full',
    });

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const $: any = this;

    $.logStack = (stack = $.CST_STACK) => {
      const msg: any[] = [];
      stack.forEach((item: any) => {
        const obj = {
          name: item.name,
          children: JSON.stringify(item.children),
        };
        msg.push(obj);
      });

      return msg;
    };

    $.RULE('global', () => {
      $.MANY(() => {
        $.OR({
          MAX_LOOKAHEAD: 4, // create or replace package | view
          DEF: [
            // plsql
            {
              ALT: () => {
                $.OR1([
                  { ALT: () => $.SUBRULE($.block) },
                  { ALT: () => $.SUBRULE($.createPackage) },
                ]);
                $.OPTION(() => {
                  $.CONSUME(tokenVocabulary.Slash);
                });
              },
            },
            { ALT: () => $.SUBRULE($.createSequenceStatement) },
            { ALT: () => $.SUBRULE($.createViewStatement) },
          ],
        });
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
      $.CONSUME(tokenVocabulary.Identifier, { LABEL: 'type_name' });
      $.CONSUME(tokenVocabulary.IsKw);
      $.OR([
        {
          // table type
          ALT: () => {
            $.CONSUME(tokenVocabulary.TableKw);
            $.CONSUME(tokenVocabulary.OfKw);
            $.SUBRULE($.variableSpec, { LABEL: 'type_table_type' });
            $.OPTION(() => {
              $.CONSUME(tokenVocabulary.IndexKw);
              $.CONSUME(tokenVocabulary.ByKw);
              $.SUBRULE1($.variableSpec, { LABEL: 'type_table_index' });
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
                $.CONSUME1(tokenVocabulary.Identifier, {
                  LABEL: 'type_record_variable_name',
                });
                $.SUBRULE2($.variableSpec, {
                  LABEL: 'type_record_variable_type',
                });
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
        $.SUBRULE($.dottedIdentifier); // exception_name or var.exception_type
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
      $.SUBRULE($.value);
      $.AT_LEAST_ONE(() => {
        $.CONSUME(tokenVocabulary.WhenKw);
        $.SUBRULE1($.value);
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
      // $.OPTION(() => {
      $.CONSUME(tokenVocabulary.ClosingBracket);
      //});
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
            { ALT: () => $.SUBRULE($.nullStatement) },
            { ALT: () => $.SUBRULE($.exitStatement) },
            { ALT: () => $.SUBRULE($.ifStatement) },
            { ALT: () => $.SUBRULE($.compilerIfStatement) },
            { ALT: () => $.SUBRULE($.caseStatement) },
            {
              ALT: () => $.SUBRULE($.functionCallSemicolon),
            },
            { ALT: () => $.SUBRULE($.queryStatement) },
            { ALT: () => $.SUBRULE($.dmlStatement) },
            { ALT: () => $.SUBRULE($.forallStatement) },
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

    $.RULE('chainedConditionsWhere', () => {
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.AndOr,
        DEF: () => $.SUBRULE($.conditionWhere),
      });
    });

    $.RULE('ifCondition', () => {
      $.SUBRULE($.chainedConditions);
      $.CONSUME(tokenVocabulary.Then); // Then
    });

    $.RULE('compilerIfCondition', () => {
      $.SUBRULE($.chainedConditions);
      $.CONSUME(tokenVocabulary.Dollar); // $
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

    $.RULE('compileErrorStatement', () => {
      $.CONSUME(tokenVocabulary.CompileErrorKw);
      $.AT_LEAST_ONE(() => {
        $.SUBRULE($.value);
      });
      $.CONSUME3(tokenVocabulary.Dollar); // $
      $.CONSUME(tokenVocabulary.End); // end
    });

    $.RULE('compilerIfStatement', () => {
      $.CONSUME(tokenVocabulary.Dollar); // $
      $.CONSUME(tokenVocabulary.If); // if
      $.SUBRULE($.compilerIfCondition);
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.statement) },
          { ALT: () => $.SUBRULE($.compileErrorStatement) },
        ]);
      });
      $.OPTION(() => {
        $.MANY2(() => {
          $.CONSUME1(tokenVocabulary.Dollar); // $
          $.CONSUME(tokenVocabulary.Elsif); // elsif
          $.SUBRULE2($.compilerIfCondition);
          $.MANY3(() => {
            $.OR2([
              { ALT: () => $.SUBRULE2($.statement) },
              { ALT: () => $.SUBRULE2($.compileErrorStatement) },
            ]);
          });
        });
      });
      $.OPTION2(() => {
        $.CONSUME2(tokenVocabulary.Dollar); // $
        $.CONSUME(tokenVocabulary.Else); // else
        $.MANY4(() => {
          $.OR3([
            { ALT: () => $.SUBRULE3($.statement) },
            { ALT: () => $.SUBRULE3($.compileErrorStatement) },
          ]);
        });
      });
      $.CONSUME3(tokenVocabulary.Dollar); // $
      $.CONSUME(tokenVocabulary.End); // end
      // no if keyword
      // no semicolon
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

    $.RULE('conditionsInBracketsWhere', () => {
      $.OPTION(() => $.CONSUME(tokenVocabulary.NotKw));
      $.CONSUME(tokenVocabulary.OpenBracket);
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.AndOr,
        DEF: () => {
          $.SUBRULE($.conditionWhere);
        },
      });
      $.CONSUME(tokenVocabulary.ClosingBracket);
    });

    $.RULE('nullCheck', () => {
      $.CONSUME(tokenVocabulary.IsKw);
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.NotKw);
      });
      $.CONSUME(tokenVocabulary.Null, { LABEL: 'rhs' });
    });

    $.RULE('singleCondition', () => {
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.NotKw);
      });
      $.SUBRULE($.valueWithoutOperators, { LABEL: 'lhs' });
      $.OPTION2(() => {
        $.OR([
          {
            ALT: () => {
              $.SUBRULE($.relationalOperators);
              $.SUBRULE2($.value, { LABEL: 'rhs' });
            },
          },
          {
            ALT: () => $.SUBRULE($.nullCheck),
          },
          {
            // in (...)
            ALT: () => {
              $.OPTION4(() => {
                $.CONSUME3(tokenVocabulary.NotKw);
              });
              $.CONSUME(tokenVocabulary.InKw);
              $.OR2([
                { ALT: () => $.SUBRULE($.valueInBrackets, { LABEL: 'rhs' }) },
                {
                  ALT: () => {
                    $.SUBRULE($.queryInBrackets);
                  },
                },
              ]);
            },
          },
          {
            ALT: () => {
              $.CONSUME(tokenVocabulary.MemberOfKw);
              $.SUBRULE1($.valueInBrackets, { LABEL: 'rhs' });
            },
          },
        ]);
      });
    });

    // allow for subquery here
    $.RULE('singleConditionWhere', () => {
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.NotKw);
      });
      $.OR([
        // allow subquery here
        {
          ALT: () => {
            $.SUBRULE($.queryInBrackets);
          },
        },
        { ALT: () => $.SUBRULE($.valueWithoutOperators, { LABEL: 'lhs' }) },
      ]);
      $.OPTION2(() => {
        $.OR5([
          {
            ALT: () => {
              $.SUBRULE($.relationalOperators);
              $.OR3([
                // allow subquery here
                {
                  ALT: () => {
                    $.SUBRULE1($.queryInBrackets);
                  },
                },
                {
                  ALT: () =>
                    $.SUBRULE1($.valueWithoutOperators, { LABEL: 'rhs' }),
                },
              ]);
            },
          },
          {
            ALT: () => $.SUBRULE($.nullCheck),
          },
          {
            // in (...)
            ALT: () => {
              $.OPTION4(() => {
                $.CONSUME3(tokenVocabulary.NotKw);
              });
              $.CONSUME(tokenVocabulary.InKw);
              $.OR4([
                { ALT: () => $.SUBRULE($.valueInBrackets, { LABEL: 'rhs' }) },
                {
                  ALT: () => {
                    $.SUBRULE2($.queryInBrackets);
                  },
                },
              ]);
            },
          },
          {
            ALT: () => {
              $.CONSUME(tokenVocabulary.MemberOfKw);
              $.SUBRULE1($.valueInBrackets, { LABEL: 'rhs' });
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

    $.RULE('conditionWhere', () => {
      $.OR({
        DEF: [
          {
            GATE: $.BACKTRACK($.conditionsInBracketsWhere),
            ALT: () => $.SUBRULE($.conditionsInBracketsWhere),
          },
          { ALT: () => $.SUBRULE($.singleConditionWhere) },
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
      $.SUBRULE($.dottedIdentifier, { LABEL: 'package_name' }); // pkg_name | schema_name.pkg_name
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.AuthidKw); // authid
        $.OR([
          { ALT: () => $.CONSUME(tokenVocabulary.DefinerKw) }, // definer
          { ALT: () => $.CONSUME(tokenVocabulary.CurrentUserKw) }, // current_user
        ]);
      });
      $.CONSUME(tokenVocabulary.AsIs); // as
      $.MANY(() => {
        $.OR2([
          { ALT: () => $.SUBRULE($.objectDeclaration) },
          { ALT: () => $.SUBRULE($.variableDeclaration) },
          { ALT: () => $.SUBRULE($.typeDefiniton) },
          { ALT: () => $.SUBRULE($.pragmaStatement) },
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
      $.SUBRULE($.dottedIdentifier, { LABEL: 'package_name' }); // pkg_name | schema_name.pkg_name
      $.CONSUME(tokenVocabulary.AsIs);
      $.MANY(() => {
        $.OR2([
          { ALT: () => $.SUBRULE($.packageObjSpec) },
          { ALT: () => $.SUBRULE($.variableDeclaration) }, // TODO here is also spec ? where is spec allowed ? remove from variable declaration ? wth
          { ALT: () => $.SUBRULE($.typeDefiniton) },
          { ALT: () => $.SUBRULE($.pragmaStatement) },
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
          { ALT: () => $.SUBRULE($.packageObjSpec) },
          { ALT: () => $.SUBRULE($.typeDefiniton) },
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
          { ALT: () => $.SUBRULE($.packageObjSpec) },
          { ALT: () => $.SUBRULE($.typeDefiniton) },
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
      $.CONSUME(tokenVocabulary.Identifier, { LABEL: 'cursor_name' }); // my_cursor
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
      $.CONSUME(tokenVocabulary.Identifier, { LABEL: 'exception_name' });
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
      $.CONSUME(tokenVocabulary.Identifier, { LABEL: 'variable_name' }); // l_row
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
      $.SUBRULE($.dottedIdentifier);
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
        {
          ALT: () => {
            $.CONSUME(tokenVocabulary.ExceptionInitKw);
            $.SUBRULE($.valueInBrackets);
          },
        },
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

    $.RULE('extractValue', () => {
      $.CONSUME(tokenVocabulary.ExtractKw);
      $.CONSUME(tokenVocabulary.OpenBracket);

      $.OR([
        // extract(hour from systimestamp)
        {
          ALT: () => {
            $.CONSUME(tokenVocabulary.Identifier);
            $.CONSUME(tokenVocabulary.FromKw);
            $.SUBRULE($.value);
          },
        },
        // xml extract(l_xml, '//xpath', {'namespace'})
        {
          ALT: () => {
            $.CONSUME1(tokenVocabulary.Identifier); // xmltype_instance
            $.CONSUME1(tokenVocabulary.Comma);
            $.OR2([
              {
                ALT: () => $.CONSUME2(tokenVocabulary.Identifier), // variable
              },
              {
                ALT: () =>
                  $.CONSUME(tokenVocabulary.StringTk, { LABEL: 'String' }), // xpath
              },
            ]);

            // namespace
            $.OPTION(() => {
              $.CONSUME2(tokenVocabulary.Comma);
              $.OR3([
                {
                  ALT: () => $.CONSUME3(tokenVocabulary.Identifier), // variable
                },
                {
                  ALT: () =>
                    $.CONSUME1(tokenVocabulary.StringTk, { LABEL: 'String' }), // namespace
                },
              ]);
            });
          },
        },
      ]);

      $.CONSUME(tokenVocabulary.ClosingBracket);
    });

    // needed to be written out because of the prior rule and extract is its own KW
    $.RULE('xmlExtract', () => {
      // $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.Dot);
      $.CONSUME(tokenVocabulary.ExtractKw);
      $.CONSUME(tokenVocabulary.OpenBracket);

      $.OR2([
        {
          ALT: () => $.CONSUME2(tokenVocabulary.Identifier), // variable
        },
        {
          ALT: () => $.CONSUME(tokenVocabulary.StringTk, { LABEL: 'String' }), // xpath
        },
      ]);

      // namespace
      $.OPTION(() => {
        $.CONSUME2(tokenVocabulary.Comma);
        $.OR3([
          {
            ALT: () => $.CONSUME3(tokenVocabulary.Identifier), // variable
          },
          {
            ALT: () =>
              $.CONSUME1(tokenVocabulary.StringTk, { LABEL: 'String' }), // namespace
          },
        ]);
      });

      $.CONSUME(tokenVocabulary.ClosingBracket);
    });

    $.RULE('castValue', () => {
      $.CONSUME(tokenVocabulary.CastKw);
      $.CONSUME(tokenVocabulary.OpenBracket);
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.AsKw);
      $.SUBRULE($.dataType);
      $.CONSUME(tokenVocabulary.ClosingBracket);
    });

    $.RULE('value', () => {
      $.AT_LEAST_ONE(() => {
        $.OR(
          $.XvalueOr ??
            ($.XvalueOr = [
              { ALT: () => $.SUBRULE($.extractValue) },
              { ALT: () => $.SUBRULE($.xmlExtract) },
              { ALT: () => $.SUBRULE($.castValue) },
              {
                ALT: () =>
                  $.CONSUME(tokenVocabulary.ValueSeperator, {
                    LABEL: 'Operator',
                  }),
              },
              {
                ALT: () =>
                  $.CONSUME(tokenVocabulary.StringTk, { LABEL: 'String' }),
              },
              // {
              //   ALT: () =>
              //     $.CONSUME(tokenVocabulary.AlternateQuotingMechanism, {
              //       LABEL: 'String',
              //     }),
              // },
              { ALT: () => $.SUBRULE($.number, { LABEL: 'Number' }) },
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
              // { ALT: () => $.CONSUME(tokenVocabulary.FromKw) }, // extract(hour from sysdate)
              { ALT: () => $.CONSUME(tokenVocabulary.Dot) },
              { ALT: () => $.CONSUME(tokenVocabulary.Percent) }, // for e. g. sql%rowcount

              // excluded from 'valueWithoutOperators'
              { ALT: () => $.SUBRULE($.relationalOperators) }, // bool <= = != ...

              { ALT: () => $.CONSUME(tokenVocabulary.AndOr) }, // chain bool vals
              { ALT: () => $.SUBRULE($.nullCheck) }, // bool x is (not) null
              { ALT: () => $.CONSUME(tokenVocabulary.NotKw) },
              { ALT: () => $.CONSUME(tokenVocabulary.MemberOfKw) },

              { ALT: () => $.CONSUME(tokenVocabulary.ReplaceKw) }, // keyword and also function

              // excluded from 'valueWithoutOperators'
              {
                ALT: () => $.CONSUME(tokenVocabulary.InKw), // bool := 1 in (1, 2)
              },
            ])
        );
      });

      // $.AT_LEAST_ONE_SEP({
      //   SEP: tokenVocabulary.ValueSeperator,
      //   DEF: () => {
      //     $.OR([
      //       { ALT: () => $.CONSUME(tokenVocabulary.StringTk) },
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

    // no 'in' and no relational operators
    $.RULE('valueWithoutOperators', () => {
      $.AT_LEAST_ONE(() => {
        $.OR(
          $.XvalueOrWithoutIn ??
            ($.XvalueOrWithoutIn = [
              { ALT: () => $.SUBRULE($.extractValue) },
              { ALT: () => $.SUBRULE($.xmlExtract) },
              { ALT: () => $.CONSUME(tokenVocabulary.ValueSeperator) },
              { ALT: () => $.CONSUME(tokenVocabulary.StringTk) },
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

              //{ ALT: () => $.CONSUME(tokenVocabulary.AndOr) }, // chain bool vals
              //{ ALT: () => $.SUBRULE($.nullCheck) }, // bool x is (not) null
              //{ ALT: () => $.CONSUME(tokenVocabulary.NotKw) },
              //{ ALT: () => $.CONSUME(tokenVocabulary.MemberOfKw) },

              { ALT: () => $.CONSUME(tokenVocabulary.ReplaceKw) }, // keyword and also function
            ])
        );
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
      $.CONSUME(tokenVocabulary.Identifier, { LABEL: 'function_name' }); // fnc_name
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
      $.CONSUME(tokenVocabulary.Identifier, { LABEL: 'procedure_name' }); // prc_name
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
            { ALT: () => $.CONSUME(tokenVocabulary.StringTk) },
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

    $.RULE('forallStatement', () => {
      $.CONSUME(tokenVocabulary.ForallKw);
      $.CONSUME(tokenVocabulary.Identifier); // l_var
      $.CONSUME(tokenVocabulary.InKw); // in
      $.SUBRULE($.value); // l_num1
      $.CONSUME(tokenVocabulary.DoubleDot); // ..
      $.SUBRULE2($.value); // 3
      $.SUBRULE($.dmlOperation);
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('dmlStatement', () => {
      $.SUBRULE($.dmlOperation);
      $.SUBRULE($.semicolon); // ;
    });

    $.RULE('dmlOperation', () => {
      $.OR([
        {
          ALT: () => $.SUBRULE($.insertOperation),
        },
        {
          ALT: () => $.SUBRULE($.updateOperation),
        },
        {
          ALT: () => $.SUBRULE($.deleteOperation),
        },
      ]);
    });

    $.RULE('insertOperation', () => {
      $.CONSUME(tokenVocabulary.InsertKw); // insert
      $.CONSUME(tokenVocabulary.IntoKw); // into
      $.SUBRULE($.dottedIdentifier); // table_name
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
            $.OR2([
              {
                ALT: () => {
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
                  $.SUBRULE($.query);
                },
              },
            ]);
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
    });

    $.RULE('updateOperation', () => {
      $.CONSUME(tokenVocabulary.UpdateKw); // update
      $.SUBRULE($.dottedIdentifier); // table_name
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
    });

    $.RULE('deleteOperation', () => {
      $.CONSUME(tokenVocabulary.DeleteKw); // delte
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.FromKw); // from
      });
      $.SUBRULE($.dottedIdentifier); // table_name
      $.OPTION1(() => {
        // where 1 = 1 ...
        $.SUBRULE($.whereClause);
      });
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
        //$.OPTION8(() => {
        $.CONSUME(tokenVocabulary.ClosingBracket); // )
        // });
      });
    });

    $.RULE('functionCallSemicolon', () => {
      $.SUBRULE($.functionCall);
      $.SUBRULE($.semicolon);
    });

    $.RULE('whereClause', () => {
      // where 1 = 1 and col2 = 5
      $.CONSUME(tokenVocabulary.WhereKw);
      $.SUBRULE($.chainedConditionsWhere);
    });

    $.RULE('commaSepIdent', () => {
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
    });

    $.RULE('groupClause', () => {
      $.CONSUME(tokenVocabulary.GroupByKw);
      $.OR([
        { ALT: () => $.SUBRULE($.commaSepIdent) },
        {
          ALT: () => {
            $.CONSUME(tokenVocabulary.OpenBracket); // (
            $.SUBRULE1($.commaSepIdent);
            $.CONSUME(tokenVocabulary.ClosingBracket); // )
          },
        },
      ]);

      $.OPTION1(() => {
        $.CONSUME(tokenVocabulary.HavingKw);
        $.SUBRULE($.chainedConditions);
      });
    });

    $.RULE('orderClause', () => {
      $.CONSUME(tokenVocabulary.OrderKw);
      $.CONSUME(tokenVocabulary.ByKw);
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.SUBRULE($.value); // value to support fc + alias.col
          $.OPTION(() => {
            $.CONSUME(tokenVocabulary.AscDescKw);
          });
          $.OPTION1(() => {
            $.CONSUME(tokenVocabulary.NullsFirstLastKw);
          });
        },
      });
    });

    $.RULE('querySource', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.dottedIdentifier) },
        {
          // array to table
          ALT: () => {
            $.CONSUME(tokenVocabulary.TableKw);
            $.CONSUME(tokenVocabulary.OpenBracket);
            $.SUBRULE($.value);
            $.CONSUME(tokenVocabulary.ClosingBracket);
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

    $.RULE('dottedIdentifier', () => {
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.Dot,
        DEF: () => {
          $.CONSUME(tokenVocabulary.Identifier);
        },
      });
    });

    $.RULE('withClause', () => {
      $.CONSUME(tokenVocabulary.WithKw);
      $.CONSUME(tokenVocabulary.Identifier);
      $.CONSUME(tokenVocabulary.AsKw);
      $.SUBRULE($.queryInBrackets);
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Comma);
        $.AT_LEAST_ONE_SEP({
          SEP: tokenVocabulary.Comma,
          DEF: () => {
            $.CONSUME2(tokenVocabulary.Identifier);
            $.CONSUME2(tokenVocabulary.AsKw);
            $.SUBRULE1($.queryInBrackets);
          },
        });
      });
    });

    $.RULE('queryOverClause', () => {
      $.CONSUME(tokenVocabulary.OverKw);
      $.CONSUME(tokenVocabulary.OpenBracket);
      // partition by col1, col2
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.PartitionByKw);
        $.AT_LEAST_ONE_SEP({
          // col1, col2, fct1(3)
          SEP: tokenVocabulary.Comma,
          DEF: () => $.SUBRULE($.dottedIdentifier),
        });
      });
      $.OPTION1(() => {
        $.SUBRULE($.orderClause);
      });
      $.CONSUME(tokenVocabulary.ClosingBracket);
    });

    $.RULE('queryWithinGroupClause', () => {
      $.CONSUME(tokenVocabulary.WithinGroupKw);
      $.CONSUME(tokenVocabulary.OpenBracket);
      $.SUBRULE($.orderClause);
      $.CONSUME(tokenVocabulary.ClosingBracket);
    });

    $.RULE('queryColumns', () => {
      $.AT_LEAST_ONE_SEP({
        // col1, col2, fct1(3)
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          // also includes just >> * <<
          $.SUBRULE($.value); // direct value / function call / variable
          $.OPTION(() => {
            $.SUBRULE($.queryWithinGroupClause);
          });
          $.OPTION1(() => {
            $.SUBRULE($.queryOverClause);
          });
          $.OPTION4(() => {
            $.SUBRULE($.queryColumnAlias);
          });
        },
      });
    });

    $.RULE('queryColumnAlias', () => {
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.AsKw);
      });
      debugger;
      $.CONSUME(tokenVocabulary.KwIdentifier); // alias
    });

    $.RULE('sqlJsonTableColumn', () => {
      $.CONSUME(tokenVocabulary.Identifier);
      $.OPTION(() => {
        $.SUBRULE($.variableSpec);
      });
      $.OPTION1(() => {
        $.CONSUME(tokenVocabulary.FormatJsonKw);
      });
      $.CONSUME(tokenVocabulary.PathKw);
      $.CONSUME(tokenVocabulary.StringTk);
    });

    $.RULE('sqlJsonTable', () => {
      $.CONSUME(tokenVocabulary.JsonTableKw);
      $.CONSUME(tokenVocabulary.OpenBracket);
      $.SUBRULE($.value);
      $.CONSUME(tokenVocabulary.Comma);
      $.CONSUME(tokenVocabulary.StringTk);
      $.CONSUME(tokenVocabulary.ColumnsKw);
      $.OR([
        {
          ALT: () => {
            $.AT_LEAST_ONE_SEP({
              SEP: tokenVocabulary.Comma,
              DEF: () => {
                $.SUBRULE($.sqlJsonTableColumn);
              },
            });
          },
        },
        {
          ALT: () => {
            $.CONSUME1(tokenVocabulary.OpenBracket);
            $.AT_LEAST_ONE_SEP1({
              SEP: tokenVocabulary.Comma,
              DEF: () => {
                $.SUBRULE1($.sqlJsonTableColumn);
              },
            });
            $.CONSUME1(tokenVocabulary.ClosingBracket);
          },
        },
      ]);

      $.CONSUME(tokenVocabulary.ClosingBracket);
      $.OPTION1(() => {
        $.CONSUME3(tokenVocabulary.Identifier); // alias
      });
    });

    $.RULE('sqlFromClause', () => {
      $.CONSUME(tokenVocabulary.FromKw); // from
      $.AT_LEAST_ONE_SEP({
        // table 1, table 2
        SEP: tokenVocabulary.Comma,
        DEF: () => {
          $.OR([
            { ALT: () => $.SUBRULE($.querySource) },
            {
              ALT: () => {
                $.SUBRULE($.queryInBrackets);
                $.OPTION1(() => {
                  $.CONSUME3(tokenVocabulary.Identifier); // alias
                });
              },
            },
            {
              ALT: () => $.SUBRULE($.sqlJsonTable),
            },
          ]);
        },
      });
    });

    $.RULE('offsetQueryClause', () => {
      $.CONSUME(tokenVocabulary.OffsetKw);
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.Integer) },
        { ALT: () => $.SUBRULE($.dottedIdentifier) },
      ]);
      $.CONSUME(tokenVocabulary.RowKw);
    });

    $.RULE('fetchQueryClause', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.FetchFirstLastKw) },
        { ALT: () => $.CONSUME(tokenVocabulary.FetchKw) },
      ]);
      $.OPTION1(() => {
        $.CONSUME(tokenVocabulary.Integer);
        $.OPTION2(() => {
          $.CONSUME(tokenVocabulary.PercentKw);
        });
      });
      $.CONSUME(tokenVocabulary.RowKw);
      $.OR1([
        { ALT: () => $.CONSUME(tokenVocabulary.WithTiesKw) },
        { ALT: () => $.CONSUME(tokenVocabulary.OnlyKw) },
      ]);
    });

    $.RULE('queryInBrackets', () => {
      $.CONSUME(tokenVocabulary.OpenBracket);
      $.SUBRULE($.query);
      $.CONSUME(tokenVocabulary.ClosingBracket);
    });

    // TODO union, minus, intersect
    // TODO distinct
    $.RULE('query', () => {
      $.OPTION9(() => {
        $.SUBRULE($.withClause);
      });
      $.CONSUME(tokenVocabulary.SelectKw); // select
      $.SUBRULE($.queryColumns);
      $.OPTION1(() => {
        $.CONSUME1(tokenVocabulary.IntoKw); // into
        $.AT_LEAST_ONE_SEP2({
          // into l_val1, l_val2
          SEP: tokenVocabulary.Comma,
          DEF: () => {
            $.SUBRULE($.dottedIdentifier);
          },
        });
      });
      $.SUBRULE($.sqlFromClause);
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
      $.OPTION5(() => {
        $.SUBRULE($.offsetQueryClause);
      });
      $.OPTION6(() => {
        $.SUBRULE($.fetchQueryClause);
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
        $.MANY1(() => {
          $.CONSUME(tokenVocabulary.OrKw); // or
          $.OR1([
            { ALT: () => $.CONSUME1(tokenVocabulary.DefinedException) }, // dup_val_on_index
            { ALT: () => $.CONSUME1(tokenVocabulary.OthersKw) }, // others
            { ALT: () => $.CONSUME1(tokenVocabulary.Identifier) }, // user_defined_exception
          ]);
        });
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
            $.SUBRULE($.queryInBrackets);
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

    $.RULE('createSequenceStatement', () => {
      $.CONSUME(tokenVocabulary.CreateKw); // create
      $.CONSUME(tokenVocabulary.SequenceKw); // sequence
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.Identifier, { LABEL: 'schema_name' }); // schema_name
        $.CONSUME(tokenVocabulary.Dot); // .
      });
      $.CONSUME1(tokenVocabulary.Identifier, { LABEL: 'sequence_name' }); // sequence_name
      // all the possible options...
      // order of statements does not matter -> many
      // unfortunately because of many the parser does not catch when a option appears multiple times
      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              $.CONSUME(tokenVocabulary.IncrementByKw); // increment by
              $.CONSUME(tokenVocabulary.Integer, { LABEL: 'increment_amount' }); // 32
            },
          },
          {
            ALT: () => {
              $.CONSUME(tokenVocabulary.StartWithKw); // start with
              $.CONSUME1(tokenVocabulary.Integer, { LABEL: 'start_with_num' }); // 32
            },
          },
          {
            ALT: () => {
              $.OR1([
                {
                  ALT: () => {
                    $.CONSUME(tokenVocabulary.MaxvalueKw); // maxvalue
                    $.CONSUME3(tokenVocabulary.Integer, {
                      LABEL: 'maxvalue_num',
                    });
                  },
                },
                {
                  ALT: () => $.CONSUME(tokenVocabulary.NoMaxvalueKw), // nomaxvalue
                },
              ]);
            },
          },
          {
            ALT: () => {
              $.OR2([
                {
                  ALT: () => {
                    $.CONSUME(tokenVocabulary.MinvalueKw); // minvalue
                    $.CONSUME4(tokenVocabulary.Integer, {
                      LABEL: 'minvalue_num',
                    });
                  },
                },
                {
                  ALT: () => $.CONSUME(tokenVocabulary.NoMinvalueKw), // nominvalue
                },
              ]);
            },
          },
          {
            ALT: () => {
              $.OR3([
                {
                  ALT: () => $.CONSUME(tokenVocabulary.CycleKw), // cycle
                },
                {
                  ALT: () => $.CONSUME(tokenVocabulary.NoCycleKw), // nocycle
                },
              ]);
            },
          },
          {
            ALT: () => {
              $.OR4([
                {
                  ALT: () => {
                    $.CONSUME(tokenVocabulary.CacheKw); // cache
                    $.CONSUME5(tokenVocabulary.Integer, { LABEL: 'cache_num' }); // 32
                  },
                },
                {
                  ALT: () => $.CONSUME(tokenVocabulary.NoCacheKw), // nocache
                },
              ]);
            },
          },
          {
            ALT: () => {
              $.OR5([
                {
                  ALT: () => $.CONSUME(tokenVocabulary.OrderKw), // order
                },
                {
                  ALT: () => $.CONSUME(tokenVocabulary.NoOrderKw), // noorder
                },
              ]);
            },
          },
        ]);
      });
      $.SUBRULE($.semicolon);
    });

    $.RULE('createViewStatement', () => {
      $.CONSUME(tokenVocabulary.CreateKw); // create
      $.OPTION(() => {
        $.CONSUME(tokenVocabulary.OrKw); // or
        $.CONSUME(tokenVocabulary.ReplaceKw); // replace
      });
      $.OPTION1(() => {
        $.OPTION2(() => {
          $.CONSUME(tokenVocabulary.NoKw); // no
        });
        $.CONSUME(tokenVocabulary.ForceKw); // force
      });
      $.CONSUME(tokenVocabulary.ViewKw); // view
      $.OPTION3(() => {
        $.CONSUME(tokenVocabulary.Identifier, { LABEL: 'schema_name' }); // schema_name
        $.CONSUME(tokenVocabulary.Dot); // .
      });
      $.CONSUME1(tokenVocabulary.Identifier, { LABEL: 'view_name' }); // view_name
      $.CONSUME(tokenVocabulary.AsKw); // as
      $.SUBRULE($.query); // query
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
export default PlSqlParser;
