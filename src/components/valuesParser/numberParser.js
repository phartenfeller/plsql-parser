const { CstParser } from'chevrotain';
const { tokenVocabulary, lex } from'../tokenDictionary/tokens');

class PlSqlStringParser extends CstParser {
  constructor() {
    super(tokenVocabulary, { recoveryEnabled: true });

    const $ = this;

    $.RULE('mathParenthesisExpression', () => {
      $.CONSUME(tokenVocabulary.OpenBracket);
      $.SUBRULE($.mathExpression);
      $.CONSUME(tokenVocabulary.ClosingBracket);
    });

    $.RULE('number', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.Integer) },
        { ALT: () => $.CONSUME(tokenVocabulary.Float) },
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
        { ALT: () => $.CONSUME(tokenVocabulary.Identifier) },
      ]);
    });

    $.RULE('mathMultiplicationExpression', () => {
      $.SUBRULE($.mathAtomicExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(tokenVocabulary.MultiplicationOperator);
        $.SUBRULE2($.mathAtomicExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('mathAdditionExpression', () => {
      $.SUBRULE($.mathMultiplicationExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(tokenVocabulary.AdditionOperator);
        $.SUBRULE2($.mathMultiplicationExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('mathExpression', () => {
      $.SUBRULE($.mathAdditionExpression);
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
