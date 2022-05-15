function logParserErrors(errors) {
  errors.forEach((err) => {
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

module.exports = logParserErrors;
