const { CstParser } from'chevrotain';
const { tokenVocabulary, lex } from'../tokenDictionary/tokens');

class PlSqlStringParser extends CstParser {
  constructor() {
    super(tokenVocabulary, { recoveryEnabled: true });

    const $ = this;

    $.RULE('stringExpression', () => {
      $.AT_LEAST_ONE_SEP({
        SEP: tokenVocabulary.Concat,
        DEF: () => {
          $.OR([
            { ALT: () => $.CONSUME(tokenVocabulary.String) },
            { ALT: () => $.SUBRULE($.compilationFlag) },
            { ALT: () => $.SUBRULE($.functionCall) },
            { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
          ]);
        },
      });
    });

    $.RULE('compilationFlag', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.plsqlUnitKw) },
        { ALT: () => $.CONSUME(tokenVocabulary.plsqlTypeKw) },
      ]);
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
  }
}

const parserInstance = new PlSqlStringParser();

export default{
  parserInstance,

  PlSqlStringParser,

  lexer(inputText) {
    return lex(inputText);
  },

  parse(inputText) {
    const lexResult = lex(inputText);

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens;

    // No semantic actions so this won't return anything yet.
    parserInstance.global();

    if (parserInstance.errors.length > 0) {
      debugger;
      const error = parserInstance.errors[0];
      // console.log(error);
      throw Error(
        `${parserInstance.errors}. 
        RuleStack: ${error.context.ruleStack.join(', ')}
        Token: "${error.token.image}" Line: "${
          error.token.startLine
        }" Column: "${error.token.startColumn}" 
        Previous Token: ${error.previousToken.image} of type "${
          error.previousToken.tokenType.name
        }"`
      );
      // throw Error(
      //   `Sad sad panda, parsing errors detected!\n${parserInstance.errors[0].message}`
      // );
    }

    return { errors: parserInstance.errors };
  },
};
