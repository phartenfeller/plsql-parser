const { CstParser } = require('chevrotain');
const { tokenVocabulary, lex } = require('./tokens');

class SelectParser extends CstParser {
  constructor() {
    super(tokenVocabulary);

    const $ = this;

    $.RULE('block', () => {
      $.SUBRULE($.declareClause);
      // $.CONSUME(tokenVocabulary.Identifier);
      $.SUBRULE($.beginClause);
      // $.CONSUME(tokenVocabulary.Identifier);
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
